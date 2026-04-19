import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ArticleGrid } from '@/components/editorial/article-grid';
import { CategoryFilter } from '@/components/editorial/category-filter';
import { CATEGORIA_LABEL } from '@/components/editorial/category-label';
import { countArticlesByCategoria, listArticles } from '@/lib/db/articles';
import { ARTICLE_CATEGORIAS, type ArticleCategoria } from '@/types';

type Params = { cat: string };

export const revalidate = 300;

const VALID = new Set<ArticleCategoria>(ARTICLE_CATEGORIAS);

function isValid(v: string): v is ArticleCategoria {
  return VALID.has(v as ArticleCategoria);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { cat } = await params;
  if (!isValid(cat)) return { title: 'Categoría no encontrada' };
  const label = CATEGORIA_LABEL[cat];
  return {
    title: `Noticias · ${label}`,
    description: `Noticias y reportajes de ${label} del Platzi FC.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<Params> }) {
  const { cat } = await params;
  if (!isValid(cat)) notFound();

  const [counts, articles] = await Promise.all([
    countArticlesByCategoria(),
    listArticles({ categoria: cat, limit: 24 }),
  ]);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-6">
      <header className="border-brand-100 border-b pb-4">
        <h1 className="text-brand-950 text-3xl font-bold">Noticias de {CATEGORIA_LABEL[cat]}</h1>
        <p className="text-brand-700 mt-2">{counts[cat]} publicaciones en esta categoría.</p>
      </header>

      <CategoryFilter basePath="/noticias" current={cat} counts={counts} total={total} />

      <ArticleGrid
        articles={articles}
        emptyMessage="Todavía no hay publicaciones en esta categoría."
      />
    </div>
  );
}
