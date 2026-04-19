import type { Metadata } from 'next';
import Link from 'next/link';
import { searchAll, type SearchHit } from '@/lib/db/search';

export const dynamic = 'force-dynamic';

type SearchParams = { q?: string };

const TYPE_LABEL: Record<SearchHit['type'], string> = {
  article: 'Noticia',
  player: 'Jugador',
  product: 'Tienda',
  video: 'Vídeo',
};

export const metadata: Metadata = {
  title: 'Búsqueda',
  description: 'Buscador del sitio del Platzi FC.',
  robots: { index: false, follow: true },
};

export default async function Page({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const { q = '' } = await searchParams;
  const query = q.trim();
  const hits = query.length >= 2 ? await searchAll(query, 12) : [];

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-brand-950 text-3xl font-bold leading-tight sm:text-4xl">Búsqueda</h1>
        <p className="text-brand-700">
          Encuentra noticias, jugadores, productos y vídeos del Platzi FC.
        </p>
      </header>

      <form action="/busqueda" method="get" role="search" className="flex gap-2">
        <label htmlFor="q" className="sr-only">
          Buscar
        </label>
        <input
          id="q"
          name="q"
          type="search"
          defaultValue={query}
          placeholder="Escribe un término (mínimo 2 caracteres)…"
          className="border-brand-200 text-brand-900 placeholder:text-brand-400 focus-visible:border-brand-500 focus-visible:ring-brand-400 h-11 flex-1 rounded-md border bg-white px-4 focus-visible:outline-none focus-visible:ring-2"
          autoComplete="off"
          aria-describedby="search-help"
        />
        <button
          type="submit"
          className="bg-brand-600 hover:bg-brand-700 focus-visible:ring-brand-500 inline-flex h-11 items-center justify-center rounded-md px-5 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Buscar
        </button>
      </form>
      <p id="search-help" className="sr-only">
        Los resultados se muestran debajo del formulario.
      </p>

      {query.length === 0 ? (
        <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-sm">
          Introduce un término para empezar.
        </p>
      ) : query.length < 2 ? (
        <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border p-4 text-sm">
          Escribe al menos dos caracteres.
        </p>
      ) : hits.length === 0 ? (
        <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border p-4 text-sm">
          No hay resultados para <strong>“{query}”</strong>.
        </p>
      ) : (
        <section aria-label="Resultados" className="space-y-3">
          <p className="text-brand-600 text-sm">
            {hits.length} resultado{hits.length === 1 ? '' : 's'} para <strong>“{query}”</strong>
          </p>
          <ul
            className="divide-brand-100 rounded-card border-brand-100 divide-y overflow-hidden border bg-white"
            role="list"
          >
            {hits.map((hit) => (
              <li key={`${hit.type}:${hit.slug}`}>
                <Link
                  href={hit.href}
                  className="hover:bg-brand-50 focus-visible:bg-brand-50 flex flex-col gap-1 px-4 py-3 transition focus-visible:outline-none"
                >
                  <span className="text-brand-500 text-xs uppercase tracking-wide">
                    {TYPE_LABEL[hit.type]}
                  </span>
                  <span className="text-brand-950 font-semibold">{hit.titulo}</span>
                  {hit.excerpt ? (
                    <span className="text-brand-700 line-clamp-2 text-sm">{hit.excerpt}</span>
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
