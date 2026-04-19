import { sql } from 'drizzle-orm';
import { check, date, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export type SeasonEstado = 'activa' | 'archivada';

export const seasons = pgTable(
  'seasons',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    nombre: text('nombre').notNull(),
    slug: text('slug').notNull().unique(),
    fechaInicio: date('fecha_inicio').notNull(),
    fechaFin: date('fecha_fin').notNull(),
    estado: text('estado').$type<SeasonEstado>().notNull().default('activa'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    estadoIdx: index('seasons_estado_idx').on(t.estado),
    fechasOk: check('seasons_fechas_ok', sql`${t.fechaFin} >= ${t.fechaInicio}`),
    estadoCheck: check('seasons_estado_check', sql`${t.estado} IN ('activa', 'archivada')`),
  }),
);

export type Season = typeof seasons.$inferSelect;
export type NewSeason = typeof seasons.$inferInsert;
