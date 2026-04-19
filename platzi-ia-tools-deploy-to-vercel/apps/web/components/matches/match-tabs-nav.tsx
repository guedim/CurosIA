import Link from 'next/link';
import { getT } from '@/lib/i18n';
import { cn } from '@/lib/utils/cn';

export type MatchTabKey = 'resumen' | 'estadisticas' | 'alineaciones' | 'minuto-a-minuto' | 'media';

type TabConfig = { key: MatchTabKey; subpath: string };

const TABS: TabConfig[] = [
  { key: 'resumen', subpath: '' },
  { key: 'estadisticas', subpath: '/estadisticas' },
  { key: 'alineaciones', subpath: '/alineaciones' },
  { key: 'minuto-a-minuto', subpath: '/minuto-a-minuto' },
  { key: 'media', subpath: '/media' },
];

export async function MatchTabsNav({
  matchSlug,
  active,
}: {
  matchSlug: string;
  active: MatchTabKey;
}) {
  const { dict } = await getT();
  const labels: Record<MatchTabKey, string> = {
    resumen: dict.matchTabs.resumen,
    estadisticas: dict.matchTabs.estadisticas,
    alineaciones: dict.matchTabs.alineaciones,
    'minuto-a-minuto': dict.matchTabs.minutoAMinuto,
    media: dict.matchTabs.media,
  };

  return (
    <nav aria-label={dict.matchTabs.label} className="border-brand-100 border-b">
      <ul className="scrollbar-hide flex gap-1 overflow-x-auto" role="list">
        {TABS.map((t) => {
          const href = `/partidos/${matchSlug}${t.subpath}`;
          const isActive = t.key === active;
          return (
            <li key={t.key} className="shrink-0">
              <Link
                href={href}
                aria-current={isActive ? 'page' : undefined}
                className={cn(
                  'inline-flex items-center border-b-2 px-4 py-3 text-sm font-medium transition-colors',
                  isActive
                    ? 'text-brand-950 border-brand-600'
                    : 'text-brand-600 hover:text-brand-900 hover:border-brand-300 border-transparent',
                )}
              >
                {labels[t.key]}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
