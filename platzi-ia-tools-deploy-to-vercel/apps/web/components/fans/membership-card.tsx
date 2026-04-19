import { Badge } from '@/components/ui/badge';
import { Card, CardBody } from '@/components/ui/card';
import { cn } from '@/lib/utils/cn';
import { formatMoney } from '@/lib/utils/money';
import type { Membership } from '@/types';

export interface MembershipCardProps {
  membership: Membership;
  labels: {
    pricePerYear: string;
    cta: string;
    benefits: string;
    mostPopular?: string;
    external: string;
  };
  currencyLocale: string;
  highlighted?: boolean;
}

/**
 * Tarjeta de un plan de membresía. El CTA es un enlace externo con
 * `rel="noopener noreferrer"` y `target="_blank"` — la activación real se
 * delega al portal de socios (no gestionamos identidad en el sitio público).
 */
export function MembershipCard({
  membership,
  labels,
  currencyLocale,
  highlighted = false,
}: MembershipCardProps) {
  return (
    <Card
      className={cn(
        'flex h-full flex-col',
        highlighted && 'border-brand-600 ring-brand-600/20 ring-4',
      )}
    >
      <CardBody className="flex flex-1 flex-col gap-4 p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-brand-950 text-xl font-semibold">{membership.nombre}</h3>
          {highlighted && labels.mostPopular ? (
            <Badge variant="success">{labels.mostPopular}</Badge>
          ) : null}
        </div>
        <p className="text-brand-700 text-sm">{membership.descripcion}</p>
        <p className="text-brand-950 text-3xl font-bold">
          {formatMoney(membership.priceCents, membership.currency, currencyLocale)}
          <span className="text-brand-600 ml-1 text-sm font-normal">/ {labels.pricePerYear}</span>
        </p>
        <div>
          <p className="text-brand-600 mb-2 text-xs font-medium uppercase tracking-wide">
            {labels.benefits}
          </p>
          <ul className="space-y-1.5" role="list">
            {membership.benefits.map((b) => (
              <li key={b} className="text-brand-800 flex gap-2 text-sm">
                <span aria-hidden="true" className="text-brand-600">
                  ✓
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto">
          {membership.externalCheckoutUrl ? (
            <a
              href={membership.externalCheckoutUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${labels.cta} — ${membership.nombre}`}
              className={cn(
                'bg-brand-900 hover:bg-brand-800 inline-flex h-10 w-full items-center justify-center rounded-md px-4 text-sm font-medium text-white transition',
                'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              )}
            >
              {labels.cta}
            </a>
          ) : null}
          <p className="text-brand-500 mt-2 text-xs">{labels.external}</p>
        </div>
      </CardBody>
    </Card>
  );
}
