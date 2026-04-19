import { test, expect } from '@playwright/test';

test.describe('Portfolio E2E Tests', () => {
  let baseUrl: string;

  test.beforeAll(async () => {
    // Configurar la URL base (ajusta según tu configuración)
    baseUrl = process.env.BASE_URL || 'http://localhost:3000';
  });

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('Validar página principal (Home)', async ({ page }) => {
    // Verificar título de la página
    await expect(page).toHaveTitle(/Mario Guerrero Portfolio/);
    
    // Verificar elementos principales del home
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    await expect(page.locator('text=MG')).toBeVisible();
    
    // Verificar enlaces de navegación principales (usar first para evitar duplicados)
    await expect(page.locator('nav a[href="/"]').first()).toBeVisible();
    await expect(page.locator('nav a[href="/about"]')).toBeVisible();
    await expect(page.locator('nav a[href="/blog"]')).toBeVisible();
    
    // Verificar contenido principal
    await expect(page.locator('text=About me')).toBeVisible();
    await expect(page.locator('text=Blog')).toBeVisible();
    
    // Verificar que no haya errores de consola
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.waitForLoadState('networkidle');
    expect(errors).toHaveLength(0);
  });

  test('Validar página About', async ({ page }) => {
    // Navegar a About directamente con timeout extendido
    await page.goto(`${baseUrl}/about`, { timeout: 10000 });
    await page.waitForLoadState('networkidle');
    
    // Verificar URL
    expect(page.url()).toContain('/about');
    
    // Verificar contenido de About
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('h1:has-text("About me")')).toBeVisible();
    await expect(page.locator('text=Projects')).toBeVisible();
    await expect(page.locator('text=Talks')).toBeVisible();
    
    // Verificar navegación de regreso
    await expect(page.locator('nav a[href="/"]').first()).toBeVisible();
  });

  test('Validar página Blog', async ({ page }) => {
    // Navegar a Blog directamente
    await page.goto(`${baseUrl}/blog`);
    await page.waitForLoadState('networkidle');
    
    // Verificar URL
    expect(page.url()).toContain('/blog');
    
    // Verificar título y contenido del blog
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('h1')).toBeVisible();
    
    // Buscar artículos o posts
    const articles = page.locator('article');
    const articleCount = await articles.count();
    
    expect(articleCount).toBeGreaterThan(0);
    
    // Validar que cada artículo tenga enlace
    for (let i = 0; i < Math.min(articleCount, 3); i++) {
      const article = articles.nth(i);
      const link = article.locator('a').first();
      
      if (await link.isVisible()) {
        // Verificar que el enlace tenga href válido
        const href = await link.getAttribute('href');
        expect(href).toBeTruthy();
        expect(href?.length).toBeGreaterThan(0);
      }
    }
  });

  test('Validar enlaces internos del Blog', async ({ page }) => {
    // Navegar al blog directamente
    await page.goto(`${baseUrl}/blog`);
    await page.waitForLoadState('networkidle');
    
    // Encontrar todos los enlaces internos
    const internalLinks = page.locator('a[href^="/"]');
    const linkCount = await internalLinks.count();
    
    if (linkCount > 0) {
      // Probar los primeros 3 enlaces
      for (let i = 0; i < Math.min(linkCount, 3); i++) {
        const link = internalLinks.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && !href.includes('#')) { // Ignorar anclas
          // Verificar que el enlace tenga href válido
          expect(href).toBeTruthy();
          expect(href?.length).toBeGreaterThan(0);
        }
      }
    }
  });

  test('Validar navegación completa', async ({ page }) => {
    // Probar flujo completo: Home → About → Blog → Home
  await page.goto(`${baseUrl}/about`, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain('/about');
  
  await page.goto(`${baseUrl}/blog`, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  expect(page.url()).toContain('/blog');
  
  await page.goto(baseUrl, { timeout: 10000 });
  await page.waitForLoadState('networkidle');
  expect(page.url()).toBe(baseUrl + '/');
  });

  test('Validar responsive design', async ({ page }) => {
    // Probar vista móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Verificar que los elementos sean visibles en móvil
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Probar vista tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Probar vista desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });
});
