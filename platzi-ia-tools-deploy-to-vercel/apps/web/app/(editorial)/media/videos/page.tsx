import type { Metadata } from 'next';
import { MediaFilterBar } from '@/components/editorial/media-filter-bar';
import { VideoCard } from '@/components/editorial/video-card';
import { listVideos } from '@/lib/db/media';
import { getT } from '@/lib/i18n';
import type { VideoCategoria } from '@/types';

export const metadata: Metadata = {
  title: 'Vídeos',
  description: 'Resúmenes, ruedas de prensa, entrevistas y vídeos del Platzi FC.',
};

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const CATEGORIAS: readonly VideoCategoria[] = [
  'resumen',
  'rueda_prensa',
  'entrevista',
  'cantera',
  'comunidad',
] as const;

function isCategoria(value: unknown): value is VideoCategoria {
  return typeof value === 'string' && (CATEGORIAS as readonly string[]).includes(value);
}

export default async function VideosPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const categoria = isCategoria(params.categoria) ? params.categoria : undefined;

  const [{ dict }, videos] = await Promise.all([getT(), listVideos({ categoria, limit: 48 })]);
  const mf = dict.mediaFilters;

  return (
    <div className="space-y-6">
      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">{dict.matchTabs.media}</h1>
        <p className="text-brand-700 mt-2">
          {videos.length} {mf.countVideos}
        </p>
      </header>

      <MediaFilterBar
        basePath="/media/videos"
        paramKey="categoria"
        current={categoria}
        title={mf.categoryTitle}
        ariaLabel={mf.label}
        options={[
          { value: undefined, label: mf.all },
          ...CATEGORIAS.map((c) => ({ value: c, label: mf.videos[c] })),
        ]}
      />

      {videos.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {videos.map((v) => (
            <li key={v.id} className="h-full">
              <VideoCard video={v} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-center text-sm">
          {mf.empty}
        </p>
      )}
    </div>
  );
}
