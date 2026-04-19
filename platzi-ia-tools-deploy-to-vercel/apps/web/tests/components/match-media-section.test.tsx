import { describe, expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { MatchMediaSection } from '@/components/matches/match-media-section';
import type { Gallery, Video } from '@/types';

function makeVideo(overrides: Partial<Video> = {}): Video {
  const now = new Date('2026-04-01T12:00:00.000Z');
  return {
    id: overrides.id ?? 'v-1',
    slug: overrides.slug ?? 'video-1',
    titulo: overrides.titulo ?? 'Resumen del partido',
    descripcion: overrides.descripcion ?? null,
    coverUrl: overrides.coverUrl ?? null,
    embedUrl: overrides.embedUrl ?? 'https://youtube.com/embed/xyz',
    plataforma: overrides.plataforma ?? 'youtube',
    duracionSeg: overrides.duracionSeg ?? 120,
    categoria: overrides.categoria ?? 'resumen',
    matchId: overrides.matchId ?? 'match-1',
    publishedAt: overrides.publishedAt ?? now,
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
  };
}

function makeGallery(overrides: Partial<Gallery> = {}): Gallery {
  const now = new Date('2026-04-01T12:00:00.000Z');
  return {
    id: overrides.id ?? 'g-1',
    slug: overrides.slug ?? 'galeria-1',
    titulo: overrides.titulo ?? 'Galería del partido',
    descripcion: overrides.descripcion ?? null,
    coverUrl: overrides.coverUrl ?? null,
    images: overrides.images ?? [{ url: 'https://x/1.jpg', alt: 'foto' }],
    matchId: overrides.matchId ?? 'match-1',
    publishedAt: overrides.publishedAt ?? now,
    createdAt: overrides.createdAt ?? now,
    updatedAt: overrides.updatedAt ?? now,
  };
}

describe('<MatchMediaSection />', () => {
  it('pinta un estado vacío si no hay media y no es preview', () => {
    const html = renderToStaticMarkup(<MatchMediaSection videos={[]} galleries={[]} />);
    expect(html).toContain('No hay vídeos ni galerías');
  });

  it('no renderiza nada en modo preview sin media', () => {
    const html = renderToStaticMarkup(
      <MatchMediaSection videos={[]} galleries={[]} previewLimit={3} matchSlug="plc-vs-rfc" />,
    );
    expect(html).toBe('');
  });

  it('limita los items en modo preview y añade CTA a la página media', () => {
    const videos = [makeVideo({ id: 'v-1' }), makeVideo({ id: 'v-2' }), makeVideo({ id: 'v-3' })];
    const html = renderToStaticMarkup(
      <MatchMediaSection videos={videos} galleries={[]} previewLimit={1} matchSlug="plc-vs-rfc" />,
    );
    expect(html).toContain('/partidos/plc-vs-rfc/media');
    expect(html).toContain('Ver todo el material');
  });

  it('renderiza ambas secciones cuando hay vídeos y galerías', () => {
    const html = renderToStaticMarkup(
      <MatchMediaSection videos={[makeVideo()]} galleries={[makeGallery()]} />,
    );
    expect(html).toContain('Vídeos');
    expect(html).toContain('Galerías');
  });
});
