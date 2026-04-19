import { describe, expect, it } from 'vitest';
import { isLocale, pickLocaleFromAcceptLanguage } from '@/lib/i18n/config';

describe('isLocale', () => {
  it('reconoce locales soportados', () => {
    expect(isLocale('es')).toBe(true);
    expect(isLocale('en')).toBe(true);
  });

  it('rechaza lo demás', () => {
    expect(isLocale('fr')).toBe(false);
    expect(isLocale('')).toBe(false);
    expect(isLocale(undefined)).toBe(false);
    expect(isLocale(42)).toBe(false);
  });
});

describe('pickLocaleFromAcceptLanguage', () => {
  it('elige el locale de mayor calidad coincidente', () => {
    expect(pickLocaleFromAcceptLanguage('en-US,en;q=0.9,es;q=0.8')).toBe('en');
    expect(pickLocaleFromAcceptLanguage('fr-FR,fr;q=0.9,es;q=0.7')).toBe('es');
  });

  it('devuelve null si no hay coincidencias', () => {
    expect(pickLocaleFromAcceptLanguage('ja-JP,ja;q=0.9')).toBeNull();
  });

  it('tolera valores nulos / vacíos', () => {
    expect(pickLocaleFromAcceptLanguage(null)).toBeNull();
    expect(pickLocaleFromAcceptLanguage('')).toBeNull();
  });

  it('normaliza variantes regionales (es-ES → es)', () => {
    expect(pickLocaleFromAcceptLanguage('es-ES;q=0.9')).toBe('es');
  });
});
