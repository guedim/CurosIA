# Platzi FC

Sitio web oficial de un club de fútbol ficticio ("Platzi FC"): calendario y resultados, plantilla, noticias, media, tienda y entradas, páginas institucionales y búsqueda. Es el MVP del sitio real que describe [`plan.md`](./plan.md) y [`platzi-fc-requerimiento.md`](./platzi-fc-requerimiento.md).

---

## 1. Qué es el proyecto

Una aplicación web **Next.js 15** (App Router) que lee datos deportivos de una **Postgres** gestionada en Supabase. El contenido se divide en dos fuentes:

- **Datos deportivos tabulares** (partidos, equipos, jugadores, clasificación, stats, productos, sponsors…): Postgres + Drizzle ORM.
- **Contenido editorial** (noticias, comunicados, páginas institucionales, galerías, vídeos): hoy vive también en Postgres en el MVP; en la V1 migrará a Sanity CMS tal como planea [`plan.md`](./plan.md).

El sitio cubre ~40 páginas públicas organizadas con **Route Groups** de Next (marketing, deportivo, editorial, comercial, institucional, legal). Rendering híbrido SSG/ISR con revalidación por página según volatilidad del contenido.

---

## 2. Estructura de carpetas

```
platzi-fc/
├── apps/
│   └── web/                      # Aplicación Next.js 15 (App Router)
│       ├── app/                  # Rutas organizadas por Route Group
│       │   ├── (marketing)/      #   └─ home
│       │   ├── (deportivo)/      #   └─ partidos, equipo, competición
│       │   ├── (editorial)/      #   └─ noticias, media
│       │   ├── (comercial)/      #   └─ tienda, entradas
│       │   ├── (institucional)/  #   └─ club, fans, sponsors, academy
│       │   ├── (legal)/          #   └─ términos, privacidad, cookies
│       │   ├── busqueda/
│       │   ├── sitemap.ts        # Sitemap dinámico (rutas estáticas + slugs DB)
│       │   ├── robots.ts
│       │   └── layout.tsx
│       ├── components/           # UI agrupada por dominio
│       │   ├── ui/               #   Button, Card, Badge, Input
│       │   ├── layout/           #   Header, Footer
│       │   ├── matches/          #   Scoreboard, MatchCard, Timeline…
│       │   ├── team/             #   PlayerCard, SquadGrid…
│       │   ├── editorial/        #   ArticleCard, Portable Text…
│       │   ├── competition/
│       │   └── commercial/
│       ├── lib/
│       │   ├── db/               # Queries Drizzle por dominio
│       │   ├── seo/              # JSON-LD (SportsEvent, NewsArticle, Person…)
│       │   ├── utils/            # cn, date, money
│       │   └── db.ts             # Re-export del cliente Drizzle
│       ├── tests/                # Unit tests (Vitest)
│       ├── e2e/                  # E2E + a11y (Playwright + axe-core)
│       ├── types/                # Tipos del dominio (re-export de @platzi-fc/db)
│       ├── playwright.config.ts
│       ├── vitest.config.ts
│       └── lighthouserc.js
│
├── packages/
│   └── db/                       # @platzi-fc/db  ← capa de acceso a Postgres
│       ├── src/
│       │   ├── schema/           # Fuente de verdad TS (16 tablas)
│       │   ├── client.ts         # Cliente Drizzle singleton
│       │   └── index.ts
│       ├── drizzle/              # Baseline introspect (sólo referencia)
│       ├── scripts/              # Seeds y aplicadores de datos ficticios
│       └── tests/                # Unit + integration (Vitest)
│
├── schema.sql                    # Bootstrap inicial de las tablas en Supabase
├── plan.md                       # Plan de ejecución por fases (MVP / V1 / V2)
├── platzi-fc-requerimiento.md    # Requisitos funcionales del sitio
├── turbo.json                    # Pipeline Turborepo (dev, build, lint, test…)
├── pnpm-workspace.yaml
└── .github/workflows/ci.yml      # CI: quality + e2e + lighthouse
```

**Dos paquetes**, un monorepo:

| Paquete          | Rol                                                                                                                |
| ---------------- | ------------------------------------------------------------------------------------------------------------------ |
| `@platzi-fc/web` | Frontend Next.js. Consume `@platzi-fc/db` para todas las queries.                                                  |
| `@platzi-fc/db`  | Esquema Drizzle, cliente singleton, scripts de seed. **Fuente de verdad de los tipos del dominio** (`src/schema`). |

---

## 3. Arquitectura

```
 ┌─────────────────────────────────────────────────────────────┐
 │                      Navegador del usuario                   │
 └───────────────────────────────┬─────────────────────────────┘
                                 │  HTML + Server Components
 ┌───────────────────────────────▼─────────────────────────────┐
 │   Next.js 15 (App Router) — apps/web                         │
 │                                                              │
 │   ┌──────────────┐   ┌──────────────┐   ┌────────────────┐   │
 │   │  (marketing) │   │ (deportivo)  │   │  (editorial)…  │   │
 │   └──────────────┘   └──────────────┘   └────────────────┘   │
 │          │                  │                    │           │
 │          └──────────────────┼────────────────────┘           │
 │                             │ Server Components              │
 │                             ▼                                │
 │                  lib/db/*  (queries por dominio)             │
 │                             │                                │
 └─────────────────────────────┼────────────────────────────────┘
                               │ Drizzle ORM
                               ▼
 ┌─────────────────────────────────────────────────────────────┐
 │                 @platzi-fc/db  (packages/db)                 │
 │   src/schema/*.ts  ← 16 tablas tipadas                       │
 │   client.ts        ← postgres-js (Supabase pooler, prepare=false) │
 └───────────────────────────────┬─────────────────────────────┘
                                 │ pooler transaction mode
 ┌───────────────────────────────▼─────────────────────────────┐
 │              PostgreSQL (Supabase)                           │
 └─────────────────────────────────────────────────────────────┘
```

**Principios clave:**

- Las páginas son **Server Components**: importan queries de `lib/db/*` y renderizan en el servidor. Cero llamadas fetch desde el cliente para datos del MVP.
- **Tipos derivados del schema**: `@platzi-fc/db` exporta los tipos que Drizzle infiere del schema, de modo que el frontend ve exactamente la forma real de los datos.
- **ISR configurado por página** (`export const revalidate = N`): calendario y marcadores live revalidan rápido, páginas institucionales casi nunca.
- **SEO técnico baked-in**: `generateMetadata`, sitemap dinámico, robots.ts, JSON-LD (`SportsEvent`, `NewsArticle`, `VideoObject`, `Person`).

---

## 4. Stack y herramientas

| Capa          | Tecnología                                     | Dónde                                                            |
| ------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| Framework     | **Next.js 15** (App Router, RSC)               | `apps/web`                                                       |
| Lenguaje      | **TypeScript 5** `strict`                      | Todo el repo                                                     |
| UI            | **React 19**, **Tailwind CSS 4**               | `apps/web/components`                                            |
| DB / ORM      | **PostgreSQL (Supabase)**, **Drizzle ORM**     | `packages/db`                                                    |
| Monorepo      | **pnpm workspaces**, **Turborepo**             | `pnpm-workspace.yaml`, `turbo.json`                              |
| Unit tests    | **Vitest**                                     | `apps/web/tests`, `packages/db/tests`                            |
| Integration   | **Vitest + Postgres real** (skip si no hay DB) | `packages/db/tests/integration`                                  |
| E2E           | **Playwright** (chromium)                      | `apps/web/e2e`                                                   |
| Accesibilidad | **@axe-core/playwright**                       | Inyectado en cada test E2E via `expectNoA11yViolations`          |
| Performance   | **Lighthouse CI** (`@lhci/cli`)                | `apps/web/lighthouserc.js`                                       |
| Calidad       | **ESLint** (eslint-config-next), **Prettier**  | Config en cada paquete                                           |
| Git hooks     | **Husky** + **lint-staged**                    | `.husky/`                                                        |
| CI            | **GitHub Actions**                             | `.github/workflows/ci.yml` (jobs `quality`, `e2e`, `lighthouse`) |
| CD            | **Vercel Git Integration**                     | Preview por PR, prod en `main`                                   |

---

## 5. Puesta en marcha en local

### 5.0. Atajo: script `install.sh` (recomendado)

Si quieres saltarte los pasos manuales de abajo, el repo incluye un script que automatiza **todo** el proceso (5.1 → 5.6) con logging detallado:

```bash
chmod +x install.sh
./install.sh
```

Flags útiles:

```bash
./install.sh --help            # ver todas las opciones
./install.sh --skip-deps       # no ejecutar `pnpm install`
./install.sh --skip-schema     # no aplicar schema.sql
./install.sh --skip-seeds      # no cargar datos de prueba
./install.sh --no-dev          # no levantar el dev server al final
./install.sh -y                # asumir "sí" en todas las confirmaciones
./install.sh --full            # dev en background + secciones 6, 7 y 8 (lint,
                               # typecheck, tests, info drizzle, build prod)
```

El script valida prerrequisitos (Node ≥ 20, pnpm ≥ 10, opcional `psql`), copia los `.env.example`, resuelve `DATABASE_URL`, aplica el esquema, ejecuta apply/seed en el orden correcto y arranca `pnpm dev`. Si prefieres entender cada paso, sigue 5.1 → 5.6 manualmente.

Con `--full` el dev server se deja corriendo en background (PID y logs en `.install-dev.log`) mientras el script avanza automáticamente por los pasos 6 (calidad), 7 (utilidades Drizzle, informativo) y 8 (build de producción). Para detenerlo al final: `kill <PID>`.

### 5.1. Prerrequisitos

- **Node.js ≥ 20**
- **pnpm ≥ 10** (el repo fija `packageManager: pnpm@10.33.0`)
- Acceso a una **Postgres**. Recomendado: una base nueva en [Supabase](https://supabase.com) (plan gratuito).
- Opcional: `psql` en el PATH si vas a correr `schema.sql` desde terminal.

### 5.2. Clonar e instalar

```bash
git clone <repo-url> platzi-fc
cd platzi-fc
pnpm install
```

### 5.3. Configurar variables de entorno

```bash
cp packages/db/.env.example packages/db/.env.local
cp apps/web/.env.example   apps/web/.env.local
```

Edita ambos `.env.local` y rellena:

- `DATABASE_URL` = connection string del **pooler** de Supabase (modo transaction, puerto 5432).
  Recuerda **url-encodear** caracteres especiales del password (`$` → `%24`, `*` → `%2A`, etc.).
- `NEXT_PUBLIC_SITE_URL` = `http://localhost:3000` en dev.

### 5.4. Crear el esquema en la base de datos

Una sola vez, para crear las tablas del MVP:

```bash
# Opción A — desde terminal
psql "$DATABASE_URL" -f schema.sql

# Opción B — pegar el contenido de schema.sql en el SQL Editor de Supabase
```

### 5.5. Cargar datos de prueba (seeds)

```bash
pnpm --filter @platzi-fc/db seed              # temporada, competiciones, equipos, partidos
pnpm --filter @platzi-fc/db seed:squad        # jugadores + stats + staff
pnpm --filter @platzi-fc/db seed:editorial    # artículos
pnpm --filter @platzi-fc/db apply:editorial
pnpm --filter @platzi-fc/db seed:commerce     # productos + sponsors
pnpm --filter @platzi-fc/db apply:commerce
pnpm --filter @platzi-fc/db seed:match-detail # eventos + alineaciones
pnpm --filter @platzi-fc/db apply:match-media
```

### 5.6. Levantar el dev server

```bash
pnpm dev
```

Abre [http://localhost:3000](http://localhost:3000).

---

## 6. Comandos de calidad y tests

```bash
# Todo el monorepo
pnpm -r lint
pnpm -r typecheck
pnpm -r test                       # unit (47 web + 88 db) + integration (3, si hay DB)

# E2E + accesibilidad (Playwright + axe-core)
pnpm --filter @platzi-fc/web e2e:install   # descarga Chromium (sólo la primera vez)
pnpm --filter @platzi-fc/web e2e
pnpm --filter @platzi-fc/web e2e:ui        # UI interactiva

# Auditoría Lighthouse (performance, a11y, SEO)
pnpm --filter @platzi-fc/web lighthouse
```

## 7. Utilidades Drizzle (packages/db)

```bash
pnpm --filter @platzi-fc/db db:generate    # genera migración diff desde src/schema
pnpm --filter @platzi-fc/db db:push        # aplica schema a la DB (sólo dev)
pnpm --filter @platzi-fc/db db:introspect  # regenera baseline desde la DB real
pnpm --filter @platzi-fc/db db:studio      # abre Drizzle Studio en el navegador
```

## 8. Build de producción

```bash
pnpm --filter @platzi-fc/web build
pnpm --filter @platzi-fc/web start
```

En la práctica el build lo ejecuta **Vercel** automáticamente en cada PR (preview) y en `main` (producción). El CI local sólo corre `lint + typecheck + test`.
