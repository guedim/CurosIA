import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { EventFilterBar } from '@/components/fans/event-filter-bar';

const LABELS = {
  filtersLabel: 'Filtros',
  scopeTitle: 'Ámbito',
  typeTitle: 'Tipo',
  upcoming: 'Próximos',
  past: 'Pasados',
  all: 'Todos',
  typeAll: 'Todos los tipos',
  typeLabels: {
    puertas_abiertas: 'Puertas abiertas',
    firma_autografos: 'Firmas',
    clinic: 'Clinic',
    solidario: 'Solidario',
    encuentro_aficion: 'Encuentro',
  },
} as const;

describe('<EventFilterBar />', () => {
  it('marca el scope activo con aria-current', () => {
    const html = renderToStaticMarkup(
      <EventFilterBar basePath="/fans/eventos" currentScope="past" labels={LABELS} />,
    );
    expect(html).toMatch(/aria-current="true"[^>]*>Pasados/);
    expect(html).not.toMatch(/aria-current="true"[^>]*>Próximos/);
  });

  it('mantiene el filtro de tipo al cambiar de scope', () => {
    const html = renderToStaticMarkup(
      <EventFilterBar
        basePath="/fans/eventos"
        currentScope="upcoming"
        currentTipo="clinic"
        labels={LABELS}
      />,
    );
    expect(html).toContain('href="/fans/eventos?tipo=clinic&amp;scope=past"');
    expect(html).toContain('href="/fans/eventos?tipo=clinic"');
  });

  it('mantiene el scope no-default al cambiar de tipo', () => {
    const html = renderToStaticMarkup(
      <EventFilterBar basePath="/fans/eventos" currentScope="past" labels={LABELS} />,
    );
    expect(html).toContain('href="/fans/eventos?scope=past&amp;tipo=clinic"');
    expect(html).toContain('href="/fans/eventos?scope=past"');
  });

  it('el enlace "todos los tipos" es la ruta base cuando scope es upcoming', () => {
    const html = renderToStaticMarkup(
      <EventFilterBar
        basePath="/fans/eventos"
        currentScope="upcoming"
        currentTipo="clinic"
        labels={LABELS}
      />,
    );
    expect(html).toMatch(/href="\/fans\/eventos"[^>]*>Todos los tipos/);
  });
});
