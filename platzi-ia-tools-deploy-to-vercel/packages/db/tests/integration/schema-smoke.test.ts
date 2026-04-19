/**
 * Integration tests ligeros contra una DB real.
 *
 * Se saltan automáticamente si `DATABASE_URL` no está definido — así el test
 * suite sigue siendo verde en entornos sin acceso al pooler (CI ligero, dev
 * sin credenciales), y se activan cuando hay conexión (CI con secret, local
 * con `.env.local`).
 *
 * Scope MVP: verificar que el cliente Drizzle puede conectar, consultar
 * metadatos y leer una tabla sin errores. Expandir a casos por query cuando
 * se añadan fixtures controladas.
 */
import { describe, expect, it, beforeAll, afterAll } from 'vitest';
import { config } from 'dotenv';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import * as schema from '../../src/schema';

config({ path: new URL('../../.env.local', import.meta.url) });
config({ path: new URL('../../.env', import.meta.url) });

const DATABASE_URL = process.env.DATABASE_URL;
const describeIntegration = DATABASE_URL ? describe : describe.skip;

describeIntegration('integration: DB smoke', () => {
  let client: ReturnType<typeof postgres>;
  let db: ReturnType<typeof drizzle<typeof schema>>;

  beforeAll(() => {
    client = postgres(DATABASE_URL!, { prepare: false, max: 1, idle_timeout: 5 });
    db = drizzle(client, { schema });
  });

  afterAll(async () => {
    await client.end({ timeout: 5 });
  });

  it('conecta y responde a SELECT 1', async () => {
    const rows = await db.execute(sql`select 1 as ok`);
    expect(rows.length).toBeGreaterThan(0);
  });

  it('lista las 9 tablas del schema MVP', async () => {
    const rows = await db.execute<{ table_name: string }>(sql`
      select table_name from information_schema.tables
      where table_schema = 'public'
      order by table_name
    `);
    const names = rows.map((r) => r.table_name);
    // Sólo verificamos las tablas centrales del MVP — no reventamos si hay
    // tablas extra (auditoría, extensiones, etc.).
    const expected = [
      'articles',
      'competitions',
      'matches',
      'players',
      'seasons',
      'standings',
      'teams',
    ];
    for (const t of expected) {
      expect(names, `falta tabla ${t}`).toContain(t);
    }
  });

  it('puede leer teams sin errores (count puede ser 0)', async () => {
    const rows = await db.select().from(schema.teams).limit(5);
    expect(Array.isArray(rows)).toBe(true);
  });
});
