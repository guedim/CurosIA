import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

export type CommunityEventTipo =
  | 'puertas_abiertas'
  | 'firma_autografos'
  | 'clinic'
  | 'solidario'
  | 'encuentro_aficion';

export const COMMUNITY_EVENT_TIPOS: readonly CommunityEventTipo[] = [
  'puertas_abiertas',
  'firma_autografos',
  'clinic',
  'solidario',
  'encuentro_aficion',
] as const;

/**
 * Eventos de comunidad: actividades del club con la afición, distintas de
 * partidos oficiales. Tienen su propio calendario y, si `requiereInscripcion`,
 * enlazan a un flujo externo (`externalRsvpUrl`) porque no queremos gestionar
 * identidad en el sitio público.
 */
export const communityEvents = pgTable(
  'community_events',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slug: text('slug').notNull().unique(),
    titulo: text('titulo').notNull(),
    descripcion: text('descripcion').notNull(),
    tipo: text('tipo').$type<CommunityEventTipo>().notNull(),
    location: text('location').notNull(),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }),
    capacidad: integer('capacidad'),
    coverUrl: text('cover_url'),
    coverAlt: text('cover_alt'),
    requiereInscripcion: boolean('requiere_inscripcion').notNull().default(false),
    externalRsvpUrl: text('external_rsvp_url'),
    destacado: boolean('destacado').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    startsAtIdx: index('community_events_starts_at_idx').on(t.startsAt),
    tipoIdx: index('community_events_tipo_idx').on(t.tipo),
    tipoCheck: check(
      'community_events_tipo_check',
      sql`${t.tipo} IN ('puertas_abiertas', 'firma_autografos', 'clinic', 'solidario', 'encuentro_aficion')`,
    ),
    fechasCheck: check(
      'community_events_fechas_check',
      sql`${t.endsAt} IS NULL OR ${t.endsAt} >= ${t.startsAt}`,
    ),
    capacidadCheck: check(
      'community_events_capacidad_check',
      sql`${t.capacidad} IS NULL OR ${t.capacidad} > 0`,
    ),
  }),
);

export type CommunityEvent = typeof communityEvents.$inferSelect;
export type NewCommunityEvent = typeof communityEvents.$inferInsert;
