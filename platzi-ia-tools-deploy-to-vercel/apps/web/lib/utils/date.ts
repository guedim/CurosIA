/**
 * Formateadores de fecha/hora localizados. Usamos Intl directo en vez de una
 * librería para no inflar bundle. Las fechas llegan como `Date` o ISO string.
 *
 * Los helpers aceptan un locale opcional; si se omite cae a `es-ES` para no
 * romper llamadas existentes. Los componentes Server que ya resuelven el
 * locale deben pasarlo explícitamente.
 */
const TIME_ZONE = 'Europe/Madrid';
const DEFAULT_LOCALE_TAG = 'es-ES';

const dateCache = new Map<string, Intl.DateTimeFormat>();
const timeCache = new Map<string, Intl.DateTimeFormat>();
const dateTimeCache = new Map<string, Intl.DateTimeFormat>();

function dateFmt(locale: string): Intl.DateTimeFormat {
  let fmt = dateCache.get(locale);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      timeZone: TIME_ZONE,
    });
    dateCache.set(locale, fmt);
  }
  return fmt;
}

function timeFmt(locale: string): Intl.DateTimeFormat {
  let fmt = timeCache.get(locale);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: TIME_ZONE,
    });
    timeCache.set(locale, fmt);
  }
  return fmt;
}

function dateTimeFmt(locale: string): Intl.DateTimeFormat {
  let fmt = dateTimeCache.get(locale);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat(locale, {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: TIME_ZONE,
    });
    dateTimeCache.set(locale, fmt);
  }
  return fmt;
}

function toDate(input: Date | string): Date {
  return input instanceof Date ? input : new Date(input);
}

export function formatDate(input: Date | string, locale: string = DEFAULT_LOCALE_TAG): string {
  return dateFmt(locale).format(toDate(input));
}

export function formatTime(input: Date | string, locale: string = DEFAULT_LOCALE_TAG): string {
  return timeFmt(locale).format(toDate(input));
}

export function formatDateTime(input: Date | string, locale: string = DEFAULT_LOCALE_TAG): string {
  return dateTimeFmt(locale).format(toDate(input));
}

/**
 * `YYYY-MM-DD…` en UTC — usado en atributos `datetime` y en JSON-LD.
 */
export function toIsoDate(input: Date | string): string {
  return toDate(input).toISOString();
}
