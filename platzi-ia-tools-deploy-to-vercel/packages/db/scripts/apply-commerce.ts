/**
 * Aplica idempotentemente las tablas comerciales (products, sponsors) sin
 * tocar el resto del schema. Mismo patrón que `apply-editorial`.
 */
import { config as loadEnv } from 'dotenv';
import postgres from 'postgres';

loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('[apply-commerce] Falta DATABASE_URL');
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 2 });

const DDL = `
CREATE TABLE IF NOT EXISTS "products" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "nombre" text NOT NULL,
  "descripcion" text NOT NULL,
  "categoria" text NOT NULL,
  "price_cents" integer NOT NULL,
  "currency" text DEFAULT 'EUR' NOT NULL,
  "image_url" text,
  "image_alt" text,
  "external_url" text NOT NULL,
  "destacado" boolean DEFAULT false NOT NULL,
  "activo" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "products_slug_unique" UNIQUE("slug"),
  CONSTRAINT "products_categoria_check" CHECK ("categoria" IN ('equipacion', 'training', 'lifestyle', 'accesorios', 'coleccionismo')),
  CONSTRAINT "products_price_check" CHECK ("price_cents" >= 0)
);

CREATE INDEX IF NOT EXISTS "products_categoria_idx" ON "products" USING btree ("categoria");
CREATE INDEX IF NOT EXISTS "products_destacado_idx" ON "products" USING btree ("destacado");
CREATE INDEX IF NOT EXISTS "products_activo_idx" ON "products" USING btree ("activo");

CREATE TABLE IF NOT EXISTS "sponsors" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "nombre" text NOT NULL,
  "tier" text NOT NULL,
  "logo_url" text,
  "url" text,
  "descripcion" text,
  "orden" integer DEFAULT 0 NOT NULL,
  "activo" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "sponsors_slug_unique" UNIQUE("slug"),
  CONSTRAINT "sponsors_tier_check" CHECK ("tier" IN ('principal', 'premium', 'partner'))
);

CREATE INDEX IF NOT EXISTS "sponsors_tier_idx" ON "sponsors" USING btree ("tier");
CREATE INDEX IF NOT EXISTS "sponsors_activo_idx" ON "sponsors" USING btree ("activo");
`;

async function main() {
  await sql.unsafe(DDL);
  console.log('[apply-commerce] OK — tablas products/sponsors aplicadas');
  await sql.end();
}

main().catch(async (err) => {
  console.error('[apply-commerce] FAIL:', err);
  await sql.end();
  process.exit(1);
});
