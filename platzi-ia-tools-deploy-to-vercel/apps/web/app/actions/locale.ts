'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import { DEFAULT_LOCALE, LOCALE_COOKIE, LOCALE_COOKIE_MAX_AGE, isLocale } from '@/lib/i18n/config';

/**
 * Server Action invocada por `<LanguageSwitcher>`. Persiste el locale elegido
 * en la cookie `pfc_locale` y revalida `/` para que el layout redibuje con el
 * nuevo diccionario sin tener que hacer un full reload desde el cliente.
 */
export async function setLocaleAction(formData: FormData): Promise<void> {
  const raw = formData.get('locale');
  const locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const store = await cookies();
  store.set(LOCALE_COOKIE, locale, {
    path: '/',
    maxAge: LOCALE_COOKIE_MAX_AGE,
    sameSite: 'lax',
  });
  revalidatePath('/', 'layout');
}
