import { describe, expect, it } from 'vitest';
import type { Article, Video } from '@/types';
import { buildNewsArticleJsonLd, buildVideoObjectJsonLd } from '@/lib/seo/article-jsonld';

function makeArticle(overrides: Partial<Article> = {}): Article {
  const now = new Date('2025-03-10T10:00:00Z');
  return {
    id: 'a-1',
    slug: 'noticia-uno',
    titulo: 'Victoria importante',
    excerpt: 'Resumen breve.',
    body: 'Contenido.',
    coverUrl: null,
    coverAlt: null,
    categoria: 'club',
    tags: [],
    autor: null,
    oficial: false,
    destacado: false,
    estado: 'publicado',
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

function makeVideo(overrides: Partial<Video> = {}): Video {
  const now = new Date('2025-03-10T10:00:00Z');
  return {
    id: 'v-1',
    slug: 'video-uno',
    titulo: 'Resumen del partido',
    descripcion: null,
    coverUrl: null,
    embedUrl: 'https://youtube.com/embed/xyz',
    plataforma: 'youtube',
    duracionSeg: null,
    categoria: 'resumen',
    matchId: null,
    publishedAt: now,
    createdAt: now,
    updatedAt: now,
    ...overrides,
  };
}

describe('buildNewsArticleJsonLd', () => {
  it('genera un objeto NewsArticle válido con los campos mínimos', () => {
    const jsonLd = buildNewsArticleJsonLd(
      makeArticle(),
      'https://example.com/noticias/noticia-uno',
    );
    expect(jsonLd['@context']).toBe('https://schema.org');
    expect(jsonLd['@type']).toBe('NewsArticle');
    expect(jsonLd.headline).toBe('Victoria importante');
    expect(jsonLd.description).toBe('Resumen breve.');
    expect(jsonLd.datePublished).toBe('2025-03-10T10:00:00.000Z');
    expect(jsonLd.dateModified).toBe('2025-03-10T10:00:00.000Z');
  });

  it('incluye imagen cuando hay coverUrl', () => {
    const jsonLd = buildNewsArticleJsonLd(
      makeArticle({ coverUrl: 'https://cdn/img.jpg' }),
      'https://example.com/x',
    );
    expect(jsonLd.image).toEqual(['https://cdn/img.jpg']);
  });

  it('omite imagen cuando coverUrl es null', () => {
    const jsonLd = buildNewsArticleJsonLd(makeArticle(), 'https://example.com/x');
    expect(jsonLd.image).toBeUndefined();
  });

  it('incluye autor cuando está definido', () => {
    const jsonLd = buildNewsArticleJsonLd(
      makeArticle({ autor: 'Juan Pérez' }),
      'https://example.com/x',
    );
    expect(jsonLd.author).toEqual({ '@type': 'Person', name: 'Juan Pérez' });
  });

  it('incluye keywords cuando hay tags', () => {
    const jsonLd = buildNewsArticleJsonLd(
      makeArticle({ tags: ['liga', 'victoria'] }),
      'https://example.com/x',
    );
    expect(jsonLd.keywords).toBe('liga, victoria');
  });

  it('omite keywords si tags está vacío', () => {
    const jsonLd = buildNewsArticleJsonLd(makeArticle(), 'https://example.com/x');
    expect(jsonLd.keywords).toBeUndefined();
  });

  it('mainEntityOfPage usa la url recibida', () => {
    const url = 'https://example.com/noticias/abc';
    const jsonLd = buildNewsArticleJsonLd(makeArticle(), url);
    expect(jsonLd.mainEntityOfPage).toEqual({ '@type': 'WebPage', '@id': url });
  });
});

describe('buildVideoObjectJsonLd', () => {
  it('genera un VideoObject válido con campos mínimos', () => {
    const jsonLd = buildVideoObjectJsonLd(
      makeVideo(),
      'https://example.com/media/videos/video-uno',
    );
    expect(jsonLd['@type']).toBe('VideoObject');
    expect(jsonLd.name).toBe('Resumen del partido');
    expect(jsonLd.embedUrl).toBe('https://youtube.com/embed/xyz');
    expect(jsonLd.uploadDate).toBe('2025-03-10T10:00:00.000Z');
  });

  it('usa el título como descripción si no hay descripcion explícita', () => {
    const jsonLd = buildVideoObjectJsonLd(makeVideo(), 'https://example.com/x');
    expect(jsonLd.description).toBe('Resumen del partido');
  });

  it('prefiere la descripción explícita cuando está presente', () => {
    const jsonLd = buildVideoObjectJsonLd(
      makeVideo({ descripcion: 'Descripción larga del resumen' }),
      'https://example.com/x',
    );
    expect(jsonLd.description).toBe('Descripción larga del resumen');
  });

  it('mapea duracionSeg a formato ISO 8601', () => {
    const jsonLd = buildVideoObjectJsonLd(makeVideo({ duracionSeg: 125 }), 'https://example.com/x');
    expect(jsonLd.duration).toBe('PT2M5S');
  });

  it('omite duration si no hay duracionSeg', () => {
    const jsonLd = buildVideoObjectJsonLd(makeVideo(), 'https://example.com/x');
    expect(jsonLd.duration).toBeUndefined();
  });

  it('incluye thumbnailUrl si hay coverUrl', () => {
    const jsonLd = buildVideoObjectJsonLd(
      makeVideo({ coverUrl: 'https://cdn/thumb.jpg' }),
      'https://example.com/x',
    );
    expect(jsonLd.thumbnailUrl).toEqual(['https://cdn/thumb.jpg']);
  });
});
