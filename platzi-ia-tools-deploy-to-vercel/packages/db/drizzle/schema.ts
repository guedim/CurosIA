import {
  pgTable,
  index,
  unique,
  check,
  uuid,
  text,
  date,
  timestamp,
  foreignKey,
  integer,
  jsonb,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const seasons = pgTable(
  'seasons',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    nombre: text().notNull(),
    slug: text().notNull(),
    fechaInicio: date('fecha_inicio').notNull(),
    fechaFin: date('fecha_fin').notNull(),
    estado: text().default('activa').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('seasons_estado_idx').using('btree', table.estado.asc().nullsLast().op('text_ops')),
    unique('seasons_slug_key').on(table.slug),
    check('seasons_estado_check', sql`estado = ANY (ARRAY['activa'::text, 'archivada'::text])`),
    check('seasons_fechas_ok', sql`fecha_fin >= fecha_inicio`),
  ],
);

export const competitions = pgTable(
  'competitions',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    nombre: text().notNull(),
    slug: text().notNull(),
    tipo: text().notNull(),
    pais: text(),
    region: text(),
    logoUrl: text('logo_url'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('competitions_tipo_idx').using('btree', table.tipo.asc().nullsLast().op('text_ops')),
    unique('competitions_slug_key').on(table.slug),
    check(
      'competitions_tipo_check',
      sql`tipo = ANY (ARRAY['liga'::text, 'copa'::text, 'amistoso'::text, 'internacional'::text])`,
    ),
  ],
);

export const teams = pgTable(
  'teams',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    nombre: text().notNull(),
    slug: text().notNull(),
    tipo: text().notNull(),
    escudoUrl: text('escudo_url'),
    pais: text(),
    ciudad: text(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('teams_tipo_idx').using('btree', table.tipo.asc().nullsLast().op('text_ops')),
    unique('teams_slug_key').on(table.slug),
    check(
      'teams_tipo_check',
      sql`tipo = ANY (ARRAY['club_principal'::text, 'rival'::text, 'cantera'::text, 'femenino'::text])`,
    ),
  ],
);

export const matches = pgTable(
  'matches',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    slug: text().notNull(),
    seasonId: uuid('season_id').notNull(),
    competitionId: uuid('competition_id').notNull(),
    homeTeamId: uuid('home_team_id').notNull(),
    awayTeamId: uuid('away_team_id').notNull(),
    estadioSanityRef: text('estadio_sanity_ref'),
    jornada: integer(),
    fechaHora: timestamp('fecha_hora', { withTimezone: true, mode: 'string' }).notNull(),
    estado: text().default('programado').notNull(),
    marcadorLocal: integer('marcador_local'),
    marcadorVisita: integer('marcador_visita'),
    asistencia: integer(),
    arbitro: text(),
    broadcastingRefs: jsonb('broadcasting_refs').default([]).notNull(),
    alineacionLocal: jsonb('alineacion_local').default([]).notNull(),
    alineacionVisita: jsonb('alineacion_visita').default([]).notNull(),
    stats: jsonb().default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('matches_away_team_idx').using(
      'btree',
      table.awayTeamId.asc().nullsLast().op('uuid_ops'),
    ),
    index('matches_competition_idx').using(
      'btree',
      table.competitionId.asc().nullsLast().op('uuid_ops'),
    ),
    index('matches_estado_idx').using('btree', table.estado.asc().nullsLast().op('text_ops')),
    index('matches_fecha_hora_idx').using(
      'btree',
      table.fechaHora.desc().nullsFirst().op('timestamptz_ops'),
    ),
    index('matches_home_team_idx').using(
      'btree',
      table.homeTeamId.asc().nullsLast().op('uuid_ops'),
    ),
    index('matches_season_idx').using('btree', table.seasonId.asc().nullsLast().op('uuid_ops')),
    foreignKey({
      columns: [table.awayTeamId],
      foreignColumns: [teams.id],
      name: 'matches_away_team_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.competitionId],
      foreignColumns: [competitions.id],
      name: 'matches_competition_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.homeTeamId],
      foreignColumns: [teams.id],
      name: 'matches_home_team_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.seasonId],
      foreignColumns: [seasons.id],
      name: 'matches_season_id_fkey',
    }).onDelete('restrict'),
    unique('matches_slug_key').on(table.slug),
    check('matches_distinct_teams', sql`home_team_id <> away_team_id`),
    check(
      'matches_estado_check',
      sql`estado = ANY (ARRAY['programado'::text, 'en_vivo'::text, 'finalizado'::text, 'suspendido'::text, 'cancelado'::text])`,
    ),
    check(
      'matches_score_consistency',
      sql`((estado = ANY (ARRAY['programado'::text, 'cancelado'::text, 'suspendido'::text])) AND (marcador_local IS NULL) AND (marcador_visita IS NULL)) OR ((estado = ANY (ARRAY['en_vivo'::text, 'finalizado'::text])) AND (marcador_local IS NOT NULL) AND (marcador_visita IS NOT NULL))`,
    ),
  ],
);

export const players = pgTable(
  'players',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    slug: text().notNull(),
    nombre: text().notNull(),
    apellido: text().notNull(),
    dorsal: integer(),
    posicion: text().notNull(),
    fechaNacimiento: date('fecha_nacimiento'),
    nacionalidad: text(),
    alturaCm: integer('altura_cm'),
    pesoKg: integer('peso_kg'),
    pieHabil: text('pie_habil'),
    fotoUrl: text('foto_url'),
    biografiaSanityRef: text('biografia_sanity_ref'),
    estado: text().default('activo').notNull(),
    teamId: uuid('team_id'),
    historialClubes: jsonb('historial_clubes').default([]).notNull(),
    redesSociales: jsonb('redes_sociales').default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('players_estado_idx').using('btree', table.estado.asc().nullsLast().op('text_ops')),
    index('players_posicion_idx').using('btree', table.posicion.asc().nullsLast().op('text_ops')),
    uniqueIndex('players_team_dorsal_uidx')
      .using(
        'btree',
        table.teamId.asc().nullsLast().op('int4_ops'),
        table.dorsal.asc().nullsLast().op('uuid_ops'),
      )
      .where(sql`((team_id IS NOT NULL) AND (dorsal IS NOT NULL))`),
    index('players_team_idx').using('btree', table.teamId.asc().nullsLast().op('uuid_ops')),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: 'players_team_id_fkey',
    }).onDelete('set null'),
    unique('players_slug_key').on(table.slug),
    check(
      'players_altura_cm_check',
      sql`(altura_cm IS NULL) OR ((altura_cm >= 140) AND (altura_cm <= 230))`,
    ),
    check(
      'players_estado_check',
      sql`estado = ANY (ARRAY['activo'::text, 'lesionado'::text, 'cedido'::text, 'retirado'::text])`,
    ),
    check(
      'players_peso_kg_check',
      sql`(peso_kg IS NULL) OR ((peso_kg >= 40) AND (peso_kg <= 150))`,
    ),
    check(
      'players_pie_habil_check',
      sql`(pie_habil IS NULL) OR (pie_habil = ANY (ARRAY['derecho'::text, 'izquierdo'::text, 'ambidiestro'::text]))`,
    ),
    check(
      'players_posicion_check',
      sql`posicion = ANY (ARRAY['portero'::text, 'defensa'::text, 'mediocampista'::text, 'delantero'::text])`,
    ),
  ],
);

export const staff = pgTable(
  'staff',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    slug: text().notNull(),
    nombre: text().notNull(),
    rol: text().notNull(),
    fotoUrl: text('foto_url'),
    biografiaSanityRef: text('biografia_sanity_ref'),
    teamId: uuid('team_id'),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('staff_rol_idx').using('btree', table.rol.asc().nullsLast().op('text_ops')),
    index('staff_team_idx').using('btree', table.teamId.asc().nullsLast().op('uuid_ops')),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: 'staff_team_id_fkey',
    }).onDelete('set null'),
    unique('staff_slug_key').on(table.slug),
  ],
);

export const matchEvents = pgTable(
  'match_events',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    matchId: uuid('match_id').notNull(),
    teamId: uuid('team_id'),
    playerId: uuid('player_id'),
    minuto: integer().notNull(),
    minutoExtra: integer('minuto_extra'),
    tipo: text().notNull(),
    descripcion: text(),
    metadata: jsonb().default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('match_events_match_idx').using('btree', table.matchId.asc().nullsLast().op('uuid_ops')),
    index('match_events_player_idx').using(
      'btree',
      table.playerId.asc().nullsLast().op('uuid_ops'),
    ),
    index('match_events_team_idx').using('btree', table.teamId.asc().nullsLast().op('uuid_ops')),
    foreignKey({
      columns: [table.matchId],
      foreignColumns: [matches.id],
      name: 'match_events_match_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.playerId],
      foreignColumns: [players.id],
      name: 'match_events_player_id_fkey',
    }).onDelete('set null'),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: 'match_events_team_id_fkey',
    }).onDelete('set null'),
    check('match_events_minuto_check', sql`(minuto >= 0) AND (minuto <= 130)`),
    check('match_events_minuto_extra_check', sql`(minuto_extra IS NULL) OR (minuto_extra >= 0)`),
    check(
      'match_events_tipo_check',
      sql`tipo = ANY (ARRAY['gol'::text, 'gol_penal'::text, 'gol_en_contra'::text, 'amarilla'::text, 'doble_amarilla'::text, 'roja'::text, 'sustitucion'::text, 'penal_fallado'::text, 'var'::text])`,
    ),
  ],
);

export const playerSeasonStats = pgTable(
  'player_season_stats',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    playerId: uuid('player_id').notNull(),
    seasonId: uuid('season_id').notNull(),
    competitionId: uuid('competition_id'),
    partidosJugados: integer('partidos_jugados').default(0).notNull(),
    minutos: integer().default(0).notNull(),
    goles: integer().default(0).notNull(),
    asistencias: integer().default(0).notNull(),
    amarillas: integer().default(0).notNull(),
    rojas: integer().default(0).notNull(),
    stats: jsonb().default({}).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('player_season_stats_season_idx').using(
      'btree',
      table.seasonId.asc().nullsLast().op('uuid_ops'),
    ),
    uniqueIndex('player_season_stats_uidx').using(
      'btree',
      sql`player_id`,
      sql`season_id`,
      sql`COALESCE(competition_id, '00000000-0000-0000-0000-000000000000'`,
    ),
    foreignKey({
      columns: [table.competitionId],
      foreignColumns: [competitions.id],
      name: 'player_season_stats_competition_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.playerId],
      foreignColumns: [players.id],
      name: 'player_season_stats_player_id_fkey',
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.seasonId],
      foreignColumns: [seasons.id],
      name: 'player_season_stats_season_id_fkey',
    }).onDelete('restrict'),
    check('player_season_stats_amarillas_check', sql`amarillas >= 0`),
    check('player_season_stats_asistencias_check', sql`asistencias >= 0`),
    check('player_season_stats_goles_check', sql`goles >= 0`),
    check('player_season_stats_minutos_check', sql`minutos >= 0`),
    check('player_season_stats_partidos_jugados_check', sql`partidos_jugados >= 0`),
    check('player_season_stats_rojas_check', sql`rojas >= 0`),
  ],
);

export const standings = pgTable(
  'standings',
  {
    id: uuid().defaultRandom().primaryKey().notNull(),
    seasonId: uuid('season_id').notNull(),
    competitionId: uuid('competition_id').notNull(),
    teamId: uuid('team_id').notNull(),
    posicion: integer(),
    pj: integer().default(0).notNull(),
    pg: integer().default(0).notNull(),
    pe: integer().default(0).notNull(),
    pp: integer().default(0).notNull(),
    gf: integer().default(0).notNull(),
    gc: integer().default(0).notNull(),
    dg: integer().generatedAlwaysAs(sql`(gf - gc)`),
    pts: integer().default(0).notNull(),
    forma: jsonb().default([]).notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index('standings_competition_idx').using(
      'btree',
      table.competitionId.asc().nullsLast().op('int4_ops'),
      table.seasonId.asc().nullsLast().op('uuid_ops'),
      table.posicion.asc().nullsLast().op('uuid_ops'),
    ),
    foreignKey({
      columns: [table.competitionId],
      foreignColumns: [competitions.id],
      name: 'standings_competition_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.seasonId],
      foreignColumns: [seasons.id],
      name: 'standings_season_id_fkey',
    }).onDelete('restrict'),
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: 'standings_team_id_fkey',
    }).onDelete('restrict'),
    unique('standings_unique').on(table.seasonId, table.competitionId, table.teamId),
    check('standings_gc_check', sql`gc >= 0`),
    check('standings_gf_check', sql`gf >= 0`),
    check('standings_partidos_coherentes', sql`pj = ((pg + pe) + pp)`),
    check('standings_pe_check', sql`pe >= 0`),
    check('standings_pg_check', sql`pg >= 0`),
    check('standings_pj_check', sql`pj >= 0`),
    check('standings_posicion_check', sql`(posicion IS NULL) OR (posicion > 0)`),
    check('standings_pp_check', sql`pp >= 0`),
    check('standings_pts_check', sql`pts >= 0`),
  ],
);
