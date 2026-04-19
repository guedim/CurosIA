import { describe, expect, it } from 'vitest';
import type { Competition, Match, Season, Team } from '@/types';
import type { MatchWithRelations } from '@/lib/db/matches';
import { buildSportsEventJsonLd } from '@/lib/seo/match-jsonld';

const now = new Date('2025-04-01T19:00:00Z');

const homeTeam: Team = {
  id: 't-home',
  nombre: 'Platzi FC',
  slug: 'platzi-fc',
  tipo: 'club_principal',
  escudoUrl: null,
  pais: 'ES',
  ciudad: 'Madrid',
  createdAt: now,
  updatedAt: now,
};

const awayTeam: Team = {
  id: 't-away',
  nombre: 'Rival FC',
  slug: 'rival-fc',
  tipo: 'rival',
  escudoUrl: null,
  pais: 'ES',
  ciudad: 'Barcelona',
  createdAt: now,
  updatedAt: now,
};

const competition: Competition = {
  id: 'c-1',
  nombre: 'La Liga',
  slug: 'la-liga',
  tipo: 'liga',
  pais: 'ES',
  region: null,
  logoUrl: null,
  createdAt: now,
  updatedAt: now,
};

const season: Season = {
  id: 's-1',
  nombre: '2024/25',
  slug: '2024-25',
  fechaInicio: '2024-08-01',
  fechaFin: '2025-05-31',
  estado: 'activa',
  createdAt: now,
  updatedAt: now,
};

function makeMatch(overrides: Partial<Match> = {}): MatchWithRelations {
  const base: Match = {
    id: 'm-1',
    slug: 'platzi-fc-vs-rival-fc',
    seasonId: season.id,
    competitionId: competition.id,
    homeTeamId: homeTeam.id,
    awayTeamId: awayTeam.id,
    estadioSanityRef: null,
    jornada: 10,
    fechaHora: now,
    estado: 'programado',
    marcadorLocal: null,
    marcadorVisita: null,
    asistencia: null,
    arbitro: null,
    broadcastingRefs: [],
    alineacionLocal: [],
    alineacionVisita: [],
    stats: {},
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
  return { ...base, homeTeam, awayTeam, competition, season };
}

describe('buildSportsEventJsonLd', () => {
  it('mapea un partido programado a SportsEvent con estado Scheduled', () => {
    const jsonLd = buildSportsEventJsonLd(makeMatch());
    expect(jsonLd['@type']).toBe('SportsEvent');
    expect(jsonLd.name).toBe('Platzi FC vs Rival FC');
    expect(jsonLd.description).toBe('La Liga — Jornada 10');
    expect(jsonLd.eventStatus).toBe('https://schema.org/EventScheduled');
    expect(jsonLd.sport).toBe('Soccer');
    expect(jsonLd.startDate).toBe('2025-04-01T19:00:00.000Z');
  });

  it('omite jornada de la descripción si es null', () => {
    const jsonLd = buildSportsEventJsonLd(makeMatch({ jornada: null }));
    expect(jsonLd.description).toBe('La Liga');
  });

  it('marca EventCancelled para estado cancelado', () => {
    const jsonLd = buildSportsEventJsonLd(makeMatch({ estado: 'cancelado' }));
    expect(jsonLd.eventStatus).toBe('https://schema.org/EventCancelled');
  });

  it('marca EventPostponed para estado suspendido', () => {
    const jsonLd = buildSportsEventJsonLd(makeMatch({ estado: 'suspendido' }));
    expect(jsonLd.eventStatus).toBe('https://schema.org/EventPostponed');
  });

  it('incluye scores cuando el partido está finalizado', () => {
    const jsonLd = buildSportsEventJsonLd(
      makeMatch({ estado: 'finalizado', marcadorLocal: 2, marcadorVisita: 1 }),
    );
    expect((jsonLd.homeTeam as Record<string, unknown>).score).toBe(2);
    expect((jsonLd.awayTeam as Record<string, unknown>).score).toBe(1);
  });

  it('incluye scores cuando el partido está en vivo', () => {
    const jsonLd = buildSportsEventJsonLd(
      makeMatch({ estado: 'en_vivo', marcadorLocal: 0, marcadorVisita: 0 }),
    );
    expect((jsonLd.homeTeam as Record<string, unknown>).score).toBe(0);
    expect((jsonLd.awayTeam as Record<string, unknown>).score).toBe(0);
  });

  it('omite scores para partidos programados', () => {
    const jsonLd = buildSportsEventJsonLd(makeMatch());
    expect((jsonLd.homeTeam as Record<string, unknown>).score).toBeUndefined();
    expect((jsonLd.awayTeam as Record<string, unknown>).score).toBeUndefined();
  });

  it('incluye asistencia si está definida', () => {
    const jsonLd = buildSportsEventJsonLd(makeMatch({ asistencia: 45000 }));
    expect(jsonLd.attendance).toBe(45000);
  });
});
