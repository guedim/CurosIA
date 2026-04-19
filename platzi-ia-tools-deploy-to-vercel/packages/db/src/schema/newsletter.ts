import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export type NewsletterStatus = 'pending' | 'confirmed' | 'unsubscribed';

/**
 * Opt-in de newsletter. Almacena sólo email + locale + estado; el envío real
 * se delega a Resend (broadcast / audience) vía el Server Action. Doble opt-in
 * (pending → confirmed) queda para una iteración posterior cuando exista el
 * endpoint de confirmación.
 */
export const newsletterSubscribers = pgTable(
  'newsletter_subscribers',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: text('email').notNull().unique(),
    locale: text('locale').notNull().default('es'),
    status: text('status').$type<NewsletterStatus>().notNull().default('pending'),
    source: text('source'),
    subscribedAt: timestamp('subscribed_at', { withTimezone: true }).notNull().defaultNow(),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
  },
  (t) => ({
    statusIdx: index('newsletter_subscribers_status_idx').on(t.status),
    statusCheck: check(
      'newsletter_subscribers_status_check',
      sql`${t.status} IN ('pending', 'confirmed', 'unsubscribed')`,
    ),
    localeCheck: check('newsletter_subscribers_locale_check', sql`${t.locale} IN ('es', 'en')`),
  }),
);

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type NewNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;
