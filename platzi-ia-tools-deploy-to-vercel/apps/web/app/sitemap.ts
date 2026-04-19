import type { MetadataRoute } from 'next';
import { ARTICLE_CATEGORIAS, PRODUCT_CATEGORIAS } from '@/types';
import { listArticles } from '@/lib/db/articles';
import { listGalleries, listVideos } from '@/lib/db/media';
import { listCompetitions, listMatches } from '@/lib/db/matches';
import { listPlayers } from '@/lib/db/players';
import { listProducts } from '@/lib/db/products';

export const dynamic = 'force-dynamic';

/**
 * Sitemap con rutas estáticas + slugs dinámicos leídos desde PostgreSQL.
 * Se genera bajo demanda para evitar saturar el pooler de Supabase en build.
 * Cada bloque ignora errores silenciosamente para no romper el sitemap si
 * una tabla está vacía.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const now = new Date();

  const staticRoutes: string[] = [
    '/',
    '/partidos',
    '/equipo',
    '/equipo/staff',
    '/equipo/femenino',
    '/equipo/cantera',
    '/competicion',
    '/noticias',
    '/noticias/comunicados',
    '/media/videos',
    '/media/galerias',
    '/entradas',
    '/entradas/abonos',
    '/entradas/estadio',
    '/tienda',
    '/club/historia',
    '/club/identidad',
    '/club/directiva',
    '/club/estadio',
    '/club/fundacion',
    '/club/transparencia',
    '/club/contacto',
    '/fans',
    '/sponsors',
    '/academy',
    '/terminos',
    '/privacidad',
    '/cookies',
    '/accesibilidad',
    '/busqueda',
  ];

  const articles = await listArticles({ limit: 500 }).catch(() => []);
  const videos = await listVideos({ limit: 500 }).catch(() => []);
  const galleries = await listGalleries(500).catch(() => []);
  const players = await listPlayers().catch(() => []);
  const matches = await listMatches({ limit: 500, order: 'desc' }).catch(() => []);
  const competitions = await listCompetitions().catch(() => []);
  const products = await listProducts({ limit: 500 }).catch(() => []);

  const dynamicRoutes: Array<{ path: string; lastModified?: Date }> = [
    ...ARTICLE_CATEGORIAS.map((c) => ({ path: `/noticias/categoria/${c}` })),
    ...PRODUCT_CATEGORIAS.map((c) => ({ path: `/tienda/${c}` })),
    ...articles.map((a) => ({
      path: `/noticias/${a.slug}`,
      lastModified: a.updatedAt,
    })),
    ...videos.map((v) => ({
      path: `/media/videos/${v.slug}`,
      lastModified: v.updatedAt,
    })),
    ...galleries.map((g) => ({
      path: `/media/galerias/${g.slug}`,
      lastModified: g.updatedAt,
    })),
    ...players.map((p) => ({
      path: `/equipo/${p.slug}`,
      lastModified: p.updatedAt ?? undefined,
    })),
    ...matches.map((m) => ({
      path: `/partidos/${m.slug}`,
      lastModified: m.updatedAt,
    })),
    ...competitions.map((c) => ({
      path: `/competicion/${c.slug}`,
      lastModified: c.updatedAt ?? undefined,
    })),
    ...competitions.flatMap((c) => [
      { path: `/competicion/${c.slug}/tabla` },
      { path: `/competicion/${c.slug}/calendario` },
    ]),
    ...products.map((p) => ({
      path: `/tienda/producto/${p.slug}`,
      lastModified: p.updatedAt,
    })),
  ];

  const entries: MetadataRoute.Sitemap = [
    ...staticRoutes.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: now,
      changeFrequency: (path === '/' ? 'daily' : 'weekly') as 'daily' | 'weekly',
      priority: path === '/' ? 1 : 0.6,
    })),
    ...dynamicRoutes.map(({ path, lastModified }) => ({
      url: `${baseUrl}${path}`,
      lastModified: lastModified ?? now,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
  ];

  return entries;
}
