import { cn } from '@/lib/utils/cn';
import type { StandingWithTeam } from '@/lib/db/standings';
import type { FormaResultado } from '@/types';

export interface StandingsTableProps {
  rows: StandingWithTeam[];
  highlightTeamSlug?: string;
  caption?: string;
}

const FORMA_META: Record<FormaResultado, { label: string; bg: string }> = {
  G: { label: 'Ganado', bg: 'bg-green-600' },
  E: { label: 'Empatado', bg: 'bg-amber-500' },
  P: { label: 'Perdido', bg: 'bg-red-600' },
};

export function StandingsTable({ rows, highlightTeamSlug, caption }: StandingsTableProps) {
  if (!rows.length) {
    return (
      <div className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-center text-sm">
        No hay datos de clasificación disponibles.
      </div>
    );
  }

  return (
    <div className="rounded-card border-brand-100 overflow-hidden border bg-white">
      <table className="w-full text-sm">
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        <thead className="bg-brand-50 text-brand-700 text-xs uppercase tracking-wide">
          <tr>
            <th scope="col" className="px-3 py-2 text-left">
              #
            </th>
            <th scope="col" className="px-3 py-2 text-left">
              Equipo
            </th>
            <NumCol label="PJ" title="Partidos jugados" />
            <NumCol label="PG" title="Ganados" />
            <NumCol label="PE" title="Empatados" />
            <NumCol label="PP" title="Perdidos" />
            <NumCol label="GF" title="Goles a favor" />
            <NumCol label="GC" title="Goles en contra" />
            <NumCol label="DG" title="Diferencia de goles" />
            <NumCol label="Pts" title="Puntos" bold />
            <th scope="col" className="hidden px-3 py-2 text-center sm:table-cell">
              Forma
            </th>
          </tr>
        </thead>
        <tbody className="divide-brand-100 divide-y">
          {rows.map((r) => {
            const isHighlighted = highlightTeamSlug === r.team.slug;
            return (
              <tr
                key={r.id}
                className={cn(
                  isHighlighted ? 'bg-brand-50/80' : 'bg-white',
                  'hover:bg-brand-50 transition',
                )}
              >
                <td className="text-brand-700 px-3 py-2.5 font-mono">{r.posicion ?? '–'}</td>
                <td
                  className={cn(
                    'px-3 py-2.5 font-medium',
                    isHighlighted ? 'text-brand-900' : 'text-brand-800',
                  )}
                >
                  {r.team.nombre}
                </td>
                <Num v={r.pj} />
                <Num v={r.pg} />
                <Num v={r.pe} />
                <Num v={r.pp} />
                <Num v={r.gf} />
                <Num v={r.gc} />
                <Num v={r.dg ?? 0} />
                <Num v={r.pts} bold />
                <td className="hidden px-3 py-2.5 sm:table-cell">
                  <FormaBar forma={r.forma} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function NumCol({ label, title, bold }: { label: string; title: string; bold?: boolean }) {
  return (
    <th scope="col" className={cn('px-3 py-2 text-right', bold && 'font-bold')} title={title}>
      {label}
    </th>
  );
}

function Num({ v, bold }: { v: number; bold?: boolean }) {
  return (
    <td
      className={cn(
        'px-3 py-2.5 text-right font-mono',
        bold ? 'text-brand-900 font-bold' : 'text-brand-800',
      )}
    >
      {v}
    </td>
  );
}

function FormaBar({ forma }: { forma: FormaResultado[] }) {
  if (!forma.length) return <span className="text-brand-400">–</span>;
  return (
    <ul className="flex justify-center gap-1" role="list" aria-label="Forma reciente">
      {forma.slice(-5).map((r, i) => (
        <li key={i}>
          <span
            aria-label={FORMA_META[r].label}
            title={FORMA_META[r].label}
            className={cn(
              'inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold text-white',
              FORMA_META[r].bg,
            )}
          >
            {r}
          </span>
        </li>
      ))}
    </ul>
  );
}
