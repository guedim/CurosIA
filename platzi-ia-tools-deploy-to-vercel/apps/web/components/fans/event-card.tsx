import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { formatDate, formatTime } from '@/lib/utils/date';
import type { CommunityEvent, CommunityEventTipo } from '@/types';

export interface EventCardProps {
  event: CommunityEvent;
  typeLabels: Record<CommunityEventTipo, string>;
  labels: {
    rsvp: string;
    openDoors: string;
    location: string;
    startsAt: string;
    detailCta: string;
  };
  dateLocale: string;
  className?: string;
}

export function EventCard({ event, typeLabels, labels, dateLocale, className }: EventCardProps) {
  return (
    <Card className={cn('flex h-full flex-col', className)}>
      {event.coverUrl ? (
        <div className="bg-brand-100 relative aspect-[16/9]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.coverUrl}
            alt={event.coverAlt ?? ''}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <CardBody className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="default">{typeLabels[event.tipo]}</Badge>
          {event.requiereInscripcion ? (
            <span className="text-brand-600 text-xs uppercase tracking-wide">{labels.rsvp}</span>
          ) : (
            <span className="text-brand-500 text-xs uppercase tracking-wide">
              {labels.openDoors}
            </span>
          )}
        </div>
        <h3 className="text-brand-950 text-lg font-semibold">{event.titulo}</h3>
        <p className="text-brand-700 line-clamp-3 text-sm">{event.descripcion}</p>
        <dl className="text-brand-700 mt-auto grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs">
          <dt className="text-brand-500 uppercase tracking-wide">{labels.startsAt}</dt>
          <dd>
            <time dateTime={event.startsAt.toISOString()}>
              {formatDate(event.startsAt, dateLocale)} · {formatTime(event.startsAt, dateLocale)}
            </time>
          </dd>
          <dt className="text-brand-500 uppercase tracking-wide">{labels.location}</dt>
          <dd>{event.location}</dd>
        </dl>
        <Link
          href={`/fans/eventos/${event.slug}`}
          className="text-brand-700 inline-flex items-center text-sm font-medium hover:underline"
        >
          {labels.detailCta} →
        </Link>
      </CardBody>
    </Card>
  );
}
