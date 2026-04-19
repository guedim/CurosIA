import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { VideoCard } from '@/components/editorial/video-card';
import { Badge } from '@/components/ui/badge';
import { getVideoBySlug, listVideos } from '@/lib/db/media';
import { buildVideoObjectJsonLd } from '@/lib/seo/article-jsonld';
import { formatDate } from '@/lib/utils/date';
import type { VideoCategoria } from '@/types';

type Params = { videoSlug: string };

export const revalidate = 600;

const CATEGORIA_LABEL: Record<VideoCategoria, string> = {
  resumen: 'Resumen',
  rueda_prensa: 'Rueda de prensa',
  entrevista: 'Entrevista',
  cantera: 'Cantera',
  comunidad: 'Comunidad',
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { videoSlug } = await params;
  const video = await getVideoBySlug(videoSlug);
  if (!video) return { title: 'Vídeo no encontrado' };
  return {
    title: video.titulo,
    description: video.descripcion ?? video.titulo,
    openGraph: {
      title: video.titulo,
      description: video.descripcion ?? video.titulo,
      type: 'video.other',
      images: video.coverUrl ? [video.coverUrl] : undefined,
    },
  };
}

export default async function VideoPage({ params }: { params: Promise<Params> }) {
  const { videoSlug } = await params;
  const video = await getVideoBySlug(videoSlug);
  if (!video) notFound();

  const related = (await listVideos({ categoria: video.categoria, limit: 4 }))
    .filter((v) => v.id !== video.id)
    .slice(0, 3);

  const url = `/media/videos/${video.slug}`;
  const jsonLd = buildVideoObjectJsonLd(video, url);

  return (
    <article className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-brand-600 text-sm">
        <ol className="flex flex-wrap gap-1">
          <li>
            <Link href="/media/videos" className="hover:underline">
              Vídeos
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-800 truncate">{video.titulo}</li>
        </ol>
      </nav>

      <header className="space-y-3">
        <Badge variant="default">{CATEGORIA_LABEL[video.categoria]}</Badge>
        <h1 className="text-brand-950 text-3xl font-bold leading-tight sm:text-4xl">
          {video.titulo}
        </h1>
        <time dateTime={video.publishedAt.toISOString()} className="text-brand-600 text-sm">
          {formatDate(video.publishedAt)}
        </time>
      </header>

      <div className="rounded-card aspect-video overflow-hidden bg-black">
        <iframe
          src={video.embedUrl}
          title={video.titulo}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="h-full w-full"
        />
      </div>

      {video.descripcion ? (
        <p className="text-brand-800 max-w-3xl leading-relaxed">{video.descripcion}</p>
      ) : null}

      {related.length ? (
        <section
          aria-label="Vídeos relacionados"
          className="border-brand-100 space-y-4 border-t pt-6"
        >
          <h2 className="text-brand-950 text-xl font-semibold">
            Más en {CATEGORIA_LABEL[video.categoria]}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {related.map((v) => (
              <li key={v.id}>
                <VideoCard video={v} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
