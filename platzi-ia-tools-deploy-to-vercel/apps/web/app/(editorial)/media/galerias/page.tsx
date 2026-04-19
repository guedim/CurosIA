import type { Metadata } from 'next';
import { GalleryCard } from '@/components/editorial/gallery-card';
import { MediaFilterBar } from '@/components/editorial/media-filter-bar';
import { listGalleries, type GalleryScope } from '@/lib/db/media';
import { getT } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Galerías',
  description: 'Galerías fotográficas de partidos, eventos y actividades del Platzi FC.',
};

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const SCOPES: readonly GalleryScope[] = ['all', 'match', 'general'] as const;

function isScope(value: unknown): value is GalleryScope {
  return typeof value === 'string' && (SCOPES as readonly string[]).includes(value);
}

export default async function GaleriasPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const scope: GalleryScope = isScope(params.scope) ? params.scope : 'all';

  const [{ dict }, galleries] = await Promise.all([getT(), listGalleries({ scope, limit: 48 })]);
  const mf = dict.mediaFilters;

  return (
    <div className="space-y-6">
      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">Galerías</h1>
        <p className="text-brand-700 mt-2">
          {galleries.length} {mf.countGalleries}
        </p>
      </header>

      <MediaFilterBar
        basePath="/media/galerias"
        paramKey="scope"
        current={scope === 'all' ? undefined : scope}
        title={mf.scopeTitle}
        ariaLabel={mf.label}
        options={[
          { value: undefined, label: mf.all },
          { value: 'match', label: mf.onlyMatch },
          { value: 'general', label: mf.noMatch },
        ]}
      />

      {galleries.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {galleries.map((g) => (
            <li key={g.id} className="h-full">
              <GalleryCard gallery={g} />
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
