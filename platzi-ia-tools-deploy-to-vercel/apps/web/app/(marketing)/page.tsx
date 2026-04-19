import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/card';
import { MatchCard } from '@/components/matches/match-card';
import { Scoreboard } from '@/components/matches/scoreboard';
import { getProximoPartidoClub, getUltimosResultadosClub } from '@/lib/db/matches';
import { getT } from '@/lib/i18n';
import { cn } from '@/lib/utils/cn';

export const revalidate = 60;

export default async function HomePage() {
  const [proximo, ultimos, { dict }] = await Promise.all([
    getProximoPartidoClub(),
    getUltimosResultadosClub(3),
    getT(),
  ]);
  const t = dict.home;

  return (
    <div className="space-y-12">
      <section className="rounded-card bg-brand-900 px-6 py-14 text-white sm:px-10">
        <Badge variant="success" className="mb-3">
          {t.season}
        </Badge>
        <h1 className="text-4xl font-bold leading-tight sm:text-5xl">{t.title}</h1>
        <p className="text-brand-100 mt-3 max-w-2xl">{t.subtitle}</p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/partidos"
            className={cn(
              'inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-medium',
              'text-brand-900 hover:bg-brand-50 bg-white',
              'focus-visible:ring-offset-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2',
            )}
          >
            {t.ctaMatches}
          </Link>
          <Link
            href="/entradas"
            className={cn(
              'inline-flex h-10 items-center justify-center rounded-md border border-white/70 px-4 text-sm font-medium',
              'text-white hover:bg-white/10',
              'focus-visible:ring-offset-brand-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2',
            )}
          >
            {t.ctaTickets}
          </Link>
        </div>
      </section>

      <section aria-label={t.nextMatch}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-brand-950 text-2xl font-semibold">
            {proximo?.estado === 'en_vivo' ? t.live : t.nextMatch}
          </h2>
          <Link
            href="/partidos?estado=programado"
            className="text-brand-700 text-sm hover:underline"
          >
            {t.viewCalendar}
          </Link>
        </div>
        {proximo ? (
          <Link
            href={`/partidos/${proximo.slug}`}
            className="rounded-card focus-visible:ring-brand-400 block focus-visible:outline-none focus-visible:ring-2"
            aria-label={`${t.nextMatch}: ${proximo.homeTeam.nombre} vs ${proximo.awayTeam.nombre}`}
          >
            <Scoreboard match={proximo} />
          </Link>
        ) : (
          <Card>
            <CardBody className="text-brand-700 text-sm">{t.noUpcoming}</CardBody>
          </Card>
        )}
      </section>

      <section aria-label={t.latestResults}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-brand-950 text-2xl font-semibold">{t.latestResults}</h2>
          <Link
            href="/partidos?estado=finalizado"
            className="text-brand-700 text-sm hover:underline"
          >
            {t.viewAll}
          </Link>
        </div>
        {ultimos.length ? (
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" role="list">
            {ultimos.map((m) => (
              <li key={m.id}>
                <MatchCard match={m} highlightTeamSlug="platzi-fc" />
              </li>
            ))}
          </ul>
        ) : (
          <Card>
            <CardBody className="text-brand-700 text-sm">{t.noResults}</CardBody>
          </Card>
        )}
      </section>

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t.news}</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-brand-700 text-sm">{t.newsDesc}</p>
            <Link
              href="/noticias"
              className="text-brand-700 mt-3 inline-block text-sm font-medium hover:underline"
            >
              {t.newsCta}
            </Link>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.standings}</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-brand-700 text-sm">{t.standingsDesc}</p>
            <Link
              href="/competicion"
              className="text-brand-700 mt-3 inline-block text-sm font-medium hover:underline"
            >
              {t.standingsCta}
            </Link>
          </CardBody>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{t.shop}</CardTitle>
          </CardHeader>
          <CardBody>
            <p className="text-brand-700 text-sm">{t.shopDesc}</p>
            <Link
              href="/tienda"
              className="text-brand-700 mt-3 inline-block text-sm font-medium hover:underline"
            >
              {t.shopCta}
            </Link>
          </CardBody>
        </Card>
      </section>
    </div>
  );
}
