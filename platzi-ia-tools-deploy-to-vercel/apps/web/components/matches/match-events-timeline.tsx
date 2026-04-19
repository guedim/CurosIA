import { cn } from '@/lib/utils/cn';
import type { MatchEvent, MatchEventTipo } from '@/types';

type TeamMeta = { id: string; nombre: string };

export interface MatchEventsTimelineProps {
  events: MatchEvent[];
  homeTeam: TeamMeta;
  awayTeam: TeamMeta;
}

const TIPO_LABEL: Record<MatchEventTipo, string> = {
  gol: 'Gol',
  gol_penal: 'Gol (penal)',
  gol_en_contra: 'Gol en contra',
  amarilla: 'Amarilla',
  doble_amarilla: 'Doble amarilla',
  roja: 'Roja',
  sustitucion: 'Sustitución',
  penal_fallado: 'Penal fallado',
  var: 'VAR',
};

const TIPO_ICON: Record<MatchEventTipo, string> = {
  gol: '⚽',
  gol_penal: '⚽',
  gol_en_contra: '⚽',
  amarilla: '🟨',
  doble_amarilla: '🟨🟨',
  roja: '🟥',
  sustitucion: '↔',
  penal_fallado: '✖',
  var: 'VAR',
};

export function MatchEventsTimeline({ events, homeTeam, awayTeam }: MatchEventsTimelineProps) {
  if (!events.length) {
    return (
      <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-4 text-sm">
        No hay eventos registrados para este partido.
      </p>
    );
  }

  return (
    <ol className="relative space-y-2" role="list">
      {events.map((e) => {
        const isHome = e.teamId === homeTeam.id;
        const isAway = e.teamId === awayTeam.id;
        const teamName = isHome ? homeTeam.nombre : isAway ? awayTeam.nombre : 'Evento';
        return (
          <li
            key={e.id}
            className={cn(
              'grid items-start gap-2',
              'grid-cols-[auto_1fr_auto] sm:grid-cols-[1fr_auto_1fr]',
            )}
          >
            <div className={cn('hidden text-right text-sm sm:block', !isHome && 'opacity-0')}>
              {isHome ? <EventBlock event={e} team={teamName} align="right" /> : null}
            </div>
            <div className="flex items-center justify-center">
              <span className="bg-brand-900 inline-flex min-w-[3rem] items-center justify-center rounded-full px-2 py-1 font-mono text-xs font-bold text-white">
                {e.minuto}
                {e.minutoExtra ? `+${e.minutoExtra}` : ''}&apos;
              </span>
            </div>
            <div className={cn('text-sm sm:text-left', !isAway && 'sm:opacity-0')}>
              <div className="sm:hidden">
                <EventBlock event={e} team={teamName} align="left" />
              </div>
              <div className="hidden sm:block">
                {isAway ? <EventBlock event={e} team={teamName} align="left" /> : null}
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function EventBlock({
  event,
  team,
  align,
}: {
  event: MatchEvent;
  team: string;
  align: 'left' | 'right';
}) {
  return (
    <div className={cn('flex flex-col gap-0.5', align === 'right' ? 'items-end' : 'items-start')}>
      <span className="text-brand-900 flex items-center gap-1.5 text-sm font-medium">
        <span aria-hidden="true">{TIPO_ICON[event.tipo]}</span>
        <span>{TIPO_LABEL[event.tipo]}</span>
      </span>
      <span className="text-brand-600 text-xs">{team}</span>
      {event.descripcion ? (
        <span className="text-brand-700 text-xs">{event.descripcion}</span>
      ) : null}
    </div>
  );
}
