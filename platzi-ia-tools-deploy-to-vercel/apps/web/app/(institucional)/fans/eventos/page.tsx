import type { Metadata } from 'next';
import { EventCard } from '@/components/fans/event-card';
import { EventFilterBar, type EventScope } from '@/components/fans/event-filter-bar';
import { Card, CardBody } from '@/components/ui/card';
import { listCommunityEvents } from '@/lib/db/community-events';
import { getT } from '@/lib/i18n';
import { buildEventTypeLabels } from '@/lib/i18n/event-type-labels';
import { COMMUNITY_EVENT_TIPOS } from '@/types';
import type { CommunityEventTipo } from '@/types';

export const metadata: Metadata = {
  title: 'Eventos de comunidad',
  description: 'Calendario de eventos de comunidad del Platzi FC.',
};

export const dynamic = 'force-dynamic';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

const SCOPES: readonly EventScope[] = ['upcoming', 'past', 'all'] as const;

function isScope(value: unknown): value is EventScope {
  return typeof value === 'string' && (SCOPES as readonly string[]).includes(value);
}

function isTipo(value: unknown): value is CommunityEventTipo {
  return typeof value === 'string' && (COMMUNITY_EVENT_TIPOS as readonly string[]).includes(value);
}

export default async function EventosPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const scope: EventScope = isScope(params.scope) ? params.scope : 'upcoming';
  const tipo = isTipo(params.tipo) ? params.tipo : undefined;

  const [{ dict }, events] = await Promise.all([getT(), listCommunityEvents({ scope, tipo })]);
  const t = dict.fans.events;
  const typeLabels = buildEventTypeLabels(dict);

  return (
    <div className="space-y-8">
      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">{t.heroTitle}</h1>
        <p className="text-brand-700 mt-2 max-w-3xl text-sm">{t.heroSubtitle}</p>
      </header>

      <EventFilterBar
        basePath="/fans/eventos"
        currentScope={scope}
        currentTipo={tipo}
        labels={{
          filtersLabel: t.sectionTitle,
          scopeTitle: t.sectionTitle,
          typeTitle: t.all,
          upcoming: t.upcoming,
          past: t.past,
          all: t.all,
          typeAll: t.typeAll,
          typeLabels,
        }}
      />

      {events.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
          {events.map((e) => (
            <li key={e.id}>
              <EventCard
                event={e}
                typeLabels={typeLabels}
                dateLocale={dict.dateLocale}
                labels={{
                  rsvp: t.rsvp,
                  openDoors: t.openDoors,
                  location: t.location,
                  startsAt: t.startsAt,
                  detailCta: t.detailCta,
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <CardBody className="text-brand-700 text-sm">{t.noEvents}</CardBody>
        </Card>
      )}
    </div>
  );
}
