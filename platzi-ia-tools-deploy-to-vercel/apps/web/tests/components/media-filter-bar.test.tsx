import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MediaFilterBar } from '@/components/editorial/media-filter-bar';

describe('<MediaFilterBar />', () => {
  const OPTIONS = [
    { value: undefined, label: 'Todos' },
    { value: 'resumen', label: 'Resumen' },
    { value: 'rueda_prensa', label: 'Rueda de prensa' },
  ];

  it('marca aria-current en la opción activa', () => {
    const html = renderToStaticMarkup(
      <MediaFilterBar
        basePath="/media/videos"
        paramKey="categoria"
        current="resumen"
        title="Categoría"
        ariaLabel="Filtros"
        options={OPTIONS}
      />,
    );
    expect(html).toMatch(/aria-current="true"[^>]*>Resumen/);
  });

  it('construye hrefs con el query string correcto', () => {
    const html = renderToStaticMarkup(
      <MediaFilterBar
        basePath="/media/videos"
        paramKey="categoria"
        current={undefined}
        title="Categoría"
        ariaLabel="Filtros"
        options={OPTIONS}
      />,
    );
    expect(html).toContain('href="/media/videos"');
    expect(html).toContain('href="/media/videos?categoria=resumen"');
    expect(html).toContain('href="/media/videos?categoria=rueda_prensa"');
  });

  it('aplica la etiqueta aria correctamente', () => {
    const html = renderToStaticMarkup(
      <MediaFilterBar
        basePath="/media/videos"
        paramKey="categoria"
        current={undefined}
        title="Categoría"
        ariaLabel="Filtros de vídeo"
        options={OPTIONS}
      />,
    );
    expect(html).toContain('aria-label="Filtros de vídeo"');
  });
});
