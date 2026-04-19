import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import type { ArticleCategoria } from '@/types';
import { ARTICLE_CATEGORIAS } from '@/types';
import { CATEGORIA_LABEL } from './category-label';

export interface CategoryFilterProps {
  basePath: string;
  current?: ArticleCategoria;
  counts: Record<ArticleCategoria, number>;
  total: number;
}

export function CategoryFilter({ basePath, current, counts, total }: CategoryFilterProps) {
  return (
    <nav aria-label="Categorías de noticias">
      <ul className="flex flex-wrap gap-1.5" role="list">
        <li>
          <Chip href={basePath} active={!current} label="Todas" count={total} />
        </li>
        {ARTICLE_CATEGORIAS.map((cat) => (
          <li key={cat}>
            <Chip
              href={`${basePath}/categoria/${cat}`}
              active={current === cat}
              label={CATEGORIA_LABEL[cat]}
              count={counts[cat] ?? 0}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Chip({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition',
        active
          ? 'border-brand-800 bg-brand-900 text-white'
          : 'border-brand-200 text-brand-800 hover:border-brand-400 hover:bg-brand-50 bg-white',
        'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2',
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          'rounded-full px-1.5 py-0.5 font-mono text-[10px]',
          active ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700',
        )}
      >
        {count}
      </span>
    </Link>
  );
}
