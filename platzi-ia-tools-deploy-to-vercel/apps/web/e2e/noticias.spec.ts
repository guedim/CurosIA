import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './helpers/axe';

test.describe('Noticias', () => {
  test('listado de noticias responde', async ({ page }) => {
    await page.goto('/noticias');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('a11y: listado sin violaciones bloqueantes', async ({ page }) => {
    await page.goto('/noticias');
    await expectNoA11yViolations(page, 'noticias-listado');
  });

  test('navega al detalle de una noticia si existen', async ({ page }) => {
    await page.goto('/noticias');
    const link = page.locator('main a[href^="/noticias/"]').first();
    const count = await link.count();
    test.skip(count === 0, 'No hay noticias seedeadas');
    await link.click();
    await expect(page).toHaveURL(/\/noticias\/[^/]+$/);
    await expect(page.getByRole('article')).toBeVisible();
  });
});
