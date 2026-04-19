import { describe, expect, it } from 'vitest';
import { cn } from '@/lib/utils/cn';

describe('cn', () => {
  it('concatena clases estáticas', () => {
    expect(cn('px-4', 'py-2')).toBe('px-4 py-2');
  });

  it('filtra valores falsy', () => {
    expect(cn('px-4', false && 'hidden', null, undefined, 'text-white')).toBe('px-4 text-white');
  });

  it('resuelve conflictos Tailwind manteniendo la última clase', () => {
    expect(cn('px-2', 'px-4')).toBe('px-4');
  });

  it('soporta arrays y objetos (pasados a clsx)', () => {
    expect(cn(['px-4', { 'bg-red-500': true, 'bg-blue-500': false }])).toBe('px-4 bg-red-500');
  });

  it('devuelve string vacío si no hay input', () => {
    expect(cn()).toBe('');
  });
});
