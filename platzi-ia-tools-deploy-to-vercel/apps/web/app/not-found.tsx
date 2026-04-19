import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Página no encontrada',
  description: 'La página que buscas no existe o ha sido movida.',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <section className="mx-auto max-w-xl py-16 text-center">
      <p className="text-brand-600 text-sm font-semibold uppercase tracking-wide">Error 404</p>
      <h1 className="text-brand-950 mt-2 text-4xl font-bold">Página no encontrada</h1>
      <p className="text-brand-700 mt-3">La página que buscas no existe o ha sido movida.</p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/"
          className="bg-brand-600 hover:bg-brand-700 focus-visible:ring-brand-500 inline-flex h-10 items-center rounded-md px-4 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Volver al inicio
        </Link>
        <Link
          href="/busqueda"
          className="border-brand-300 text-brand-900 hover:bg-brand-50 focus-visible:ring-brand-400 inline-flex h-10 items-center rounded-md border bg-white px-4 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Buscar
        </Link>
      </div>
    </section>
  );
}
