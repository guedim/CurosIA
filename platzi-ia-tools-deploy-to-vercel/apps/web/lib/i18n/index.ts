import { cookies } from 'next/headers';
import { DEFAULT_LOCALE, LOCALE_COOKIE, isLocale, type Locale } from './config';
import { es, type Dictionary } from './dictionaries/es';
import { en } from './dictionaries/en';

const DICTIONARIES: Record<Locale, Dictionary> = { es, en };

/**
 * Resuelve el locale actual desde la cookie `pfc_locale`. Se usa en layouts y
 * componentes Server. Leer cookies convierte la ruta en dinámica: es un
 * trade-off asumido para V1 (ver `lib/i18n/config.ts`).
 */
export async function getLocale(): Promise<Locale> {
  const store = await cookies();
  const raw = store.get(LOCALE_COOKIE)?.value;
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}

export async function getT(): Promise<{ locale: Locale; dict: Dictionary }> {
  const locale = await getLocale();
  return { locale, dict: getDictionary(locale) };
}

export type { Dictionary, Locale };
export {
  LOCALES,
  DEFAULT_LOCALE,
  LOCALE_COOKIE,
  LOCALE_COOKIE_MAX_AGE,
  isLocale,
  pickLocaleFromAcceptLanguage,
} from './config';
