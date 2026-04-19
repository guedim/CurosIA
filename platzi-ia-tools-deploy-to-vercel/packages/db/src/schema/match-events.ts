import { sql } from 'drizzle-orm';
import { check, index, integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { matches } from './matches';
import { players } from './players';
import { teams } from './teams';

export type MatchEventTipo =
  | 'gol'
  | 'gol_penal'
  | 'gol_en_contra'
  | 'amarilla'
  | 'doble_amarilla'
  | 'roja'
  | 'sustitucion'
  | 'penal_fallado'
  | 'var';

export const matchEvents = pgTable(
  'match_events',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    matchId: uuid('match_id')
      .notNull()
      .references(() => matches.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
    playerId: uuid('player_id').references(() => players.id, { onDelete: 'set null' }),
    minuto: integer('minuto').notNull(),
    minutoExtra: integer('minuto_extra'),
    tipo: text('tipo').$type<MatchEventTipo>().notNull(),
    descripcion: text('descripcion'),
    metadata: jsonb('metadata')
      .$type<Record<string, unknown>>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    matchIdx: index('match_events_match_idx').on(t.matchId),
    playerIdx: index('match_events_player_idx').on(t.playerId),
    teamIdx: index('match_events_team_idx').on(t.teamId),
    minutoCheck: check('match_events_minuto_check', sql`${t.minuto} >= 0 AND ${t.minuto} <= 130`),
    minutoExtraCheck: check(
      'match_events_minuto_extra_check',
      sql`${t.minutoExtra} IS NULL OR ${t.minutoExtra} >= 0`,
    ),
    tipoCheck: check(
      'match_events_tipo_check',
      sql`${t.tipo} IN ('gol','gol_penal','gol_en_contra','amarilla','doble_amarilla','roja','sustitucion','penal_fallado','var')`,
    ),
  }),
);

export type MatchEvent = typeof matchEvents.$inferSelect;
export type NewMatchEvent = typeof matchEvents.$inferInsert;
