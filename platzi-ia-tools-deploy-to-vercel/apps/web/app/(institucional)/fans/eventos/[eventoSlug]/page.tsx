import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { getCommunityEventBySlug } from '@/lib/db/community-events';
import { getT } from '@/lib/i18n';
import { buildEventTypeLabels } from '@/lib/i18n/event-type-labels';
import { formatDateTime } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';

type Params = Promise<{ eventoSlug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { eventoSlug } = await params;
  const event = await getCommunityEventBySlug(eventoSlug);
  if (!event) return { title: 'Evento no encontrado' };
  return {
    title: event.titulo,
    description: event.descripcion.slice(0, 160),
  };
}

export const revalidate = 600;

export default async function EventoDetallePage({ params }: { params: Params }) {
  const { eventoSlug } = await params;
  const [{ dict }, event] = await Promise.all([getT(), getCommunityEventBySlug(eventoSlug)]);
  if (!event) notFound();

  const t = dict.fans.events;
  const typeLabels = buildEventTypeLabels(dict);
  const startsAtIso = event.startsAt.toISOString();

  return (
    <article className="space-y-8">
      <Link href="/fans/eventos" className="text-brand-700 inline-block text-sm hover:underline">
        {t.back}
      </Link>

      <header className="space-y-3">
        <Badge variant="default">{typeLabels[event.tipo]}</Badge>
        <h1 className="text-brand-950 text-3xl font-bold sm:text-4xl">{event.titulo}</h1>
      </header>

      {event.coverUrl ? (
        <div className="rounded-card bg-brand-100 relative aspect-[16/7] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.coverUrl}
            alt={event.coverAlt ?? ''}
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-4">
          <p className="text-brand-800 whitespace-pre-line text-base leading-relaxed">
            {event.descripcion}
          </p>
        </div>

        <aside className="space-y-4">
          <Card>
            <CardBody className="space-y-3 p-5 text-sm">
              <div>
                <p className="text-brand-500 text-xs uppercase tracking-wide">{t.startsAt}</p>
                <p className="text-brand-950 font-medium">
                  <time dateTime={startsAtIso}>
                    {formatDateTime(event.startsAt, dict.dateLocale)}
                  </time>
                </p>
              </div>
              <div>
                <p className="text-brand-500 text-xs uppercase tracking-wide">{t.location}</p>
                <p className="text-brand-950">{event.location}</p>
              </div>
              {typeof event.capacidad === 'number' ? (
                <div>
                  <p className="text-brand-500 text-xs uppercase tracking-wide">{t.capacity}</p>
                  <p className="text-brand-950">{event.capacidad}</p>
                </div>
              ) : null}
              {event.requiereInscripcion && event.externalRsvpUrl ? (
                <a
                  href={event.externalRsvpUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'bg-brand-900 hover:bg-brand-800 inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-medium text-white transition',
                    'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
                  )}
                >
                  {t.rsvp}
                </a>
              ) : (
                <p className="text-brand-600 text-xs">{t.openDoors}</p>
              )}
            </CardBody>
          </Card>
        </aside>
      </div>
    </article>
  );
}
