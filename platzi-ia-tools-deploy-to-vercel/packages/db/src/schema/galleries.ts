import { sql } from 'drizzle-orm';
import { index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { matches } from './matches';

export type GalleryImage = {
  url: string;
  alt: string;
  credito?: string;
};

export const galleries = pgTable(
  'galleries',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slug: text('slug').notNull().unique(),
    titulo: text('titulo').notNull(),
    descripcion: text('descripcion'),
    coverUrl: text('cover_url'),
    images: jsonb('images')
      .$type<GalleryImage[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    matchId: uuid('match_id').references(() => matches.id, { onDelete: 'set null' }),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    publishedIdx: index('galleries_published_idx').on(t.publishedAt),
    matchIdx: index('galleries_match_idx').on(t.matchId),
  }),
);

export type Gallery = typeof galleries.$inferSelect;
export type NewGallery = typeof galleries.$inferInsert;
