import Link from 'next/link';
import { VideoCard } from '@/components/editorial/video-card';
import { GalleryCard } from '@/components/editorial/gallery-card';
import type { Gallery, Video } from '@/types';

export interface MatchMediaSectionProps {
  videos: Video[];
  galleries: Gallery[];
  /**
   * Cuando se renderiza como preview dentro del resumen, mostramos solo los
   * N primeros items y un enlace a la pestaña media. En la pestaña completa
   * este prop es undefined y se muestran todos.
   */
  previewLimit?: number;
  /**
   * Slug del partido; usado para construir el CTA "ver todo" del modo preview.
   */
  matchSlug?: string;
}

export function MatchMediaSection({
  videos,
  galleries,
  previewLimit,
  matchSlug,
}: MatchMediaSectionProps) {
  const shownVideos = previewLimit ? videos.slice(0, previewLimit) : videos;
  const shownGalleries = previewLimit ? galleries.slice(0, previewLimit) : galleries;
  const hasVideos = shownVideos.length > 0;
  const hasGalleries = shownGalleries.length > 0;

  if (!hasVideos && !hasGalleries) {
    if (previewLimit) return null;
    return (
      <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-4 text-sm">
        No hay vídeos ni galerías para este partido todavía.
      </p>
    );
  }

  const hasMoreVideos = previewLimit ? videos.length > shownVideos.length : false;
  const hasMoreGalleries = previewLimit ? galleries.length > shownGalleries.length : false;
  const showLink = matchSlug && previewLimit && (hasMoreVideos || hasMoreGalleries);

  return (
    <div className="space-y-6">
      {hasVideos ? (
        <section aria-labelledby="match-media-videos">
          <header className="mb-3 flex items-baseline justify-between gap-3">
            <h3 id="match-media-videos" className="text-brand-950 text-lg font-semibold">
              Vídeos
            </h3>
            <span className="text-brand-500 text-xs">
              {videos.length} {videos.length === 1 ? 'vídeo' : 'vídeos'}
            </span>
          </header>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {shownVideos.map((v) => (
              <li key={v.id}>
                <VideoCard video={v} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {hasGalleries ? (
        <section aria-labelledby="match-media-galleries">
          <header className="mb-3 flex items-baseline justify-between gap-3">
            <h3 id="match-media-galleries" className="text-brand-950 text-lg font-semibold">
              Galerías
            </h3>
            <span className="text-brand-500 text-xs">
              {galleries.length} {galleries.length === 1 ? 'galería' : 'galerías'}
            </span>
          </header>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {shownGalleries.map((g) => (
              <li key={g.id}>
                <GalleryCard gallery={g} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {showLink ? (
        <Link
          href={`/partidos/${matchSlug}/media`}
          className="text-brand-700 inline-flex text-sm hover:underline"
        >
          Ver todo el material del partido →
        </Link>
      ) : null}
    </div>
  );
}
