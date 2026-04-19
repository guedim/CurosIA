import type { PlayerWithTeam } from '@/lib/db/players';
import type { PlayerPosicion } from '@/types';
import { PlayerCard } from './player-card';

export interface SquadGridProps {
  players: PlayerWithTeam[];
  emptyMessage?: string;
}

const GROUP_LABEL: Record<PlayerPosicion, string> = {
  portero: 'Porteros',
  defensa: 'Defensas',
  mediocampista: 'Mediocampo',
  delantero: 'Delanteros',
};

const GROUP_ORDER: PlayerPosicion[] = ['portero', 'defensa', 'mediocampista', 'delantero'];

/**
 * Grid de plantilla agrupada por posición. Si ya hay un filtro aplicado externamente
 * (solo una posición llega en `players`), cae por defecto a un grid plano sin títulos.
 */
export function SquadGrid({ players, emptyMessage }: SquadGridProps) {
  if (!players.length) {
    return (
      <div className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-center text-sm">
        {emptyMessage ?? 'No se encontraron jugadores con los filtros seleccionados.'}
      </div>
    );
  }

  const grouped = new Map<PlayerPosicion, PlayerWithTeam[]>();
  for (const p of players) {
    const arr = grouped.get(p.posicion) ?? [];
    arr.push(p);
    grouped.set(p.posicion, arr);
  }

  const posicionesPresentes = GROUP_ORDER.filter((p) => grouped.has(p));
  const enableGrouping = posicionesPresentes.length > 1;

  if (!enableGrouping) {
    return (
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
        {players.map((p) => (
          <li key={p.id}>
            <PlayerCard player={p} />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className="space-y-8">
      {posicionesPresentes.map((pos) => {
        const group = grouped.get(pos)!;
        return (
          <section key={pos} aria-labelledby={`grp-${pos}`}>
            <h2
              id={`grp-${pos}`}
              className="text-brand-700 mb-3 text-sm font-semibold uppercase tracking-wide"
            >
              {GROUP_LABEL[pos]}{' '}
              <span className="text-brand-500 font-normal">({group.length})</span>
            </h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
              {group.map((p) => (
                <li key={p.id}>
                  <PlayerCard player={p} />
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
