/**
 * Aplica idempotentemente las tablas editoriales (articles, videos, galleries,
 * pages) sin tocar el resto del schema. Hace CREATE TABLE IF NOT EXISTS para
 * poder re-ejecutar el script. Se prefiere este script sobre `drizzle-kit
 * push` porque la introspección genera drift al renombrar constraints.
 */
import { config as loadEnv } from 'dotenv';
import postgres from 'postgres';

loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('[apply-editorial] Falta DATABASE_URL');
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 2 });

const DDL = `
CREATE TABLE IF NOT EXISTS "articles" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "titulo" text NOT NULL,
  "excerpt" text NOT NULL,
  "body" text NOT NULL,
  "cover_url" text,
  "cover_alt" text,
  "categoria" text NOT NULL,
  "tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "autor" text,
  "oficial" boolean DEFAULT false NOT NULL,
  "destacado" boolean DEFAULT false NOT NULL,
  "estado" text DEFAULT 'publicado' NOT NULL,
  "published_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "articles_slug_unique" UNIQUE("slug"),
  CONSTRAINT "articles_categoria_check" CHECK ("categoria" IN ('club', 'equipo', 'academia', 'femenino', 'comunidad', 'tienda')),
  CONSTRAINT "articles_estado_check" CHECK ("estado" IN ('borrador', 'publicado'))
);

CREATE INDEX IF NOT EXISTS "articles_categoria_idx" ON "articles" USING btree ("categoria");
CREATE INDEX IF NOT EXISTS "articles_estado_idx" ON "articles" USING btree ("estado");
CREATE INDEX IF NOT EXISTS "articles_published_idx" ON "articles" USING btree ("published_at");
CREATE INDEX IF NOT EXISTS "articles_oficial_idx" ON "articles" USING btree ("oficial");

CREATE TABLE IF NOT EXISTS "videos" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "titulo" text NOT NULL,
  "descripcion" text,
  "cover_url" text,
  "embed_url" text NOT NULL,
  "plataforma" text NOT NULL,
  "duracion_seg" integer,
  "categoria" text NOT NULL,
  "published_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "videos_slug_unique" UNIQUE("slug"),
  CONSTRAINT "videos_plataforma_check" CHECK ("plataforma" IN ('youtube', 'vimeo', 'nativo')),
  CONSTRAINT "videos_categoria_check" CHECK ("categoria" IN ('resumen', 'rueda_prensa', 'entrevista', 'cantera', 'comunidad')),
  CONSTRAINT "videos_duracion_check" CHECK ("duracion_seg" IS NULL OR "duracion_seg" > 0)
);

CREATE INDEX IF NOT EXISTS "videos_categoria_idx" ON "videos" USING btree ("categoria");
CREATE INDEX IF NOT EXISTS "videos_published_idx" ON "videos" USING btree ("published_at");

CREATE TABLE IF NOT EXISTS "galleries" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "titulo" text NOT NULL,
  "descripcion" text,
  "cover_url" text,
  "images" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "published_at" timestamp with time zone NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "galleries_slug_unique" UNIQUE("slug")
);

CREATE INDEX IF NOT EXISTS "galleries_published_idx" ON "galleries" USING btree ("published_at");

CREATE TABLE IF NOT EXISTS "pages" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "titulo" text NOT NULL,
  "intro" text,
  "body" text NOT NULL,
  "hero_url" text,
  "hero_alt" text,
  "seo_description" text,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
`;

async function main() {
  await sql.unsafe(DDL);
  console.log('[apply-editorial] OK — tablas editoriales aplicadas');
  await sql.end();
}

main().catch(async (err) => {
  console.error('[apply-editorial] FAIL:', err);
  await sql.end();
  process.exit(1);
});
