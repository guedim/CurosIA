import { describe, expect, it, vi } from 'vitest';

const nextRedirect = vi.fn();
const nextNext = vi.fn();

vi.mock('next/server', () => ({
  NextResponse: {
    redirect: (url: URL) => {
      nextRedirect(url.toString());
      return { kind: 'redirect', url } as const;
    },
    next: () => {
      nextNext();
      const cookies = new Map<string, { value: string; options?: unknown } | null>();
      return {
        kind: 'next' as const,
        cookies: {
          set: (name: string, value: string, options?: unknown) => {
            cookies.set(name, { value, options });
          },
          delete: (name: string) => {
            cookies.set(name, null);
          },
          _snapshot: () => cookies,
        },
      };
    },
  },
}));

import { middleware } from '@/middleware';

type RequestCookies = Record<string, string>;

function makeRequest({
  pathname,
  params = {},
  cookies = {},
  acceptLanguage,
}: {
  pathname: string;
  params?: Record<string, string>;
  cookies?: RequestCookies;
  acceptLanguage?: string;
}) {
  const url = new URL(`https://example.test${pathname}`);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const headers = new Map<string, string>();
  if (acceptLanguage) headers.set('accept-language', acceptLanguage);
  return {
    nextUrl: {
      pathname: url.pathname,
      searchParams: url.searchParams,
      clone: () => new URL(url.toString()),
    },
    cookies: {
      get: (name: string) => (cookies[name] != null ? { value: cookies[name] } : undefined),
      has: (name: string) => Object.hasOwn(cookies, name),
    },
    headers: {
      get: (name: string) => headers.get(name.toLowerCase()) ?? null,
    },
  } as never;
}

type NextOutcome = {
  kind: 'next';
  cookies: { _snapshot: () => Map<string, { value: string } | null> };
};

function runNext(...args: Parameters<typeof makeRequest>): NextOutcome {
  return middleware(makeRequest(...args)) as unknown as NextOutcome;
}

describe('middleware', () => {
  describe('partidos persistence', () => {
    it('pasa a través si la ruta no es /partidos', () => {
      nextRedirect.mockClear();
      nextNext.mockClear();
      runNext({ pathname: '/noticias', cookies: { pfc_locale: 'es' } });
      expect(nextNext).toHaveBeenCalledOnce();
      expect(nextRedirect).not.toHaveBeenCalled();
    });

    it('redirige rellenando params desde cookies cuando faltan', () => {
      nextRedirect.mockClear();
      const res = middleware(
        makeRequest({
          pathname: '/partidos',
          cookies: {
            pfc_partidos_season: '2025-2026',
            pfc_partidos_competition: 'liga',
          },
        }),
      ) as unknown as { kind: 'redirect'; url: URL };
      expect(res.kind).toBe('redirect');
      expect(res.url.searchParams.get('season')).toBe('2025-2026');
      expect(res.url.searchParams.get('competition')).toBe('liga');
    });

    it('no redirige si la URL ya trae los params aunque haya cookie', () => {
      nextRedirect.mockClear();
      const res = runNext({
        pathname: '/partidos',
        params: { season: '2025-2026', competition: 'liga' },
        cookies: {
          pfc_partidos_season: 'otra',
          pfc_partidos_competition: 'otra',
          pfc_locale: 'es',
        },
      });
      expect(res.kind).toBe('next');
      expect(nextRedirect).not.toHaveBeenCalled();
    });

    it('persiste cookies de partidos cuando la URL trae params', () => {
      const res = runNext({
        pathname: '/partidos',
        params: { season: '2025-2026' },
        cookies: { pfc_locale: 'es' },
      });
      const snap = res.cookies._snapshot();
      expect(snap.get('pfc_partidos_season')).toMatchObject({ value: '2025-2026' });
    });
  });

  describe('locale detection', () => {
    it('siembra cookie pfc_locale con Accept-Language cuando no existe', () => {
      const res = runNext({
        pathname: '/',
        acceptLanguage: 'en-US,en;q=0.9,es;q=0.8',
      });
      const snap = res.cookies._snapshot();
      expect(snap.get('pfc_locale')).toMatchObject({ value: 'en' });
    });

    it('cae al default es si Accept-Language no coincide con ningún locale soportado', () => {
      const res = runNext({
        pathname: '/',
        acceptLanguage: 'ja-JP,ja;q=0.9',
      });
      const snap = res.cookies._snapshot();
      expect(snap.get('pfc_locale')).toMatchObject({ value: 'es' });
    });

    it('respeta la cookie existente si es un locale válido', () => {
      const res = runNext({
        pathname: '/',
        cookies: { pfc_locale: 'en' },
        acceptLanguage: 'es-ES,es;q=0.9',
      });
      const snap = res.cookies._snapshot();
      expect(snap.get('pfc_locale')).toBeUndefined();
    });

    it('repara la cookie si trae un valor no soportado', () => {
      const res = runNext({
        pathname: '/',
        cookies: { pfc_locale: 'zz' },
      });
      const snap = res.cookies._snapshot();
      expect(snap.get('pfc_locale')).toMatchObject({ value: 'es' });
    });
  });
});
