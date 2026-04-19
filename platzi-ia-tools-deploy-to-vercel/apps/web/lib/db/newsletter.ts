import {
  eq,
  newsletterSubscribers,
  sql,
  type NewNewsletterSubscriber,
  type NewsletterSubscriber,
} from '@platzi-fc/db';
import { getDb } from '@/lib/db';

/**
 * Alta (o reactivación) de un email en la newsletter. Idempotente por
 * `email`: si ya existía como `unsubscribed`, lo revive a `pending`.
 * No llama al proveedor externo — esa responsabilidad la asume el Server
 * Action (`/app/actions/newsletter.ts`) que integra con Resend.
 */
export async function upsertSubscriber(input: {
  email: string;
  locale: 'es' | 'en';
  source?: string;
}): Promise<NewsletterSubscriber> {
  const db = getDb();
  const values: NewNewsletterSubscriber = {
    email: input.email,
    locale: input.locale,
    source: input.source ?? null,
    status: 'pending',
  };
  const [row] = await db
    .insert(newsletterSubscribers)
    .values(values)
    .onConflictDoUpdate({
      target: newsletterSubscribers.email,
      set: {
        locale: values.locale,
        source: values.source,
        status: sql`CASE WHEN ${newsletterSubscribers.status} = 'unsubscribed' THEN 'pending' ELSE ${newsletterSubscribers.status} END`,
        unsubscribedAt: sql`CASE WHEN ${newsletterSubscribers.status} = 'unsubscribed' THEN NULL ELSE ${newsletterSubscribers.unsubscribedAt} END`,
      },
    })
    .returning();
  if (!row) throw new Error('upsertSubscriber: no row returned');
  return row;
}

export async function findSubscriberByEmail(email: string): Promise<NewsletterSubscriber | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.email, email))
    .limit(1);
  return row ?? null;
}
