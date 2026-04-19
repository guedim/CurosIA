import type { Metadata } from 'next';
import { MembershipCard } from '@/components/fans/membership-card';
import { Card, CardBody } from '@/components/ui/card';
import { listMemberships } from '@/lib/db/memberships';
import { getT } from '@/lib/i18n';

export const metadata: Metadata = {
  title: 'Membresía',
  description: 'Conoce los planes de membresía del Platzi FC.',
};

export const revalidate = 600;

export default async function MembresiaPage() {
  const [{ dict }, memberships] = await Promise.all([getT(), listMemberships()]);
  const t = dict.fans.membership;

  return (
    <div className="space-y-10">
      <header className="rounded-card bg-brand-900 px-6 py-12 text-white sm:px-10">
        <h1 className="text-3xl font-bold sm:text-4xl">{t.heroTitle}</h1>
        <p className="text-brand-100 mt-3 max-w-2xl">{t.heroSubtitle}</p>
      </header>

      {memberships.length ? (
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" role="list">
          {memberships.map((m) => (
            <li key={m.id}>
              <MembershipCard
                membership={m}
                highlighted={m.tier === 'socio'}
                currencyLocale={dict.currencyLocale}
                labels={{
                  pricePerYear: t.pricePerYear,
                  cta: t.cta,
                  benefits: t.benefits,
                  mostPopular: t.mostPopular,
                  external: t.external,
                }}
              />
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <CardBody className="text-brand-700 text-sm">Sin planes publicados.</CardBody>
        </Card>
      )}
    </div>
  );
}
