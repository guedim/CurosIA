/**
 * Aplica idempotentemente la columna `match_id` a `videos` y `galleries`
 * (con FK `ON DELETE SET NULL`) + índices. Usa ADD COLUMN IF NOT EXISTS para
 * poder re-ejecutar sin drift.
 */
import { config as loadEnv } from 'dotenv';
import postgres from 'postgres';

loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('[apply-match-media] Falta DATABASE_URL');
  process.exit(1);
}

const sql = postgres(url, { prepare: false, max: 2 });

const DDL = `
ALTER TABLE "videos" ADD COLUMN IF NOT EXISTS "match_id" uuid;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'videos_match_id_matches_id_fk'
  ) THEN
    ALTER TABLE "videos"
      ADD CONSTRAINT "videos_match_id_matches_id_fk"
      FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE SET NULL;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS "videos_match_idx" ON "videos" USING btree ("match_id");

ALTER TABLE "galleries" ADD COLUMN IF NOT EXISTS "match_id" uuid;
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'galleries_match_id_matches_id_fk'
  ) THEN
    ALTER TABLE "galleries"
      ADD CONSTRAINT "galleries_match_id_matches_id_fk"
      FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE SET NULL;
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS "galleries_match_idx" ON "galleries" USING btree ("match_id");
`;

async function main() {
  await sql.unsafe(DDL);
  console.log('[apply-match-media] OK — match_id añadido a videos/galleries');
  await sql.end();
}

main().catch(async (err) => {
  console.error('[apply-match-media] FAIL:', err);
  await sql.end();
  process.exit(1);
});
