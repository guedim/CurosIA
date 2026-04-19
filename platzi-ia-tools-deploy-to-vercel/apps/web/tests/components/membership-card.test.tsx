import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MembershipCard } from '@/components/fans/membership-card';
import type { Membership } from '@/types';

const LABELS = {
  pricePerYear: 'al año',
  cta: 'Quiero este plan',
  benefits: 'Beneficios',
  mostPopular: 'Más popular',
  external: 'Continúa en el portal',
};

function makeMembership(overrides: Partial<Membership> = {}): Membership {
  const now = new Date('2026-04-10T00:00:00.000Z');
  return {
    id: 'm-1',
    slug: 'socio-anual',
    tier: 'socio',
    nombre: 'Socio',
    descripcion: 'Plan clásico',
    priceCents: 6900,
    currency: 'EUR',
    benefits: ['Preventa de entradas', 'Carnet físico'],
    heroUrl: null,
    externalCheckoutUrl: 'https://ext/join',
    orden: 2,
    activo: true,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('<MembershipCard />', () => {
  it('renderiza nombre, precio formateado y beneficios', () => {
    const html = renderToStaticMarkup(
      <MembershipCard membership={makeMembership()} labels={LABELS} currencyLocale="es-ES" />,
    );
    expect(html).toContain('Socio');
    expect(html).toContain('Plan clásico');
    expect(html).toContain('Preventa de entradas');
    expect(html).toContain('Carnet físico');
    expect(html).toContain('al año');
    expect(html).toMatch(/69[,.]00/);
  });

  it('añade el badge "más popular" cuando se resalta', () => {
    const html = renderToStaticMarkup(
      <MembershipCard
        membership={makeMembership()}
        labels={LABELS}
        currencyLocale="es-ES"
        highlighted
      />,
    );
    expect(html).toContain('Más popular');
  });

  it('no añade el badge si no se resalta', () => {
    const html = renderToStaticMarkup(
      <MembershipCard membership={makeMembership()} labels={LABELS} currencyLocale="es-ES" />,
    );
    expect(html).not.toContain('Más popular');
  });

  it('abre el CTA externo en nueva pestaña con rel seguro', () => {
    const html = renderToStaticMarkup(
      <MembershipCard membership={makeMembership()} labels={LABELS} currencyLocale="es-ES" />,
    );
    expect(html).toContain('href="https://ext/join"');
    expect(html).toContain('target="_blank"');
    expect(html).toContain('rel="noopener noreferrer"');
  });

  it('no renderiza CTA si la membresía no tiene url externa', () => {
    const html = renderToStaticMarkup(
      <MembershipCard
        membership={makeMembership({ externalCheckoutUrl: null })}
        labels={LABELS}
        currencyLocale="es-ES"
      />,
    );
    expect(html).not.toContain('href="https://ext/join"');
    expect(html).not.toContain('target="_blank"');
  });
});
