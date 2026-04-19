import type { PlayerWithTeam } from '@/lib/db/players';

/**
 * JSON-LD `Person` (con `affiliation`/`memberOf` al equipo) para el perfil del
 * jugador. Usamos `Person` en vez de `Athlete` porque el segundo no está en
 * schema.org estándar; los buscadores reconocen `Person` como base.
 */
export function buildPlayerJsonLd(player: PlayerWithTeam): Record<string, unknown> {
  const name = `${player.nombre} ${player.apellido}`;
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name,
    givenName: player.nombre,
    familyName: player.apellido,
    jobTitle: 'Futbolista profesional',
  };

  if (player.fechaNacimiento) {
    jsonLd.birthDate = player.fechaNacimiento;
  }
  if (player.nacionalidad) {
    jsonLd.nationality = player.nacionalidad;
  }
  if (player.alturaCm) {
    jsonLd.height = { '@type': 'QuantitativeValue', value: player.alturaCm, unitCode: 'CMT' };
  }
  if (player.pesoKg) {
    jsonLd.weight = { '@type': 'QuantitativeValue', value: player.pesoKg, unitCode: 'KGM' };
  }

  if (player.team) {
    jsonLd.memberOf = {
      '@type': 'SportsTeam',
      name: player.team.nombre,
    };
  }

  const redes = player.redesSociales ?? {};
  const sameAs: string[] = [];
  if (redes.instagram) sameAs.push(redes.instagram);
  if (redes.x) sameAs.push(redes.x);
  if (redes.tiktok) sameAs.push(redes.tiktok);
  if (redes.web) sameAs.push(redes.web);
  if (sameAs.length) jsonLd.sameAs = sameAs;

  return jsonLd;
}
