import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

// Cargar .env.local primero (override local), luego .env (compartido).
loadEnv({ path: '.env.local' });
loadEnv({ path: '.env' });

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  // Permitir `drizzle-kit generate` sin URL (sólo necesita schema files),
  // pero avisar en consola para que quede claro cuándo falta.
  // eslint-disable-next-line no-console
  console.warn(
    '[drizzle.config] DATABASE_URL no definido. `push` e `introspect` fallarán hasta que lo rellenes en .env.local.',
  );
}

export default defineConfig({
  schema: './src/schema/*.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: databaseUrl ?? 'postgres://invalid',
  },
  casing: 'snake_case',
  verbose: true,
  strict: true,
});
