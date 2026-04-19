import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './helpers/axe';

test.describe('Tienda', () => {
  test('catálogo responde', async ({ page }) => {
    await page.goto('/tienda');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('a11y: catálogo sin violaciones bloqueantes', async ({ page }) => {
    await page.goto('/tienda');
    await expectNoA11yViolations(page, 'tienda');
  });

  test('busqueda responde con un query', async ({ page }) => {
    await page.goto('/busqueda?q=platzi');
    await expect(page.locator('main')).toBeVisible();
  });

  test('a11y: búsqueda sin violaciones bloqueantes', async ({ page }) => {
    await page.goto('/busqueda?q=platzi');
    await expectNoA11yViolations(page, 'busqueda');
  });
});
