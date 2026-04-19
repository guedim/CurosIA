import { sql } from 'drizzle-orm';
import {
  check,
  date,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from 'drizzle-orm/pg-core';
import { teams } from './teams';

export type PlayerPosicion = 'portero' | 'defensa' | 'mediocampista' | 'delantero';
export type PlayerPieHabil = 'derecho' | 'izquierdo' | 'ambidiestro';
export type PlayerEstado = 'activo' | 'lesionado' | 'cedido' | 'retirado';

export type HistorialClub = {
  club: string;
  desde: string;
  hasta?: string;
  cedido?: boolean;
};

export type RedesSociales = Partial<{
  instagram: string;
  x: string;
  tiktok: string;
  youtube: string;
  web: string;
}>;

export const players = pgTable(
  'players',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slug: text('slug').notNull().unique(),
    nombre: text('nombre').notNull(),
    apellido: text('apellido').notNull(),
    dorsal: integer('dorsal'),
    posicion: text('posicion').$type<PlayerPosicion>().notNull(),
    fechaNacimiento: date('fecha_nacimiento'),
    nacionalidad: text('nacionalidad'),
    alturaCm: integer('altura_cm'),
    pesoKg: integer('peso_kg'),
    pieHabil: text('pie_habil').$type<PlayerPieHabil>(),
    fotoUrl: text('foto_url'),
    biografiaSanityRef: text('biografia_sanity_ref'),
    estado: text('estado').$type<PlayerEstado>().notNull().default('activo'),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
    historialClubes: jsonb('historial_clubes')
      .$type<HistorialClub[]>()
      .notNull()
      .default(sql`'[]'::jsonb`),
    redesSociales: jsonb('redes_sociales')
      .$type<RedesSociales>()
      .notNull()
      .default(sql`'{}'::jsonb`),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    teamIdx: index('players_team_idx').on(t.teamId),
    posicionIdx: index('players_posicion_idx').on(t.posicion),
    estadoIdx: index('players_estado_idx').on(t.estado),
    teamDorsalUidx: uniqueIndex('players_team_dorsal_uidx')
      .on(t.teamId, t.dorsal)
      .where(sql`${t.teamId} IS NOT NULL AND ${t.dorsal} IS NOT NULL`),
    posicionCheck: check(
      'players_posicion_check',
      sql`${t.posicion} IN ('portero', 'defensa', 'mediocampista', 'delantero')`,
    ),
    estadoCheck: check(
      'players_estado_check',
      sql`${t.estado} IN ('activo', 'lesionado', 'cedido', 'retirado')`,
    ),
    alturaCheck: check(
      'players_altura_check',
      sql`${t.alturaCm} IS NULL OR ${t.alturaCm} BETWEEN 140 AND 230`,
    ),
    pesoCheck: check(
      'players_peso_check',
      sql`${t.pesoKg} IS NULL OR ${t.pesoKg} BETWEEN 40 AND 150`,
    ),
    pieCheck: check(
      'players_pie_check',
      sql`${t.pieHabil} IS NULL OR ${t.pieHabil} IN ('derecho', 'izquierdo', 'ambidiestro')`,
    ),
  }),
);

export type Player = typeof players.$inferSelect;
export type NewPlayer = typeof players.$inferInsert;
