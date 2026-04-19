import type { Article, Video } from '@/types';

/**
 * JSON-LD `NewsArticle` para el detalle de noticia. Usamos `NewsArticle`
 * (subtipo de Article) porque la mayor parte del contenido editorial del
 * club son piezas informativas; los comunicados oficiales también encajan.
 */
export function buildNewsArticleJsonLd(article: Article, url: string): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.titulo,
    description: article.excerpt,
    datePublished: article.publishedAt.toISOString(),
    dateModified: article.updatedAt.toISOString(),
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    publisher: {
      '@type': 'Organization',
      name: 'Platzi FC',
      logo: {
        '@type': 'ImageObject',
        url: '/placeholders/logo.png',
      },
    },
  };
  if (article.coverUrl) {
    jsonLd.image = [article.coverUrl];
  }
  if (article.autor) {
    jsonLd.author = { '@type': 'Person', name: article.autor };
  }
  if (article.tags.length) {
    jsonLd.keywords = article.tags.join(', ');
  }
  return jsonLd;
}

/**
 * JSON-LD `VideoObject` para el detalle de vídeo.
 */
export function buildVideoObjectJsonLd(video: Video, url: string): Record<string, unknown> {
  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: video.titulo,
    description: video.descripcion ?? video.titulo,
    uploadDate: video.publishedAt.toISOString(),
    embedUrl: video.embedUrl,
    contentUrl: url,
  };
  if (video.coverUrl) jsonLd.thumbnailUrl = [video.coverUrl];
  if (typeof video.duracionSeg === 'number') {
    jsonLd.duration = `PT${Math.floor(video.duracionSeg / 60)}M${video.duracionSeg % 60}S`;
  }
  return jsonLd;
}
