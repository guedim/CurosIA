import { cn } from '@/lib/utils/cn';
import { formatDateTime } from '@/lib/utils/date';
import type { MatchWithRelations } from '@/lib/db/matches';
import { MatchStatusBadge } from './match-status-badge';

export interface ScoreboardProps {
  match: MatchWithRelations;
  variant?: 'compact' | 'hero';
  className?: string;
}

/**
 * Marcador grande con equipos, resultado y contexto (competición + fecha).
 * - `hero`: versión ampliada para la landing del partido y la home.
 * - `compact`: versión reducida para sidebars.
 */
export function Scoreboard({ match, variant = 'hero', className }: ScoreboardProps) {
  const finalizado = match.estado === 'finalizado' || match.estado === 'en_vivo';
  const isHero = variant === 'hero';

  return (
    <div
      className={cn(
        'rounded-card border-brand-100 border bg-white',
        isHero ? 'px-6 py-6 sm:px-10 sm:py-8' : 'px-4 py-3',
        className,
      )}
    >
      <div className="text-brand-600 flex items-center justify-between gap-3 text-xs uppercase tracking-wide">
        <span>
          {match.competition.nombre}
          {match.jornada ? ` · Jornada ${match.jornada}` : ''}
        </span>
        <MatchStatusBadge estado={match.estado} />
      </div>

      <div className={cn('mt-4 grid items-center gap-4', 'grid-cols-[1fr_auto_1fr]')}>
        <TeamBlock name={match.homeTeam.nombre} align="right" size={variant} />
        <ScoreBlock
          local={match.marcadorLocal}
          visita={match.marcadorVisita}
          finalizado={finalizado}
          isHero={isHero}
        />
        <TeamBlock name={match.awayTeam.nombre} align="left" size={variant} />
      </div>

      <div className="text-brand-700 mt-4 text-center text-sm">
        <time dateTime={match.fechaHora.toISOString()}>{formatDateTime(match.fechaHora)}</time>
      </div>
    </div>
  );
}

function TeamBlock({
  name,
  align,
  size,
}: {
  name: string;
  align: 'left' | 'right';
  size: 'compact' | 'hero';
}) {
  return (
    <div
      className={cn(
        'flex flex-col',
        align === 'right' ? 'items-end text-right' : 'items-start text-left',
      )}
    >
      <span
        className={cn(
          'text-brand-950 font-semibold',
          size === 'hero' ? 'text-xl sm:text-2xl' : 'text-base',
        )}
      >
        {name}
      </span>
    </div>
  );
}

function ScoreBlock({
  local,
  visita,
  finalizado,
  isHero,
}: {
  local: number | null;
  visita: number | null;
  finalizado: boolean;
  isHero: boolean;
}) {
  if (!finalizado || local === null || visita === null) {
    return (
      <div
        className={cn(
          'bg-brand-50 text-brand-700 flex items-center justify-center rounded-md px-4 font-mono font-bold',
          isHero ? 'h-14 text-xl sm:text-2xl' : 'h-10 text-base',
        )}
      >
        vs
      </div>
    );
  }

  return (
    <div
      className={cn(
        'bg-brand-900 flex items-center justify-center gap-3 rounded-md px-5 text-white',
        isHero ? 'h-14 text-3xl sm:text-4xl' : 'h-10 text-xl',
      )}
    >
      <span className="font-mono font-bold" aria-label="Marcador local">
        {local}
      </span>
      <span aria-hidden="true" className="opacity-60">
        –
      </span>
      <span className="font-mono font-bold" aria-label="Marcador visitante">
        {visita}
      </span>
    </div>
  );
}
