import type { Metadata } from 'next';
import { ArticleCard } from '@/components/editorial/article-card';
import { ArticleGrid } from '@/components/editorial/article-grid';
import { CategoryFilter } from '@/components/editorial/category-filter';
import { countArticlesByCategoria, listArticles } from '@/lib/db/articles';

export const metadata: Metadata = {
  title: 'Noticias',
  description: 'Últimas noticias, comunicados y reportajes del Platzi FC y su entorno.',
};

export const revalidate = 300;

export default async function NoticiasPage() {
  const [counts, featured, latest] = await Promise.all([
    countArticlesByCategoria(),
    listArticles({ destacado: true, limit: 1 }),
    listArticles({ limit: 12 }),
  ]);

  const hero = featured[0] ?? latest[0] ?? null;
  const rest = hero ? latest.filter((a) => a.id !== hero.id).slice(0, 11) : latest;
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">Noticias</h1>
        <p className="text-brand-700 mt-2">
          {total} publicaciones entre noticias, comunicados y reportajes del club.
        </p>
      </header>

      <CategoryFilter basePath="/noticias" counts={counts} total={total} />

      {hero ? <ArticleCard article={hero} variant="hero" /> : null}

      <ArticleGrid articles={rest} />
    </div>
  );
}
