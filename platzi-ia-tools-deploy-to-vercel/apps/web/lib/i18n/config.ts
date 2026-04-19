/**
 * Configuración central de i18n. Mantener esta lista y el tipo sincronizados;
 * todo el resto del sistema deriva de aquí.
 *
 * Sobre la estrategia de URLs: la V1 del sitio usa persistencia por cookie
 * (`pfc_locale`) en lugar de segmentos `app/[lang]/…`, para no refactorizar las
 * ~45 páginas y `<Link>` existentes. Esto implica que las rutas que consuman
 * traducciones se vuelven dinámicas (layout lee cookies). El enfoque URL-based
 * con `hreflang` por locale queda marcado como seguimiento para V2.
 */
export const LOCALES = ['es', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = 'es';
export const LOCALE_COOKIE = 'pfc_locale';
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (LOCALES as readonly string[]).includes(value);
}

/**
 * Parsea el header `Accept-Language` y devuelve el primer locale soportado.
 * Formato esperado: `es-ES,es;q=0.9,en;q=0.8`.
 */
export function pickLocaleFromAcceptLanguage(header: string | null): Locale | null {
  if (!header) return null;
  const candidates = header
    .split(',')
    .map((chunk) => {
      const [rawTag = '', ...params] = chunk.trim().split(';');
      const qParam = params.find((p) => p.trim().startsWith('q='));
      const q = qParam ? Number.parseFloat(qParam.trim().slice(2)) : 1;
      return { tag: rawTag.trim().toLowerCase(), q: Number.isFinite(q) ? q : 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { tag } of candidates) {
    const [primary] = tag.split('-');
    if (isLocale(primary)) return primary;
  }
  return null;
}
