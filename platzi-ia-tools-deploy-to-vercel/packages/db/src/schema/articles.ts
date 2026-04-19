import { sql } from 'drizzle-orm';
import { boolean, check, index, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export type ArticleCategoria = 'club' | 'equipo' | 'academia' | 'femenino' | 'comunidad' | 'tienda';
export type ArticleEstado = 'borrador' | 'publicado';

export const ARTICLE_CATEGORIAS: readonly ArticleCategoria[] = [
  'club',
  'equipo',
  'academia',
  'femenino',
  'comunidad',
  'tienda',
] as const;

/**
 * Artículos editoriales: noticias y comunicados oficiales. Los comunicados
 * usan el flag `oficial` para separarlos en la UI (`/noticias/comunicados`),
 * pero comparten tabla porque los campos base son idénticos.
 *
 * `body` se almacena como markdown simple para evitar dependencias de CMS.
 * El renderer del frontend divide por párrafos en `\n\n`.
 */
export const articles = pgTable(
  'articles',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slug: text('slug').notNull().unique(),
    titulo: text('titulo').notNull(),
    excerpt: text('excerpt').notNull(),
    body: text('body').notNull(),
    coverUrl: text('cover_url'),
    coverAlt: text('cover_alt'),
    categoria: text('categoria').$type<ArticleCategoria>().notNull(),
    tags: jsonb('tags')
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    autor: text('autor'),
    oficial: boolean('oficial').notNull().default(false),
    destacado: boolean('destacado').notNull().default(false),
    estado: text('estado').$type<ArticleEstado>().notNull().default('publicado'),
    publishedAt: timestamp('published_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    categoriaIdx: index('articles_categoria_idx').on(t.categoria),
    estadoIdx: index('articles_estado_idx').on(t.estado),
    publishedIdx: index('articles_published_idx').on(t.publishedAt),
    oficialIdx: index('articles_oficial_idx').on(t.oficial),
    categoriaCheck: check(
      'articles_categoria_check',
      sql`${t.categoria} IN ('club', 'equipo', 'academia', 'femenino', 'comunidad', 'tienda')`,
    ),
    estadoCheck: check('articles_estado_check', sql`${t.estado} IN ('borrador', 'publicado')`),
  }),
);

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
