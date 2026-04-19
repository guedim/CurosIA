import { asc, eq, memberships, type Membership } from '@platzi-fc/db';
import { getDb } from '@/lib/db';

/**
 * Devuelve los planes de membresía activos ordenados por `orden` (1..N), que
 * coincide con la jerarquía de precio (fan → legend). Se consume desde
 * `/fans` y `/fans/membresia`.
 */
export async function listMemberships(): Promise<Membership[]> {
  const db = getDb();
  return db
    .select()
    .from(memberships)
    .where(eq(memberships.activo, true))
    .orderBy(asc(memberships.orden));
}

export async function getMembershipBySlug(slug: string): Promise<Membership | null> {
  const db = getDb();
  const [row] = await db.select().from(memberships).where(eq(memberships.slug, slug)).limit(1);
  return row ?? null;
}
