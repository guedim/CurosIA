import { sql } from 'drizzle-orm';
import { check, index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export type TeamTipo = 'club_principal' | 'rival' | 'cantera' | 'femenino';

export const teams = pgTable(
  'teams',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    nombre: text('nombre').notNull(),
    slug: text('slug').notNull().unique(),
    tipo: text('tipo').$type<TeamTipo>().notNull(),
    escudoUrl: text('escudo_url'),
    pais: text('pais'),
    ciudad: text('ciudad'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    tipoIdx: index('teams_tipo_idx').on(t.tipo),
    tipoCheck: check(
      'teams_tipo_check',
      sql`${t.tipo} IN ('club_principal', 'rival', 'cantera', 'femenino')`,
    ),
  }),
);

export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
