/**
 * Aplica idempotentemente las tablas del Sprint V1-3 (memberships,
 * community_events, newsletter_subscribers). CREATE TABLE IF NOT EXISTS para
 * re-ejecución segura. Se prefiere esto a `drizzle-kit push` por el drift que
 * genera la introspección al renombrar constraints.
 */
import { config as loadEnv } from 'dotenv';
import postgres from 'postgres';

loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('[apply-fans] Falta DATABASE_URL');
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 2 });

const DDL = `
CREATE TABLE IF NOT EXISTS "memberships" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "tier" text NOT NULL,
  "nombre" text NOT NULL,
  "descripcion" text NOT NULL,
  "price_cents" integer NOT NULL,
  "currency" text DEFAULT 'EUR' NOT NULL,
  "benefits" jsonb DEFAULT '[]'::jsonb NOT NULL,
  "hero_url" text,
  "external_checkout_url" text,
  "orden" integer DEFAULT 0 NOT NULL,
  "activo" boolean DEFAULT true NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "memberships_slug_unique" UNIQUE("slug"),
  CONSTRAINT "memberships_tier_check" CHECK ("tier" IN ('fan', 'socio', 'premium', 'legend')),
  CONSTRAINT "memberships_price_check" CHECK ("price_cents" >= 0)
);

CREATE INDEX IF NOT EXISTS "memberships_tier_idx" ON "memberships" USING btree ("tier");
CREATE INDEX IF NOT EXISTS "memberships_activo_idx" ON "memberships" USING btree ("activo");

CREATE TABLE IF NOT EXISTS "community_events" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "slug" text NOT NULL,
  "titulo" text NOT NULL,
  "descripcion" text NOT NULL,
  "tipo" text NOT NULL,
  "location" text NOT NULL,
  "starts_at" timestamp with time zone NOT NULL,
  "ends_at" timestamp with time zone,
  "capacidad" integer,
  "cover_url" text,
  "cover_alt" text,
  "requiere_inscripcion" boolean DEFAULT false NOT NULL,
  "external_rsvp_url" text,
  "destacado" boolean DEFAULT false NOT NULL,
  "created_at" timestamp with time zone DEFAULT now() NOT NULL,
  "updated_at" timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT "community_events_slug_unique" UNIQUE("slug"),
  CONSTRAINT "community_events_tipo_check" CHECK ("tipo" IN ('puertas_abiertas', 'firma_autografos', 'clinic', 'solidario', 'encuentro_aficion')),
  CONSTRAINT "community_events_fechas_check" CHECK ("ends_at" IS NULL OR "ends_at" >= "starts_at"),
  CONSTRAINT "community_events_capacidad_check" CHECK ("capacidad" IS NULL OR "capacidad" > 0)
);

CREATE INDEX IF NOT EXISTS "community_events_starts_at_idx" ON "community_events" USING btree ("starts_at");
CREATE INDEX IF NOT EXISTS "community_events_tipo_idx" ON "community_events" USING btree ("tipo");

CREATE TABLE IF NOT EXISTS "newsletter_subscribers" (
  "id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
  "email" text NOT NULL,
  "locale" text DEFAULT 'es' NOT NULL,
  "status" text DEFAULT 'pending' NOT NULL,
  "source" text,
  "subscribed_at" timestamp with time zone DEFAULT now() NOT NULL,
  "confirmed_at" timestamp with time zone,
  "unsubscribed_at" timestamp with time zone,
  CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email"),
  CONSTRAINT "newsletter_subscribers_status_check" CHECK ("status" IN ('pending', 'confirmed', 'unsubscribed')),
  CONSTRAINT "newsletter_subscribers_locale_check" CHECK ("locale" IN ('es', 'en'))
);

CREATE INDEX IF NOT EXISTS "newsletter_subscribers_status_idx" ON "newsletter_subscribers" USING btree ("status");
`;

async function main() {
  await sql.unsafe(DDL);
  console.log('[apply-fans] OK — memberships, community_events, newsletter_subscribers aplicadas');
  await sql.end();
}

main().catch(async (err) => {
  console.error('[apply-fans] FAIL:', err);
  await sql.end();
  process.exit(1);
});
