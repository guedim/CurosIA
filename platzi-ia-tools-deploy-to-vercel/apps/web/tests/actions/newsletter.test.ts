import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const upsertSubscriber = vi.fn();

vi.mock('@/lib/db/newsletter', () => ({
  upsertSubscriber: (...args: unknown[]) => upsertSubscriber(...args),
}));

const fetchMock = vi.fn();
vi.stubGlobal('fetch', fetchMock);

import { subscribeNewsletterAction, type NewsletterState } from '@/app/actions/newsletter';

const IDLE: NewsletterState = { status: 'idle' };

function fd(entries: Record<string, string>): FormData {
  const form = new FormData();
  for (const [k, v] of Object.entries(entries)) form.append(k, v);
  return form;
}

beforeEach(() => {
  upsertSubscriber.mockReset();
  upsertSubscriber.mockResolvedValue({ id: 'u-1' });
  fetchMock.mockReset();
  delete process.env.RESEND_API_KEY;
  delete process.env.RESEND_AUDIENCE_ID;
});

afterEach(() => {
  vi.useRealTimers();
});

describe('subscribeNewsletterAction', () => {
  it('exige email', async () => {
    const result = await subscribeNewsletterAction(IDLE, fd({ email: '   ' }));
    expect(result).toEqual({ status: 'error', code: 'required' });
    expect(upsertSubscriber).not.toHaveBeenCalled();
  });

  it('rechaza emails con formato inválido', async () => {
    const result = await subscribeNewsletterAction(IDLE, fd({ email: 'no-at-symbol' }));
    expect(result).toEqual({ status: 'error', code: 'invalid' });
    expect(upsertSubscriber).not.toHaveBeenCalled();
  });

  it('persiste y devuelve success cuando el email es válido', async () => {
    const result = await subscribeNewsletterAction(
      IDLE,
      fd({ email: 'Fan@PLATZIFC.com', locale: 'en', source: 'footer' }),
    );
    expect(result).toEqual({ status: 'success' });
    expect(upsertSubscriber).toHaveBeenCalledWith({
      email: 'fan@platzifc.com',
      locale: 'en',
      source: 'footer',
    });
  });

  it('cae a locale por defecto cuando no es soportado', async () => {
    await subscribeNewsletterAction(IDLE, fd({ email: 'f@p.es', locale: 'fr' }));
    expect(upsertSubscriber).toHaveBeenCalledWith(expect.objectContaining({ locale: 'es' }));
  });

  it('propaga al audience de Resend si las env vars están presentes', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.RESEND_AUDIENCE_ID = 'aud-1';
    fetchMock.mockResolvedValue({ ok: true, status: 201, text: async () => '' });

    const result = await subscribeNewsletterAction(IDLE, fd({ email: 'f@p.es' }));
    expect(result).toEqual({ status: 'success' });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/audiences/aud-1/contacts');
    expect(init.method).toBe('POST');
    const body = JSON.parse(init.body as string) as { email: string; unsubscribed: boolean };
    expect(body.email).toBe('f@p.es');
    expect(body.unsubscribed).toBe(false);
  });

  it('no llama a Resend si faltan envs', async () => {
    await subscribeNewsletterAction(IDLE, fd({ email: 'f@p.es' }));
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('devuelve error unknown si la DB falla', async () => {
    upsertSubscriber.mockRejectedValue(new Error('boom'));
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const result = await subscribeNewsletterAction(IDLE, fd({ email: 'f@p.es' }));
    expect(result).toEqual({ status: 'error', code: 'unknown' });
    spy.mockRestore();
  });

  it('trata 409 del audience como OK (ya existe)', async () => {
    process.env.RESEND_API_KEY = 'test-key';
    process.env.RESEND_AUDIENCE_ID = 'aud-1';
    fetchMock.mockResolvedValue({ ok: false, status: 409, text: async () => 'conflict' });
    const result = await subscribeNewsletterAction(IDLE, fd({ email: 'f@p.es' }));
    expect(result).toEqual({ status: 'success' });
  });
});
