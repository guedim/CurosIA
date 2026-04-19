/**
 * Lighthouse CI — config de auditoría de performance/SEO/a11y.
 *
 * Local:  `pnpm lighthouse` (auto-start del dev server)
 * CI:     `LHCI_BASE_URL=https://preview.vercel.app pnpm lighthouse` contra preview.
 *
 * Los umbrales del plan (Sección 6):
 *   Performance >= 90, A11y >= 95, SEO >= 95
 * En dev server los bundles no están optimizados → bajamos umbrales locales y
 * dejamos que CI los endurezca vía `LHCI_STRICT=1`.
 */

const BASE_URL = process.env.LHCI_BASE_URL ?? 'http://localhost:3000';
const isStrict = process.env.LHCI_STRICT === '1';

const PAGES = ['/', '/partidos', '/equipo', '/noticias', '/tienda'];

const thresholds = isStrict
  ? {
      performance: 0.9,
      accessibility: 0.95,
      'best-practices': 0.9,
      seo: 0.95,
    }
  : {
      performance: 0.7,
      accessibility: 0.9,
      'best-practices': 0.8,
      seo: 0.9,
    };

module.exports = {
  ci: {
    collect: {
      url: PAGES.map((p) => `${BASE_URL}${p}`),
      numberOfRuns: isStrict ? 3 : 1,
      startServerCommand: process.env.LHCI_BASE_URL ? undefined : 'pnpm dev',
      startServerReadyPattern: 'Ready in',
      startServerReadyTimeout: 120_000,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: thresholds.performance }],
        'categories:accessibility': ['error', { minScore: thresholds.accessibility }],
        'categories:best-practices': ['warn', { minScore: thresholds['best-practices'] }],
        'categories:seo': ['error', { minScore: thresholds.seo }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
