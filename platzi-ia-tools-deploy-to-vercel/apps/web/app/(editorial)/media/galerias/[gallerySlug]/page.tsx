import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGalleryBySlug } from '@/lib/db/media';
import { formatDate } from '@/lib/utils/date';

type Params = { gallerySlug: string };

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { gallerySlug } = await params;
  const gallery = await getGalleryBySlug(gallerySlug);
  if (!gallery) return { title: 'Galería no encontrada' };
  return {
    title: gallery.titulo,
    description: gallery.descripcion ?? gallery.titulo,
    openGraph: {
      title: gallery.titulo,
      description: gallery.descripcion ?? gallery.titulo,
      type: 'article',
      images: gallery.coverUrl ? [gallery.coverUrl] : undefined,
    },
  };
}

export default async function GalleryPage({ params }: { params: Promise<Params> }) {
  const { gallerySlug } = await params;
  const gallery = await getGalleryBySlug(gallerySlug);
  if (!gallery) notFound();

  return (
    <article className="space-y-6">
      <nav aria-label="Breadcrumb" className="text-brand-600 text-sm">
        <ol className="flex flex-wrap gap-1">
          <li>
            <Link href="/media/galerias" className="hover:underline">
              Galerías
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-800 truncate">{gallery.titulo}</li>
        </ol>
      </nav>

      <header className="space-y-2">
        <h1 className="text-brand-950 text-3xl font-bold leading-tight sm:text-4xl">
          {gallery.titulo}
        </h1>
        {gallery.descripcion ? <p className="text-brand-700">{gallery.descripcion}</p> : null}
        <time dateTime={gallery.publishedAt.toISOString()} className="text-brand-600 text-sm">
          {formatDate(gallery.publishedAt)} · {gallery.images.length}{' '}
          {gallery.images.length === 1 ? 'foto' : 'fotos'}
        </time>
      </header>

      {gallery.images.length ? (
        <ul
          className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3"
          role="list"
          aria-label={`Fotografías de ${gallery.titulo}`}
        >
          {gallery.images.map((img, i) => (
            <li key={i} className="rounded-card border-brand-100 overflow-hidden border bg-white">
              <figure>
                <div className="bg-brand-100 aspect-[4/3]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.url}
                    alt={img.alt}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                </div>
                {img.credito ? (
                  <figcaption className="text-brand-500 px-3 py-2 text-xs">
                    {img.credito}
                  </figcaption>
                ) : null}
              </figure>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-center text-sm">
          Esta galería no tiene imágenes.
        </p>
      )}
    </article>
  );
}
