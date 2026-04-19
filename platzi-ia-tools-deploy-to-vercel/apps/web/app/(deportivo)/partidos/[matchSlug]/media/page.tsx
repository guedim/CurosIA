import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MatchMediaSection } from '@/components/matches/match-media-section';
import { MatchTabsNav } from '@/components/matches/match-tabs-nav';
import { Scoreboard } from '@/components/matches/scoreboard';
import { getMatchBySlug } from '@/lib/db/matches';
import { getMediaForMatch } from '@/lib/db/media';

type Params = { matchSlug: string };

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { matchSlug } = await params;
  const match = await getMatchBySlug(matchSlug);
  if (!match) return { title: 'Partido no encontrado' };
  const title = `Media · ${match.homeTeam.nombre} vs ${match.awayTeam.nombre}`;
  return {
    title,
    description: `Vídeos y galerías del encuentro entre ${match.homeTeam.nombre} y ${match.awayTeam.nombre}.`,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { matchSlug } = await params;
  const match = await getMatchBySlug(matchSlug);
  if (!match) notFound();

  const media = await getMediaForMatch(match.id);

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-brand-600 text-sm">
        <ol className="flex gap-1">
          <li>
            <Link href="/partidos" className="hover:underline">
              Partidos
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/partidos/${match.slug}`} className="hover:underline">
              {match.homeTeam.nombre} vs {match.awayTeam.nombre}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-800">Media</li>
        </ol>
      </nav>

      <Scoreboard match={match} variant="compact" />

      <MatchTabsNav matchSlug={match.slug} active="media" />

      <section aria-labelledby="media-heading" className="space-y-6">
        <h1 id="media-heading" className="text-brand-950 text-2xl font-bold">
          Vídeos y galerías del partido
        </h1>
        <MatchMediaSection videos={media.videos} galleries={media.galleries} />
      </section>
    </div>
  );
}
