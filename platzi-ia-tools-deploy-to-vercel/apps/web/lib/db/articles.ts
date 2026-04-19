import {
  and,
  articles,
  desc,
  eq,
  ne,
  type Article,
  type ArticleCategoria,
  type SQL,
} from '@platzi-fc/db';
import { getDb } from '@/lib/db';

export type ListArticlesFilters = {
  categoria?: ArticleCategoria;
  oficial?: boolean;
  destacado?: boolean;
  limit?: number;
  offset?: number;
  excludeSlug?: string;
};

export async function listArticles(filters: ListArticlesFilters = {}): Promise<Article[]> {
  const db = getDb();
  const { categoria, oficial, destacado, limit, offset, excludeSlug } = filters;

  const conditions: SQL[] = [eq(articles.estado, 'publicado')];
  if (categoria) conditions.push(eq(articles.categoria, categoria));
  if (typeof oficial === 'boolean') conditions.push(eq(articles.oficial, oficial));
  if (typeof destacado === 'boolean') conditions.push(eq(articles.destacado, destacado));
  if (excludeSlug) conditions.push(ne(articles.slug, excludeSlug));

  let query = db
    .select()
    .from(articles)
    .where(and(...conditions))
    .orderBy(desc(articles.publishedAt))
    .$dynamic();

  if (limit) query = query.limit(limit);
  if (offset) query = query.offset(offset);

  return query;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(articles)
    .where(and(eq(articles.slug, slug), eq(articles.estado, 'publicado')))
    .limit(1);
  return row ?? null;
}

export async function countArticlesByCategoria(): Promise<Record<ArticleCategoria, number>> {
  const db = getDb();
  const rows = await db
    .select({ categoria: articles.categoria })
    .from(articles)
    .where(eq(articles.estado, 'publicado'));

  const counts: Record<ArticleCategoria, number> = {
    club: 0,
    equipo: 0,
    academia: 0,
    femenino: 0,
    comunidad: 0,
    tienda: 0,
  };
  for (const r of rows) counts[r.categoria]++;
  return counts;
}
