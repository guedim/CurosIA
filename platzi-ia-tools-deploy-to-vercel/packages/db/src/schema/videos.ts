import { sql } from 'drizzle-orm';
import { check, index, integer, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { matches } from './matches';

export type VideoPlataforma = 'youtube' | 'vimeo' | 'nativo';
export type VideoCategoria = 'resumen' | 'rueda_prensa' | 'entrevista' | 'cantera' | 'comunidad';

export const videos = pgTable(
  'videos',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slug: text('slug').notNull().unique(),
    titulo: text('titulo').notNull(),
    descripcion: text('descripcion'),
    coverUrl: text('cover_url'),
    embedUrl: text('embed_url').notNull(),
    plataforma: text('plataforma').$type<VideoPlataforma>().notNull(),
    duracionSeg: integer('duracion_seg'),
    categoria: text('categoria').$type<VideoCategoria>().notNull(),
    matchId: uuid('match_id').references(() => matches.id, { onDelete: 'set null' }),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    categoriaIdx: index('videos_categoria_idx').on(t.categoria),
    publishedIdx: index('videos_published_idx').on(t.publishedAt),
    matchIdx: index('videos_match_idx').on(t.matchId),
    plataformaCheck: check(
      'videos_plataforma_check',
      sql`${t.plataforma} IN ('youtube', 'vimeo', 'nativo')`,
    ),
    categoriaCheck: check(
      'videos_categoria_check',
      sql`${t.categoria} IN ('resumen', 'rueda_prensa', 'entrevista', 'cantera', 'comunidad')`,
    ),
    duracionCheck: check(
      'videos_duracion_check',
      sql`${t.duracionSeg} IS NULL OR ${t.duracionSeg} > 0`,
    ),
  }),
);

export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;
