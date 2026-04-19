import {
  and,
  asc,
  desc,
  eq,
  isNull,
  playerSeasonStats,
  players,
  seasons,
  teams,
  type Player,
  type PlayerPosicion,
  type PlayerSeasonStats,
  type Season,
  type Team,
} from '@platzi-fc/db';
import { getDb } from '@/lib/db';

const CLUB_PRINCIPAL_SLUG = 'platzi-fc';

export type PlayerWithTeam = Player & { team: Team | null };

export type PlayerStatsRow = PlayerSeasonStats & { season: Season };

export type PlayerListFilters = {
  posicion?: PlayerPosicion;
  /**
   * Slug del equipo cuya plantilla se lista. Default: club principal.
   */
  teamSlug?: string;
};

const POSICION_ORDER: Record<PlayerPosicion, number> = {
  portero: 0,
  defensa: 1,
  mediocampista: 2,
  delantero: 3,
};

export async function listPlayers(filters: PlayerListFilters = {}): Promise<PlayerWithTeam[]> {
  const db = getDb();
  const { posicion, teamSlug = CLUB_PRINCIPAL_SLUG } = filters;

  const [team] = await db.select().from(teams).where(eq(teams.slug, teamSlug)).limit(1);
  if (!team) return [];

  const whereClause = posicion
    ? and(eq(players.teamId, team.id), eq(players.posicion, posicion))
    : eq(players.teamId, team.id);

  const rows = await db.select().from(players).where(whereClause).orderBy(asc(players.dorsal));

  // Sort estable: por posición canónica y luego por dorsal asc.
  rows.sort((a, b) => {
    const diff = POSICION_ORDER[a.posicion] - POSICION_ORDER[b.posicion];
    if (diff !== 0) return diff;
    return (a.dorsal ?? 999) - (b.dorsal ?? 999);
  });

  return rows.map((p) => ({ ...p, team }));
}

export async function getPlayerBySlug(slug: string): Promise<PlayerWithTeam | null> {
  const db = getDb();
  const [row] = await db.select().from(players).where(eq(players.slug, slug)).limit(1);
  if (!row) return null;

  let team: Team | null = null;
  if (row.teamId) {
    const [t] = await db.select().from(teams).where(eq(teams.id, row.teamId)).limit(1);
    team = t ?? null;
  }
  return { ...row, team };
}

/**
 * Stats agregadas (competición = NULL → total temporada) de un jugador, ordenadas
 * por fecha descendente de la temporada.
 */
export async function getPlayerTotalStats(playerId: string): Promise<PlayerStatsRow[]> {
  const db = getDb();
  const rows = await db
    .select({ stat: playerSeasonStats, season: seasons })
    .from(playerSeasonStats)
    .innerJoin(seasons, eq(seasons.id, playerSeasonStats.seasonId))
    .where(and(eq(playerSeasonStats.playerId, playerId), isNull(playerSeasonStats.competitionId)))
    .orderBy(desc(seasons.fechaInicio));

  return rows.map((r) => ({ ...r.stat, season: r.season }));
}

export async function countPlayersByPosition(
  teamSlug = CLUB_PRINCIPAL_SLUG,
): Promise<Record<PlayerPosicion, number>> {
  const roster = await listPlayers({ teamSlug });
  const counts: Record<PlayerPosicion, number> = {
    portero: 0,
    defensa: 0,
    mediocampista: 0,
    delantero: 0,
  };
  for (const p of roster) counts[p.posicion]++;
  return counts;
}
