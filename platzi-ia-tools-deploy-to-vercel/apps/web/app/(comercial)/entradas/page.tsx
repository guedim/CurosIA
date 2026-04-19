import type { Metadata } from 'next';
import Link from 'next/link';
import { MatchCard } from '@/components/matches/match-card';
import { Badge } from '@/components/ui/badge';
import { listProximosPartidosLocal } from '@/lib/db/matches';
import { formatDate } from '@/lib/utils/date';

export const dynamic = 'force-dynamic';

export const revalidate = 60; // Revalida cada minuto en lugar de en el build

const TICKETING_BASE_URL = 'https://entradas.platzifc.example';

export const metadata: Metadata = {
  title: 'Entradas',
  description:
    'Compra entradas para los próximos partidos del Platzi FC en el Platzi Arena, abonos de temporada e información del estadio.',
};

export default async function Page() {
  const proximos = await listProximosPartidosLocal(8);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <Badge variant="default">Taquilla oficial</Badge>
        <h1 className="text-brand-950 text-3xl font-bold leading-tight sm:text-4xl">
          Entradas para los próximos partidos
        </h1>
        <p className="text-brand-700 max-w-2xl">
          Adquiere tus entradas para los partidos como local en el Platzi Arena. Venta online y en
          taquillas del estadio, con prioridad de 48 horas para abonados.
        </p>
      </header>

      <section aria-labelledby="proximos-partidos" className="space-y-4">
        <h2 id="proximos-partidos" className="text-brand-950 text-xl font-semibold">
          Próximos partidos en casa
        </h2>
        {proximos.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {proximos.map((m) => (
              <li key={m.id} className="space-y-3">
                <MatchCard match={m} highlightTeamSlug={m.homeTeam.slug} />
                <a
                  href={`${TICKETING_BASE_URL}/${m.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-brand-600 hover:bg-brand-700 focus-visible:ring-brand-500 inline-flex h-9 w-full items-center justify-center rounded-md px-4 text-sm font-medium text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                  aria-label={`Comprar entradas para ${m.homeTeam.nombre} contra ${m.awayTeam.nombre} el ${formatDate(m.fechaHora)}`}
                >
                  Comprar entradas
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-sm">
            Aún no hay partidos programados con entradas a la venta. Revisa próximamente.
          </p>
        )}
      </section>

      <section
        aria-labelledby="enlaces"
        className="border-brand-100 grid gap-4 border-t pt-8 md:grid-cols-2"
      >
        <h2 id="enlaces" className="sr-only">
          Enlaces relacionados
        </h2>
        <Link
          href="/entradas/abonos"
          className="rounded-card border-brand-100 hover:border-brand-300 hover:shadow-card focus-visible:ring-brand-400 block border bg-white p-5 transition focus-visible:outline-none focus-visible:ring-2"
        >
          <h3 className="text-brand-950 text-lg font-semibold">Abonos de temporada</h3>
          <p className="text-brand-700 mt-1 text-sm">Ventajas y tarifas de los abonos 2026.</p>
        </Link>
        <Link
          href="/entradas/estadio"
          className="rounded-card border-brand-100 hover:border-brand-300 hover:shadow-card focus-visible:ring-brand-400 block border bg-white p-5 transition focus-visible:outline-none focus-visible:ring-2"
        >
          <h3 className="text-brand-950 text-lg font-semibold">Información del estadio</h3>
          <p className="text-brand-700 mt-1 text-sm">
            Zonas, accesibilidad y horarios de taquilla.
          </p>
        </Link>
      </section>
    </div>
  );
}
