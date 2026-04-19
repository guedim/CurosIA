import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/commercial/product-card';
import { PRODUCT_CATEGORIA_LABEL } from '@/components/commercial/product-category-filter';
import { Badge } from '@/components/ui/badge';
import { getProductBySlug, listProducts } from '@/lib/db/products';
import { formatMoney } from '@/lib/utils/money';

type Params = { productSlug: string };

export const revalidate = 600;

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (!product) return { title: 'Producto no encontrado' };
  return {
    title: product.nombre,
    description: product.descripcion,
    openGraph: {
      title: product.nombre,
      description: product.descripcion,
      type: 'website',
      images: product.imageUrl ? [product.imageUrl] : undefined,
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { productSlug } = await params;
  const product = await getProductBySlug(productSlug);
  if (!product) notFound();

  const related = (await listProducts({ categoria: product.categoria, limit: 5 }))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  const price = formatMoney(product.priceCents, product.currency);

  return (
    <article className="space-y-10">
      <nav aria-label="Breadcrumb" className="text-brand-600 text-sm">
        <ol className="flex flex-wrap gap-1">
          <li>
            <Link href="/tienda" className="hover:underline">
              Tienda
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/tienda/${product.categoria}`} className="hover:underline">
              {PRODUCT_CATEGORIA_LABEL[product.categoria]}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="text-brand-800 truncate">{product.nombre}</li>
        </ol>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <figure className="rounded-card border-brand-100 overflow-hidden border bg-white">
          <div className="bg-brand-50 aspect-square">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.imageAlt ?? product.nombre}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="from-brand-100 to-brand-200 text-brand-600 flex h-full items-center justify-center bg-gradient-to-br">
                <span>Sin imagen</span>
              </div>
            )}
          </div>
        </figure>

        <div className="space-y-5">
          <Badge variant="default">{PRODUCT_CATEGORIA_LABEL[product.categoria]}</Badge>
          <h1 className="text-brand-950 text-3xl font-bold leading-tight sm:text-4xl">
            {product.nombre}
          </h1>
          <p className="text-brand-800 text-2xl font-semibold" aria-label={`Precio ${price}`}>
            {price}
          </p>
          <p className="text-brand-700 leading-relaxed">{product.descripcion}</p>
          <a
            href={product.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-brand-600 hover:bg-brand-700 focus-visible:ring-brand-500 inline-flex h-11 items-center justify-center rounded-md px-6 text-sm font-semibold text-white transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
            aria-label={`Comprar ${product.nombre} en la tienda oficial (se abre en una pestaña nueva)`}
          >
            Comprar en tienda oficial
          </a>
          <p className="text-brand-500 text-xs">
            La compra y el checkout se realizan en la plataforma externa oficial del club.
          </p>
        </div>
      </div>

      {related.length ? (
        <section
          aria-label="Productos relacionados"
          className="border-brand-100 space-y-4 border-t pt-8"
        >
          <h2 className="text-brand-950 text-xl font-semibold">
            Más en {PRODUCT_CATEGORIA_LABEL[product.categoria]}
          </h2>
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
