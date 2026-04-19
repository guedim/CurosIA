import { expect, test } from '@playwright/test';

test.describe('SEO técnico', () => {
  test('home expone metadatos básicos', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/\S+/);
    const description = await page.locator('meta[name="description"]').getAttribute('content');
    expect(description?.length ?? 0).toBeGreaterThan(0);
  });

  test('sitemap.xml responde', async ({ request, baseURL }) => {
    const res = await request.get(`${baseURL}/sitemap.xml`);
    expect(res.ok()).toBeTruthy();
    const body = await res.text();
    expect(body).toContain('<urlset');
  });

  test('robots.txt responde', async ({ request, baseURL }) => {
    const res = await request.get(`${baseURL}/robots.txt`);
    expect(res.ok()).toBeTruthy();
    expect(await res.text()).toMatch(/Sitemap|User-agent/);
  });
});
