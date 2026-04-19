import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export type SponsorTier = 'principal' | 'premium' | 'partner';

export const SPONSOR_TIERS: readonly SponsorTier[] = ['principal', 'premium', 'partner'] as const;

/**
 * Patrocinadores del club, agrupados por `tier` para renderizado jerárquico
 * en el footer y en la landing `/sponsors`. `orden` permite control editorial
 * dentro de cada tier.
 */
export const sponsors = pgTable(
  'sponsors',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slug: text('slug').notNull().unique(),
    nombre: text('nombre').notNull(),
    tier: text('tier').$type<SponsorTier>().notNull(),
    logoUrl: text('logo_url'),
    url: text('url'),
    descripcion: text('descripcion'),
    orden: integer('orden').notNull().default(0),
    activo: boolean('activo').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tierIdx: index('sponsors_tier_idx').on(t.tier),
    activoIdx: index('sponsors_activo_idx').on(t.activo),
    tierCheck: check('sponsors_tier_check', sql`${t.tier} IN ('principal', 'premium', 'partner')`),
  }),
);

export type Sponsor = typeof sponsors.$inferSelect;
export type NewSponsor = typeof sponsors.$inferInsert;
