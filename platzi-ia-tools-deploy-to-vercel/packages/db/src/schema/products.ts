import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export type ProductCategoria =
  | 'equipacion'
  | 'training'
  | 'lifestyle'
  | 'accesorios'
  | 'coleccionismo';

export const PRODUCT_CATEGORIAS: readonly ProductCategoria[] = [
  'equipacion',
  'training',
  'lifestyle',
  'accesorios',
  'coleccionismo',
] as const;

/**
 * Catálogo de la tienda oficial. El checkout se realiza en una plataforma
 * externa (`externalUrl`); aquí solo se muestran fichas informativas.
 * `priceCents` evita errores de coma flotante (formateo en UI con Intl).
 */
export const products = pgTable(
  'products',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slug: text('slug').notNull().unique(),
    nombre: text('nombre').notNull(),
    descripcion: text('descripcion').notNull(),
    categoria: text('categoria').$type<ProductCategoria>().notNull(),
    priceCents: integer('price_cents').notNull(),
    currency: text('currency').notNull().default('EUR'),
    imageUrl: text('image_url'),
    imageAlt: text('image_alt'),
    externalUrl: text('external_url').notNull(),
    destacado: boolean('destacado').notNull().default(false),
    activo: boolean('activo').notNull().default(true),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    categoriaIdx: index('products_categoria_idx').on(t.categoria),
    destacadoIdx: index('products_destacado_idx').on(t.destacado),
    activoIdx: index('products_activo_idx').on(t.activo),
    categoriaCheck: check(
      'products_categoria_check',
      sql`${t.categoria} IN ('equipacion', 'training', 'lifestyle', 'accesorios', 'coleccionismo')`,
    ),
    priceCheck: check('products_price_check', sql`${t.priceCents} >= 0`),
  }),
);

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
