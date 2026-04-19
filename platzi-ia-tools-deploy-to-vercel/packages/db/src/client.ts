import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

/**
 * Cliente Drizzle singleton.
 *
 * - Se usa `postgres-js` porque es el driver recomendado para Supabase pooler.
 * - `prepare: false` es obligatorio cuando se conecta al pooler en modo transaction.
 * - El cliente se guarda en `globalThis` en desarrollo para evitar fugas por HMR.
 */

const globalForDb = globalThis as unknown as {
  __platzifcPg?: ReturnType<typeof postgres>;
  __platzifcDb?: ReturnType<typeof createDb>;
};

function createDb(connectionString: string) {
  const client =
    globalForDb.__platzifcPg ??
    postgres(connectionString, {
      prepare: false,
      max: 3,
      idle_timeout: 10,
      connect_timeout: 10,
    });
  globalForDb.__platzifcPg = client;
  return drizzle(client, { schema, logger: process.env.DB_LOG === '1' });
}

export function getDb() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    throw new Error(
      'DATABASE_URL no está definido. Copia packages/db/.env.example a .env.local y rellena el valor.',
    );
  }
  if (!globalForDb.__platzifcDb) globalForDb.__platzifcDb = createDb(url);
  return globalForDb.__platzifcDb;
}

export type Database = ReturnType<typeof getDb>;
