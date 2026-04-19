import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MatchList } from '@/components/matches/match-list';
import { getCompetitionBySlug } from '@/lib/db/standings';
import { listMatches, type MatchWithRelations } from '@/lib/db/matches';
import type { MatchEstado } from '@/types';

type Params = { competitionSlug: string };

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { competitionSlug } = await params;
  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) return { title: 'Competición no encontrada' };
  return {
    title: `Calendario · ${competition.nombre}`,
    description: `Calendario completo de ${competition.nombre}: próximos partidos, en vivo y resultados.`,
  };
}

export default async function CalendarPage({ params }: { params: Promise<Params> }) {
  const { competitionSlug } = await params;
  const competition = await getCompetitionBySlug(competitionSlug);
  if (!competition) notFound();

  const [upcoming, live, finished] = await Promise.all([
    listMatches({ competitionSlug, estado: 'programado', order: 'asc' }),
    listMatches({ competitionSlug, estado: 'en_vivo', order: 'asc' }),
    listMatches({ competitionSlug, estado: 'finalizado', order: 'desc' }),
  ]);

  const byJornada = groupByJornada(upcoming);

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
          <li>
            <Link href={`/competicion/${competition.slug}`} className="hover:underline">
              {competition.nombre}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-800">Calendario</li>
        </ol>
      </nav>

      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">Calendario</h1>
        <p className="text-brand-700 mt-2">{competition.nombre}</p>
      </header>

      {live.length ? (
        <Section
          title="En vivo"
          estado="en_vivo"
          matches={live}
          emptyMessage="Sin partidos en vivo ahora mismo."
        />
      ) : null}

      <section aria-label="Próximos partidos" className="space-y-4">
        <h2 className="text-brand-950 text-xl font-semibold">Próximos partidos</h2>
        {byJornada.length ? (
          byJornada.map(([jornadaKey, group]) => (
            <div key={jornadaKey} className="space-y-2">
              <h3 className="text-brand-600 text-sm font-medium uppercase tracking-wide">
                {jornadaKey}
              </h3>
              <MatchList matches={group} highlightTeamSlug="platzi-fc" />
            </div>
          ))
        ) : (
          <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-center text-sm">
            No hay próximos partidos programados.
          </p>
        )}
      </section>

      <Section
        title="Resultados"
        estado="finalizado"
        matches={finished}
        emptyMessage="Sin resultados registrados todavía."
      />
    </div>
  );
}

function Section({
  title,
  matches,
  emptyMessage,
}: {
  title: string;
  estado: MatchEstado;
  matches: MatchWithRelations[];
  emptyMessage: string;
}) {
  return (
    <section aria-label={title} className="space-y-3">
      <h2 className="text-brand-950 text-xl font-semibold">{title}</h2>
      <MatchList matches={matches} emptyMessage={emptyMessage} highlightTeamSlug="platzi-fc" />
    </section>
  );
}

function groupByJornada(list: MatchWithRelations[]): Array<[string, MatchWithRelations[]]> {
  const map = new Map<string, MatchWithRelations[]>();
  for (const m of list) {
    const key = m.jornada ? `Jornada ${m.jornada}` : 'Sin jornada';
    const arr = map.get(key) ?? [];
    arr.push(m);
    map.set(key, arr);
  }
  return Array.from(map.entries());
}
