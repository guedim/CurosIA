'use server';

import { upsertSubscriber } from '@/lib/db/newsletter';
import { DEFAULT_LOCALE, isLocale } from '@/lib/i18n/config';

export type NewsletterState =
  | { status: 'idle' }
  | { status: 'success' }
  | { status: 'error'; code: 'invalid' | 'required' | 'unknown' };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Alta en la newsletter. Usa `useActionState` en el cliente y devuelve el
 * estado actualizado. La integración con Resend es opcional (env
 * `RESEND_API_KEY` + `RESEND_AUDIENCE_ID`): si está configurada, añadimos el
 * contacto al audience. Si no, sólo persistimos en la tabla local.
 *
 * Esta acción intencionadamente no confirma el email todavía — el doble
 * opt-in queda para una iteración posterior cuando exista el endpoint de
 * confirmación.
 */
export async function subscribeNewsletterAction(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const rawEmail = formData.get('email');
  const rawLocale = formData.get('locale');
  const rawSource = formData.get('source');

  const email = typeof rawEmail === 'string' ? rawEmail.trim().toLowerCase() : '';
  const locale = isLocale(rawLocale) ? rawLocale : DEFAULT_LOCALE;
  const source = typeof rawSource === 'string' && rawSource ? rawSource : undefined;

  if (!email) return { status: 'error', code: 'required' };
  if (!EMAIL_RE.test(email)) return { status: 'error', code: 'invalid' };

  try {
    await upsertSubscriber({ email, locale, source });
    await forwardToResend({ email, locale });
    return { status: 'success' };
  } catch (err) {
    console.error('[newsletter] subscribe failed', err);
    return { status: 'error', code: 'unknown' };
  }
}

async function forwardToResend({ email, locale }: { email: string; locale: 'es' | 'en' }) {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) return;

  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, unsubscribed: false }),
  });

  if (!res.ok && res.status !== 409) {
    const body = await res.text();
    throw new Error(`Resend ${res.status}: ${body}`);
  }

  void locale;
}
