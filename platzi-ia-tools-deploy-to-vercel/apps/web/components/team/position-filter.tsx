import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { PlayerPosicion } from '@/types';

export interface PositionFilterProps {
  current?: PlayerPosicion;
  basePath: string;
  counts?: Record<PlayerPosicion, number>;
  total?: number;
}

const OPTIONS: { value: PlayerPosicion | undefined; label: string }[] = [
  { value: undefined, label: 'Todos' },
  { value: 'portero', label: 'Porteros' },
  { value: 'defensa', label: 'Defensas' },
  { value: 'mediocampista', label: 'Mediocampo' },
  { value: 'delantero', label: 'Delanteros' },
];

export function PositionFilter({ current, basePath, counts, total }: PositionFilterProps) {
  return (
    <nav aria-label="Filtrar plantilla por posición">
      <ul className="flex flex-wrap gap-1.5" role="list">
        {OPTIONS.map((opt) => {
          const active = opt.value === current;
          const href = opt.value ? `${basePath}?posicion=${opt.value}` : basePath;
          const count = opt.value ? counts?.[opt.value] : total;
          return (
            <li key={opt.label}>
              <Link
                href={href}
                aria-current={active ? 'true' : undefined}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition',
                  active
                    ? 'border-brand-800 bg-brand-900 text-white'
                    : 'border-brand-200 text-brand-800 hover:border-brand-400 hover:bg-brand-50 bg-white',
                  'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2',
                )}
              >
                <span>{opt.label}</span>
                {count !== undefined ? (
                  <span
                    className={cn(
                      'rounded-full px-1.5 text-xs',
                      active ? 'bg-white/15' : 'bg-brand-100 text-brand-700',
                    )}
                  >
                    {count}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
