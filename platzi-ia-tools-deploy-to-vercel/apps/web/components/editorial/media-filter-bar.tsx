import Link from 'next/link';
import { cn } from '@/lib/utils/cn';

export type MediaFilterOption = { value: string | undefined; label: string };

export interface MediaFilterBarProps {
  basePath: string;
  paramKey: string;
  current: string | undefined;
  title: string;
  options: MediaFilterOption[];
  ariaLabel: string;
}

/**
 * Barra de filtros tipo chip para las páginas `/media/videos` y
 * `/media/galerias`. Se renderiza como enlaces para evitar JS cliente; cada
 * chip reescribe solo el param que le corresponde.
 */
export function MediaFilterBar({
  basePath,
  paramKey,
  current,
  title,
  options,
  ariaLabel,
}: MediaFilterBarProps) {
  return (
    <nav aria-label={ariaLabel} className="rounded-card border-brand-100 border bg-white p-3">
      <p className="text-brand-600 mb-1.5 px-1 text-xs font-medium uppercase tracking-wide">
        {title}
      </p>
      <ul className="flex flex-wrap gap-1.5" role="list">
        {options.map((opt) => {
          const active = (current ?? undefined) === opt.value;
          const href = opt.value ? `${basePath}?${paramKey}=${opt.value}` : basePath;
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
    </nav>
  );
}
