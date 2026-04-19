import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { competitions } from './competitions';
import { seasons } from './seasons';
import { teams } from './teams';

export type MatchEstado = 'programado' | 'en_vivo' | 'finalizado' | 'suspendido' | 'cancelado';

export type AlineacionEntry = {
  playerId: string;
  dorsal?: number;
  nombre?: string;
  posicion?: string;
  titular: boolean;
  minutoEntrada?: number;
  minutoSalida?: number;
};

export const matches = pgTable(
  'matches',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slug: text('slug').notNull().unique(),
    seasonId: uuid('season_id')
      .notNull()
      .references(() => seasons.id, { onDelete: 'restrict' }),
    competitionId: uuid('competition_id')
      .notNull()
      .references(() => competitions.id, { onDelete: 'restrict' }),
    homeTeamId: uuid('home_team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'restrict' }),
    awayTeamId: uuid('away_team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'restrict' }),
    estadioSanityRef: text('estadio_sanity_ref'),
    jornada: integer('jornada'),
    fechaHora: timestamp('fecha_hora', { withTimezone: true }).notNull(),
    estado: text('estado').$type<MatchEstado>().notNull().default('programado'),
    marcadorLocal: integer('marcador_local'),
    marcadorVisita: integer('marcador_visita'),
    asistencia: integer('asistencia'),
    arbitro: text('arbitro'),
    broadcastingRefs: jsonb('broadcasting_refs')
      .$type<string[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    alineacionLocal: jsonb('alineacion_local')
      .$type<AlineacionEntry[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    alineacionVisita: jsonb('alineacion_visita')
      .$type<AlineacionEntry[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    stats: jsonb('stats')
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    seasonIdx: index('matches_season_idx').on(t.seasonId),
    competitionIdx: index('matches_competition_idx').on(t.competitionId),
    homeTeamIdx: index('matches_home_team_idx').on(t.homeTeamId),
    awayTeamIdx: index('matches_away_team_idx').on(t.awayTeamId),
    fechaHoraIdx: index('matches_fecha_hora_idx').on(t.fechaHora),
    estadoIdx: index('matches_estado_idx').on(t.estado),
    distinctTeams: check('matches_distinct_teams', sql`${t.homeTeamId} <> ${t.awayTeamId}`),
    scoreConsistency: check(
      'matches_score_consistency',
      sql`
        (${t.estado} IN ('programado', 'cancelado', 'suspendido')
          AND ${t.marcadorLocal} IS NULL AND ${t.marcadorVisita} IS NULL)
        OR (${t.estado} IN ('en_vivo', 'finalizado')
          AND ${t.marcadorLocal} IS NOT NULL AND ${t.marcadorVisita} IS NOT NULL)
      `,
    ),
    estadoCheck: check(
      'matches_estado_check',
      sql`${t.estado} IN ('programado', 'en_vivo', 'finalizado', 'suspendido', 'cancelado')`,
    ),
  }),
);

export type Match = typeof matches.$inferSelect;
export type NewMatch = typeof matches.$inferInsert;
