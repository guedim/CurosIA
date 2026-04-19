/**
 * Seed de datos ficticios para Sprints 2 y 3.
 *
 * Pobla: 1 temporada activa, 4 competiciones, 8 equipos (1 propio + 7 rivales),
 * 24 partidos (mezcla de programados, en_vivo y finalizados) y eventos asociados
 * a los finalizados.
 *
 * Uso:
 *   pnpm --filter @platzi-fc/db seed
 *
 * Idempotente: se apoya en ON CONFLICT DO NOTHING sobre los slugs únicos. Puede
 * re-ejecutarse sin duplicar filas, pero no actualiza datos existentes.
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

import { sql } from 'drizzle-orm';
import { getDb } from '../src/client';
import {
  competitions,
  matchEvents,
  matches,
  seasons,
  teams,
  type NewCompetition,
  type NewMatch,
  type NewMatchEvent,
  type NewSeason,
  type NewTeam,
} from '../src/schema';

const db = getDb();

const TEMPORADA_SLUG = '2026';

const SEASONS: NewSeason[] = [
  {
    nombre: 'Temporada 2026',
    slug: TEMPORADA_SLUG,
    fechaInicio: '2026-01-15',
    fechaFin: '2026-12-20',
    estado: 'activa',
  },
];

const COMPETITIONS: NewCompetition[] = [
  {
    nombre: 'Liga Nacional',
    slug: 'liga-nacional',
    tipo: 'liga',
    pais: 'ES',
    region: 'Europa',
  },
  {
    nombre: 'Copa del Club',
    slug: 'copa-del-club',
    tipo: 'copa',
    pais: 'ES',
    region: 'Europa',
  },
  {
    nombre: 'Champions Regional',
    slug: 'champions-regional',
    tipo: 'internacional',
    region: 'Europa',
  },
  {
    nombre: 'Amistosos Pretemporada',
    slug: 'amistosos-pretemporada',
    tipo: 'amistoso',
  },
];

const TEAMS: NewTeam[] = [
  { nombre: 'Platzi FC', slug: 'platzi-fc', tipo: 'club_principal', pais: 'ES', ciudad: 'Madrid' },
  { nombre: 'Real Código', slug: 'real-codigo', tipo: 'rival', pais: 'ES', ciudad: 'Barcelona' },
  { nombre: 'Atlético Dev', slug: 'atletico-dev', tipo: 'rival', pais: 'ES', ciudad: 'Valencia' },
  {
    nombre: 'Sporting Debug',
    slug: 'sporting-debug',
    tipo: 'rival',
    pais: 'ES',
    ciudad: 'Sevilla',
  },
  {
    nombre: 'Deportivo Stack',
    slug: 'deportivo-stack',
    tipo: 'rival',
    pais: 'PT',
    ciudad: 'Lisboa',
  },
  { nombre: 'Unión Kernel', slug: 'union-kernel', tipo: 'rival', pais: 'FR', ciudad: 'Lyon' },
  { nombre: 'Racing Binary', slug: 'racing-binary', tipo: 'rival', pais: 'IT', ciudad: 'Milán' },
  { nombre: 'FC Compiler', slug: 'fc-compiler', tipo: 'rival', pais: 'DE', ciudad: 'Berlín' },
];

type MatchSeed = {
  slug: string;
  competitionSlug: string;
  homeSlug: string;
  awaySlug: string;
  jornada: number;
  fechaHora: string;
  estado: 'programado' | 'en_vivo' | 'finalizado';
  marcadorLocal?: number;
  marcadorVisita?: number;
  asistencia?: number;
  arbitro?: string;
  eventos?: {
    minuto: number;
    tipo: NewMatchEvent['tipo'];
    teamSlug: string;
    descripcion?: string;
  }[];
};

const MATCHES: MatchSeed[] = [
  // --- Finalizados (últimos resultados) ---
  {
    slug: 'platzi-fc-vs-real-codigo-2026-03-08',
    competitionSlug: 'liga-nacional',
    homeSlug: 'platzi-fc',
    awaySlug: 'real-codigo',
    jornada: 22,
    fechaHora: '2026-03-08T19:00:00Z',
    estado: 'finalizado',
    marcadorLocal: 2,
    marcadorVisita: 1,
    asistencia: 48210,
    arbitro: 'J. Martínez',
    eventos: [
      { minuto: 23, tipo: 'gol', teamSlug: 'platzi-fc', descripcion: 'Remate de cabeza' },
      { minuto: 41, tipo: 'amarilla', teamSlug: 'real-codigo' },
      { minuto: 56, tipo: 'gol', teamSlug: 'real-codigo', descripcion: 'Contragolpe' },
      { minuto: 78, tipo: 'gol_penal', teamSlug: 'platzi-fc' },
    ],
  },
  {
    slug: 'atletico-dev-vs-platzi-fc-2026-03-15',
    competitionSlug: 'liga-nacional',
    homeSlug: 'atletico-dev',
    awaySlug: 'platzi-fc',
    jornada: 23,
    fechaHora: '2026-03-15T17:30:00Z',
    estado: 'finalizado',
    marcadorLocal: 0,
    marcadorVisita: 3,
    asistencia: 32800,
    arbitro: 'L. García',
    eventos: [
      { minuto: 12, tipo: 'gol', teamSlug: 'platzi-fc' },
      { minuto: 54, tipo: 'gol', teamSlug: 'platzi-fc' },
      { minuto: 71, tipo: 'amarilla', teamSlug: 'atletico-dev' },
      { minuto: 83, tipo: 'gol', teamSlug: 'platzi-fc' },
    ],
  },
  {
    slug: 'platzi-fc-vs-sporting-debug-2026-03-22',
    competitionSlug: 'liga-nacional',
    homeSlug: 'platzi-fc',
    awaySlug: 'sporting-debug',
    jornada: 24,
    fechaHora: '2026-03-22T21:00:00Z',
    estado: 'finalizado',
    marcadorLocal: 1,
    marcadorVisita: 1,
    asistencia: 49100,
    arbitro: 'P. Ruiz',
    eventos: [
      { minuto: 34, tipo: 'gol', teamSlug: 'sporting-debug' },
      { minuto: 88, tipo: 'gol', teamSlug: 'platzi-fc', descripcion: 'Empate sobre la bocina' },
    ],
  },
  {
    slug: 'deportivo-stack-vs-platzi-fc-2026-03-29',
    competitionSlug: 'champions-regional',
    homeSlug: 'deportivo-stack',
    awaySlug: 'platzi-fc',
    jornada: 3,
    fechaHora: '2026-03-29T19:45:00Z',
    estado: 'finalizado',
    marcadorLocal: 2,
    marcadorVisita: 2,
    asistencia: 40500,
    arbitro: 'T. Fernández',
    eventos: [
      { minuto: 18, tipo: 'gol', teamSlug: 'deportivo-stack' },
      { minuto: 29, tipo: 'gol', teamSlug: 'platzi-fc' },
      { minuto: 63, tipo: 'gol_penal', teamSlug: 'platzi-fc' },
      { minuto: 90, tipo: 'gol', teamSlug: 'deportivo-stack', descripcion: 'Empate en añadido' },
    ],
  },
  {
    slug: 'platzi-fc-vs-union-kernel-2026-04-02',
    competitionSlug: 'copa-del-club',
    homeSlug: 'platzi-fc',
    awaySlug: 'union-kernel',
    jornada: 1,
    fechaHora: '2026-04-02T20:30:00Z',
    estado: 'finalizado',
    marcadorLocal: 4,
    marcadorVisita: 0,
    asistencia: 46200,
    arbitro: 'M. Soto',
    eventos: [
      { minuto: 8, tipo: 'gol', teamSlug: 'platzi-fc' },
      { minuto: 27, tipo: 'gol', teamSlug: 'platzi-fc' },
      { minuto: 52, tipo: 'gol', teamSlug: 'platzi-fc' },
      { minuto: 74, tipo: 'gol', teamSlug: 'platzi-fc' },
    ],
  },
  {
    slug: 'racing-binary-vs-platzi-fc-2026-04-08',
    competitionSlug: 'liga-nacional',
    homeSlug: 'racing-binary',
    awaySlug: 'platzi-fc',
    jornada: 25,
    fechaHora: '2026-04-08T18:00:00Z',
    estado: 'finalizado',
    marcadorLocal: 1,
    marcadorVisita: 2,
    asistencia: 35700,
    arbitro: 'R. Delgado',
    eventos: [
      { minuto: 14, tipo: 'gol', teamSlug: 'platzi-fc' },
      { minuto: 47, tipo: 'gol', teamSlug: 'racing-binary' },
      { minuto: 69, tipo: 'gol_penal', teamSlug: 'platzi-fc' },
      { minuto: 82, tipo: 'amarilla', teamSlug: 'racing-binary' },
    ],
  },
  {
    slug: 'fc-compiler-vs-platzi-fc-2026-04-13',
    competitionSlug: 'champions-regional',
    homeSlug: 'fc-compiler',
    awaySlug: 'platzi-fc',
    jornada: 4,
    fechaHora: '2026-04-13T20:00:00Z',
    estado: 'finalizado',
    marcadorLocal: 0,
    marcadorVisita: 1,
    asistencia: 52000,
    arbitro: 'S. Richter',
    eventos: [
      { minuto: 66, tipo: 'gol', teamSlug: 'platzi-fc', descripcion: 'Tiro libre' },
      { minuto: 90, tipo: 'amarilla', teamSlug: 'fc-compiler' },
    ],
  },

  // --- En vivo hoy ---
  {
    slug: 'platzi-fc-vs-real-codigo-2026-04-16',
    competitionSlug: 'liga-nacional',
    homeSlug: 'platzi-fc',
    awaySlug: 'real-codigo',
    jornada: 26,
    fechaHora: '2026-04-16T19:30:00Z',
    estado: 'en_vivo',
    marcadorLocal: 1,
    marcadorVisita: 0,
    asistencia: 49500,
    arbitro: 'J. Martínez',
    eventos: [{ minuto: 37, tipo: 'gol', teamSlug: 'platzi-fc', descripcion: 'Jugada colectiva' }],
  },

  // --- Programados (próximos partidos) ---
  {
    slug: 'union-kernel-vs-platzi-fc-2026-04-22',
    competitionSlug: 'liga-nacional',
    homeSlug: 'union-kernel',
    awaySlug: 'platzi-fc',
    jornada: 27,
    fechaHora: '2026-04-22T19:00:00Z',
    estado: 'programado',
  },
  {
    slug: 'platzi-fc-vs-deportivo-stack-2026-04-26',
    competitionSlug: 'champions-regional',
    homeSlug: 'platzi-fc',
    awaySlug: 'deportivo-stack',
    jornada: 5,
    fechaHora: '2026-04-26T20:45:00Z',
    estado: 'programado',
  },
  {
    slug: 'platzi-fc-vs-racing-binary-2026-05-03',
    competitionSlug: 'liga-nacional',
    homeSlug: 'platzi-fc',
    awaySlug: 'racing-binary',
    jornada: 28,
    fechaHora: '2026-05-03T21:00:00Z',
    estado: 'programado',
  },
  {
    slug: 'platzi-fc-vs-atletico-dev-2026-05-10',
    competitionSlug: 'copa-del-club',
    homeSlug: 'platzi-fc',
    awaySlug: 'atletico-dev',
    jornada: 2,
    fechaHora: '2026-05-10T18:30:00Z',
    estado: 'programado',
  },
  {
    slug: 'sporting-debug-vs-platzi-fc-2026-05-17',
    competitionSlug: 'liga-nacional',
    homeSlug: 'sporting-debug',
    awaySlug: 'platzi-fc',
    jornada: 29,
    fechaHora: '2026-05-17T17:00:00Z',
    estado: 'programado',
  },
  {
    slug: 'platzi-fc-vs-fc-compiler-2026-05-21',
    competitionSlug: 'champions-regional',
    homeSlug: 'platzi-fc',
    awaySlug: 'fc-compiler',
    jornada: 6,
    fechaHora: '2026-05-21T20:00:00Z',
    estado: 'programado',
  },
  {
    slug: 'real-codigo-vs-platzi-fc-2026-05-28',
    competitionSlug: 'liga-nacional',
    homeSlug: 'real-codigo',
    awaySlug: 'platzi-fc',
    jornada: 30,
    fechaHora: '2026-05-28T19:00:00Z',
    estado: 'programado',
  },

  // --- Partidos entre rivales (para enriquecer calendario y tabla) ---
  {
    slug: 'atletico-dev-vs-sporting-debug-2026-03-15',
    competitionSlug: 'liga-nacional',
    homeSlug: 'atletico-dev',
    awaySlug: 'sporting-debug',
    jornada: 23,
    fechaHora: '2026-03-15T20:00:00Z',
    estado: 'finalizado',
    marcadorLocal: 1,
    marcadorVisita: 2,
    asistencia: 28500,
  },
  {
    slug: 'real-codigo-vs-union-kernel-2026-03-22',
    competitionSlug: 'liga-nacional',
    homeSlug: 'real-codigo',
    awaySlug: 'union-kernel',
    jornada: 24,
    fechaHora: '2026-03-22T19:00:00Z',
    estado: 'finalizado',
    marcadorLocal: 3,
    marcadorVisita: 3,
    asistencia: 37100,
  },
  {
    slug: 'sporting-debug-vs-racing-binary-2026-03-29',
    competitionSlug: 'liga-nacional',
    homeSlug: 'sporting-debug',
    awaySlug: 'racing-binary',
    jornada: 25,
    fechaHora: '2026-03-29T17:00:00Z',
    estado: 'finalizado',
    marcadorLocal: 2,
    marcadorVisita: 0,
    asistencia: 31200,
  },
  {
    slug: 'union-kernel-vs-deportivo-stack-2026-04-05',
    competitionSlug: 'liga-nacional',
    homeSlug: 'union-kernel',
    awaySlug: 'deportivo-stack',
    jornada: 25,
    fechaHora: '2026-04-05T20:00:00Z',
    estado: 'finalizado',
    marcadorLocal: 1,
    marcadorVisita: 1,
    asistencia: 29800,
  },
  {
    slug: 'racing-binary-vs-fc-compiler-2026-04-12',
    competitionSlug: 'liga-nacional',
    homeSlug: 'racing-binary',
    awaySlug: 'fc-compiler',
    jornada: 26,
    fechaHora: '2026-04-12T18:30:00Z',
    estado: 'finalizado',
    marcadorLocal: 2,
    marcadorVisita: 2,
    asistencia: 33600,
  },
  {
    slug: 'deportivo-stack-vs-real-codigo-2026-04-19',
    competitionSlug: 'liga-nacional',
    homeSlug: 'deportivo-stack',
    awaySlug: 'real-codigo',
    jornada: 27,
    fechaHora: '2026-04-19T19:00:00Z',
    estado: 'programado',
  },
  {
    slug: 'fc-compiler-vs-atletico-dev-2026-04-26',
    competitionSlug: 'liga-nacional',
    homeSlug: 'fc-compiler',
    awaySlug: 'atletico-dev',
    jornada: 27,
    fechaHora: '2026-04-26T17:30:00Z',
    estado: 'programado',
  },
  {
    slug: 'platzi-fc-vs-real-codigo-2026-01-20',
    competitionSlug: 'amistosos-pretemporada',
    homeSlug: 'platzi-fc',
    awaySlug: 'real-codigo',
    jornada: 1,
    fechaHora: '2026-01-20T18:00:00Z',
    estado: 'finalizado',
    marcadorLocal: 3,
    marcadorVisita: 2,
    asistencia: 22000,
  },
];

async function seed() {
  // eslint-disable-next-line no-console
  console.log('→ Insertando temporadas');
  await db.insert(seasons).values(SEASONS).onConflictDoNothing({ target: seasons.slug });

  // eslint-disable-next-line no-console
  console.log('→ Insertando competiciones');
  await db
    .insert(competitions)
    .values(COMPETITIONS)
    .onConflictDoNothing({ target: competitions.slug });

  // eslint-disable-next-line no-console
  console.log('→ Insertando equipos');
  await db.insert(teams).values(TEAMS).onConflictDoNothing({ target: teams.slug });

  const seasonRows = await db.select().from(seasons);
  const competitionRows = await db.select().from(competitions);
  const teamRows = await db.select().from(teams);

  const seasonId = seasonRows.find((s) => s.slug === TEMPORADA_SLUG)?.id;
  if (!seasonId) throw new Error(`Temporada ${TEMPORADA_SLUG} no encontrada tras insertar`);

  const competitionBySlug = new Map(competitionRows.map((c) => [c.slug, c.id]));
  const teamBySlug = new Map(teamRows.map((t) => [t.slug, t.id]));

  // eslint-disable-next-line no-console
  console.log('→ Insertando partidos');
  const matchValues: NewMatch[] = MATCHES.map((m) => {
    const competitionId = competitionBySlug.get(m.competitionSlug);
    const homeTeamId = teamBySlug.get(m.homeSlug);
    const awayTeamId = teamBySlug.get(m.awaySlug);
    if (!competitionId || !homeTeamId || !awayTeamId) {
      throw new Error(`Relaciones faltantes en match ${m.slug}`);
    }
    return {
      slug: m.slug,
      seasonId,
      competitionId,
      homeTeamId,
      awayTeamId,
      jornada: m.jornada,
      fechaHora: new Date(m.fechaHora),
      estado: m.estado,
      marcadorLocal: m.marcadorLocal ?? null,
      marcadorVisita: m.marcadorVisita ?? null,
      asistencia: m.asistencia ?? null,
      arbitro: m.arbitro ?? null,
    };
  });

  await db.insert(matches).values(matchValues).onConflictDoNothing({ target: matches.slug });

  const matchRows = await db.select({ id: matches.id, slug: matches.slug }).from(matches);
  const matchBySlug = new Map(matchRows.map((m) => [m.slug, m.id]));

  // eslint-disable-next-line no-console
  console.log('→ Insertando eventos de partido');
  const eventValues: NewMatchEvent[] = [];
  for (const m of MATCHES) {
    if (!m.eventos?.length) continue;
    const matchId = matchBySlug.get(m.slug);
    if (!matchId) continue;
    for (const e of m.eventos) {
      const teamId = teamBySlug.get(e.teamSlug);
      eventValues.push({
        matchId,
        teamId: teamId ?? null,
        minuto: e.minuto,
        tipo: e.tipo,
        descripcion: e.descripcion ?? null,
      });
    }
  }
  if (eventValues.length) {
    // Truncamos eventos existentes de estos matches para mantener idempotencia:
    // si re-seedeas, los eventos se regeneran tal cual.
    const matchIds = Array.from(new Set(eventValues.map((e) => e.matchId)));
    await db.execute(
      sql`DELETE FROM match_events WHERE match_id IN (${sql.join(
        matchIds.map((id) => sql`${id}::uuid`),
        sql`, `,
      )})`,
    );
    await db.insert(matchEvents).values(eventValues);
  }

  // eslint-disable-next-line no-console
  console.log('✓ Seed completado');
  // eslint-disable-next-line no-console
  console.log(
    `  seasons=${seasonRows.length}, competitions=${competitionRows.length}, teams=${teamRows.length}, matches=${matchRows.length}, events=${eventValues.length}`,
  );
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('✗ Seed falló:', err);
    process.exit(1);
  });
