import Link from 'next/link';
import { getT } from '@/lib/i18n';
import type { Competition, Season } from '@/types';
import { cn } from '@/lib/utils/cn';

export type MatchFilterValues = {
  season?: string;
  competition?: string;
  lado?: 'local' | 'visita';
  estado?: 'programado' | 'finalizado' | 'en_vivo';
};

export interface FilterBarProps {
  seasons: Season[];
  competitions: Competition[];
  current: MatchFilterValues;
  basePath: string;
}

/**
 * Barra de filtros para /partidos. Implementada como `<a>` links que generan
 * URLs nuevas (sin JS de cliente). Cada grupo es un conjunto de chips con
 * aria-current para feedback de selección (aria-pressed no es válido en <a>).
 */
export async function FilterBar({ seasons, competitions, current, basePath }: FilterBarProps) {
  const { dict } = await getT();
  const l = dict.matchFilters;
  return (
    <div className="rounded-card border-brand-100 space-y-3 border bg-white p-4">
      <FilterGroup
        label={l.season}
        basePath={basePath}
        current={current}
        paramKey="season"
        options={[
          { value: undefined, label: l.all },
          ...seasons.map((s) => ({ value: s.slug, label: s.nombre })),
        ]}
      />
      <FilterGroup
        label={l.competition}
        basePath={basePath}
        current={current}
        paramKey="competition"
        options={[
          { value: undefined, label: l.all },
          ...competitions.map((c) => ({ value: c.slug, label: c.nombre })),
        ]}
      />
      <FilterGroup
        label={l.side}
        basePath={basePath}
        current={current}
        paramKey="lado"
        options={[
          { value: undefined, label: l.allMasc },
          { value: 'local', label: l.local },
          { value: 'visita', label: l.visita },
        ]}
      />
      <FilterGroup
        label={l.status}
        basePath={basePath}
        current={current}
        paramKey="estado"
        options={[
          { value: undefined, label: l.allMasc },
          { value: 'programado', label: l.upcoming },
          { value: 'en_vivo', label: l.live },
          { value: 'finalizado', label: l.results },
        ]}
      />
    </div>
  );
}

type Option = { value: string | undefined; label: string };

function FilterGroup({
  label,
  options,
  current,
  paramKey,
  basePath,
}: {
  label: string;
  options: Option[];
  current: MatchFilterValues;
  paramKey: keyof MatchFilterValues;
  basePath: string;
}) {
  return (
    <div>
      <p className="text-brand-600 mb-1.5 text-xs font-medium uppercase tracking-wide">{label}</p>
      <ul className="flex flex-wrap gap-1.5" role="list">
        {options.map((opt) => {
          const active = (current[paramKey] ?? undefined) === opt.value;
          const href = buildHref(basePath, current, paramKey, opt.value);
          return (
            <li key={`${paramKey}-${opt.value ?? 'all'}`}>
              <Link
                href={href}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium transition',
                  active
                    ? 'border-brand-800 bg-brand-900 text-white'
                    : 'border-brand-200 text-brand-800 hover:border-brand-400 hover:bg-brand-50 bg-white',
                  'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2',
                )}
              >
                {opt.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function buildHref(
  basePath: string,
  current: MatchFilterValues,
  paramKey: keyof MatchFilterValues,
  nextValue: string | undefined,
): string {
  const params = new URLSearchParams();
  const merged: MatchFilterValues = { ...current, [paramKey]: nextValue };
  for (const [k, v] of Object.entries(merged)) {
    if (v) params.set(k, v);
  }
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
