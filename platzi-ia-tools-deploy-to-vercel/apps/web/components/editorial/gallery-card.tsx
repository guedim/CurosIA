import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/date';
import type { Gallery } from '@/types';

export interface GalleryCardProps {
  gallery: Gallery;
  className?: string;
}

export function GalleryCard({ gallery, className }: GalleryCardProps) {
  const count = gallery.images.length;
  return (
    <Link
      href={`/media/galerias/${gallery.slug}`}
      className={cn(
        'rounded-card border-brand-100 shadow-card hover:border-brand-300 group flex h-full flex-col overflow-hidden border bg-white transition hover:shadow-md',
        'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2',
        className,
      )}
    >
      <div className="bg-brand-100 relative aspect-[4/3] overflow-hidden">
        {gallery.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={gallery.coverUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="from-brand-200 to-brand-500 h-full w-full bg-gradient-to-br"
          />
        )}
        <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
          {count} {count === 1 ? 'foto' : 'fotos'}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-brand-950 group-hover:text-brand-800 line-clamp-2 text-base font-semibold">
          {gallery.titulo}
        </h3>
        {gallery.descripcion ? (
          <p className="text-brand-700 line-clamp-2 text-sm">{gallery.descripcion}</p>
        ) : null}
        <time
          dateTime={gallery.publishedAt.toISOString()}
          className="text-brand-500 mt-auto text-xs font-medium uppercase tracking-wide"
        >
          {formatDate(gallery.publishedAt)}
        </time>
      </div>
    </Link>
  );
}
