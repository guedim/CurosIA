import Link from 'next/link';
import { getT } from '@/lib/i18n';

export async function SiteFooter() {
  const { dict } = await getT();
  const { sections, links, rights, disclaimer } = dict.footer;
  const year = new Date().getFullYear();

  const groups: { title: string; items: { href: string; label: string }[] }[] = [
    {
      title: sections.club,
      items: [
        { href: '/club/historia', label: links.historia },
        { href: '/club/identidad', label: links.identidad },
        { href: '/club/directiva', label: links.directiva },
        { href: '/club/estadio', label: links.estadio },
        { href: '/club/contacto', label: links.contacto },
      ],
    },
    {
      title: sections.deportivo,
      items: [
        { href: '/partidos', label: links.partidos },
        { href: '/equipo', label: links.equipo },
        { href: '/equipo/staff', label: links.staff },
        { href: '/competicion', label: links.competicion },
      ],
    },
    {
      title: sections.fans,
      items: [
        { href: '/entradas', label: links.entradas },
        { href: '/entradas/abonos', label: links.abonos },
        { href: '/tienda', label: links.tienda },
        { href: '/noticias', label: links.noticias },
      ],
    },
    {
      title: sections.legal,
      items: [
        { href: '/terminos', label: links.terminos },
        { href: '/privacidad', label: links.privacidad },
        { href: '/cookies', label: links.cookies },
        { href: '/accesibilidad', label: links.accesibilidad },
      ],
    },
  ];

  return (
    <footer className="border-brand-100 bg-brand-50 mt-16 border-t">
      <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {groups.map((group) => (
            <div key={group.title}>
              <h2 className="text-brand-900 mb-3 text-sm font-semibold uppercase tracking-wide">
                {group.title}
              </h2>
              <ul className="space-y-2">
                {group.items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-brand-700 hover:text-brand-950 focus-visible:ring-brand-400 rounded text-sm hover:underline focus-visible:outline-none focus-visible:ring-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-brand-200 text-brand-700 mt-10 flex flex-col items-start justify-between gap-2 border-t pt-6 text-xs sm:flex-row sm:items-center">
          <p>
            &copy; {year} Platzi FC. {rights}
          </p>
          <p>{disclaimer}</p>
        </div>
      </div>
    </footer>
  );
}
