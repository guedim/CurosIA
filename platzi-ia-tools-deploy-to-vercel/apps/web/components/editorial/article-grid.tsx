import type { Article } from '@/types';
import { cn } from '@/lib/utils/cn';
import { ArticleCard } from './article-card';

export interface ArticleGridProps {
  articles: Article[];
  emptyMessage?: string;
  className?: string;
}

export function ArticleGrid({
  articles,
  emptyMessage = 'No hay noticias disponibles con los filtros seleccionados.',
  className,
}: ArticleGridProps) {
  if (!articles.length) {
    return (
      <div className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-center text-sm">
        {emptyMessage}
      </div>
    );
  }

  return (
    <ul className={cn('grid gap-4 sm:grid-cols-2 lg:grid-cols-3', className)} role="list">
      {articles.map((a) => (
        <li key={a.id} className="h-full">
          <ArticleCard article={a} />
        </li>
      ))}
    </ul>
  );
}
