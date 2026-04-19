import Link from 'next/link';
import { formatMoney } from '@/lib/utils/money';
import type { Product } from '@/types';

export interface ProductCardProps {
  product: Product;
}

const CATEGORIA_LABEL: Record<Product['categoria'], string> = {
  equipacion: 'Equipación',
  training: 'Training',
  lifestyle: 'Lifestyle',
  accesorios: 'Accesorios',
  coleccionismo: 'Coleccionismo',
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/tienda/producto/${product.slug}`}
      className="rounded-card border-brand-100 hover:border-brand-300 hover:shadow-card focus-visible:ring-brand-400 group block overflow-hidden border bg-white transition focus-visible:outline-none focus-visible:ring-2"
      aria-label={`${product.nombre}, ${formatMoney(product.priceCents, product.currency)}`}
    >
      <div className="bg-brand-50 aspect-square">
        {product.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.imageUrl}
            alt={product.imageAlt ?? product.nombre}
            loading="lazy"
            className="h-full w-full object-cover transition group-hover:scale-[1.02]"
          />
        ) : (
          <div className="from-brand-100 to-brand-200 text-brand-600 flex h-full items-center justify-center bg-gradient-to-br">
            <span className="text-sm">Sin imagen</span>
          </div>
        )}
      </div>
      <div className="space-y-1 p-4">
        <p className="text-brand-500 text-xs uppercase tracking-wide">
          {CATEGORIA_LABEL[product.categoria]}
        </p>
        <h3 className="text-brand-950 text-sm font-semibold group-hover:underline">
          {product.nombre}
        </h3>
        <p className="text-brand-700 text-sm font-medium">
          {formatMoney(product.priceCents, product.currency)}
        </p>
      </div>
    </Link>
  );
}
