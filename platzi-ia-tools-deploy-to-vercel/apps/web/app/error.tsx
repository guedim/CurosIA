'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // TODO: enviar a servicio de observabilidad (Sentry / Axiom) en sprint posterior.
    console.error(error);
  }, [error]);

  return (
    <section className="mx-auto max-w-xl py-16 text-center">
      <p className="text-sm font-semibold uppercase tracking-wide text-red-600">Error</p>
      <h1 className="text-brand-950 mt-2 text-4xl font-bold">Algo ha salido mal</h1>
      <p className="text-brand-700 mt-3">
        Estamos trabajando para resolverlo. Intenta de nuevo o vuelve más tarde.
      </p>
      {error.digest ? (
        <p className="text-brand-500 mt-2 text-xs">
          Código de referencia: <code>{error.digest}</code>
        </p>
      ) : null}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={reset}
          className="bg-brand-600 hover:bg-brand-700 focus-visible:ring-brand-500 inline-flex h-10 items-center rounded-md px-4 text-sm font-medium text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        >
          Reintentar
        </button>
      </div>
    </section>
  );
}
