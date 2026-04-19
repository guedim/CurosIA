import type { Metadata } from 'next';
import Link from 'next/link';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { listCompetitions } from '@/lib/db/matches';
import type { CompetitionTipo } from '@/types';

export const metadata: Metadata = {
  title: 'Competiciones',
  description: 'Competiciones activas de Platzi FC: liga, copas y torneos internacionales.',
};

export const revalidate = 3600;

const TIPO_META: Record<
  CompetitionTipo,
  { label: string; variant: 'success' | 'warning' | 'info' | 'default' }
> = {
  liga: { label: 'Liga', variant: 'success' },
  copa: { label: 'Copa', variant: 'warning' },
  internacional: { label: 'Internacional', variant: 'info' },
  amistoso: { label: 'Amistoso', variant: 'default' },
};

export default async function CompetitionsPage() {
  const competitions = await listCompetitions();

  return (
    <div className="space-y-6">
      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">Competiciones</h1>
        <p className="text-brand-700 mt-2">
          {competitions.length} competiciones en las que participa Platzi FC esta temporada.
        </p>
      </header>

      {competitions.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {competitions.map((c) => {
            const tipo = TIPO_META[c.tipo];
            return (
              <li key={c.id}>
                <Link
                  href={`/competicion/${c.slug}`}
                  className="rounded-card focus-visible:ring-brand-400 block focus-visible:outline-none focus-visible:ring-2"
                >
                  <Card className="hover:border-brand-300 h-full transition hover:shadow-md">
                    <CardHeader className="flex flex-row items-start justify-between gap-2">
                      <CardTitle className="truncate">{c.nombre}</CardTitle>
                      <Badge variant={tipo.variant}>{tipo.label}</Badge>
                    </CardHeader>
                    <CardBody className="text-brand-700 text-sm">
                      {c.pais || c.region ? (
                        <p>{[c.region, c.pais].filter(Boolean).join(' · ')}</p>
                      ) : (
                        <p className="text-brand-500">Competición oficial</p>
                      )}
                      <p className="text-brand-600 mt-3 text-xs font-medium">
                        Ver tabla y calendario →
                      </p>
                    </CardBody>
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-center text-sm">
          No hay competiciones registradas todavía.
        </p>
      )}
    </div>
  );
}
