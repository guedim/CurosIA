import Link from 'next/link';
import type { CommunityEventTipo } from '@/types';
import { COMMUNITY_EVENT_TIPOS } from '@/types';
import { cn } from '@/lib/utils/cn';

export type EventScope = 'upcoming' | 'past' | 'all';

export interface EventFilterBarProps {
  basePath: string;
  currentScope: EventScope;
  currentTipo?: CommunityEventTipo;
  labels: {
    filtersLabel: string;
    scopeTitle: string;
    typeTitle: string;
    upcoming: string;
    past: string;
    all: string;
    typeAll: string;
    typeLabels: Record<CommunityEventTipo, string>;
  };
}

/**
 * Filtros sin-JS para `/fans/eventos`. Dos grupos: `scope` (upcoming/past/all)
 * y `tipo` (chip por categoría). Se renderizan como `<a>` para mantener la
 * página como Server Component y evitar cliente innecesario.
 */
export function EventFilterBar({
  basePath,
  currentScope,
  currentTipo,
  labels,
}: EventFilterBarProps) {
  return (
    <section
      aria-label={labels.filtersLabel}
      className="rounded-card border-brand-100 space-y-3 border bg-white p-4"
    >
      <FilterGroup
        title={labels.scopeTitle}
        options={[
          { value: 'upcoming', label: labels.upcoming },
          { value: 'past', label: labels.past },
          { value: 'all', label: labels.all },
        ]}
        current={currentScope}
        paramKey="scope"
        basePath={basePath}
        extraParams={currentTipo ? { tipo: currentTipo } : {}}
      />
      <FilterGroup
        title={labels.typeTitle}
        options={[
          { value: undefined, label: labels.typeAll },
          ...COMMUNITY_EVENT_TIPOS.map((t) => ({ value: t, label: labels.typeLabels[t] })),
        ]}
        current={currentTipo}
        paramKey="tipo"
        basePath={basePath}
        extraParams={currentScope !== 'upcoming' ? { scope: currentScope } : {}}
      />
    </section>
  );
}

function FilterGroup<V extends string | undefined>({
  title,
  options,
  current,
  paramKey,
  basePath,
  extraParams,
}: {
  title: string;
  options: { value: V; label: string }[];
  current: V;
  paramKey: string;
  basePath: string;
  extraParams: Record<string, string>;
}) {
  return (
    <div>
      <p className="text-brand-600 mb-1.5 text-xs font-medium uppercase tracking-wide">{title}</p>
      <ul className="flex flex-wrap gap-1.5" role="list">
        {options.map((opt) => {
          const active = (current ?? undefined) === opt.value;
          const href = buildHref(basePath, extraParams, paramKey, opt.value);
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
  extraParams: Record<string, string>,
  paramKey: string,
  nextValue: string | undefined,
): string {
  const params = new URLSearchParams(extraParams);
  if (nextValue) params.set(paramKey, nextValue);
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}
