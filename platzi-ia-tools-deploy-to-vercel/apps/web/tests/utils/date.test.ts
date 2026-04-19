import { describe, expect, it } from 'vitest';
import { formatDate, formatDateTime, formatTime, toIsoDate } from '@/lib/utils/date';

const SAMPLE = new Date('2025-03-15T19:30:00Z');

describe('formatDate', () => {
  it('devuelve un string con día, mes y año', () => {
    const out = formatDate(SAMPLE);
    expect(out).toContain('2025');
    expect(out.toLowerCase()).toContain('mar');
    expect(out).toContain('15');
  });

  it('acepta strings ISO', () => {
    const out = formatDate('2025-03-15T19:30:00Z');
    expect(out).toContain('2025');
  });
});

describe('formatTime', () => {
  it('devuelve HH:MM en Europe/Madrid', () => {
    const out = formatTime(SAMPLE);
    expect(out).toMatch(/\d{2}:\d{2}/);
    expect(out).toContain('20:30');
  });
});

describe('formatDateTime', () => {
  it('combina fecha y hora', () => {
    const out = formatDateTime(SAMPLE);
    expect(out).toContain('2025');
    expect(out).toMatch(/\d{2}:\d{2}/);
  });
});

describe('toIsoDate', () => {
  it('acepta Date', () => {
    expect(toIsoDate(SAMPLE)).toBe('2025-03-15T19:30:00.000Z');
  });

  it('normaliza strings al mismo ISO', () => {
    expect(toIsoDate('2025-03-15T19:30:00Z')).toBe('2025-03-15T19:30:00.000Z');
  });
});
