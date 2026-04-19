import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getMatchBySlug, getMatchEvents } from '@/lib/db/matches';
import { getMediaForMatch } from '@/lib/db/media';
import { Scoreboard } from '@/components/matches/scoreboard';
import { MatchEventsTimeline } from '@/components/matches/match-events-timeline';
import { MatchMediaSection } from '@/components/matches/match-media-section';
import { MatchTabsNav } from '@/components/matches/match-tabs-nav';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { buildSportsEventJsonLd } from '@/lib/seo/match-jsonld';
import { formatDateTime } from '@/lib/utils/date';

type Params = { matchSlug: string };

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { matchSlug } = await params;
  const match = await getMatchBySlug(matchSlug);
  if (!match) {
    return { title: 'Partido no encontrado' };
  }
  const title = `${match.homeTeam.nombre} vs ${match.awayTeam.nombre}`;
  const description = `${match.competition.nombre}${match.jornada ? ` · Jornada ${match.jornada}` : ''} · ${formatDateTime(match.fechaHora)}`;
  return {
    title,
    description,
    openGraph: { title, description, type: 'article' },
  };
}

export default async function MatchDetailPage({ params }: { params: Promise<Params> }) {
  const { matchSlug } = await params;
  const match = await getMatchBySlug(matchSlug);
  if (!match) notFound();

  const [events, media] = await Promise.all([getMatchEvents(match.id), getMediaForMatch(match.id)]);
  const jsonLd = buildSportsEventJsonLd(match);
  const ultimosEventos = events.slice(-6);
  const hasMedia = media.videos.length > 0 || media.galleries.length > 0;

  return (
    <div className="space-y-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-brand-600 text-sm">
        <ol className="flex gap-1">
          <li>
            <Link href="/partidos" className="hover:underline">
              Partidos
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-800 truncate">
            {match.homeTeam.nombre} vs {match.awayTeam.nombre}
          </li>
        </ol>
      </nav>

      <Scoreboard match={match} variant="hero" />

      <MatchTabsNav matchSlug={match.slug} active="resumen" />

      <div className="grid gap-6 md:grid-cols-[1fr_280px]">
        <section aria-label="Resumen del partido" className="space-y-4">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-brand-950 text-xl font-semibold">Últimos momentos</h2>
            {events.length ? (
              <Link
                href={`/partidos/${match.slug}/minuto-a-minuto`}
                className="text-brand-700 text-sm hover:underline"
              >
                Ver minuto a minuto completo →
              </Link>
            ) : null}
          </div>
          <MatchEventsTimeline
            events={ultimosEventos}
            homeTeam={{ id: match.homeTeamId, nombre: match.homeTeam.nombre }}
            awayTeam={{ id: match.awayTeamId, nombre: match.awayTeam.nombre }}
          />
        </section>

        <aside className="space-y-4" aria-label="Información del partido">
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardBody className="text-brand-800 space-y-2 text-sm">
              <InfoRow label="Competición" value={match.competition.nombre} />
              {match.jornada ? <InfoRow label="Jornada" value={`${match.jornada}`} /> : null}
              <InfoRow label="Temporada" value={match.season.nombre} />
              {match.arbitro ? <InfoRow label="Árbitro" value={match.arbitro} /> : null}
              {match.asistencia ? (
                <InfoRow label="Asistencia" value={match.asistencia.toLocaleString('es-ES')} />
              ) : null}
            </CardBody>
          </Card>
        </aside>
      </div>

      {hasMedia ? (
        <section
          aria-labelledby="media-preview-heading"
          className="border-brand-100 space-y-4 border-t pt-6"
        >
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="media-preview-heading" className="text-brand-950 text-xl font-semibold">
              Vídeos y galerías
            </h2>
            <Link
              href={`/partidos/${match.slug}/media`}
              className="text-brand-700 text-sm hover:underline"
            >
              Ver toda la media →
            </Link>
          </div>
          <MatchMediaSection
            videos={media.videos}
            galleries={media.galleries}
            previewLimit={3}
            matchSlug={match.slug}
          />
        </section>
      ) : null}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-2">
      <dt className="text-brand-600 font-medium">{label}</dt>
      <dd className="text-brand-900">{value}</dd>
    </div>
  );
}
