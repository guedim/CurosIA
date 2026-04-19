import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { StandingsTable } from '@/components/competition/standings-table';
import { MatchList } from '@/components/matches/match-list';
import { getCompetitionBySlug, getStandingsByCompetition } from '@/lib/db/standings';
import { listMatches } from '@/lib/db/matches';
import type { CompetitionTipo } from '@/types';

type Params = { competitionSlug: string };

export const revalidate = 600;

const TIPO_META: Record<
  CompetitionTipo,
  { label: string; variant: 'success' | 'warning' | 'info' | 'default' }
> = {
  liga: { label: 'Liga', variant: 'success' },
  copa: { label: 'Copa', variant: 'warning' },
  internacional: { label: 'Internacional', variant: 'info' },
  amistoso: { label: 'Amistoso', variant: 'default' },
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { competitionSlug } = await params;
  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) return { title: 'Competición no encontrada' };
  return {
    title: competition.nombre,
    description: `Clasificación y calendario de ${competition.nombre} para Platzi FC.`,
  };
}

export default async function CompetitionPage({ params }: { params: Promise<Params> }) {
  const { competitionSlug } = await params;
  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) notFound();

  const [standingsData, upcoming, recent] = await Promise.all([
    getStandingsByCompetition(competitionSlug),
    listMatches({ competitionSlug, estado: 'programado', order: 'asc', limit: 4 }),
    listMatches({ competitionSlug, estado: 'finalizado', order: 'desc', limit: 4 }),
  ]);

  const tipo = TIPO_META[competition.tipo];
  const hasStandings = !!standingsData && standingsData.rows.length > 0;
  const topRows = hasStandings ? standingsData!.rows.slice(0, 5) : [];

  return (
    <div className="space-y-8">
      <nav aria-label="Breadcrumb" className="text-brand-600 text-sm">
        <ol className="flex gap-1">
          <li>
            <Link href="/competicion" className="hover:underline">
              Competiciones
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-800 truncate">{competition.nombre}</li>
        </ol>
      </nav>

      <header className="rounded-card bg-brand-900 px-6 py-8 text-white sm:px-10 sm:py-10">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={tipo.variant}>{tipo.label}</Badge>
          {competition.region ? (
            <span className="text-brand-100 text-sm">{competition.region}</span>
          ) : null}
          {competition.pais ? (
            <span className="text-brand-100 text-sm">· {competition.pais}</span>
          ) : null}
        </div>
        <h1 className="mt-2 text-3xl font-bold leading-tight sm:text-4xl">{competition.nombre}</h1>
        {standingsData?.season ? (
          <p className="text-brand-100 mt-2 text-sm">Temporada {standingsData.season.nombre}</p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href={`/competicion/${competition.slug}/tabla`}
            className="text-brand-900 hover:bg-brand-50 rounded-full bg-white px-4 py-1.5 text-sm font-semibold transition"
          >
            Ver tabla completa
          </Link>
          <Link
            href={`/competicion/${competition.slug}/calendario`}
            className="rounded-full border border-white/40 px-4 py-1.5 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Calendario
          </Link>
        </div>
      </header>

      {hasStandings ? (
        <section aria-label="Top 5 de la clasificación" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-brand-950 text-xl font-semibold">Top 5</h2>
            <Link
              href={`/competicion/${competition.slug}/tabla`}
              className="text-brand-700 text-sm font-medium hover:underline"
            >
              Ver tabla completa →
            </Link>
          </div>
          <StandingsTable
            rows={topRows}
            highlightTeamSlug="platzi-fc"
            caption={`Top 5 de ${competition.nombre}`}
          />
        </section>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-label="Próximos partidos" className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-brand-950 text-xl font-semibold">Próximos partidos</h2>
            <Link
              href={`/competicion/${competition.slug}/calendario`}
              className="text-brand-700 text-sm font-medium hover:underline"
            >
              Calendario completo →
            </Link>
          </div>
          <MatchList
            matches={upcoming}
            emptyMessage="No hay próximos partidos programados."
            highlightTeamSlug="platzi-fc"
          />
        </section>

        <section aria-label="Últimos resultados" className="space-y-3">
          <h2 className="text-brand-950 text-xl font-semibold">Últimos resultados</h2>
          <MatchList
            matches={recent}
            emptyMessage="Sin resultados registrados todavía."
            highlightTeamSlug="platzi-fc"
          />
        </section>
      </div>
    </div>
  );
}
