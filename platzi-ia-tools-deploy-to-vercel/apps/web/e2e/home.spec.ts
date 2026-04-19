import { expect, test } from '@playwright/test';
import { expectNoA11yViolations } from './helpers/axe';

test.describe('Home', () => {
  test('renderiza el header y las secciones principales', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Platzi FC/i);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('tiene un enlace a /partidos navegable', async ({ page }) => {
    await page.goto('/');
    const partidosLink = page.getByRole('link', { name: /partidos/i }).first();
    await expect(partidosLink).toBeVisible();
    await partidosLink.click();
    await expect(page).toHaveURL(/\/partidos/);
  });

  test('a11y: home sin violaciones WCAG AA bloqueantes', async ({ page }) => {
    await page.goto('/');
    await expectNoA11yViolations(page, 'home');
  });
});
