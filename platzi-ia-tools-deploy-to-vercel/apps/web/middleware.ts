import { NextResponse, type NextRequest } from 'next/server';
import {
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  isLocale,
  pickLocaleFromAcceptLanguage,
} from '@/lib/i18n/config';

/**
 * Middleware compartido para el sitio. Dos responsabilidades hoy:
 *
 *   1) Persistencia de los selectores de `/partidos` (`season` / `competition`).
 *      Si la URL no los trae pero hay cookie, redirige a la misma URL con los
 *      parámetros rellenos para que la navegación compartible refleje el estado.
 *
 *   2) Detección de locale en la primera visita. Si aún no hay cookie
 *      `pfc_locale`, se siembra desde `Accept-Language` (o del default `es`)
 *      para que los layouts del lado servidor puedan resolverlo en la primera
 *      petición renderizada — no sólo a partir del segundo pageview.
 *
 * `lado` y `estado` NO se persisten a propósito: son filtros contextuales que
 * cambian mucho y no representan una preferencia duradera.
 */
const PARTIDOS_PARAMS = ['season', 'competition'] as const;
const PARTIDOS_COOKIE_PREFIX = 'pfc_partidos_';
const PARTIDOS_COOKIE_MAX_AGE = 60 * 60 * 24 * 180;

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const partidosRedirect = maybeRedirectPartidos(request);
  if (partidosRedirect) return partidosRedirect;

  const response = NextResponse.next();

  if (pathname === '/partidos') {
    for (const param of PARTIDOS_PARAMS) {
      const name = `${PARTIDOS_COOKIE_PREFIX}${param}`;
      const value = searchParams.get(param);
      if (value) {
        response.cookies.set(name, value, {
          path: '/',
          maxAge: PARTIDOS_COOKIE_MAX_AGE,
          sameSite: 'lax',
        });
      } else if (request.cookies.has(name)) {
        response.cookies.delete(name);
      }
    }
  }

  if (!request.cookies.has(LOCALE_COOKIE)) {
    const detected =
      pickLocaleFromAcceptLanguage(request.headers.get('accept-language')) ?? DEFAULT_LOCALE;
    response.cookies.set(LOCALE_COOKIE, detected, {
      path: '/',
      maxAge: LOCALE_COOKIE_MAX_AGE,
      sameSite: 'lax',
    });
  } else {
    const current = request.cookies.get(LOCALE_COOKIE)?.value;
    if (!isLocale(current)) {
      response.cookies.set(LOCALE_COOKIE, DEFAULT_LOCALE, {
        path: '/',
        maxAge: LOCALE_COOKIE_MAX_AGE,
        sameSite: 'lax',
      });
    }
  }

  return response;
}

function maybeRedirectPartidos(request: NextRequest): NextResponse | null {
  if (request.nextUrl.pathname !== '/partidos') return null;

  const url = request.nextUrl.clone();
  let mutated = false;
  for (const param of PARTIDOS_PARAMS) {
    if (url.searchParams.has(param)) continue;
    const cookie = request.cookies.get(`${PARTIDOS_COOKIE_PREFIX}${param}`)?.value;
    if (cookie) {
      url.searchParams.set(param, cookie);
      mutated = true;
    }
  }
  return mutated ? NextResponse.redirect(url) : null;
}

export const config = {
  matcher: [
    /**
     * Excluye assets estáticos y rutas internas para que el middleware sólo
     * corra en documentos HTML y endpoints de la app.
     */
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)',
  ],
};
