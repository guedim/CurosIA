import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArticleCard } from '@/components/editorial/article-card';
import { CATEGORIA_LABEL } from '@/components/editorial/category-label';
import { MarkdownBody } from '@/components/editorial/markdown-body';
import { Badge } from '@/components/ui/badge';
import { getArticleBySlug, listArticles } from '@/lib/db/articles';
import { buildNewsArticleJsonLd } from '@/lib/seo/article-jsonld';
import { formatDate } from '@/lib/utils/date';

type Params = { articleSlug: string };

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { articleSlug } = await params;
  const article = await getArticleBySlug(articleSlug);
  if (!article) return { title: 'Noticia no encontrada' };
  return {
    title: article.titulo,
    description: article.excerpt,
    openGraph: {
      title: article.titulo,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.publishedAt.toISOString(),
      authors: article.autor ? [article.autor] : undefined,
      images: article.coverUrl ? [article.coverUrl] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { articleSlug } = await params;
  const article = await getArticleBySlug(articleSlug);
  if (!article) notFound();

  const related = await listArticles({
    categoria: article.categoria,
    excludeSlug: article.slug,
    limit: 3,
  });

  const url = `/noticias/${article.slug}`;
  const jsonLd = buildNewsArticleJsonLd(article, url);

  return (
    <article className="space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav aria-label="Breadcrumb" className="text-brand-600 text-sm">
        <ol className="flex flex-wrap gap-1">
          <li>
            <Link href="/noticias" className="hover:underline">
              Noticias
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/noticias/categoria/${article.categoria}`} className="hover:underline">
              {CATEGORIA_LABEL[article.categoria]}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-800 truncate">{article.titulo}</li>
        </ol>
      </nav>

      <header className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          {article.oficial ? <Badge variant="warning">Comunicado oficial</Badge> : null}
          <Badge variant="default">{CATEGORIA_LABEL[article.categoria]}</Badge>
          {article.tags.slice(0, 4).map((t) => (
            <Badge key={t} variant="outline">
              #{t}
            </Badge>
          ))}
        </div>
        <h1 className="text-brand-950 text-3xl font-bold leading-tight sm:text-4xl">
          {article.titulo}
        </h1>
        <p className="text-brand-700 text-lg">{article.excerpt}</p>
        <div className="text-brand-600 flex flex-wrap items-center gap-3 text-sm">
          {article.autor ? <span>{article.autor}</span> : null}
          <time dateTime={article.publishedAt.toISOString()}>
            {formatDate(article.publishedAt)}
          </time>
        </div>
      </header>

      {article.coverUrl ? (
        <figure className="rounded-card overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={article.coverUrl}
            alt={article.coverAlt ?? ''}
            className="aspect-[16/9] w-full object-cover"
          />
          {article.coverAlt ? (
            <figcaption className="text-brand-500 mt-2 text-xs">{article.coverAlt}</figcaption>
          ) : null}
        </figure>
      ) : null}

      <MarkdownBody body={article.body} className="max-w-3xl" />

      {related.length ? (
        <section
          aria-label="Noticias relacionadas"
          className="border-brand-100 space-y-4 border-t pt-6"
        >
          <h2 className="text-brand-950 text-xl font-semibold">También te puede interesar</h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {related.map((r) => (
              <li key={r.id}>
                <ArticleCard article={r} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
