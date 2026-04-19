import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  unique,
  uuid,
} from 'drizzle-orm/pg-core';
import { competitions } from './competitions';
import { seasons } from './seasons';
import { teams } from './teams';

export type FormaResultado = 'G' | 'E' | 'P';

export const standings = pgTable(
  'standings',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    seasonId: uuid('season_id')
      .notNull()
      .references(() => seasons.id, { onDelete: 'restrict' }),
    competitionId: uuid('competition_id')
      .notNull()
      .references(() => competitions.id, { onDelete: 'restrict' }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'restrict' }),
    posicion: integer('posicion'),
    pj: integer('pj').notNull().default(0),
    pg: integer('pg').notNull().default(0),
    pe: integer('pe').notNull().default(0),
    pp: integer('pp').notNull().default(0),
    gf: integer('gf').notNull().default(0),
    gc: integer('gc').notNull().default(0),
    // dg se genera en la DB: GENERATED ALWAYS AS (gf - gc) STORED.
    // En Drizzle se declara como generatedAlwaysAs para que el tipo lo refleje.
    dg: integer('dg').generatedAlwaysAs(sql`gf - gc`),
    pts: integer('pts').notNull().default(0),
    forma: jsonb('forma')
      .$type<FormaResultado[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    competitionIdx: index('standings_competition_idx').on(t.competitionId, t.seasonId, t.posicion),
    uniqueCombo: unique('standings_unique').on(t.seasonId, t.competitionId, t.teamId),
    partidosCoherentes: check(
      'standings_partidos_coherentes',
      sql`${t.pj} = ${t.pg} + ${t.pe} + ${t.pp}`,
    ),
    nonNegative: check(
      'standings_non_negative',
      sql`${t.pj} >= 0 AND ${t.pg} >= 0 AND ${t.pe} >= 0 AND ${t.pp} >= 0
          AND ${t.gf} >= 0 AND ${t.gc} >= 0 AND ${t.pts} >= 0`,
    ),
    posicionCheck: check(
      'standings_posicion_check',
      sql`${t.posicion} IS NULL OR ${t.posicion} > 0`,
    ),
  }),
);

export type Standing = typeof standings.$inferSelect;
export type NewStanding = typeof standings.$inferInsert;
