import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { PRODUCT_CATEGORIAS, type ProductCategoria } from '@/types';

export const PRODUCT_CATEGORIA_LABEL: Record<ProductCategoria, string> = {
  equipacion: 'Equipación',
  training: 'Training',
  lifestyle: 'Lifestyle',
  accesorios: 'Accesorios',
  coleccionismo: 'Coleccionismo',
};

export interface ProductCategoryFilterProps {
  active?: ProductCategoria;
  counts: Record<ProductCategoria, number>;
  total: number;
}

export function ProductCategoryFilter({ active, counts, total }: ProductCategoryFilterProps) {
  return (
    <nav aria-label="Filtro por categoría" className="flex flex-wrap gap-2">
      <FilterChip href="/tienda" active={!active} label="Todos" count={total} />
      {PRODUCT_CATEGORIAS.map((c) => (
        <FilterChip
          key={c}
          href={`/tienda/${c}`}
          active={active === c}
          label={PRODUCT_CATEGORIA_LABEL[c]}
          count={counts[c]}
        />
      ))}
    </nav>
  );
}

function FilterChip({
  href,
  active,
  label,
  count,
}: {
  href: string;
  active: boolean;
  label: string;
  count: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'true' : undefined}
      className={cn(
        'inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm transition',
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-brand-200 text-brand-800 hover:border-brand-400 bg-white',
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          'inline-flex min-w-[1.5rem] justify-center rounded-full px-1.5 text-xs',
          active ? 'bg-white/20 text-white' : 'bg-brand-100 text-brand-700',
        )}
      >
        {count}
      </span>
    </Link>
  );
}
