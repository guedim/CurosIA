import { sql } from 'drizzle-orm';
import { index, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import { teams } from './teams';

export const staff = pgTable(
  'staff',
  {
    id: uuid('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    slug: text('slug').notNull().unique(),
    nombre: text('nombre').notNull(),
    rol: text('rol').notNull(),
    fotoUrl: text('foto_url'),
    biografiaSanityRef: text('biografia_sanity_ref'),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    teamIdx: index('staff_team_idx').on(t.teamId),
    rolIdx: index('staff_rol_idx').on(t.rol),
  }),
);

export type Staff = typeof staff.$inferSelect;
export type NewStaff = typeof staff.$inferInsert;
