import type { MatchWithRelations } from '@/lib/db/matches';
import { cn } from '@/lib/utils/cn';
import { MatchCard } from './match-card';

export interface MatchListProps {
  matches: MatchWithRelations[];
  emptyMessage?: string;
  highlightTeamSlug?: string;
  className?: string;
}

export function MatchList({
  matches,
  emptyMessage = 'No se encontraron partidos con los filtros seleccionados.',
  highlightTeamSlug,
  className,
}: MatchListProps) {
  if (!matches.length) {
    return (
      <div className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-center text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className={cn('grid gap-3 sm:grid-cols-2', className)} role="list">
      {matches.map((m) => (
        <li key={m.id}>
          <MatchCard match={m} highlightTeamSlug={highlightTeamSlug} />
        </li>
      ))}
    </ul>
  );
}
