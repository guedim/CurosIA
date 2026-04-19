import { MarkdownBody } from './markdown-body';
import type { Page } from '@/types';

export interface PageContentProps {
  page: Page;
}

/**
 * Renderer compartido por las páginas institucionales (`/club/*`). Muestra
 * hero opcional, título, intro y body markdown. El contenido vive en la
 * tabla `pages` indexada por slug (p. ej. `club/historia`).
 */
export function PageContent({ page }: PageContentProps) {
  return (
    <article className="space-y-6">
      {page.heroUrl ? (
        <figure className="rounded-card overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={page.heroUrl}
            alt={page.heroAlt ?? ''}
            className="aspect-[21/9] w-full object-cover"
          />
        </figure>
      ) : null}

      <header className="border-brand-100 space-y-3 border-b pb-6">
        <h1 className="text-brand-950 text-3xl font-bold sm:text-4xl">{page.titulo}</h1>
        {page.intro ? <p className="text-brand-700 text-lg">{page.intro}</p> : null}
      </header>

      <MarkdownBody body={page.body} className="max-w-3xl" />
    </article>
  );
}
