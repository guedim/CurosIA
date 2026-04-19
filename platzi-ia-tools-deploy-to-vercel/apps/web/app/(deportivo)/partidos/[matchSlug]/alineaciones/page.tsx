import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MatchLineupPitch } from '@/components/matches/match-lineup-pitch';
import { MatchTabsNav } from '@/components/matches/match-tabs-nav';
import { Scoreboard } from '@/components/matches/scoreboard';
import { getMatchBySlug } from '@/lib/db/matches';

type Params = { matchSlug: string };

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { matchSlug } = await params;
  const match = await getMatchBySlug(matchSlug);
  if (!match) return { title: 'Partido no encontrado' };
  const title = `Alineaciones · ${match.homeTeam.nombre} vs ${match.awayTeam.nombre}`;
  return {
    title,
    description: `Alineaciones del encuentro entre ${match.homeTeam.nombre} y ${match.awayTeam.nombre}.`,
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
          <li className="text-brand-800">Alineaciones</li>
        </ol>
      </nav>

      <Scoreboard match={match} variant="compact" />

      <MatchTabsNav matchSlug={match.slug} active="alineaciones" />

      <section aria-labelledby="lineups-heading" className="space-y-6">
        <h1 id="lineups-heading" className="text-brand-950 text-2xl font-bold">
          Alineaciones
        </h1>
        <div className="grid gap-6 md:grid-cols-2">
          <MatchLineupPitch
            alineacion={match.alineacionLocal}
            team={match.homeTeam.nombre}
            side="local"
          />
          <MatchLineupPitch
            alineacion={match.alineacionVisita}
            team={match.awayTeam.nombre}
            side="visita"
          />
        </div>
      </section>
    </div>
  );
}
