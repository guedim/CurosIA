/**
 * Seed de Sprint V1-1: estadísticas, alineaciones y timeline ampliado para
 * partidos destacados. Depende de seed.ts y seed-squad.ts.
 *
 * Actualiza 3 partidos con `stats`, `alineacionLocal`, `alineacionVisita` y
 * regenera sus eventos con una timeline más rica (goles, asistencias, tarjetas,
 * sustituciones). Idempotente: reescribe las columnas de esos matches.
 *
 *   pnpm --filter @platzi-fc/db seed:match-detail
 */
import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

import { eq, inArray, sql } from 'drizzle-orm';
import { getDb } from '../src/client';
import {
  galleries,
  matchEvents,
  matches,
  players,
  teams,
  videos,
  type AlineacionEntry,
  type NewGallery,
  type NewMatchEvent,
  type NewVideo,
} from '../src/schema';

const db = getDb();

type MatchStats = {
  posesion: { local: number; visita: number };
  remates: { local: number; visita: number };
  rematesAPuerta: { local: number; visita: number };
  corners: { local: number; visita: number };
  faltas: { local: number; visita: number };
  fuerasDeJuego: { local: number; visita: number };
  pases: { local: number; visita: number };
  precisionPases: { local: number; visita: number };
  amarillas: { local: number; visita: number };
  rojas: { local: number; visita: number };
};

type AlineacionSeed = {
  dorsal: number;
  nombre: string;
  posicion: 'portero' | 'defensa' | 'mediocampista' | 'delantero';
  titular: boolean;
  minutoEntrada?: number;
  minutoSalida?: number;
  /** Slug del jugador en players (solo Platzi FC). Los rivales no tienen fila. */
  playerSlug?: string;
};

type EventSeed = {
  minuto: number;
  minutoExtra?: number;
  tipo: NewMatchEvent['tipo'];
  teamSlug: string;
  descripcion?: string;
};

type MatchDetailSeed = {
  slug: string;
  stats: MatchStats;
  alineacionLocal: AlineacionSeed[];
  alineacionVisita: AlineacionSeed[];
  eventos: EventSeed[];
};

/**
 * Alineación base del Platzi FC en 4-3-3 con sustituciones habituales.
 * Los slugs se resuelven a UUIDs desde la tabla `players`.
 */
const PLATZI_XI_BASE: AlineacionSeed[] = [
  {
    dorsal: 1,
    nombre: 'Pablo Guerra',
    posicion: 'portero',
    titular: true,
    playerSlug: 'pablo-guerra',
  },
  {
    dorsal: 2,
    nombre: 'Daniel Ortiz',
    posicion: 'defensa',
    titular: true,
    playerSlug: 'daniel-ortiz',
  },
  {
    dorsal: 3,
    nombre: 'Lucas Fernández',
    posicion: 'defensa',
    titular: true,
    playerSlug: 'lucas-fernandez',
  },
  {
    dorsal: 4,
    nombre: 'Hugo Méndez',
    posicion: 'defensa',
    titular: true,
    playerSlug: 'hugo-mendez',
  },
  {
    dorsal: 5,
    nombre: 'Javier Cortés',
    posicion: 'defensa',
    titular: true,
    playerSlug: 'javier-cortes',
  },
  {
    dorsal: 6,
    nombre: 'Alejandro Durán',
    posicion: 'mediocampista',
    titular: true,
    playerSlug: 'alejandro-duran',
  },
  {
    dorsal: 8,
    nombre: 'Mateo Pizarro',
    posicion: 'mediocampista',
    titular: true,
    playerSlug: 'mateo-pizarro',
  },
  {
    dorsal: 10,
    nombre: 'Nicolás Vega',
    posicion: 'mediocampista',
    titular: true,
    playerSlug: 'nicolas-vega',
  },
  {
    dorsal: 7,
    nombre: 'Andrés Rojas',
    posicion: 'delantero',
    titular: true,
    playerSlug: 'andres-rojas',
  },
  {
    dorsal: 9,
    nombre: 'Carlos Iniesta',
    posicion: 'delantero',
    titular: true,
    playerSlug: 'carlos-iniesta',
  },
  {
    dorsal: 11,
    nombre: 'Nico Morales',
    posicion: 'delantero',
    titular: true,
    playerSlug: 'nico-morales',
  },
  // Suplentes habituales
  {
    dorsal: 13,
    nombre: 'Marco Antonelli',
    posicion: 'portero',
    titular: false,
    playerSlug: 'marco-antonelli',
  },
  {
    dorsal: 14,
    nombre: 'Thiago Silva',
    posicion: 'mediocampista',
    titular: false,
    playerSlug: 'thiago-silva',
  },
  {
    dorsal: 17,
    nombre: 'Pedro Aranda',
    posicion: 'mediocampista',
    titular: false,
    playerSlug: 'pedro-aranda',
  },
  {
    dorsal: 19,
    nombre: 'Oliver Grau',
    posicion: 'delantero',
    titular: false,
    playerSlug: 'oliver-grau',
  },
  {
    dorsal: 21,
    nombre: 'Diego Campos',
    posicion: 'mediocampista',
    titular: false,
    playerSlug: 'diego-campos',
  },
  {
    dorsal: 22,
    nombre: 'Tomás Vieira',
    posicion: 'delantero',
    titular: false,
    playerSlug: 'tomas-vieira',
  },
  {
    dorsal: 23,
    nombre: 'Samir Khan',
    posicion: 'defensa',
    titular: false,
    playerSlug: 'samir-khan',
  },
];

/** Once base del rival con nombres genéricos; sin playerId real (jsonb sintético). */
function buildRivalXI(teamSlug: string): AlineacionSeed[] {
  const nombresPorSlug: Record<string, string[]> = {
    'real-codigo': [
      'A. Vázquez',
      'B. Torres',
      'C. Ramos',
      'D. Giménez',
      'E. Luna',
      'F. Aranda',
      'G. Soler',
      'H. Velasco',
      'I. Piqué',
      'J. Marín',
      'K. Reyes',
      'L. Núñez',
      'M. Pons',
      'N. Vera',
      'O. Ruiz',
    ],
    'union-kernel': [
      'A. Rossi',
      'B. Kohl',
      'C. Müller',
      'D. Bauer',
      'E. Schmidt',
      'F. Wagner',
      'G. Hoffmann',
      'H. Weber',
      'I. Fischer',
      'J. Becker',
      'K. Lange',
      'L. Krüger',
      'M. Werner',
      'N. Hahn',
      'O. Bach',
    ],
  };
  const nombres =
    nombresPorSlug[teamSlug] ?? Array.from({ length: 15 }, (_, i) => `Jugador ${i + 1}`);
  const posiciones: AlineacionSeed['posicion'][] = [
    'portero',
    'defensa',
    'defensa',
    'defensa',
    'defensa',
    'mediocampista',
    'mediocampista',
    'mediocampista',
    'delantero',
    'delantero',
    'delantero',
  ];
  const titulares: AlineacionSeed[] = posiciones.map((posicion, i) => ({
    dorsal: i + 1,
    nombre: nombres[i],
    posicion,
    titular: true,
  }));
  const suplentes: AlineacionSeed[] = [
    { dorsal: 12, nombre: nombres[11], posicion: 'portero', titular: false },
    { dorsal: 14, nombre: nombres[12], posicion: 'mediocampista', titular: false },
    { dorsal: 16, nombre: nombres[13], posicion: 'defensa', titular: false },
    { dorsal: 18, nombre: nombres[14], posicion: 'delantero', titular: false },
  ];
  return [...titulares, ...suplentes];
}

const MATCHES_DETAIL: MatchDetailSeed[] = [
  // Finalizado: 2-1 ante Real Código (jornada 22, Liga Nacional)
  {
    slug: 'platzi-fc-vs-real-codigo-2026-03-08',
    stats: {
      posesion: { local: 62, visita: 38 },
      remates: { local: 14, visita: 7 },
      rematesAPuerta: { local: 7, visita: 3 },
      corners: { local: 6, visita: 4 },
      faltas: { local: 10, visita: 14 },
      fuerasDeJuego: { local: 2, visita: 5 },
      pases: { local: 512, visita: 384 },
      precisionPases: { local: 88, visita: 81 },
      amarillas: { local: 1, visita: 3 },
      rojas: { local: 0, visita: 0 },
    },
    alineacionLocal: PLATZI_XI_BASE.map((p, i) => {
      if (p.dorsal === 11) return { ...p, minutoSalida: 72 };
      if (p.dorsal === 10) return { ...p, minutoSalida: 85 };
      if (p.dorsal === 22) return { ...p, titular: false, minutoEntrada: 72 };
      if (p.dorsal === 17) return { ...p, titular: false, minutoEntrada: 85 };
      return p;
    }),
    alineacionVisita: buildRivalXI('real-codigo'),
    eventos: [
      {
        minuto: 23,
        tipo: 'gol',
        teamSlug: 'platzi-fc',
        descripcion: 'Iniesta remata de cabeza a pase de Vega',
      },
      {
        minuto: 41,
        tipo: 'amarilla',
        teamSlug: 'real-codigo',
        descripcion: 'Falta sobre Rojas en tres cuartos',
      },
      { minuto: 56, tipo: 'gol', teamSlug: 'real-codigo', descripcion: 'Vázquez al contragolpe' },
      {
        minuto: 68,
        tipo: 'amarilla',
        teamSlug: 'real-codigo',
        descripcion: 'Interrupción táctica',
      },
      {
        minuto: 72,
        tipo: 'sustitucion',
        teamSlug: 'platzi-fc',
        descripcion: 'Entra Vieira por Morales',
      },
      {
        minuto: 78,
        tipo: 'gol_penal',
        teamSlug: 'platzi-fc',
        descripcion: 'Rojas transforma desde los once metros',
      },
      {
        minuto: 83,
        tipo: 'amarilla',
        teamSlug: 'real-codigo',
        descripcion: 'Protestar al árbitro',
      },
      {
        minuto: 85,
        tipo: 'sustitucion',
        teamSlug: 'platzi-fc',
        descripcion: 'Entra Aranda por Vega',
      },
      { minuto: 88, tipo: 'amarilla', teamSlug: 'platzi-fc', descripcion: 'Pérdida de tiempo' },
      {
        minuto: 90,
        minutoExtra: 3,
        tipo: 'var',
        teamSlug: 'real-codigo',
        descripcion: 'Revisión por posible penal; no se concede',
      },
    ],
  },
  // Finalizado: 4-0 ante Unión Kernel (Copa)
  {
    slug: 'platzi-fc-vs-union-kernel-2026-04-02',
    stats: {
      posesion: { local: 71, visita: 29 },
      remates: { local: 22, visita: 4 },
      rematesAPuerta: { local: 13, visita: 1 },
      corners: { local: 11, visita: 2 },
      faltas: { local: 6, visita: 17 },
      fuerasDeJuego: { local: 3, visita: 1 },
      pases: { local: 623, visita: 298 },
      precisionPases: { local: 91, visita: 74 },
      amarillas: { local: 0, visita: 4 },
      rojas: { local: 0, visita: 1 },
    },
    alineacionLocal: PLATZI_XI_BASE.map((p) => {
      if (p.dorsal === 9) return { ...p, minutoSalida: 65 };
      if (p.dorsal === 22) return { ...p, titular: false, minutoEntrada: 65 };
      if (p.dorsal === 10) return { ...p, minutoSalida: 78 };
      if (p.dorsal === 14) return { ...p, titular: false, minutoEntrada: 78 };
      if (p.dorsal === 6) return { ...p, minutoSalida: 85 };
      if (p.dorsal === 21) return { ...p, titular: false, minutoEntrada: 85 };
      return p;
    }),
    alineacionVisita: buildRivalXI('union-kernel'),
    eventos: [
      { minuto: 8, tipo: 'gol', teamSlug: 'platzi-fc', descripcion: 'Iniesta abre el marcador' },
      { minuto: 22, tipo: 'amarilla', teamSlug: 'union-kernel', descripcion: 'Falta sobre Vega' },
      {
        minuto: 27,
        tipo: 'gol',
        teamSlug: 'platzi-fc',
        descripcion: 'Vega firma el segundo tras jugada ensayada',
      },
      { minuto: 43, tipo: 'amarilla', teamSlug: 'union-kernel', descripcion: 'Protesta' },
      { minuto: 52, tipo: 'gol', teamSlug: 'platzi-fc', descripcion: 'Pizarro desde la frontal' },
      {
        minuto: 58,
        tipo: 'roja',
        teamSlug: 'union-kernel',
        descripcion: 'Doble amarilla a Kohl por entrada fuerte',
      },
      {
        minuto: 65,
        tipo: 'sustitucion',
        teamSlug: 'platzi-fc',
        descripcion: 'Entra Vieira por Iniesta',
      },
      {
        minuto: 74,
        tipo: 'gol',
        teamSlug: 'platzi-fc',
        descripcion: 'Vieira remata desde dentro del área',
      },
      {
        minuto: 78,
        tipo: 'sustitucion',
        teamSlug: 'platzi-fc',
        descripcion: 'Entra Silva por Vega',
      },
      { minuto: 82, tipo: 'amarilla', teamSlug: 'union-kernel' },
      {
        minuto: 85,
        tipo: 'sustitucion',
        teamSlug: 'platzi-fc',
        descripcion: 'Entra Campos por Durán',
      },
      { minuto: 89, tipo: 'amarilla', teamSlug: 'union-kernel' },
    ],
  },
  // En vivo: 1-0 ante Real Código (jornada 26)
  {
    slug: 'platzi-fc-vs-real-codigo-2026-04-16',
    stats: {
      posesion: { local: 58, visita: 42 },
      remates: { local: 8, visita: 5 },
      rematesAPuerta: { local: 4, visita: 2 },
      corners: { local: 3, visita: 2 },
      faltas: { local: 4, visita: 6 },
      fuerasDeJuego: { local: 1, visita: 2 },
      pases: { local: 280, visita: 215 },
      precisionPases: { local: 89, visita: 82 },
      amarillas: { local: 0, visita: 1 },
      rojas: { local: 0, visita: 0 },
    },
    alineacionLocal: PLATZI_XI_BASE,
    alineacionVisita: buildRivalXI('real-codigo'),
    eventos: [
      { minuto: 14, tipo: 'amarilla', teamSlug: 'real-codigo' },
      {
        minuto: 37,
        tipo: 'gol',
        teamSlug: 'platzi-fc',
        descripcion: 'Jugada colectiva culminada por Iniesta',
      },
      {
        minuto: 42,
        tipo: 'var',
        teamSlug: 'platzi-fc',
        descripcion: 'Se valida el gol tras revisión',
      },
    ],
  },
];

async function main() {
  // Resolución de IDs por slug
  const matchRows = await db
    .select({ id: matches.id, slug: matches.slug })
    .from(matches)
    .where(
      inArray(
        matches.slug,
        MATCHES_DETAIL.map((m) => m.slug),
      ),
    );
  const matchBySlug = new Map(matchRows.map((m) => [m.slug, m.id]));

  const playerRows = await db.select({ id: players.id, slug: players.slug }).from(players);
  const playerBySlug = new Map(playerRows.map((p) => [p.slug, p.id]));

  const teamRows = await db.select({ id: teams.id, slug: teams.slug }).from(teams);
  const teamBySlug = new Map(teamRows.map((t) => [t.slug, t.id]));

  for (const seed of MATCHES_DETAIL) {
    const matchId = matchBySlug.get(seed.slug);
    if (!matchId) {
      // eslint-disable-next-line no-console
      console.warn(`⚠ Match ${seed.slug} no encontrado, saltando.`);
      continue;
    }

    const local = toAlineacion(seed.alineacionLocal, playerBySlug);
    const visita = toAlineacion(seed.alineacionVisita, playerBySlug);

    // eslint-disable-next-line no-console
    console.log(`→ Actualizando match ${seed.slug}`);
    await db
      .update(matches)
      .set({
        stats: seed.stats as unknown as Record<string, unknown>,
        alineacionLocal: local,
        alineacionVisita: visita,
        updatedAt: new Date(),
      })
      .where(eq(matches.id, matchId));

    // Regenerar eventos
    await db.execute(sql`DELETE FROM match_events WHERE match_id = ${matchId}::uuid`);
    const eventValues: NewMatchEvent[] = seed.eventos.map((e) => ({
      matchId,
      teamId: teamBySlug.get(e.teamSlug) ?? null,
      minuto: e.minuto,
      minutoExtra: e.minutoExtra ?? null,
      tipo: e.tipo,
      descripcion: e.descripcion ?? null,
    }));
    if (eventValues.length) {
      await db.insert(matchEvents).values(eventValues);
    }
  }

  // --- Videos y galerías ligados a matches ---
  const mediaSeeds = buildMatchMediaSeeds(matchBySlug);
  if (mediaSeeds.videos.length) {
    // eslint-disable-next-line no-console
    console.log(`→ Upsert de ${mediaSeeds.videos.length} videos de partido`);
    for (const v of mediaSeeds.videos) {
      await db
        .insert(videos)
        .values(v)
        .onConflictDoUpdate({
          target: videos.slug,
          set: { matchId: v.matchId, updatedAt: new Date() },
        });
    }
  }
  if (mediaSeeds.galleries.length) {
    // eslint-disable-next-line no-console
    console.log(`→ Upsert de ${mediaSeeds.galleries.length} galerías de partido`);
    for (const g of mediaSeeds.galleries) {
      await db
        .insert(galleries)
        .values(g)
        .onConflictDoUpdate({
          target: galleries.slug,
          set: { matchId: g.matchId, updatedAt: new Date() },
        });
    }
  }

  // eslint-disable-next-line no-console
  console.log(`✓ Seed match-detail completado. matches actualizados=${MATCHES_DETAIL.length}`);
}

function buildMatchMediaSeeds(matchBySlug: Map<string, string>): {
  videos: NewVideo[];
  galleries: NewGallery[];
} {
  const flagship = matchBySlug.get('platzi-fc-vs-real-codigo-2026-03-08');
  const copa = matchBySlug.get('platzi-fc-vs-union-kernel-2026-04-02');

  const videoList: NewVideo[] = [];
  const galleryList: NewGallery[] = [];

  if (flagship) {
    videoList.push({
      slug: 'resumen-platzi-vs-real-codigo-j22',
      titulo: 'Resumen: Platzi FC 2-1 Real Código (J22)',
      descripcion: 'Los goles y mejores jugadas de la victoria ante Real Código en la jornada 22.',
      coverUrl: '/placeholders/video-01.jpg',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      plataforma: 'youtube',
      duracionSeg: 210,
      categoria: 'resumen',
      matchId: flagship,
      publishedAt: new Date('2026-03-08T22:00:00Z'),
    });
    galleryList.push({
      slug: 'galeria-platzi-vs-real-codigo-j22',
      titulo: 'Galería: Platzi FC 2-1 Real Código',
      descripcion: 'Las mejores imágenes del derbi en el estadio.',
      coverUrl: '/placeholders/gallery-01-cover.jpg',
      images: [
        {
          url: '/placeholders/gallery-01-01.jpg',
          alt: 'Salto al campo del once titular',
          credito: 'Platzi FC Media',
        },
        {
          url: '/placeholders/gallery-01-02.jpg',
          alt: 'Celebración del gol de Iniesta',
          credito: 'Platzi FC Media',
        },
        {
          url: '/placeholders/gallery-01-03.jpg',
          alt: 'Afición cantando en el gol de la remontada',
          credito: 'Platzi FC Media',
        },
      ],
      matchId: flagship,
      publishedAt: new Date('2026-03-08T23:00:00Z'),
    });
  }

  if (copa) {
    videoList.push({
      slug: 'resumen-platzi-vs-union-kernel-copa',
      titulo: 'Resumen Copa: Platzi FC 4-0 Unión Kernel',
      descripcion: 'Goleada en la primera eliminatoria de Copa del Club.',
      coverUrl: '/placeholders/video-02.jpg',
      embedUrl: 'https://www.youtube.com/embed/9bZkp7q19f0',
      plataforma: 'youtube',
      duracionSeg: 245,
      categoria: 'resumen',
      matchId: copa,
      publishedAt: new Date('2026-04-02T23:00:00Z'),
    });
  }

  return { videos: videoList, galleries: galleryList };
}

function toAlineacion(
  entries: AlineacionSeed[],
  playerBySlug: Map<string, string>,
): AlineacionEntry[] {
  return entries.map((e) => {
    const playerId = e.playerSlug ? playerBySlug.get(e.playerSlug) : undefined;
    return {
      playerId: playerId ?? `synthetic:${e.nombre}:${e.dorsal}`,
      dorsal: e.dorsal,
      nombre: e.nombre,
      posicion: e.posicion,
      titular: e.titular,
      ...(e.minutoEntrada !== undefined ? { minutoEntrada: e.minutoEntrada } : {}),
      ...(e.minutoSalida !== undefined ? { minutoSalida: e.minutoSalida } : {}),
    };
  });
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error('✗ Seed match-detail falló:', err);
    process.exit(1);
  });
