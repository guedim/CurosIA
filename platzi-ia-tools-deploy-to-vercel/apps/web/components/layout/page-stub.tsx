import type { ReactNode } from 'react';

export interface PageStubProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

/**
 * Placeholder para páginas en construcción.
 * Se reemplaza en sprints posteriores con contenido real.
 */
export function PageStub({ title, description, children }: PageStubProps) {
  return (
    <section className="space-y-4">
      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">{title}</h1>
        {description ? <p className="text-brand-700 mt-2">{description}</p> : null}
      </header>
      <div className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-sm">
        {children ?? (
          <p>
            Página en construcción. Se implementará en un sprint posterior del plan de ejecución.
          </p>
        )}
      </div>
    </section>
  );
}
