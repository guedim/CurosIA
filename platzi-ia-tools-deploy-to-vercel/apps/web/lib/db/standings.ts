import {
  and,
  asc,
  competitions,
  desc,
  eq,
  seasons,
  standings,
  teams,
  type Competition,
  type Season,
  type Standing,
  type Team,
} from '@platzi-fc/db';
import { getDb } from '@/lib/db';

export type StandingWithTeam = Standing & { team: Team };

export async function getCompetitionBySlug(slug: string): Promise<Competition | null> {
  const db = getDb();
  const [row] = await db.select().from(competitions).where(eq(competitions.slug, slug)).limit(1);
  return row ?? null;
}

/**
 * Tabla de clasificación ordenada por posición. Si `seasonSlug` es undefined,
 * usa la temporada activa más reciente.
 */
export async function getStandingsByCompetition(
  competitionSlug: string,
  seasonSlug?: string,
): Promise<{ competition: Competition; season: Season; rows: StandingWithTeam[] } | null> {
  const db = getDb();
  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) return null;

  const season = seasonSlug
    ? await db
        .select()
        .from(seasons)
        .where(eq(seasons.slug, seasonSlug))
        .limit(1)
        .then((r) => r[0])
    : await db
        .select()
        .from(seasons)
        .where(eq(seasons.estado, 'activa'))
        .orderBy(desc(seasons.fechaInicio))
        .limit(1)
        .then((r) => r[0]);
  if (!season) return null;

  const rawRows = await db
    .select({ standing: standings, team: teams })
    .from(standings)
    .innerJoin(teams, eq(teams.id, standings.teamId))
    .where(and(eq(standings.competitionId, competition.id), eq(standings.seasonId, season.id)))
    .orderBy(asc(standings.posicion));

  return {
    competition,
    season,
    rows: rawRows.map((r) => ({ ...r.standing, team: r.team })),
  };
}
