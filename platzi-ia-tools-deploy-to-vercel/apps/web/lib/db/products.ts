import {
  and,
  asc,
  desc,
  eq,
  products,
  type Product,
  type ProductCategoria,
  type SQL,
} from '@platzi-fc/db';
import { getDb } from '@/lib/db';

export type ListProductsFilters = {
  categoria?: ProductCategoria;
  destacado?: boolean;
  limit?: number;
};

export async function listProducts(filters: ListProductsFilters = {}): Promise<Product[]> {
  const db = getDb();
  const conditions: SQL[] = [eq(products.activo, true)];
  if (filters.categoria) conditions.push(eq(products.categoria, filters.categoria));
  if (typeof filters.destacado === 'boolean') {
    conditions.push(eq(products.destacado, filters.destacado));
  }

  let query = db
    .select()
    .from(products)
    .where(and(...conditions))
    .orderBy(desc(products.destacado), asc(products.nombre))
    .$dynamic();

  if (filters.limit) query = query.limit(filters.limit);
  return query;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(products)
    .where(and(eq(products.slug, slug), eq(products.activo, true)))
    .limit(1);
  return row ?? null;
}

export async function countProductsByCategoria(): Promise<Record<ProductCategoria, number>> {
  const db = getDb();
  const rows = await db
    .select({ categoria: products.categoria })
    .from(products)
    .where(eq(products.activo, true));

  const counts: Record<ProductCategoria, number> = {
    equipacion: 0,
    training: 0,
    lifestyle: 0,
    accesorios: 0,
    coleccionismo: 0,
  };
  for (const r of rows) counts[r.categoria]++;
  return counts;
}
