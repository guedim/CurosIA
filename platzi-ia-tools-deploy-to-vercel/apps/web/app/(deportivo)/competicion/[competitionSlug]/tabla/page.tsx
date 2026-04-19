import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { StandingsTable } from '@/components/competition/standings-table';
import { getCompetitionBySlug, getStandingsByCompetition } from '@/lib/db/standings';

type Params = { competitionSlug: string };

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { competitionSlug } = await params;
  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) return { title: 'Competición no encontrada' };
  return {
    title: `Tabla · ${competition.nombre}`,
    description: `Clasificación completa de ${competition.nombre}.`,
  };
}

export default async function StandingsPage({ params }: { params: Promise<Params> }) {
  const { competitionSlug } = await params;
  const data = await getStandingsByCompetition(competitionSlug);
  if (!data) notFound();

  const { competition, season, rows } = data;

  return (
    <div className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-brand-600 text-sm">
        <ol className="flex gap-1">
          <li>
            <Link href="/competicion" className="hover:underline">
              Competiciones
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/competicion/${competition.slug}`} className="hover:underline">
              {competition.nombre}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-800">Tabla</li>
        </ol>
      </nav>

      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">Tabla de posiciones</h1>
        <p className="text-brand-700 mt-2">
          {competition.nombre} · Temporada {season.nombre}
        </p>
      </header>

      <StandingsTable
        rows={rows}
        highlightTeamSlug="platzi-fc"
        caption={`Clasificación de ${competition.nombre}, temporada ${season.nombre}`}
      />

      <section
        aria-label="Leyenda"
        className="rounded-card border-brand-100 bg-brand-50 text-brand-700 border p-4 text-xs"
      >
        <p className="text-brand-900 font-medium">Leyenda</p>
        <p className="mt-1">
          PJ = Partidos jugados · PG = Ganados · PE = Empatados · PP = Perdidos · GF = Goles a favor
          · GC = Goles en contra · DG = Diferencia de goles · Pts = Puntos. Forma: últimos 5
          partidos (<span className="font-semibold text-green-700">G</span>anado,{' '}
          <span className="font-semibold text-amber-700">E</span>mpatado,{' '}
          <span className="font-semibold text-red-700">P</span>erdido).
        </p>
      </section>
    </div>
  );
}
