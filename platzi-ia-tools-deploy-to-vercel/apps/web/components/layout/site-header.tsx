import Link from 'next/link';
import { LanguageSwitcher } from '@/components/layout/language-switcher';
import { getT } from '@/lib/i18n';
import { cn } from '@/lib/utils/cn';

export async function SiteHeader() {
  const { locale, dict } = await getT();
  const navItems: { href: string; label: string }[] = [
    { href: '/partidos', label: dict.nav.partidos },
    { href: '/equipo', label: dict.nav.equipo },
    { href: '/competicion', label: dict.nav.competicion },
    { href: '/noticias', label: dict.nav.noticias },
    { href: '/entradas', label: dict.nav.entradas },
    { href: '/tienda', label: dict.nav.tienda },
    { href: '/club/historia', label: dict.nav.club },
  ];

  return (
    <header className="border-brand-100 sticky top-0 z-40 w-full border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="text-brand-900 flex items-center gap-2 text-lg font-semibold"
          aria-label={dict.nav.home}
        >
          <span
            aria-hidden="true"
            className={cn(
              'inline-flex h-8 w-8 items-center justify-center rounded-full',
              'bg-brand-600 text-sm font-bold text-white',
            )}
          >
            PFC
          </span>
          <span className="hidden sm:inline">Platzi FC</span>
        </Link>

        <nav aria-label={dict.nav.mainLabel} className="min-w-0 flex-1">
          <ul className="flex flex-wrap items-center gap-1 sm:gap-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'text-brand-800 inline-flex items-center rounded-md px-2.5 py-1.5 text-sm font-medium',
                    'hover:bg-brand-50 hover:text-brand-950',
                    'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2',
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <LanguageSwitcher current={locale} label={dict.nav.languageSwitcher} />
          <Link
            href="/busqueda"
            aria-label={dict.nav.search}
            className={cn(
              'inline-flex h-9 w-9 items-center justify-center rounded-md',
              'text-brand-800 hover:bg-brand-50 hover:text-brand-950',
              'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2',
            )}
          >
            <span aria-hidden="true">⌕</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
