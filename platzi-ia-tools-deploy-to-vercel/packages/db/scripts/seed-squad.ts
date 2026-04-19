/**
 * Seed de Sprint 3: jugadores, staff, stats agregadas y tablas de clasificación.
 *
 * Depende de seed.ts (necesita temporadas, competiciones, equipos y partidos ya
 * insertados). Orden recomendado:
 *   pnpm --filter @platzi-fc/db seed
 *   pnpm --filter @platzi-fc/db seed:squad
 *
 * Idempotente para players y staff (ON CONFLICT DO NOTHING sobre slug). Para
 * player_season_stats y standings se borra y re-inserta por (player|team,
 * season, competition) para que re-seedeos reflejen el estado actual.
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

import { and, eq, inArray, sql } from 'drizzle-orm';
import { getDb } from '../src/client';
import {
  competitions,
  playerSeasonStats,
  players,
  seasons,
  staff,
  standings,
  teams,
  type NewPlayer,
  type NewPlayerSeasonStats,
  type NewStaff,
  type NewStanding,
  type FormaResultado,
} from '../src/schema';

const db = getDb();

const SEASON_SLUG = '2026';
const CLUB_PRINCIPAL_SLUG = 'platzi-fc';
const LIGA_SLUG = 'liga-nacional';
const CHAMPIONS_SLUG = 'champions-regional';

type PlayerSeed = Omit<NewPlayer, 'teamId'> & {
  stats?: Partial<{
    pj: number;
    min: number;
    goles: number;
    asistencias: number;
    amarillas: number;
    rojas: number;
  }>;
};

const PLAYERS: PlayerSeed[] = [
  // Porteros
  {
    slug: 'pablo-guerra',
    nombre: 'Pablo',
    apellido: 'Guerra',
    dorsal: 1,
    posicion: 'portero',
    nacionalidad: 'ES',
    fechaNacimiento: '1995-05-14',
    alturaCm: 190,
    pesoKg: 85,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 24, min: 2160 },
  },
  {
    slug: 'marco-antonelli',
    nombre: 'Marco',
    apellido: 'Antonelli',
    dorsal: 13,
    posicion: 'portero',
    nacionalidad: 'IT',
    fechaNacimiento: '1999-11-02',
    alturaCm: 188,
    pesoKg: 82,
    pieHabil: 'izquierdo',
    estado: 'activo',
    stats: { pj: 2, min: 180 },
  },
  // Defensas
  {
    slug: 'daniel-ortiz',
    nombre: 'Daniel',
    apellido: 'Ortiz',
    dorsal: 2,
    posicion: 'defensa',
    nacionalidad: 'ES',
    fechaNacimiento: '1994-03-21',
    alturaCm: 182,
    pesoKg: 78,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 23, min: 2050, goles: 1, amarillas: 4 },
  },
  {
    slug: 'lucas-fernandez',
    nombre: 'Lucas',
    apellido: 'Fernández',
    dorsal: 3,
    posicion: 'defensa',
    nacionalidad: 'AR',
    fechaNacimiento: '1996-07-08',
    alturaCm: 185,
    pesoKg: 80,
    pieHabil: 'izquierdo',
    estado: 'activo',
    stats: { pj: 22, min: 1980, amarillas: 3 },
  },
  {
    slug: 'hugo-mendez',
    nombre: 'Hugo',
    apellido: 'Méndez',
    dorsal: 4,
    posicion: 'defensa',
    nacionalidad: 'PT',
    fechaNacimiento: '1993-09-12',
    alturaCm: 188,
    pesoKg: 83,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 20, min: 1790, goles: 2, amarillas: 5, rojas: 1 },
  },
  {
    slug: 'javier-cortes',
    nombre: 'Javier',
    apellido: 'Cortés',
    dorsal: 5,
    posicion: 'defensa',
    nacionalidad: 'ES',
    fechaNacimiento: '1997-12-01',
    alturaCm: 180,
    pesoKg: 75,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 18, min: 1520, amarillas: 2 },
  },
  {
    slug: 'rafael-novak',
    nombre: 'Rafael',
    apellido: 'Novak',
    dorsal: 15,
    posicion: 'defensa',
    nacionalidad: 'CZ',
    fechaNacimiento: '2000-04-19',
    alturaCm: 184,
    pesoKg: 79,
    pieHabil: 'derecho',
    estado: 'lesionado',
    stats: { pj: 10, min: 850 },
  },
  // Mediocampistas
  {
    slug: 'alejandro-duran',
    nombre: 'Alejandro',
    apellido: 'Durán',
    dorsal: 6,
    posicion: 'mediocampista',
    nacionalidad: 'ES',
    fechaNacimiento: '1994-08-05',
    alturaCm: 176,
    pesoKg: 72,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 24, min: 2160, goles: 3, asistencias: 6, amarillas: 4 },
  },
  {
    slug: 'mateo-pizarro',
    nombre: 'Mateo',
    apellido: 'Pizarro',
    dorsal: 8,
    posicion: 'mediocampista',
    nacionalidad: 'AR',
    fechaNacimiento: '1998-02-27',
    alturaCm: 174,
    pesoKg: 70,
    pieHabil: 'izquierdo',
    estado: 'activo',
    stats: { pj: 23, min: 2010, goles: 4, asistencias: 5, amarillas: 2 },
  },
  {
    slug: 'nicolas-vega',
    nombre: 'Nicolás',
    apellido: 'Vega',
    dorsal: 10,
    posicion: 'mediocampista',
    nacionalidad: 'UY',
    fechaNacimiento: '1995-06-18',
    alturaCm: 178,
    pesoKg: 74,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 25, min: 2230, goles: 8, asistencias: 11, amarillas: 3 },
  },
  {
    slug: 'thiago-silva',
    nombre: 'Thiago',
    apellido: 'Silva',
    dorsal: 14,
    posicion: 'mediocampista',
    nacionalidad: 'BR',
    fechaNacimiento: '2001-11-30',
    alturaCm: 172,
    pesoKg: 68,
    pieHabil: 'ambidiestro',
    estado: 'activo',
    stats: { pj: 16, min: 1120, goles: 2, asistencias: 3 },
  },
  {
    slug: 'pedro-aranda',
    nombre: 'Pedro',
    apellido: 'Aranda',
    dorsal: 17,
    posicion: 'mediocampista',
    nacionalidad: 'ES',
    fechaNacimiento: '1996-10-09',
    alturaCm: 177,
    pesoKg: 73,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 19, min: 1600, goles: 2, asistencias: 4, amarillas: 3 },
  },
  {
    slug: 'diego-campos',
    nombre: 'Diego',
    apellido: 'Campos',
    dorsal: 21,
    posicion: 'mediocampista',
    nacionalidad: 'MX',
    fechaNacimiento: '1999-07-15',
    alturaCm: 173,
    pesoKg: 69,
    pieHabil: 'izquierdo',
    estado: 'activo',
    stats: { pj: 14, min: 920, goles: 1, asistencias: 2 },
  },
  // Delanteros
  {
    slug: 'andres-rojas',
    nombre: 'Andrés',
    apellido: 'Rojas',
    dorsal: 7,
    posicion: 'delantero',
    nacionalidad: 'CO',
    fechaNacimiento: '1993-04-03',
    alturaCm: 180,
    pesoKg: 76,
    pieHabil: 'izquierdo',
    estado: 'activo',
    stats: { pj: 25, min: 2230, goles: 18, asistencias: 7, amarillas: 2 },
  },
  {
    slug: 'carlos-iniesta',
    nombre: 'Carlos',
    apellido: 'Iniesta',
    dorsal: 9,
    posicion: 'delantero',
    nacionalidad: 'ES',
    fechaNacimiento: '1992-12-22',
    alturaCm: 186,
    pesoKg: 82,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 24, min: 2140, goles: 15, asistencias: 4, amarillas: 1 },
  },
  {
    slug: 'nico-morales',
    nombre: 'Nico',
    apellido: 'Morales',
    dorsal: 11,
    posicion: 'delantero',
    nacionalidad: 'ES',
    fechaNacimiento: '2000-01-17',
    alturaCm: 175,
    pesoKg: 71,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 20, min: 1450, goles: 6, asistencias: 3 },
  },
  {
    slug: 'oliver-grau',
    nombre: 'Oliver',
    apellido: 'Grau',
    dorsal: 19,
    posicion: 'delantero',
    nacionalidad: 'FR',
    fechaNacimiento: '2002-05-24',
    alturaCm: 183,
    pesoKg: 77,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 12, min: 680, goles: 3, asistencias: 1 },
  },
  {
    slug: 'tomas-vieira',
    nombre: 'Tomás',
    apellido: 'Vieira',
    dorsal: 22,
    posicion: 'delantero',
    nacionalidad: 'PT',
    fechaNacimiento: '1997-03-11',
    alturaCm: 178,
    pesoKg: 74,
    pieHabil: 'ambidiestro',
    estado: 'activo',
    stats: { pj: 18, min: 1280, goles: 5, asistencias: 4 },
  },
  // Reservas / jóvenes
  {
    slug: 'samir-khan',
    nombre: 'Samir',
    apellido: 'Khan',
    dorsal: 23,
    posicion: 'defensa',
    nacionalidad: 'EG',
    fechaNacimiento: '2003-02-02',
    alturaCm: 182,
    pesoKg: 75,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 6, min: 340 },
  },
  {
    slug: 'leo-palmeri',
    nombre: 'Leo',
    apellido: 'Palmeri',
    dorsal: 24,
    posicion: 'mediocampista',
    nacionalidad: 'AR',
    fechaNacimiento: '2003-08-30',
    alturaCm: 170,
    pesoKg: 65,
    pieHabil: 'izquierdo',
    estado: 'activo',
    stats: { pj: 4, min: 180 },
  },
  {
    slug: 'ivan-brebic',
    nombre: 'Ivan',
    apellido: 'Brebic',
    dorsal: 25,
    posicion: 'mediocampista',
    nacionalidad: 'HR',
    fechaNacimiento: '2002-10-14',
    alturaCm: 181,
    pesoKg: 74,
    pieHabil: 'derecho',
    estado: 'cedido',
    stats: { pj: 0, min: 0 },
  },
  {
    slug: 'raul-mendoza',
    nombre: 'Raúl',
    apellido: 'Mendoza',
    dorsal: 26,
    posicion: 'delantero',
    nacionalidad: 'ES',
    fechaNacimiento: '2004-01-09',
    alturaCm: 176,
    pesoKg: 70,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 3, min: 120, goles: 1 },
  },
  {
    slug: 'felipe-navas',
    nombre: 'Felipe',
    apellido: 'Navas',
    dorsal: 27,
    posicion: 'defensa',
    nacionalidad: 'CL',
    fechaNacimiento: '2002-06-28',
    alturaCm: 185,
    pesoKg: 80,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 5, min: 310 },
  },
  {
    slug: 'martin-cabral',
    nombre: 'Martín',
    apellido: 'Cabral',
    dorsal: 28,
    posicion: 'mediocampista',
    nacionalidad: 'ES',
    fechaNacimiento: '2001-09-17',
    alturaCm: 172,
    pesoKg: 67,
    pieHabil: 'izquierdo',
    estado: 'activo',
    stats: { pj: 9, min: 520, asistencias: 1 },
  },
  {
    slug: 'adrian-pons',
    nombre: 'Adrián',
    apellido: 'Pons',
    dorsal: 29,
    posicion: 'delantero',
    nacionalidad: 'ES',
    fechaNacimiento: '2003-11-04',
    alturaCm: 179,
    pesoKg: 73,
    pieHabil: 'derecho',
    estado: 'activo',
    stats: { pj: 7, min: 410, goles: 2 },
  },
];

const STAFF: NewStaff[] = [
  { slug: 'ricardo-pereira', nombre: 'Ricardo Pereira', rol: 'Entrenador principal' },
  { slug: 'carla-benitez', nombre: 'Carla Benítez', rol: 'Entrenadora asistente' },
  { slug: 'jorge-martinez', nombre: 'Jorge Martínez', rol: 'Preparador físico' },
  { slug: 'elena-rodriguez', nombre: 'Elena Rodríguez', rol: 'Entrenadora de porteros' },
  { slug: 'pablo-costa', nombre: 'Pablo Costa', rol: 'Analista táctico' },
  { slug: 'sandra-vila', nombre: 'Sandra Vila', rol: 'Médica del club' },
  { slug: 'tomas-ledesma', nombre: 'Tomás Ledesma', rol: 'Fisioterapeuta' },
  { slug: 'ana-serrano', nombre: 'Ana Serrano', rol: 'Nutricionista' },
];

type StandingSeed = {
  teamSlug: string;
  posicion: number;
  pj: number;
  pg: number;
  pe: number;
  pp: number;
  gf: number;
  gc: number;
  pts: number;
  forma: FormaResultado[];
};

const LIGA_STANDINGS: StandingSeed[] = [
  {
    teamSlug: 'platzi-fc',
    posicion: 1,
    pj: 26,
    pg: 18,
    pe: 5,
    pp: 3,
    gf: 52,
    gc: 22,
    pts: 59,
    forma: ['G', 'G', 'E', 'G', 'G'],
  },
  {
    teamSlug: 'real-codigo',
    posicion: 2,
    pj: 26,
    pg: 17,
    pe: 5,
    pp: 4,
    gf: 48,
    gc: 24,
    pts: 56,
    forma: ['G', 'P', 'G', 'G', 'E'],
  },
  {
    teamSlug: 'atletico-dev',
    posicion: 3,
    pj: 26,
    pg: 15,
    pe: 6,
    pp: 5,
    gf: 44,
    gc: 28,
    pts: 51,
    forma: ['E', 'G', 'P', 'G', 'G'],
  },
  {
    teamSlug: 'sporting-debug',
    posicion: 4,
    pj: 26,
    pg: 13,
    pe: 8,
    pp: 5,
    gf: 40,
    gc: 29,
    pts: 47,
    forma: ['G', 'E', 'G', 'G', 'P'],
  },
  {
    teamSlug: 'union-kernel',
    posicion: 5,
    pj: 26,
    pg: 12,
    pe: 7,
    pp: 7,
    gf: 38,
    gc: 32,
    pts: 43,
    forma: ['P', 'E', 'G', 'E', 'G'],
  },
  {
    teamSlug: 'racing-binary',
    posicion: 6,
    pj: 26,
    pg: 10,
    pe: 9,
    pp: 7,
    gf: 35,
    gc: 33,
    pts: 39,
    forma: ['E', 'G', 'P', 'G', 'E'],
  },
  {
    teamSlug: 'deportivo-stack',
    posicion: 7,
    pj: 26,
    pg: 9,
    pe: 8,
    pp: 9,
    gf: 30,
    gc: 33,
    pts: 35,
    forma: ['E', 'P', 'E', 'G', 'P'],
  },
  {
    teamSlug: 'fc-compiler',
    posicion: 8,
    pj: 26,
    pg: 7,
    pe: 6,
    pp: 13,
    gf: 27,
    gc: 42,
    pts: 27,
    forma: ['P', 'P', 'E', 'P', 'P'],
  },
];

const CHAMPIONS_STANDINGS: StandingSeed[] = [
  {
    teamSlug: 'platzi-fc',
    posicion: 1,
    pj: 4,
    pg: 2,
    pe: 2,
    pp: 0,
    gf: 8,
    gc: 4,
    pts: 8,
    forma: ['G', 'E', 'E', 'G'],
  },
  {
    teamSlug: 'deportivo-stack',
    posicion: 2,
    pj: 4,
    pg: 2,
    pe: 1,
    pp: 1,
    gf: 7,
    gc: 5,
    pts: 7,
    forma: ['G', 'G', 'E', 'P'],
  },
  {
    teamSlug: 'fc-compiler',
    posicion: 3,
    pj: 4,
    pg: 1,
    pe: 1,
    pp: 2,
    gf: 5,
    gc: 6,
    pts: 4,
    forma: ['E', 'P', 'G', 'P'],
  },
  {
    teamSlug: 'racing-binary',
    posicion: 4,
    pj: 4,
    pg: 0,
    pe: 2,
    pp: 2,
    gf: 3,
    gc: 8,
    pts: 2,
    forma: ['E', 'P', 'P', 'E'],
  },
];

async function main() {
  const [seasonRow] = await db.select().from(seasons).where(eq(seasons.slug, SEASON_SLUG)).limit(1);
  if (!seasonRow) throw new Error(`Temporada ${SEASON_SLUG} no existe. Ejecuta seed.ts primero.`);
  const seasonId = seasonRow.id;

  const competitionRows = await db.select().from(competitions);
  const competitionBySlug = new Map(competitionRows.map((c) => [c.slug, c.id]));
  const ligaId = competitionBySlug.get(LIGA_SLUG);
  const championsId = competitionBySlug.get(CHAMPIONS_SLUG);
  if (!ligaId || !championsId) {
    throw new Error('Competiciones liga-nacional / champions-regional no encontradas.');
  }

  const teamRows = await db.select().from(teams);
  const teamBySlug = new Map(teamRows.map((t) => [t.slug, t.id]));
  const clubId = teamBySlug.get(CLUB_PRINCIPAL_SLUG);
  if (!clubId) throw new Error('Club principal no encontrado.');

  // --- Players ---
  // eslint-disable-next-line no-console
  console.log('→ Insertando jugadores');
  const playerValues: NewPlayer[] = PLAYERS.map(({ stats: _stats, ...p }) => ({
    ...p,
    teamId: clubId,
  }));
  await db.insert(players).values(playerValues).onConflictDoNothing({ target: players.slug });

  const playerRows = await db
    .select({ id: players.id, slug: players.slug })
    .from(players)
    .where(
      inArray(
        players.slug,
        PLAYERS.map((p) => p.slug),
      ),
    );
  const playerBySlug = new Map(playerRows.map((p) => [p.slug, p.id]));

  // --- Player season stats ---
  // eslint-disable-next-line no-console
  console.log('→ Refrescando player_season_stats');
  const statValues: NewPlayerSeasonStats[] = [];
  for (const p of PLAYERS) {
    const playerId = playerBySlug.get(p.slug);
    if (!playerId || !p.stats) continue;
    statValues.push({
      playerId,
      seasonId,
      competitionId: null,
      partidosJugados: p.stats.pj ?? 0,
      minutos: p.stats.min ?? 0,
      goles: p.stats.goles ?? 0,
      asistencias: p.stats.asistencias ?? 0,
      amarillas: p.stats.amarillas ?? 0,
      rojas: p.stats.rojas ?? 0,
    });
  }
  if (statValues.length) {
    const playerIds = statValues.map((s) => s.playerId);
    await db
      .delete(playerSeasonStats)
      .where(
        and(
          inArray(playerSeasonStats.playerId, playerIds),
          eq(playerSeasonStats.seasonId, seasonId),
        ),
      );
    await db.insert(playerSeasonStats).values(statValues);
  }

  // --- Staff ---
  // eslint-disable-next-line no-console
  console.log('→ Insertando staff');
  await db
    .insert(staff)
    .values(STAFF.map((s) => ({ ...s, teamId: clubId })))
    .onConflictDoNothing({ target: staff.slug });

  // --- Standings ---
  // eslint-disable-next-line no-console
  console.log('→ Refrescando standings');
  const standingValues: NewStanding[] = [];
  const pushStandings = (rows: StandingSeed[], competitionId: string) => {
    for (const r of rows) {
      const teamId = teamBySlug.get(r.teamSlug);
      if (!teamId) continue;
      standingValues.push({
        seasonId,
        competitionId,
        teamId,
        posicion: r.posicion,
        pj: r.pj,
        pg: r.pg,
        pe: r.pe,
        pp: r.pp,
        gf: r.gf,
        gc: r.gc,
        pts: r.pts,
        forma: r.forma,
      });
    }
  };
  pushStandings(LIGA_STANDINGS, ligaId);
  pushStandings(CHAMPIONS_STANDINGS, championsId);

  if (standingValues.length) {
    await db
      .delete(standings)
      .where(
        and(
          eq(standings.seasonId, seasonId),
          inArray(standings.competitionId, [ligaId, championsId]),
        ),
      );
    await db.insert(standings).values(standingValues);
  }

  // eslint-disable-next-line no-console
  console.log(
    `✓ Seed squad completado. players=${playerRows.length}, stats=${statValues.length}, staff=${STAFF.length}, standings=${standingValues.length}`,
  );
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('✗ Seed squad falló:', err);
    // eslint-disable-next-line no-console
    console.error(sql);
    process.exit(1);
  });
