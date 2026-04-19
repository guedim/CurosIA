import AxeBuilder from '@axe-core/playwright';
import { expect, type Page } from '@playwright/test';

/**
 * Ejecuta axe-core sobre la página actual y falla el test si hay violaciones
 * de severidad >= serious para WCAG 2.1 AA.
 *
 * Usamos `disableRules` para excluir falsos positivos conocidos:
 * - `color-contrast`: se analiza manualmente (contraste depende de tema final).
 * - `region`: las páginas ya tienen `<main>`; axe marca headers/footers sueltos.
 */
export async function expectNoA11yViolations(page: Page, tag = 'default'): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .disableRules(['color-contrast', 'region'])
    .analyze();

  const blocking = results.violations.filter(
    (v) => v.impact === 'serious' || v.impact === 'critical',
  );

  if (blocking.length) {
    const summary = blocking
      .map((v) => `${v.id} (${v.impact}): ${v.help} — ${v.nodes.length} nodo(s)`)
      .join('\n');
    // Fail con mensaje legible antes que un deep-equal de JSON.
    expect(blocking, `[${tag}] ${blocking.length} violación(es) a11y:\n${summary}`).toEqual([]);
  }
}
