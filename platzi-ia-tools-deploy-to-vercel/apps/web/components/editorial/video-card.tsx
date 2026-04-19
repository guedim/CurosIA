import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils/cn';
import { formatDate } from '@/lib/utils/date';
import type { Video, VideoCategoria } from '@/types';

const CATEGORIA_LABEL: Record<VideoCategoria, string> = {
  resumen: 'Resumen',
  rueda_prensa: 'Rueda de prensa',
  entrevista: 'Entrevista',
  cantera: 'Cantera',
  comunidad: 'Comunidad',
};

export interface VideoCardProps {
  video: Video;
  className?: string;
}

export function VideoCard({ video, className }: VideoCardProps) {
  return (
    <Link
      href={`/media/videos/${video.slug}`}
      className={cn(
        'rounded-card border-brand-100 shadow-card hover:border-brand-300 group flex h-full flex-col overflow-hidden border bg-white transition hover:shadow-md',
        'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2',
        className,
      )}
    >
      <div className="bg-brand-900 relative aspect-video overflow-hidden">
        {video.coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={video.coverUrl}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover opacity-90 transition group-hover:scale-105"
          />
        ) : (
          <div
            aria-hidden="true"
            className="from-brand-700 to-brand-950 h-full w-full bg-gradient-to-br"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            aria-hidden="true"
            className="text-brand-900 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 shadow-lg transition group-hover:bg-white"
          >
            <svg viewBox="0 0 24 24" className="ml-0.5 h-6 w-6 fill-current">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
        </div>
        {typeof video.duracionSeg === 'number' ? (
          <span className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5 font-mono text-xs text-white">
            {formatDuration(video.duracionSeg)}
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <Badge variant="default">{CATEGORIA_LABEL[video.categoria]}</Badge>
        <h3 className="text-brand-950 group-hover:text-brand-800 line-clamp-2 text-base font-semibold">
          {video.titulo}
        </h3>
        {video.descripcion ? (
          <p className="text-brand-700 line-clamp-2 text-sm">{video.descripcion}</p>
        ) : null}
        <time
          dateTime={video.publishedAt.toISOString()}
          className="text-brand-500 mt-auto text-xs font-medium uppercase tracking-wide"
        >
          {formatDate(video.publishedAt)}
        </time>
      </div>
    </Link>
  );
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
