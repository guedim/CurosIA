import { describe, expect, it } from 'vitest';
import { formatMoney } from '@/lib/utils/money';

describe('formatMoney', () => {
  it('formatea céntimos como euros con locale es-ES por defecto', () => {
    const out = formatMoney(8999);
    expect(out).toContain('89,99');
    expect(out).toContain('€');
  });

  it('soporta cero', () => {
    expect(formatMoney(0)).toContain('0,00');
  });

  it('redondea a dos decimales como máximo', () => {
    expect(formatMoney(12345)).toContain('123,45');
  });

  it('acepta otra moneda', () => {
    const out = formatMoney(1000, 'USD', 'en-US');
    expect(out).toBe('$10.00');
  });

  it('maneja importes negativos', () => {
    const out = formatMoney(-500);
    expect(out).toContain('-');
    expect(out).toContain('5,00');
  });
});
