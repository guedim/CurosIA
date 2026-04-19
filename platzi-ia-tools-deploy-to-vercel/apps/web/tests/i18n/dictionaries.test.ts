import { describe, expect, it } from 'vitest';
import { es } from '@/lib/i18n/dictionaries/es';
import { en } from '@/lib/i18n/dictionaries/en';

function allLeafKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const out: string[] = [];
  for (const [k, v] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${k}` : k;
    if (v && typeof v === 'object' && !Array.isArray(v)) {
      out.push(...allLeafKeys(v as Record<string, unknown>, path));
    } else {
      out.push(path);
    }
  }
  return out.sort();
}

describe('diccionarios i18n', () => {
  it('tienen exactamente las mismas claves en es y en', () => {
    expect(allLeafKeys(en)).toEqual(allLeafKeys(es));
  });

  it('todas las claves tienen valor string no vacío', () => {
    for (const dict of [es, en]) {
      for (const key of allLeafKeys(dict as Record<string, unknown>)) {
        const value = key
          .split('.')
          .reduce<unknown>((acc, k) => (acc as Record<string, unknown>)[k], dict);
        expect(value, `clave vacía: ${key}`).toBeTypeOf('string');
        expect((value as string).length, `clave vacía: ${key}`).toBeGreaterThan(0);
      }
    }
  });

  it('exponen el locale correcto', () => {
    expect(es.locale).toBe('es');
    expect(en.locale).toBe('en');
  });
});
