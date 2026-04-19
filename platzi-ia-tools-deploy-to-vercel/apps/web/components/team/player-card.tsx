import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import type { PlayerEstado, PlayerPosicion } from '@/types';
import type { PlayerWithTeam } from '@/lib/db/players';

export interface PlayerCardProps {
  player: PlayerWithTeam;
  className?: string;
}

const POSICION_LABEL: Record<PlayerPosicion, string> = {
  portero: 'Portero',
  defensa: 'Defensa',
  mediocampista: 'Mediocampista',
  delantero: 'Delantero',
};

const ESTADO_LABEL: Record<
  Exclude<PlayerEstado, 'activo'>,
  { label: string; variant: 'warning' | 'info' | 'default' }
> = {
  lesionado: { label: 'Lesionado', variant: 'warning' },
  cedido: { label: 'Cedido', variant: 'info' },
  retirado: { label: 'Retirado', variant: 'default' },
};

export function PlayerCard({ player, className }: PlayerCardProps) {
  const estadoTag = player.estado !== 'activo' ? ESTADO_LABEL[player.estado] : null;

  return (
    <Link
      href={`/equipo/${player.slug}`}
      className={cn(
        'rounded-card border-brand-100 group block border bg-white p-4 transition',
        'hover:border-brand-300 hover:shadow-card',
        'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2',
        className,
      )}
      aria-label={`Ver perfil de ${player.nombre} ${player.apellido}, ${POSICION_LABEL[player.posicion]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          aria-hidden="true"
          className="bg-brand-900 flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-xl font-bold text-white"
        >
          {player.dorsal ?? '–'}
        </div>
        {estadoTag ? (
          <Badge variant={estadoTag.variant} className="shrink-0">
            {estadoTag.label}
          </Badge>
        ) : null}
      </div>

      <div className="mt-3">
        <p className="text-brand-600 text-xs uppercase tracking-wide">
          {POSICION_LABEL[player.posicion]}
        </p>
        <h3 className="text-brand-950 mt-0.5 text-base font-semibold leading-tight">
          {player.nombre} <span className="font-bold">{player.apellido}</span>
        </h3>
      </div>

      <dl className="text-brand-700 mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs">
        {player.nacionalidad ? (
          <div className="flex gap-1">
            <dt className="font-medium">País:</dt>
            <dd>{player.nacionalidad}</dd>
          </div>
        ) : null}
        {player.alturaCm ? (
          <div className="flex gap-1">
            <dt className="font-medium">Altura:</dt>
            <dd>{player.alturaCm} cm</dd>
          </div>
        ) : null}
        {player.pieHabil ? (
          <div className="flex gap-1">
            <dt className="font-medium">Pie:</dt>
            <dd className="capitalize">{player.pieHabil}</dd>
          </div>
        ) : null}
      </dl>
    </Link>
  );
}
