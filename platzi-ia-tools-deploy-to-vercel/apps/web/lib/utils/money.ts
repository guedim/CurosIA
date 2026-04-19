/**
 * Formatea un importe almacenado en céntimos (int) como texto localizado.
 * Ejemplo: `formatMoney(8999, 'EUR')` → `"89,99 €"`.
 */
export function formatMoney(cents: number, currency = 'EUR', locale = 'es-ES'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}
