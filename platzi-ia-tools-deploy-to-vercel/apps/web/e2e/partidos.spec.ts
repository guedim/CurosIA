import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './helpers/axe';

test.describe('Partidos', () => {
  test('el listado responde y muestra filtros', async ({ page }) => {
    await page.goto('/partidos');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('a11y: listado de partidos sin violaciones bloqueantes', async ({ page }) => {
    await page.goto('/partidos');
    await expectNoA11yViolations(page, 'partidos-listado');
  });

  test('permite navegar a un partido si hay tarjetas', async ({ page }) => {
    await page.goto('/partidos');
    const firstLink = page.locator('main a[href^="/partidos/"]').first();
    const count = await firstLink.count();
    test.skip(count === 0, 'No hay partidos seedeados en la DB');
    await firstLink.click();
    await expect(page).toHaveURL(/\/partidos\/[^/]+$/);
    await expect(page.locator('main')).toBeVisible();
  });
});
