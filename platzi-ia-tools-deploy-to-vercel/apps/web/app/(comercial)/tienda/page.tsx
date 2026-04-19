import type { Metadata } from 'next';
import { ProductCard } from '@/components/commercial/product-card';
import { ProductCategoryFilter } from '@/components/commercial/product-category-filter';
import { Badge } from '@/components/ui/badge';
import { countProductsByCategoria, listProducts } from '@/lib/db/products';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Tienda oficial',
  description: 'Camisetas, equipaciones, accesorios y productos oficiales del Platzi FC.',
};

export default async function Page() {
  const [products, counts] = await Promise.all([listProducts(), countProductsByCategoria()]);
  const total = products.length;

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <Badge variant="default">Tienda oficial</Badge>
        <h1 className="text-brand-950 text-3xl font-bold leading-tight sm:text-4xl">
          Lleva los colores del Platzi FC
        </h1>
        <p className="text-brand-700 max-w-2xl">
          Equipaciones oficiales, training, coleccionismo y accesorios. La compra se realiza en
          nuestra tienda externa; aquí encontrarás la ficha completa de cada producto.
        </p>
      </header>

      <ProductCategoryFilter counts={counts} total={total} />

      {products.length ? (
        <ul
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          role="list"
          aria-label="Listado de productos"
        >
          {products.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card border-brand-200 bg-brand-50 text-brand-700 border border-dashed p-6 text-sm">
          No hay productos disponibles en este momento.
        </p>
      )}
    </div>
  );
}
