/**
 * Tests for root README.md content.
 *
 * Verifies the README is well-formed and contains the key sections
 * a newcomer needs to understand and run the project.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { describe, it, expect, beforeAll } from 'vitest';

const __dirname = dirname(fileURLToPath(import.meta.url));
const README_PATH = resolve(__dirname, '../../../README.md');

let readme: string;

beforeAll(() => {
  readme = readFileSync(README_PATH, 'utf-8');
});

describe('README.md structure', () => {
  it('is not empty', () => {
    expect(readme.trim().length).toBeGreaterThan(0);
  });

  it('starts with a top-level heading', () => {
    expect(readme.trimStart()).toMatch(/^#\s+\S/);
  });

  it("contains the project heading '# Platzi FC'", () => {
    expect(readme).toContain('# Platzi FC');
  });
});

describe('README.md key sections', () => {
  it('documents the folder structure', () => {
    expect(readme).toMatch(/##\s+\d+\.\s+Estructura de carpetas/);
  });

  it('documents the architecture', () => {
    expect(readme).toMatch(/##\s+\d+\.\s+Arquitectura/);
  });

  it('documents the local setup', () => {
    expect(readme).toMatch(/##\s+\d+\.\s+Puesta en marcha en local/);
  });

  it('documents quality and test commands', () => {
    expect(readme).toMatch(/##\s+\d+\.\s+Comandos de calidad y tests/);
  });
});

describe('README.md setup commands', () => {
  it('mentions pnpm install', () => {
    expect(readme).toContain('pnpm install');
  });

  it('mentions pnpm dev', () => {
    expect(readme).toContain('pnpm dev');
  });

  it('references DATABASE_URL', () => {
    expect(readme).toContain('DATABASE_URL');
  });

  it('references the seeds workflow for @platzi-fc/db', () => {
    expect(readme).toContain('pnpm --filter @platzi-fc/db seed');
  });
});
