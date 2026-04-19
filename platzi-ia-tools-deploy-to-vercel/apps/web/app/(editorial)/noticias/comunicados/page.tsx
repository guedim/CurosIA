import type { Metadata } from 'next';
import { ArticleGrid } from '@/components/editorial/article-grid';
import { listArticles } from '@/lib/db/articles';

export const metadata: Metadata = {
  title: 'Comunicados oficiales',
  description: 'Comunicados oficiales del Platzi FC.',
};

export const revalidate = 300;

export default async function ComunicadosPage() {
  const articles = await listArticles({ oficial: true, limit: 24 });

  return (
    <div className="space-y-6">
      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">Comunicados oficiales</h1>
        <p className="text-brand-700 mt-2">
          {articles.length} comunicados publicados por los canales oficiales del club.
        </p>
      </header>
      <ArticleGrid articles={articles} emptyMessage="No hay comunicados oficiales recientes." />
    </div>
  );
}
