import { describe, expect, it } from 'vitest';
import type { Player, Team } from '@/types';
import type { PlayerWithTeam } from '@/lib/db/players';
import { buildPlayerJsonLd } from '@/lib/seo/player-jsonld';

const now = new Date('2025-01-01T00:00:00Z');

const team: Team = {
  id: 't-1',
  nombre: 'Platzi FC',
  slug: 'platzi-fc',
  tipo: 'club_principal',
  escudoUrl: null,
  pais: 'ES',
  ciudad: 'Madrid',
  createdAt: now,
  updatedAt: now,
};

function makePlayer(overrides: Partial<Player> = {}, withTeam = true): PlayerWithTeam {
  const base: Player = {
    id: 'p-1',
    slug: 'juan-perez',
    nombre: 'Juan',
    apellido: 'Pérez',
    dorsal: 10,
    posicion: 'mediocampista',
    fechaNacimiento: null,
    nacionalidad: null,
    alturaCm: null,
    pesoKg: null,
    pieHabil: null,
    fotoUrl: null,
    biografiaSanityRef: null,
    estado: 'activo',
    teamId: team.id,
    historialClubes: [],
    redesSociales: {},
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
  return { ...base, team: withTeam ? team : null };
}

describe('buildPlayerJsonLd', () => {
  it('genera un Person válido con nombre completo', () => {
    const jsonLd = buildPlayerJsonLd(makePlayer());
    expect(jsonLd['@type']).toBe('Person');
    expect(jsonLd.name).toBe('Juan Pérez');
    expect(jsonLd.givenName).toBe('Juan');
    expect(jsonLd.familyName).toBe('Pérez');
    expect(jsonLd.jobTitle).toBe('Futbolista profesional');
  });

  it('incluye birthDate si hay fechaNacimiento', () => {
    const jsonLd = buildPlayerJsonLd(makePlayer({ fechaNacimiento: '1995-06-15' }));
    expect(jsonLd.birthDate).toBe('1995-06-15');
  });

  it('omite birthDate si fechaNacimiento es null', () => {
    const jsonLd = buildPlayerJsonLd(makePlayer());
    expect(jsonLd.birthDate).toBeUndefined();
  });

  it('incluye altura con QuantitativeValue en cm', () => {
    const jsonLd = buildPlayerJsonLd(makePlayer({ alturaCm: 185 }));
    expect(jsonLd.height).toEqual({
      '@type': 'QuantitativeValue',
      value: 185,
      unitCode: 'CMT',
    });
  });

  it('incluye peso con QuantitativeValue en kg', () => {
    const jsonLd = buildPlayerJsonLd(makePlayer({ pesoKg: 78 }));
    expect(jsonLd.weight).toEqual({
      '@type': 'QuantitativeValue',
      value: 78,
      unitCode: 'KGM',
    });
  });

  it('incluye memberOf con el equipo cuando está presente', () => {
    const jsonLd = buildPlayerJsonLd(makePlayer());
    expect(jsonLd.memberOf).toEqual({
      '@type': 'SportsTeam',
      name: 'Platzi FC',
    });
  });

  it('omite memberOf cuando team es null', () => {
    const jsonLd = buildPlayerJsonLd(makePlayer({}, false));
    expect(jsonLd.memberOf).toBeUndefined();
  });

  it('agrupa redes sociales en sameAs', () => {
    const jsonLd = buildPlayerJsonLd(
      makePlayer({
        redesSociales: {
          instagram: 'https://ig.com/juan',
          x: 'https://x.com/juan',
          web: 'https://juan.es',
        },
      }),
    );
    expect(jsonLd.sameAs).toEqual(['https://ig.com/juan', 'https://x.com/juan', 'https://juan.es']);
  });

  it('omite sameAs si no hay redes sociales', () => {
    const jsonLd = buildPlayerJsonLd(makePlayer());
    expect(jsonLd.sameAs).toBeUndefined();
  });

  it('incluye nationality cuando está definida', () => {
    const jsonLd = buildPlayerJsonLd(makePlayer({ nacionalidad: 'ES' }));
    expect(jsonLd.nationality).toBe('ES');
  });
});
