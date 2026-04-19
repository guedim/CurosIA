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
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Verificar enlaces de navegación principales
    await expect(page.locator('nav a[href="/about"]')).toBeVisible();
    await expect(page.locator('nav a[href="/blog"]')).toBeVisible();
    
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
    // Navegar a About
    await page.click('nav a[href="/about"]');
    await page.waitForLoadState('networkidle');
    
    // Verificar URL
    expect(page.url()).toContain('/about');
    
    // Verificar contenido de About
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=About')).toBeVisible();
    
    // Verificar elementos típicos de About
    const aboutContent = page.locator('main, section, .about');
    await expect(aboutContent).toBeVisible();
    
    // Verificar navegación de regreso
    await expect(page.locator('nav a[href="/"]')).toBeVisible();
  });

  test('Validar página Blog', async ({ page }) => {
    // Navegar a Blog
    await page.click('nav a[href="/blog"]');
    await page.waitForLoadState('networkidle');
    
    // Verificar URL
    expect(page.url()).toContain('/blog');
    
    // Verificar título y contenido del blog
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Blog')).toBeVisible();
    
    // Buscar artículos o posts
    const articles = page.locator('article, .post, .blog-post');
    const articleCount = await articles.count();
    
    if (articleCount > 0) {
      // Validar que cada artículo tenga enlace
      for (let i = 0; i < articleCount; i++) {
        const article = articles.nth(i);
        const link = article.locator('a').first();
        
        if (await link.isVisible()) {
          // Verificar que el enlace tenga href válido
          const href = await link.getAttribute('href');
          expect(href).toBeTruthy();
          expect(href?.length).toBeGreaterThan(0);
        }
      }
    }
  });

  test('Validar enlaces internos del Blog', async ({ page }) => {
    // Navegar al blog
    await page.click('nav a[href="/blog"]');
    await page.waitForLoadState('networkidle');
    
    // Encontrar todos los enlaces internos
    const internalLinks = page.locator('a[href^="/"], a[href*="localhost"]');
    const linkCount = await internalLinks.count();
    
    if (linkCount > 0) {
      // Probar cada enlace
      for (let i = 0; i < Math.min(linkCount, 10); i++) { // Limitar a 10 enlaces
        const link = internalLinks.nth(i);
        const href = await link.getAttribute('href');
        
        if (href && !href.includes('#')) { // Ignorar anclas
          // Abrir enlace en nueva pestaña para no perder contexto
          const [newPage] = await Promise.all([
            page.context().waitForEvent('page'),
            link.click({ modifiers: ['Control', 'Shift'] }) // Ctrl+Shift+Click
          ]);
          
          await newPage.waitForLoadState('networkidle');
          
          // Verificar que la página cargue sin errores
          await expect(newPage.locator('body')).toBeVisible();
          
          // Verificar no haya errores 404
          const response = await newPage.response(newPage.url());
          if (response) {
            expect(response.status()).toBeLessThan(400);
          }
          
          await newPage.close();
        }
      }
    }
  });

  test('Validar navegación completa', async ({ page }) => {
    // Probar flujo completo: Home → About → Blog → Home
    await page.click('nav a[href="/about"]');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/about');
    
    await page.click('nav a[href="/blog"]');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/blog');
    
    await page.click('nav a[href="/"]');
    await page.waitForLoadState('networkidle');
    expect(page.url()).toBe(baseUrl + '/');
  });

  test('Validar responsive design', async ({ page }) => {
    // Probar vista móvil
    await page.setViewportSize({ width: 375, height: 667 });
    await page.waitForLoadState('networkidle');
    
    // Verificar que los elementos sean visibles en móvil
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Probar vista tablet
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Probar vista desktop
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.waitForLoadState('networkidle');
    
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
  });
});
