import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageContent } from '@/components/editorial/page-content';
import { getPageBySlug } from '@/lib/db/pages';

const SLUG = 'club/estadio';

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageBySlug(SLUG);
  if (!page) return { title: 'Estadio' };
  return {
    title: page.titulo,
    description: page.seoDescription ?? page.intro ?? undefined,
  };
}

export default async function Page() {
  const page = await getPageBySlug(SLUG);
  if (!page) notFound();
  return <PageContent page={page} />;
}
