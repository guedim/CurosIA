import { asc, eq, sponsors, type Sponsor, type SponsorTier } from '@platzi-fc/db';
import { getDb } from '@/lib/db';

export async function listSponsors(): Promise<Sponsor[]> {
  const db = getDb();
  return db
    .select()
    .from(sponsors)
    .where(eq(sponsors.activo, true))
    .orderBy(asc(sponsors.tier), asc(sponsors.orden), asc(sponsors.nombre));
}

export async function listSponsorsByTier(): Promise<Record<SponsorTier, Sponsor[]>> {
  const all = await listSponsors();
  const grouped: Record<SponsorTier, Sponsor[]> = {
    principal: [],
    premium: [],
    partner: [],
  };
  for (const s of all) grouped[s.tier].push(s);
  return grouped;
}
