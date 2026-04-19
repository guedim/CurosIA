import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export type MembershipTier = 'fan' | 'socio' | 'premium' | 'legend';

export const MEMBERSHIP_TIERS: readonly MembershipTier[] = [
  'fan',
  'socio',
  'premium',
  'legend',
] as const;

/**
 * Niveles de membresía del club. Es un master de tiers (no perfiles de
 * usuario): la tabla describe qué incluye cada nivel. La activación real se
 * delega a un CRM externo vía `externalCheckoutUrl` (CTA externa).
 */
export const memberships = pgTable(
  'memberships',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slug: text('slug').notNull().unique(),
    tier: text('tier').$type<MembershipTier>().notNull(),
    nombre: text('nombre').notNull(),
    descripcion: text('descripcion').notNull(),
    priceCents: integer('price_cents').notNull(),
    currency: text('currency').notNull().default('EUR'),
    benefits: jsonb('benefits')
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    heroUrl: text('hero_url'),
    externalCheckoutUrl: text('external_checkout_url'),
    orden: integer('orden').notNull().default(0),
    activo: boolean('activo').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tierIdx: index('memberships_tier_idx').on(t.tier),
    activoIdx: index('memberships_activo_idx').on(t.activo),
    tierCheck: check(
      'memberships_tier_check',
      sql`${t.tier} IN ('fan', 'socio', 'premium', 'legend')`,
    ),
    priceCheck: check('memberships_price_check', sql`${t.priceCents} >= 0`),
  }),
);

export type Membership = typeof memberships.$inferSelect;
export type NewMembership = typeof memberships.$inferInsert;
