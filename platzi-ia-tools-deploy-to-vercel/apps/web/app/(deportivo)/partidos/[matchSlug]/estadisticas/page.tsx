import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MatchStatsComparative } from '@/components/matches/match-stats-comparative';
import { MatchTabsNav } from '@/components/matches/match-tabs-nav';
import { Scoreboard } from '@/components/matches/scoreboard';
import { getMatchBySlug } from '@/lib/db/matches';

type Params = { matchSlug: string };

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { matchSlug } = await params;
  const match = await getMatchBySlug(matchSlug);
  if (!match) return { title: 'Partido no encontrado' };
  const title = `Estadísticas · ${match.homeTeam.nombre} vs ${match.awayTeam.nombre}`;
  return {
    title,
    description: `Estadísticas comparativas del encuentro entre ${match.homeTeam.nombre} y ${match.awayTeam.nombre}.`,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { matchSlug } = await params;
  const match = await getMatchBySlug(matchSlug);
  if (!match) notFound();

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
          <li className="text-brand-800">Estadísticas</li>
        </ol>
      </nav>

      <Scoreboard match={match} variant="compact" />

      <MatchTabsNav matchSlug={match.slug} active="estadisticas" />

      <section aria-labelledby="stats-heading" className="space-y-4">
        <h1 id="stats-heading" className="text-brand-950 text-2xl font-bold">
          Estadísticas comparativas
        </h1>
        <MatchStatsComparative
          stats={match.stats}
          homeTeam={match.homeTeam.nombre}
          awayTeam={match.awayTeam.nombre}
        />
      </section>
    </div>
  );
}
