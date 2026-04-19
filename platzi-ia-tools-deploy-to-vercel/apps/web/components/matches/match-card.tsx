import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { formatDate, formatTime } from '@/lib/utils/date';
import type { MatchWithRelations } from '@/lib/db/matches';
import { MatchStatusBadge } from './match-status-badge';

export interface MatchCardProps {
  match: MatchWithRelations;
  highlightTeamSlug?: string;
  className?: string;
}

export function MatchCard({ match, highlightTeamSlug, className }: MatchCardProps) {
  const finalizado = match.estado === 'finalizado' || match.estado === 'en_vivo';

  return (
    <Link
      href={`/partidos/${match.slug}`}
      className={cn(
        'rounded-card border-brand-100 group block border bg-white transition',
        'hover:border-brand-300 hover:shadow-card',
        'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2',
        className,
      )}
      aria-label={`${match.homeTeam.nombre} contra ${match.awayTeam.nombre}, ${formatDate(match.fechaHora)}`}
    >
      <div className="border-brand-50 text-brand-600 flex items-center justify-between border-b px-4 py-2 text-xs">
        <span className="truncate">
          {match.competition.nombre}
          {match.jornada ? ` · J${match.jornada}` : ''}
        </span>
        <MatchStatusBadge estado={match.estado} />
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 py-4">
        <TeamName
          name={match.homeTeam.nombre}
          align="right"
          highlight={highlightTeamSlug === match.homeTeam.slug}
        />
        <Score local={match.marcadorLocal} visita={match.marcadorVisita} finalizado={finalizado} />
        <TeamName
          name={match.awayTeam.nombre}
          align="left"
          highlight={highlightTeamSlug === match.awayTeam.slug}
        />
      </div>

      <div className="text-brand-600 flex items-center justify-between px-4 pb-3 text-xs">
        <time dateTime={match.fechaHora.toISOString()}>
          {formatDate(match.fechaHora)} · {formatTime(match.fechaHora)}
        </time>
        <span className="opacity-0 transition group-hover:opacity-100" aria-hidden="true">
          Ver detalle →
        </span>
      </div>
    </Link>
  );
}

function TeamName({
  name,
  align,
  highlight,
}: {
  name: string;
  align: 'left' | 'right';
  highlight: boolean;
}) {
  return (
    <span
      className={cn(
        'truncate text-sm font-semibold sm:text-base',
        align === 'right' ? 'text-right' : 'text-left',
        highlight ? 'text-brand-900' : 'text-brand-800',
      )}
    >
      {name}
    </span>
  );
}

function Score({
  local,
  visita,
  finalizado,
}: {
  local: number | null;
  visita: number | null;
  finalizado: boolean;
}) {
  if (!finalizado || local === null || visita === null) {
    return (
      <span className="bg-brand-50 text-brand-700 rounded px-3 py-1 font-mono text-sm font-semibold">
        vs
      </span>
    );
  }
  return (
    <span className="bg-brand-900 flex items-center gap-2 rounded px-3 py-1 font-mono text-base font-bold text-white">
      <span>{local}</span>
      <span aria-hidden="true" className="opacity-60">
        –
      </span>
      <span>{visita}</span>
    </span>
  );
}
