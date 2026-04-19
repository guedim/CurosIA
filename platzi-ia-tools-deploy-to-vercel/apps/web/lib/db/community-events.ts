import {
  and,
  asc,
  communityEvents,
  desc,
  eq,
  gte,
  lt,
  type CommunityEvent,
  type CommunityEventTipo,
  type SQL,
} from '@platzi-fc/db';
import { getDb } from '@/lib/db';

export type EventFilters = {
  tipo?: CommunityEventTipo;
  scope?: 'upcoming' | 'past' | 'all';
  limit?: number;
};

/**
 * Listado filtrable de eventos de comunidad.
 *
 * - `scope=upcoming` (default): eventos con `startsAt >= now`, orden ascendente.
 * - `scope=past`: eventos con `startsAt < now`, orden descendente (más recientes primero).
 * - `scope=all`: todos, orden ascendente por fecha.
 *
 * El corte `now` se calcula en servidor en cada request, por lo que la ruta
 * que consume esto debe ser dinámica (o revalidar frecuentemente).
 */
export async function listCommunityEvents(filters: EventFilters = {}): Promise<CommunityEvent[]> {
  const db = getDb();
  const scope = filters.scope ?? 'upcoming';
  const now = new Date();
  const conditions: SQL[] = [];

  if (filters.tipo) conditions.push(eq(communityEvents.tipo, filters.tipo));
  if (scope === 'upcoming') conditions.push(gte(communityEvents.startsAt, now));
  else if (scope === 'past') conditions.push(lt(communityEvents.startsAt, now));

  let query = db
    .select()
    .from(communityEvents)
    .where(conditions.length ? and(...conditions) : undefined)
    .$dynamic();

  query =
    scope === 'past'
      ? query.orderBy(desc(communityEvents.startsAt))
      : query.orderBy(asc(communityEvents.startsAt));

  if (filters.limit) query = query.limit(filters.limit);
  return query;
}

export async function getCommunityEventBySlug(slug: string): Promise<CommunityEvent | null> {
  const db = getDb();
  const [row] = await db
    .select()
    .from(communityEvents)
    .where(eq(communityEvents.slug, slug))
    .limit(1);
  return row ?? null;
}
