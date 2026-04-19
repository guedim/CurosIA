import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './helpers/axe';

test.describe('Equipo', () => {
  test('plantilla responde', async ({ page }) => {
    await page.goto('/equipo');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('a11y: plantilla sin violaciones bloqueantes', async ({ page }) => {
    await page.goto('/equipo');
    await expectNoA11yViolations(page, 'equipo-plantilla');
  });

  test('navega al perfil de un jugador si hay datos', async ({ page }) => {
    await page.goto('/equipo');
    const link = page.locator('main a[href^="/equipo/"]').first();
    const count = await link.count();
    test.skip(count === 0, 'No hay jugadores seedeados');
    await link.click();
    await expect(page).toHaveURL(/\/equipo\/[^/]+$/);
  });
});
