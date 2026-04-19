import type { Metadata } from 'next';
import { countPlayersByPosition, listPlayers } from '@/lib/db/players';
import { SquadGrid } from '@/components/team/squad-grid';
import { PositionFilter } from '@/components/team/position-filter';
import type { PlayerPosicion } from '@/types';

export const metadata: Metadata = {
  title: 'Plantilla',
  description: 'Plantilla del primer equipo de Platzi FC. Filtra por posición.',
};

export const revalidate = 3600;

const VALID_POSICIONES = new Set<PlayerPosicion>([
  'portero',
  'defensa',
  'mediocampista',
  'delantero',
]);

type Params = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function pickFirst(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

export default async function EquipoPage({ searchParams }: Params) {
  const sp = await searchParams;
  const raw = pickFirst(sp.posicion);
  const posicion =
    raw && VALID_POSICIONES.has(raw as PlayerPosicion) ? (raw as PlayerPosicion) : undefined;

  const [players, counts] = await Promise.all([
    listPlayers({ posicion }),
    countPlayersByPosition(),
  ]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">Plantilla</h1>
        <p className="text-brand-700 mt-2">
          {total} jugadores en el primer equipo de Platzi FC en la temporada actual.
        </p>
      </header>

      <div className="space-y-4">
        <PositionFilter basePath="/equipo" current={posicion} counts={counts} total={total} />
        <SquadGrid players={players} />
      </div>
    </div>
  );
}
