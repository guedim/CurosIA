import {
  and,
  desc,
  eq,
  galleries,
  isNotNull,
  isNull,
  videos,
  type Gallery,
  type SQL,
  type Video,
  type VideoCategoria,
} from '@platzi-fc/db';
import { getDb } from '@/lib/db';

export type MatchMedia = {
  videos: Video[];
  galleries: Gallery[];
};

/**
 * Recupera los vídeos y galerías asociados a un partido (FK `match_id`), en
 * paralelo y ordenados por fecha de publicación descendente. Se usa en la
 * página de detalle de partido (Resumen y pestaña Media) para evitar dos
 * roundtrips secuenciales al renderizar.
 */
export async function getMediaForMatch(matchId: string): Promise<MatchMedia> {
  const db = getDb();
  const [videoRows, galleryRows] = await Promise.all([
    db.select().from(videos).where(eq(videos.matchId, matchId)).orderBy(desc(videos.publishedAt)),
    db
      .select()
      .from(galleries)
      .where(eq(galleries.matchId, matchId))
      .orderBy(desc(galleries.publishedAt)),
  ]);
  return { videos: videoRows, galleries: galleryRows };
}

export async function listVideos(
  filters: {
    categoria?: VideoCategoria;
    limit?: number;
  } = {},
): Promise<Video[]> {
  const db = getDb();
  const conditions: SQL[] = [];
  if (filters.categoria) conditions.push(eq(videos.categoria, filters.categoria));

  let query = db
    .select()
    .from(videos)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(videos.publishedAt))
    .$dynamic();

  if (filters.limit) query = query.limit(filters.limit);
  return query;
}

export async function getVideoBySlug(slug: string): Promise<Video | null> {
  const db = getDb();
  const [row] = await db.select().from(videos).where(eq(videos.slug, slug)).limit(1);
  return row ?? null;
}

export type GalleryScope = 'all' | 'match' | 'general';

export async function listGalleries(
  filters: { scope?: GalleryScope; limit?: number } | number = {},
): Promise<Gallery[]> {
  const normalized: { scope?: GalleryScope; limit?: number } =
    typeof filters === 'number' ? { limit: filters } : filters;
  const db = getDb();
  const scope = normalized.scope ?? 'all';
  const conditions: SQL[] = [];
  if (scope === 'match') conditions.push(isNotNull(galleries.matchId));
  else if (scope === 'general') conditions.push(isNull(galleries.matchId));

  let query = db
    .select()
    .from(galleries)
    .where(conditions.length ? and(...conditions) : undefined)
    .orderBy(desc(galleries.publishedAt))
    .$dynamic();
  if (normalized.limit) query = query.limit(normalized.limit);
  return query;
}

export async function getGalleryBySlug(slug: string): Promise<Gallery | null> {
  const db = getDb();
  const [row] = await db.select().from(galleries).where(eq(galleries.slug, slug)).limit(1);
  return row ?? null;
}
