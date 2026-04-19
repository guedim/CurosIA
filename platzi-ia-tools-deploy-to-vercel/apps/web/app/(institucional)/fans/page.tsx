import type { Metadata } from 'next';
import Link from 'next/link';
import { EventCard } from '@/components/fans/event-card';
import { MembershipCard } from '@/components/fans/membership-card';
import { NewsletterForm } from '@/components/fans/newsletter-form';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { listCommunityEvents } from '@/lib/db/community-events';
import { listMemberships } from '@/lib/db/memberships';
import { getT } from '@/lib/i18n';
import { buildEventTypeLabels } from '@/lib/i18n/event-type-labels';

export const metadata: Metadata = {
  title: 'Fans',
  description: 'Membresías, eventos de comunidad y newsletter del Platzi FC.',
};

export const revalidate = 300;

export default async function FansHubPage() {
  const [{ dict, locale }, memberships, upcomingEvents] = await Promise.all([
    getT(),
    listMemberships(),
    listCommunityEvents({ scope: 'upcoming', limit: 3 }),
  ]);
  const t = dict.fans;
  const ml = t.membership;
  const el = t.events;
  const typeLabels = buildEventTypeLabels(dict);

  return (
    <div className="space-y-12">
      <section className="rounded-card bg-brand-900 px-6 py-12 text-white sm:px-10">
        <h1 className="text-3xl font-bold sm:text-4xl">{t.title}</h1>
        <p className="text-brand-100 mt-3 max-w-2xl">{t.subtitle}</p>
      </section>

      <section aria-labelledby="memberships-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 id="memberships-heading" className="text-brand-950 text-2xl font-semibold">
              {ml.sectionTitle}
            </h2>
            <p className="text-brand-700 mt-1 text-sm">{ml.sectionDesc}</p>
          </div>
          <Link href="/fans/membresia" className="text-brand-700 text-sm hover:underline">
            {ml.seeAll} →
          </Link>
        </div>
        {memberships.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" role="list">
            {memberships.map((m) => (
              <li key={m.id}>
                <MembershipCard
                  membership={m}
                  highlighted={m.tier === 'socio'}
                  currencyLocale={dict.currencyLocale}
                  labels={{
                    pricePerYear: ml.pricePerYear,
                    cta: ml.cta,
                    benefits: ml.benefits,
                    mostPopular: ml.mostPopular,
                    external: ml.external,
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
      </section>

      <section aria-labelledby="events-heading">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <h2 id="events-heading" className="text-brand-950 text-2xl font-semibold">
              {el.sectionTitle}
            </h2>
            <p className="text-brand-700 mt-1 text-sm">{el.sectionDesc}</p>
          </div>
          <Link href="/fans/eventos" className="text-brand-700 text-sm hover:underline">
            {el.all} →
          </Link>
        </div>
        {upcomingEvents.length ? (
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {upcomingEvents.map((e) => (
              <li key={e.id}>
                <EventCard
                  event={e}
                  typeLabels={typeLabels}
                  dateLocale={dict.dateLocale}
                  labels={{
                    rsvp: el.rsvp,
                    openDoors: el.openDoors,
                    location: el.location,
                    startsAt: el.startsAt,
                    detailCta: el.detailCta,
                  }}
                />
              </li>
            ))}
          </ul>
        ) : (
          <Card>
            <CardBody className="text-brand-700 text-sm">{el.noEvents}</CardBody>
          </Card>
        )}
      </section>

      <section aria-labelledby="newsletter-heading" className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle id="newsletter-heading">{t.newsletter.sectionTitle}</CardTitle>
          </CardHeader>
          <CardBody className="space-y-4">
            <p className="text-brand-700 text-sm">{t.newsletter.sectionDesc}</p>
            <NewsletterForm
              locale={locale}
              source="fans-hub"
              labels={{
                emailLabel: t.newsletter.emailLabel,
                emailPlaceholder: t.newsletter.emailPlaceholder,
                submit: t.newsletter.submit,
                successTitle: t.newsletter.successTitle,
                successBody: t.newsletter.successBody,
                errorInvalid: t.newsletter.errorInvalid,
                errorRequired: t.newsletter.errorRequired,
                errorUnknown: t.newsletter.errorUnknown,
                consent: t.newsletter.consent,
              }}
            />
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
