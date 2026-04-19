import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/date';
import type { Article } from '@/types';
import { CATEGORIA_LABEL } from './category-label';

export interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'hero' | 'compact';
  className?: string;
}

export function ArticleCard({ article, variant = 'default', className }: ArticleCardProps) {
  const href = `/noticias/${article.slug}`;

  if (variant === 'hero') {
    return (
      <Link
        href={href}
        className={cn(
          'rounded-card bg-brand-900 focus-visible:ring-brand-400 group relative block overflow-hidden text-white focus-visible:outline-none focus-visible:ring-2',
          'min-h-[320px] sm:min-h-[400px]',
          className,
        )}
      >
        <CoverImage
          url={article.coverUrl}
          alt={article.coverAlt}
          className="absolute inset-0 h-full w-full object-cover opacity-60 transition group-hover:scale-105 group-hover:opacity-75"
        />
        <div className="relative flex h-full flex-col justify-end p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            {article.oficial ? <Badge variant="warning">Oficial</Badge> : null}
            <Badge variant="outline" className="border-white/40 text-white">
              {CATEGORIA_LABEL[article.categoria]}
            </Badge>
          </div>
          <h2 className="mt-3 text-2xl font-bold leading-tight sm:text-3xl">{article.titulo}</h2>
          <p className="text-brand-100 mt-2 line-clamp-2 text-sm">{article.excerpt}</p>
          <time
            dateTime={article.publishedAt.toISOString()}
            className="text-brand-200 mt-3 text-xs font-medium uppercase tracking-wide"
          >
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </Link>
    );
  }

  if (variant === 'compact') {
    return (
      <Link
        href={href}
        className={cn(
          'rounded-card hover:bg-brand-50 focus-visible:ring-brand-400 group flex gap-3 p-2 transition focus-visible:outline-none focus-visible:ring-2',
          className,
        )}
      >
        <CoverImage
          url={article.coverUrl}
          alt={article.coverAlt}
          className="h-16 w-24 shrink-0 rounded object-cover"
        />
        <div className="min-w-0">
          <p className="text-brand-900 group-hover:text-brand-700 line-clamp-2 text-sm font-medium">
            {article.titulo}
          </p>
          <time dateTime={article.publishedAt.toISOString()} className="text-brand-500 text-xs">
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        'rounded-card border-brand-100 shadow-card hover:border-brand-300 group flex h-full flex-col overflow-hidden border bg-white transition hover:shadow-md',
        'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2',
        className,
      )}
    >
      <div className="bg-brand-100 aspect-[16/9] overflow-hidden">
        <CoverImage
          url={article.coverUrl}
          alt={article.coverAlt}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex flex-wrap items-center gap-2">
          {article.oficial ? <Badge variant="warning">Oficial</Badge> : null}
          <Badge variant="default">{CATEGORIA_LABEL[article.categoria]}</Badge>
        </div>
        <h3 className="text-brand-950 group-hover:text-brand-800 line-clamp-2 text-base font-semibold">
          {article.titulo}
        </h3>
        <p className="text-brand-700 line-clamp-2 text-sm">{article.excerpt}</p>
        <time
          dateTime={article.publishedAt.toISOString()}
          className="text-brand-500 mt-auto text-xs font-medium uppercase tracking-wide"
        >
          {formatDate(article.publishedAt)}
        </time>
      </div>
    </Link>
  );
}

function CoverImage({
  url,
  alt,
  className,
}: {
  url: string | null;
  alt: string | null;
  className?: string;
}) {
  if (!url) {
    return (
      <div
        aria-hidden="true"
        className={cn(
          'from-brand-200 to-brand-400 text-brand-50 flex items-center justify-center bg-gradient-to-br',
          className,
        )}
      >
        <span className="text-2xl font-bold opacity-60">PFC</span>
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={url} alt={alt ?? ''} loading="lazy" className={className} />
  );
}
