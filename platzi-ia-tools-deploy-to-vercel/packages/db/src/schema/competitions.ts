import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export type CompetitionTipo = 'liga' | 'copa' | 'amistoso' | 'internacional';

export const competitions = pgTable(
  'competitions',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    nombre: text('nombre').notNull(),
    slug: text('slug').notNull().unique(),
    tipo: text('tipo').$type<CompetitionTipo>().notNull(),
    pais: text('pais'),
    region: text('region'),
    logoUrl: text('logo_url'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tipoIdx: index('competitions_tipo_idx').on(t.tipo),
    tipoCheck: check(
      'competitions_tipo_check',
      sql`${t.tipo} IN ('liga', 'copa', 'amistoso', 'internacional')`,
    ),
  }),
);

export type Competition = typeof competitions.$inferSelect;
export type NewCompetition = typeof competitions.$inferInsert;
