import { setLocaleAction } from '@/app/actions/locale';
import { LOCALES, type Locale } from '@/lib/i18n/config';
import { cn } from '@/lib/utils/cn';

const LABEL: Record<Locale, string> = {
  es: 'ES',
  en: 'EN',
};

export interface LanguageSwitcherProps {
  current: Locale;
  label: string;
}

/**
 * Selector de idioma accesible: un `<form>` por locale con un botón submit.
 * El Server Action `setLocaleAction` persiste la elección y revalida el
 * layout, así que funciona sin JS de cliente. `aria-pressed` indica al
 * lector de pantallas cuál es el idioma activo.
 */
export function LanguageSwitcher({ current, label }: LanguageSwitcherProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className="border-brand-200 inline-flex items-center rounded-md border bg-white p-0.5 text-xs"
    >
      {LOCALES.map((loc) => {
        const active = loc === current;
        return (
          <form key={loc} action={setLocaleAction}>
            <input type="hidden" name="locale" value={loc} />
            <button
              type="submit"
              aria-pressed={active}
              aria-label={`${label}: ${LABEL[loc]}`}
              className={cn(
                'inline-flex h-7 min-w-[2rem] items-center justify-center rounded px-2 font-semibold uppercase transition',
                active
                  ? 'bg-brand-900 text-white'
                  : 'text-brand-700 hover:bg-brand-50 hover:text-brand-950',
                'focus-visible:ring-brand-400 focus-visible:outline-none focus-visible:ring-2',
              )}
            >
              {LABEL[loc]}
            </button>
          </form>
        );
      })}
    </div>
  );
}
