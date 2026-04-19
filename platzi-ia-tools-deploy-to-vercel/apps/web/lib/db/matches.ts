import {
  and,
  asc,
  competitions,
  desc,
  eq,
  gt,
  inArray,
  lt,
  matchEvents,
  matches,
  or,
  seasons,
  teams,
  type Competition,
  type Match,
  type MatchEvent,
  type SQL,
  type Season,
  type Team,
} from '@platzi-fc/db';
import { getDb } from '@/lib/db';

export type MatchWithRelations = Match & {
  competition: Competition;
  season: Season;
  homeTeam: Team;
  awayTeam: Team;
};

export type MatchListFilters = {
  seasonSlug?: string;
  competitionSlug?: string;
  lado?: 'local' | 'visita' | 'todos';
  estado?: 'programado' | 'en_vivo' | 'finalizado';
  limit?: number;
  order?: 'asc' | 'desc';
  /**
   * Cuando se pasa `lado`, se filtra contra este slug. Por defecto el club principal.
   */
  clubPrincipalSlug?: string;
};

const CLUB_PRINCIPAL_SLUG_DEFAULT = 'platzi-fc';

/**
 * Listado de partidos con filtros combinables. Ordenado por `fecha_hora`.
 *
 * Los filtros por `seasonSlug` / `competitionSlug` resuelven el UUID mediante
 * sub-selects tipados en lugar de JOINs para que el `where` siga siendo plano
 * y componible. Esto mantiene la query simple y deja los JOINs sólo para
 * hidratar las relaciones devueltas al consumidor.
 */
export async function listMatches(filters: MatchListFilters = {}): Promise<MatchWithRelations[]> {
  const db = getDb();
  const {
    seasonSlug,
    competitionSlug,
    lado = 'todos',
    estado,
    limit,
    order = 'desc',
    clubPrincipalSlug = CLUB_PRINCIPAL_SLUG_DEFAULT,
  } = filters;

  const conditions: SQL[] = [];

  if (seasonSlug) {
    const [s] = await db
      .select({ id: seasons.id })
      .from(seasons)
      .where(eq(seasons.slug, seasonSlug))
      .limit(1);
    if (!s) return [];
    conditions.push(eq(matches.seasonId, s.id));
  }

  if (competitionSlug) {
    const [c] = await db
      .select({ id: competitions.id })
      .from(competitions)
      .where(eq(competitions.slug, competitionSlug))
      .limit(1);
    if (!c) return [];
    conditions.push(eq(matches.competitionId, c.id));
  }

  if (estado) {
    conditions.push(eq(matches.estado, estado));
  }

  if (lado !== 'todos') {
    const [t] = await db
      .select({ id: teams.id })
      .from(teams)
      .where(eq(teams.slug, clubPrincipalSlug))
      .limit(1);
    if (!t) return [];
    conditions.push(lado === 'local' ? eq(matches.homeTeamId, t.id) : eq(matches.awayTeamId, t.id));
  }

  const whereClause = conditions.length ? and(...conditions) : undefined;
  const orderBy = order === 'asc' ? asc(matches.fechaHora) : desc(matches.fechaHora);

  let query = db.select().from(matches).where(whereClause).orderBy(orderBy).$dynamic();
  if (limit) query = query.limit(limit);

  const rows = await query;
  if (!rows.length) return [];

  return hydrateMatches(rows);
}

export async function getMatchBySlug(slug: string): Promise<MatchWithRelations | null> {
  const db = getDb();
  const [row] = await db.select().from(matches).where(eq(matches.slug, slug)).limit(1);
  if (!row) return null;
  const [hydrated] = await hydrateMatches([row]);
  return hydrated ?? null;
}

export async function getMatchEvents(matchId: string): Promise<MatchEvent[]> {
  const db = getDb();
  return db
    .select()
    .from(matchEvents)
    .where(eq(matchEvents.matchId, matchId))
    .orderBy(asc(matchEvents.minuto), asc(matchEvents.createdAt));
}

/**
 * Próximo partido del club principal (primer `programado` o `en_vivo` más
 * próximo). Si no hay ninguno futuro, devuelve null.
 */
/**
 * Próximos partidos como local del club principal, pensados para la landing
 * de `/entradas`. Filtramos `homeTeamId` para descartar los de fuera (sin venta
 * directa en nuestra taquilla) y limitamos a partidos futuros.
 */
export async function listProximosPartidosLocal(
  limit = 6,
  clubPrincipalSlug: string = CLUB_PRINCIPAL_SLUG_DEFAULT,
): Promise<MatchWithRelations[]> {
  const db = getDb();
  const [club] = await db
    .select({ id: teams.id })
    .from(teams)
    .where(eq(teams.slug, clubPrincipalSlug))
    .limit(1);
  if (!club) return [];

  const now = new Date();
  const rows = await db
    .select()
    .from(matches)
    .where(
      and(
        eq(matches.homeTeamId, club.id),
        or(
          eq(matches.estado, 'en_vivo'),
          and(eq(matches.estado, 'programado'), gt(matches.fechaHora, now)),
        ),
      ),
    )
    .orderBy(asc(matches.fechaHora))
    .limit(limit);

  return hydrateMatches(rows);
}

export async function getProximoPartidoClub(
  clubPrincipalSlug: string = CLUB_PRINCIPAL_SLUG_DEFAULT,
): Promise<MatchWithRelations | null> {
  const db = getDb();
  const [club] = await db
    .select({ id: teams.id })
    .from(teams)
    .where(eq(teams.slug, clubPrincipalSlug))
    .limit(1);
  if (!club) return null;

  const now = new Date();
  const [row] = await db
    .select()
    .from(matches)
    .where(
      and(
        or(eq(matches.homeTeamId, club.id), eq(matches.awayTeamId, club.id)),
        or(
          eq(matches.estado, 'en_vivo'),
          and(eq(matches.estado, 'programado'), gt(matches.fechaHora, now)),
        ),
      ),
    )
    .orderBy(asc(matches.fechaHora))
    .limit(1);

  if (!row) return null;
  const [hydrated] = await hydrateMatches([row]);
  return hydrated ?? null;
}

/**
 * Últimos partidos finalizados del club principal (orden descendente por fecha).
 */
export async function getUltimosResultadosClub(
  limit = 3,
  clubPrincipalSlug: string = CLUB_PRINCIPAL_SLUG_DEFAULT,
): Promise<MatchWithRelations[]> {
  const db = getDb();
  const [club] = await db
    .select({ id: teams.id })
    .from(teams)
    .where(eq(teams.slug, clubPrincipalSlug))
    .limit(1);
  if (!club) return [];

  const now = new Date();
  const rows = await db
    .select()
    .from(matches)
    .where(
      and(
        or(eq(matches.homeTeamId, club.id), eq(matches.awayTeamId, club.id)),
        eq(matches.estado, 'finalizado'),
        lt(matches.fechaHora, now),
      ),
    )
    .orderBy(desc(matches.fechaHora))
    .limit(limit);

  return hydrateMatches(rows);
}

export async function listSeasons(): Promise<Season[]> {
  const db = getDb();
  return db.select().from(seasons).orderBy(desc(seasons.fechaInicio));
}

export async function listCompetitions(): Promise<Competition[]> {
  const db = getDb();
  return db.select().from(competitions).orderBy(asc(competitions.nombre));
}

async function hydrateMatches(rows: Match[]): Promise<MatchWithRelations[]> {
  if (!rows.length) return [];
  const db = getDb();

  const competitionIds = unique(rows.map((m) => m.competitionId));
  const seasonIds = unique(rows.map((m) => m.seasonId));
  const teamIds = unique(rows.flatMap((m) => [m.homeTeamId, m.awayTeamId]));

  const [competitionRows, seasonRows, teamRows] = await Promise.all([
    db.select().from(competitions).where(inArray(competitions.id, competitionIds)),
    db.select().from(seasons).where(inArray(seasons.id, seasonIds)),
    db.select().from(teams).where(inArray(teams.id, teamIds)),
  ]);

  const competitionById = new Map(competitionRows.map((c) => [c.id, c]));
  const seasonById = new Map(seasonRows.map((s) => [s.id, s]));
  const teamById = new Map(teamRows.map((t) => [t.id, t]));

  return rows.map((m) => {
    const competition = competitionById.get(m.competitionId);
    const season = seasonById.get(m.seasonId);
    const homeTeam = teamById.get(m.homeTeamId);
    const awayTeam = teamById.get(m.awayTeamId);
    if (!competition || !season || !homeTeam || !awayTeam) {
      throw new Error(`Integridad referencial rota en match ${m.slug}`);
    }
    return { ...m, competition, season, homeTeam, awayTeam };
  });
}

function unique<T>(arr: T[]): T[] {
  return Array.from(new Set(arr));
}
