import { sql } from 'drizzle-orm';
import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

/**
 * Páginas institucionales de contenido largo (historia, identidad, estadio,
 * contacto, etc.). Indexadas por `slug` — las rutas del frontend resuelven
 * su slug estático (`club/historia`, `club/identidad`, …).
 *
 * Body es markdown; el renderer del frontend divide por párrafos en `\n\n`.
 */
export const pages = pgTable('pages', {
  id: uuid('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  slug: text('slug').notNull().unique(),
  titulo: text('titulo').notNull(),
  intro: text('intro'),
  body: text('body').notNull(),
  heroUrl: text('hero_url'),
  heroAlt: text('hero_alt'),
  seoDescription: text('seo_description'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type Page = typeof pages.$inferSelect;
export type NewPage = typeof pages.$inferInsert;
