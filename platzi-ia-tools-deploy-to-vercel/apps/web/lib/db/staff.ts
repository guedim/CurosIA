import { asc, eq, staff, teams, type Staff, type Team } from '@platzi-fc/db';
import { getDb } from '@/lib/db';

const CLUB_PRINCIPAL_SLUG = 'platzi-fc';

export type StaffWithTeam = Staff & { team: Team | null };

export async function listStaff(teamSlug = CLUB_PRINCIPAL_SLUG): Promise<StaffWithTeam[]> {
  const db = getDb();
  const [team] = await db.select().from(teams).where(eq(teams.slug, teamSlug)).limit(1);
  if (!team) return [];

  const rows = await db
    .select()
    .from(staff)
    .where(eq(staff.teamId, team.id))
    .orderBy(asc(staff.rol), asc(staff.nombre));

  return rows.map((s) => ({ ...s, team }));
}
