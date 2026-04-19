import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/commercial/product-card';
import {
  PRODUCT_CATEGORIA_LABEL,
  ProductCategoryFilter,
} from '@/components/commercial/product-category-filter';
import { countProductsByCategoria, listProducts } from '@/lib/db/products';
import { PRODUCT_CATEGORIAS, type ProductCategoria } from '@/types';

type Params = { categorySlug: string };

export const revalidate = 600;

const VALID_CATS = new Set<ProductCategoria>(PRODUCT_CATEGORIAS);

function isValidCategoria(s: string): s is ProductCategoria {
  return (VALID_CATS as Set<string>).has(s);
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { categorySlug } = await params;
  if (!isValidCategoria(categorySlug)) return { title: 'Categoría' };
  const label = PRODUCT_CATEGORIA_LABEL[categorySlug];
  return {
    title: `Tienda — ${label}`,
    description: `Productos oficiales del Platzi FC en la categoría ${label}.`,
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { categorySlug } = await params;
  if (!isValidCategoria(categorySlug)) notFound();

  const [products, counts, allProducts] = await Promise.all([
    listProducts({ categoria: categorySlug }),
    countProductsByCategoria(),
    listProducts(),
  ]);

  const label = PRODUCT_CATEGORIA_LABEL[categorySlug];

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <p className="text-brand-600 text-sm">Tienda</p>
        <h1 className="text-brand-950 text-3xl font-bold leading-tight sm:text-4xl">{label}</h1>
      </header>

      <ProductCategoryFilter active={categorySlug} counts={counts} total={allProducts.length} />

      {products.length ? (
        <ul
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="list"
          aria-label={`Productos en ${label}`}
        >
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-sm">
          Esta categoría aún no tiene productos disponibles.
        </p>
      )}
    </div>
  );
}
