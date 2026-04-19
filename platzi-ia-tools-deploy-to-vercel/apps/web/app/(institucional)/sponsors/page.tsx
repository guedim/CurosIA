import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { listSponsorsByTier } from '@/lib/db/sponsors';
import type { Sponsor, SponsorTier } from '@/types';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'Patrocinadores',
  description:
    'Empresas y marcas aliadas del Platzi FC: patrocinador principal, premium y partners oficiales.',
};

const TIER_TITLE: Record<SponsorTier, string> = {
  principal: 'Patrocinador principal',
  premium: 'Patrocinadores premium',
  partner: 'Partners oficiales',
};

const TIER_DESCRIPTION: Record<SponsorTier, string> = {
  principal: 'Socio estratégico que lidera el proyecto del primer equipo y la cantera.',
  premium:
    'Marcas que acompañan al club en áreas clave como estadio, energía y servicios financieros.',
  partner: 'Empresas que participan en activaciones específicas con el club y la afición.',
};

export default async function Page() {
  const grouped = await listSponsorsByTier();

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <Badge variant="default">Patrocinadores</Badge>
        <h1 className="text-brand-950 text-3xl font-bold leading-tight sm:text-4xl">
          Marcas que caminan con el Platzi FC
        </h1>
        <p className="text-brand-700 max-w-2xl">
          Agradecemos a nuestros patrocinadores el apoyo continuado al proyecto deportivo, social y
          editorial del club.
        </p>
      </header>

      {(Object.keys(TIER_TITLE) as SponsorTier[]).map((tier) => (
        <SponsorSection key={tier} tier={tier} sponsors={grouped[tier]} />
      ))}
    </div>
  );
}

function SponsorSection({ tier, sponsors }: { tier: SponsorTier; sponsors: Sponsor[] }) {
  if (!sponsors.length) return null;
  return (
    <section aria-labelledby={`tier-${tier}`} className="space-y-4">
      <div className="space-y-1">
        <h2 id={`tier-${tier}`} className="text-brand-950 text-xl font-semibold">
          {TIER_TITLE[tier]}
        </h2>
        <p className="text-brand-600 text-sm">{TIER_DESCRIPTION[tier]}</p>
      </div>
      <ul
        className={tier === 'principal' ? 'grid gap-4' : 'grid gap-4 sm:grid-cols-2 lg:grid-cols-3'}
        role="list"
      >
        {sponsors.map((s) => (
          <li key={s.id}>
            <SponsorCard sponsor={s} prominent={tier === 'principal'} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function SponsorCard({ sponsor, prominent = false }: { sponsor: Sponsor; prominent?: boolean }) {
  const content = (
    <div
      className={
        'rounded-card border-brand-100 flex h-full flex-col gap-3 border bg-white p-5 transition ' +
        (sponsor.url
          ? 'hover:border-brand-300 hover:shadow-card focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2'
          : '')
      }
    >
      <div
        className={
          'bg-brand-50 flex items-center justify-center rounded-md ' +
          (prominent ? 'h-32 md:h-40' : 'h-24')
        }
        aria-hidden="true"
      >
        {sponsor.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sponsor.logoUrl}
            alt=""
            className="max-h-full max-w-[70%] object-contain"
            loading="lazy"
          />
        ) : (
          <span className="text-brand-500 text-sm">{sponsor.nombre}</span>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-brand-950 text-base font-semibold">{sponsor.nombre}</h3>
        {sponsor.descripcion ? (
          <p className="text-brand-700 text-sm">{sponsor.descripcion}</p>
        ) : null}
      </div>
      {sponsor.url ? (
        <span className="text-brand-600 mt-auto text-xs font-medium">Visitar sitio →</span>
      ) : null}
    </div>
  );

  if (sponsor.url) {
    return (
      <a
        href={sponsor.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${sponsor.nombre} (se abre en una pestaña nueva)`}
        className="block h-full"
      >
        {content}
      </a>
    );
  }
  return content;
}
