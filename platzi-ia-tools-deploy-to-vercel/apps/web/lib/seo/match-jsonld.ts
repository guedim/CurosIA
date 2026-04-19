import type { MatchWithRelations } from '@/lib/db/matches';

/**
 * Genera JSON-LD `SportsEvent` para un partido. Se emite en el `<head>` del
 * detalle del partido para mejorar rich results en buscadores.
 *
 * Spec: https://schema.org/SportsEvent
 */
export function buildSportsEventJsonLd(match: MatchWithRelations): Record<string, unknown> {
  const eventStatus =
    match.estado === 'cancelado'
      ? 'https://schema.org/EventCancelled'
      : match.estado === 'suspendido'
        ? 'https://schema.org/EventPostponed'
        : 'https://schema.org/EventScheduled';

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'SportsEvent',
    name: `${match.homeTeam.nombre} vs ${match.awayTeam.nombre}`,
    description: `${match.competition.nombre}${match.jornada ? ` — Jornada ${match.jornada}` : ''}`,
    startDate: match.fechaHora.toISOString(),
    sport: 'Soccer',
    eventStatus,
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    homeTeam: {
      '@type': 'SportsTeam',
      name: match.homeTeam.nombre,
    },
    awayTeam: {
      '@type': 'SportsTeam',
      name: match.awayTeam.nombre,
    },
    organizer: {
      '@type': 'SportsOrganization',
      name: match.competition.nombre,
    },
  };

  if (match.asistencia) {
    jsonLd.attendance = match.asistencia;
  }

  if (
    (match.estado === 'finalizado' || match.estado === 'en_vivo') &&
    match.marcadorLocal !== null &&
    match.marcadorVisita !== null
  ) {
    jsonLd.homeTeam = {
      ...(jsonLd.homeTeam as Record<string, unknown>),
      score: match.marcadorLocal,
    };
    jsonLd.awayTeam = {
      ...(jsonLd.awayTeam as Record<string, unknown>),
      score: match.marcadorVisita,
    };
  }

  return jsonLd;
}
