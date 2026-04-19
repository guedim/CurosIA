export * from './schema';
export { getDb, type Database } from './client';
// Re-export del builder SQL y tipos de drizzle para que los consumidores no
// necesiten declarar drizzle-orm como dependencia directa.
export {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  ilike,
  inArray,
  isNotNull,
  isNull,
  like,
  lt,
  lte,
  ne,
  not,
  or,
  sql,
  type SQL,
} from 'drizzle-orm';
export type { PgTable } from 'drizzle-orm/pg-core';
