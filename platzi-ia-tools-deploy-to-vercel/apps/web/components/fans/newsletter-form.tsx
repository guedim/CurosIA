'use client';

import { useActionState } from 'react';
import { subscribeNewsletterAction, type NewsletterState } from '@/app/actions/newsletter';
import type { Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';

export interface NewsletterFormProps {
  locale: Locale;
  source?: string;
  labels: {
    emailLabel: string;
    emailPlaceholder: string;
    submit: string;
    successTitle: string;
    successBody: string;
    errorInvalid: string;
    errorRequired: string;
    errorUnknown: string;
    consent: string;
  };
}

const INITIAL: NewsletterState = { status: 'idle' };

export function NewsletterForm({ locale, source = 'fans', labels }: NewsletterFormProps) {
  const [state, formAction, isPending] = useActionState(subscribeNewsletterAction, INITIAL);

  if (state.status === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-card border-brand-600 bg-brand-50 text-brand-900 border p-5 text-sm"
      >
        <p className="font-semibold">{labels.successTitle}</p>
        <p className="mt-1">{labels.successBody}</p>
      </div>
    );
  }

  const errorMessage =
    state.status === 'error'
      ? state.code === 'invalid'
        ? labels.errorInvalid
        : state.code === 'required'
          ? labels.errorRequired
          : labels.errorUnknown
      : null;

  return (
    <form action={formAction} className="flex flex-col gap-3" noValidate>
      <input type="hidden" name="locale" value={locale} />
      <input type="hidden" name="source" value={source} />
      <div className="flex flex-col gap-1">
        <label htmlFor="newsletter-email" className="text-brand-800 text-sm font-medium">
          {labels.emailLabel}
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder={labels.emailPlaceholder}
            aria-invalid={errorMessage ? 'true' : undefined}
            aria-describedby={errorMessage ? 'newsletter-error' : 'newsletter-consent'}
            className={cn(
              'flex-1 rounded-md border bg-white px-3 py-2 text-sm',
              'focus:border-brand-400 focus:ring-brand-400/30 focus:outline-none focus:ring-2',
              errorMessage ? 'border-red-400' : 'border-brand-200',
            )}
          />
          <button
            type="submit"
            disabled={isPending}
            className={cn(
              'bg-brand-900 hover:bg-brand-800 inline-flex h-10 items-center justify-center rounded-md px-5 text-sm font-medium text-white transition',
              'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
              isPending && 'cursor-wait opacity-70',
            )}
          >
            {labels.submit}
          </button>
        </div>
      </div>
      {errorMessage ? (
        <p id="newsletter-error" role="alert" className="text-sm text-red-700">
          {errorMessage}
        </p>
      ) : (
        <p id="newsletter-consent" className="text-brand-600 text-xs">
          {labels.consent}
        </p>
      )}
    </form>
  );
}
