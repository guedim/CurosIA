import { eq, pages, type Page } from '@platzi-fc/db';
import { getDb } from '@/lib/db';

export async function getPageBySlug(slug: string): Promise<Page | null> {
  const db = getDb();
  const [row] = await db.select().from(pages).where(eq(pages.slug, slug)).limit(1);
  return row ?? null;
}
