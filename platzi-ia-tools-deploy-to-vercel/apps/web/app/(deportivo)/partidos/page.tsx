import type { Metadata } from 'next';
import {
  listCompetitions,
  listMatches,
  listSeasons,
  type MatchListFilters,
} from '@/lib/db/matches';
import { FilterBar, type MatchFilterValues } from '@/components/matches/filter-bar';
import { MatchList } from '@/components/matches/match-list';

export const metadata: Metadata = {
  title: 'Partidos',
  description: 'Calendario y resultados del equipo.',
};

export const revalidate = 300;

type Params = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const ESTADO_VALID = new Set(['programado', 'en_vivo', 'finalizado']);
const LADO_VALID = new Set(['local', 'visita']);

function pickFirst(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function PartidosPage({ searchParams }: Params) {
  const sp = await searchParams;
  const seasonSlug = pickFirst(sp.season);
  const competitionSlug = pickFirst(sp.competition);
  const ladoRaw = pickFirst(sp.lado);
  const estadoRaw = pickFirst(sp.estado);

  const lado = ladoRaw && LADO_VALID.has(ladoRaw) ? (ladoRaw as 'local' | 'visita') : undefined;
  const estado =
    estadoRaw && ESTADO_VALID.has(estadoRaw)
      ? (estadoRaw as 'programado' | 'en_vivo' | 'finalizado')
      : undefined;

  const filters: MatchListFilters = {
    seasonSlug,
    competitionSlug,
    lado: lado ?? 'todos',
    estado,
    order: estado === 'programado' ? 'asc' : 'desc',
    limit: 50,
  };

  const [matches, seasons, competitions] = await Promise.all([
    listMatches(filters),
    listSeasons(),
    listCompetitions(),
  ]);

  const current: MatchFilterValues = {
    season: seasonSlug,
    competition: competitionSlug,
    lado,
    estado,
  };

  return (
    <div className="space-y-6">
      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">Partidos</h1>
        <p className="text-brand-700 mt-2">Calendario y resultados del equipo.</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <aside aria-label="Filtros de partidos">
          <FilterBar
            seasons={seasons}
            competitions={competitions}
            current={current}
            basePath="/partidos"
          />
        </aside>

        <section aria-label="Listado de partidos">
          <p className="text-brand-600 mb-3 text-sm">
            {matches.length} {matches.length === 1 ? 'partido' : 'partidos'}
          </p>
          <MatchList matches={matches} highlightTeamSlug="platzi-fc" />
        </section>
      </div>
    </div>
  );
}
