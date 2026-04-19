import { and, articles, desc, eq, ilike, or, players, products, videos } from '@platzi-fc/db';
import { getDb } from '@/lib/db';

export type SearchHit = {
  type: 'article' | 'player' | 'product' | 'video';
  slug: string;
  titulo: string;
  excerpt?: string | null;
  href: string;
};

/**
 * Búsqueda simple con `ILIKE %q%` sobre varias entidades. Suficiente para el
 * MVP; la migración a full-text search (tsvector) o Algolia se abordará en V1.
 */
export async function searchAll(q: string, limit = 8): Promise<SearchHit[]> {
  const term = q.trim();
  if (term.length < 2) return [];
  const like = `%${term}%`;
  const db = getDb();

  const [articleRows, playerRows, productRows, videoRows] = await Promise.all([
    db
      .select({
        slug: articles.slug,
        titulo: articles.titulo,
        excerpt: articles.excerpt,
      })
      .from(articles)
      .where(
        and(
          eq(articles.estado, 'publicado'),
          or(ilike(articles.titulo, like), ilike(articles.excerpt, like)),
        ),
      )
      .orderBy(desc(articles.publishedAt))
      .limit(limit),
    db
      .select({ slug: players.slug, titulo: players.nombre })
      .from(players)
      .where(ilike(players.nombre, like))
      .limit(limit),
    db
      .select({
        slug: products.slug,
        titulo: products.nombre,
        descripcion: products.descripcion,
      })
      .from(products)
      .where(
        and(
          eq(products.activo, true),
          or(ilike(products.nombre, like), ilike(products.descripcion, like)),
        ),
      )
      .limit(limit),
    db
      .select({ slug: videos.slug, titulo: videos.titulo })
      .from(videos)
      .where(ilike(videos.titulo, like))
      .orderBy(desc(videos.publishedAt))
      .limit(limit),
  ]);

  const hits: SearchHit[] = [
    ...articleRows.map((r) => ({
      type: 'article' as const,
      slug: r.slug,
      titulo: r.titulo,
      excerpt: r.excerpt,
      href: `/noticias/${r.slug}`,
    })),
    ...playerRows.map((r) => ({
      type: 'player' as const,
      slug: r.slug,
      titulo: r.titulo,
      href: `/equipo/${r.slug}`,
    })),
    ...productRows.map((r) => ({
      type: 'product' as const,
      slug: r.slug,
      titulo: r.titulo,
      excerpt: r.descripcion,
      href: `/tienda/producto/${r.slug}`,
    })),
    ...videoRows.map((r) => ({
      type: 'video' as const,
      slug: r.slug,
      titulo: r.titulo,
      href: `/media/videos/${r.slug}`,
    })),
  ];

  return hits;
}
