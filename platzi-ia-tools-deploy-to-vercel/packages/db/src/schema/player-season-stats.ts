import { sql } from 'drizzle-orm';
import {
  check,
  index,
  integer,
  jsonb,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { competitions } from './competitions';
import { players } from './players';
import { seasons } from './seasons';

export const playerSeasonStats = pgTable(
  'player_season_stats',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    playerId: uuid('player_id')
      .notNull()
      .references(() => players.id, { onDelete: 'cascade' }),
    seasonId: uuid('season_id')
      .notNull()
      .references(() => seasons.id, { onDelete: 'restrict' }),
    competitionId: uuid('competition_id').references(() => competitions.id, {
      onDelete: 'restrict',
    }),
    partidosJugados: integer('partidos_jugados').notNull().default(0),
    minutos: integer('minutos').notNull().default(0),
    goles: integer('goles').notNull().default(0),
    asistencias: integer('asistencias').notNull().default(0),
    amarillas: integer('amarillas').notNull().default(0),
    rojas: integer('rojas').notNull().default(0),
    stats: jsonb('stats')
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    seasonIdx: index('player_season_stats_season_idx').on(t.seasonId),
    uniqCombo: uniqueIndex('player_season_stats_uidx').on(
      t.playerId,
      t.seasonId,
      sql`COALESCE(${t.competitionId}, '00000000-0000-0000-0000-000000000000'::uuid)`,
    ),
    nonNegative: check(
      'player_season_stats_non_negative',
      sql`${t.partidosJugados} >= 0 AND ${t.minutos} >= 0 AND ${t.goles} >= 0
          AND ${t.asistencias} >= 0 AND ${t.amarillas} >= 0 AND ${t.rojas} >= 0`,
    ),
  }),
);

export type PlayerSeasonStats = typeof playerSeasonStats.$inferSelect;
export type NewPlayerSeasonStats = typeof playerSeasonStats.$inferInsert;
