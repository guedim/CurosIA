# Platzi FC - Plan de Ejecución y Stack Técnico

---

## 1) Stack Tecnológico

### Frontend

| Tecnología       | Versión         | Justificación                                                                                                                                                                                     |
| ---------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Next.js**      | 15 (App Router) | SSR/SSG híbrido para 40+ páginas. ISR permite revalidar contenido deportivo sin rebuild completo. Server Components reducen JS del cliente. Route Groups organizan las 12+ secciones del sitemap. |
| **TypeScript**   | 5.x             | Con 20+ modelos de datos y relaciones cruzadas, el tipado fuerte previene errores y documenta las interfaces del dominio.                                                                         |
| **Tailwind CSS** | 4               | Utility-first elimina CSS muerto. El sistema de tokens (colores del club, tipografía) se configura una vez. Compatible con RSC.                                                                   |
| **React**        | 19              | Server Components nativos, Suspense boundaries para carga progresiva de datos deportivos.                                                                                                         |

### CMS (Contenido Editorial)

| Tecnología    | Justificación                                                                                                                                                                                                                                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Sanity.io** | Esquemas definidos como código TypeScript alineados con los 20+ modelos del requisito. GROQ permite queries complejas para relaciones entidad-entidad. Portable Text soporta los `body_bloques` y `biografia_bloques` del spec. Previsualización en tiempo real integrable con Next.js. CDN global incluido. Plan gratuito generoso para MVP. |

### Base de Datos (Datos Deportivos)

| Tecnología                           | Justificación                                                                                                                                                                                                                            |
| ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **PostgreSQL** (via Supabase o Neon) | Datos deportivos altamente relacionales: partidos vinculan equipos, competiciones, temporadas, estadios. PostgreSQL maneja JOINs eficientes, índices compuestos y JSON columns para datos semi-estructurados como `stats` y `eventos[]`. |
| **Drizzle ORM**                      | Type-safe, genera tipos TS del schema, migraciones declarativas. Más ligero que Prisma, mejor performance en edge runtimes.                                                                                                              |

### Infraestructura y Servicios

| Servicio                  | Uso                                                                                                                |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| **Vercel**                | Deploy del frontend. Edge Functions para ISR. Preview deployments por PR. Analytics integrado.                     |
| **Supabase**              | PostgreSQL gestionado + Auth (V1/V2) + Storage para assets pesados. Row Level Security para futuras APIs públicas. |
| **Resend**                | Emails transaccionales y newsletter.                                                                               |
| **Algolia o Meilisearch** | Búsqueda global facetada (MVP: búsqueda simple con PostgreSQL full-text; V1: migración a servicio dedicado).       |

### Testing y Calidad

| Herramienta    | Uso                                                    |
| -------------- | ------------------------------------------------------ |
| **Vitest**     | Unit tests y tests de integración de la capa de datos. |
| **Playwright** | E2E tests de flujos críticos.                          |
| **Storybook**  | Catálogo de componentes UI, pruebas visuales.          |
| **axe-core**   | Tests automatizados de accesibilidad.                  |

### CI/CD

| Herramienta                | Uso                                                            |
| -------------------------- | -------------------------------------------------------------- |
| **GitHub Actions**         | Pipeline de CI: lint, types, tests, build.                     |
| **Vercel Git Integration** | CD automático: preview por branch, producción en merge a main. |

### Monorepo

| Herramienta   | Uso                                        |
| ------------- | ------------------------------------------ |
| **Turborepo** | Orquestación de builds y cache entre apps. |
| **pnpm**      | Gestor de paquetes con workspaces.         |

---

## 2) Estructura del Proyecto

```
platzi-fc/
├── apps/
│   └── web/                          # Next.js 15 App
│       ├── app/
│       │   ├── (marketing)/          # Home
│       │   │   ├── page.tsx
│       │   │   └── layout.tsx
│       │   │
│       │   ├── (deportivo)/          # Partidos, Equipo, Competición
│       │   │   ├── partidos/
│       │   │   │   ├── page.tsx
│       │   │   │   └── [matchSlug]/
│       │   │   │       ├── page.tsx
│       │   │   │       ├── estadisticas/page.tsx
│       │   │   │       ├── alineaciones/page.tsx
│       │   │   │       └── minuto-a-minuto/page.tsx
│       │   │   ├── equipo/
│       │   │   │   ├── page.tsx
│       │   │   │   ├── [playerSlug]/page.tsx
│       │   │   │   ├── staff/page.tsx
│       │   │   │   ├── femenino/
│       │   │   │   └── cantera/
│       │   │   └── competicion/
│       │   │       └── [competitionSlug]/
│       │   │           ├── page.tsx
│       │   │           ├── tabla/page.tsx
│       │   │           └── calendario/page.tsx
│       │   │
│       │   ├── (editorial)/          # Noticias, Media
│       │   │   ├── noticias/
│       │   │   │   ├── page.tsx
│       │   │   │   ├── [articleSlug]/page.tsx
│       │   │   │   ├── categoria/[cat]/page.tsx
│       │   │   │   └── comunicados/page.tsx
│       │   │   └── media/
│       │   │       ├── videos/
│       │   │       └── galerias/
│       │   │
│       │   ├── (comercial)/          # Entradas, Tienda
│       │   │   ├── entradas/
│       │   │   │   ├── page.tsx
│       │   │   │   ├── abonos/page.tsx
│       │   │   │   └── estadio/page.tsx
│       │   │   └── tienda/
│       │   │       ├── page.tsx
│       │   │       ├── [categorySlug]/page.tsx
│       │   │       └── producto/[productSlug]/page.tsx
│       │   │
│       │   ├── (institucional)/      # Club, Fans, Sponsors, Academy
│       │   │   ├── club/
│       │   │   │   ├── historia/page.tsx
│       │   │   │   ├── identidad/page.tsx
│       │   │   │   ├── directiva/page.tsx
│       │   │   │   ├── estadio/page.tsx
│       │   │   │   ├── fundacion/page.tsx
│       │   │   │   ├── transparencia/page.tsx
│       │   │   │   └── contacto/page.tsx
│       │   │   ├── fans/
│       │   │   ├── sponsors/
│       │   │   └── academy/
│       │   │
│       │   ├── (legal)/
│       │   │   ├── terminos/page.tsx
│       │   │   ├── privacidad/page.tsx
│       │   │   ├── cookies/page.tsx
│       │   │   └── accesibilidad/page.tsx
│       │   │
│       │   ├── busqueda/page.tsx
│       │   ├── not-found.tsx
│       │   ├── error.tsx
│       │   ├── layout.tsx
│       │   ├── globals.css
│       │   └── sitemap.ts
│       │
│       ├── components/
│       │   ├── ui/                   # Button, Card, Badge, Input
│       │   ├── layout/               # Header, Footer, Nav, Sidebar
│       │   ├── matches/              # MatchCard, Scoreboard, MatchTimeline
│       │   ├── team/                 # PlayerCard, StaffCard, SquadGrid
│       │   ├── news/                 # ArticleCard, ArticleBody
│       │   ├── media/                # VideoPlayer, GalleryViewer
│       │   ├── competition/          # StandingsTable, TournamentCalendar
│       │   ├── commercial/           # TicketCTA, ProductCard
│       │   ├── shared/               # Breadcrumbs, Pagination, Filters
│       │   └── cms-blocks/           # Renderizadores Portable Text
│       │
│       ├── lib/
│       │   ├── sanity/               # Client, queries GROQ, portable-text
│       │   ├── db/                   # Drizzle client, schema, queries/
│       │   ├── api/                  # Funciones de data fetching
│       │   ├── seo/                  # JSON-LD generators, metadata helpers
│       │   ├── i18n/                 # Config, diccionarios es/en
│       │   └── utils/                # Fechas, formateo, URLs
│       │
│       ├── hooks/
│       ├── types/                    # Interfaces TS del dominio
│       └── public/
│
├── packages/
│   └── sanity-studio/               # Sanity Studio (CMS admin)
│       ├── schemas/                  # Document types (article, video, gallery, etc.)
│       ├── structure.ts
│       └── sanity.config.ts
│
├── drizzle/migrations/
├── scripts/                          # Seeds, imports de datos
├── .github/workflows/
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

**Route Groups** `(marketing)`, `(deportivo)`, `(editorial)`, `(comercial)`, `(institucional)` no afectan URLs pero permiten layouts compartidos por contexto (ej. layout deportivo con selector de temporada persistente).

---

## 3) Arquitectura de la Capa de Datos

### División CMS vs Base de Datos

```
┌─────────────────┐                    ┌──────────────────┐
│   Sanity CMS    │                    │   PostgreSQL     │
│  (Editorial)    │                    │  (Deportivo)     │
│                 │                    │                  │
│  - Noticias     │     ┌─────────┐   │  - Temporadas    │
│  - Páginas      │────▶│ Next.js │◀──│  - Competiciones │
│  - Media refs   │     │ Server  │   │  - Equipos       │
│  - Sponsors     │     │ Comps   │   │  - Partidos      │
│  - Tienda       │     └────┬────┘   │  - Jugadores     │
│  - Entradas     │          │        │  - Stats         │
│  - Membresías   │          ▼        │  - Clasificación │
│  - Eventos      │     ┌─────────┐   │  - Staff         │
│  - Estadio      │     │ Vercel  │   └──────────────────┘
│  - Navegación   │     │ ISR+CDN │
└─────────────────┘     └─────────┘
```

**Sanity** gestiona contenido editorial con bloques ricos (Portable Text). **PostgreSQL** gestiona datos tabulares con relaciones y agregaciones. Se vinculan mediante campos `sanityRef` en PostgreSQL o `externalId` en Sanity.

### Estrategia de Rendering por Página

| Página                   | Estrategia    | Revalidación        |
| ------------------------ | ------------- | ------------------- |
| Home                     | ISR           | 60s                 |
| Partidos (listado)       | ISR           | 300s                |
| Partido (detalle activo) | ISR           | 60s                 |
| Partido (detalle pasado) | ISR           | 3600s               |
| Equipo / Plantilla       | ISR           | 3600s               |
| Clasificación            | ISR           | 300s                |
| Noticias (listado)       | ISR           | 120s                |
| Noticia (detalle)        | ISR           | on-demand (webhook) |
| Páginas Club             | SSG           | on-demand (webhook) |
| Tienda                   | ISR           | 600s                |
| Búsqueda                 | SSR (dynamic) | N/A                 |

---

## 4) Fases de Desarrollo

### Fase 0: Setup (1 semana)

**Sprint 0 - Fundación**

- Inicializar monorepo con Turborepo + pnpm
- Configurar Next.js 15 con App Router y TypeScript strict
- Configurar Tailwind CSS 4 con tokens del club
- Inicializar Sanity Studio con proyecto y dataset
- Provisionar PostgreSQL (Supabase/Neon)
- Configurar Drizzle ORM con primera migración
- Configurar ESLint, Prettier, Husky
- Configurar GitHub Actions: lint + typecheck + build
- Conectar Vercel para deploys automáticos
- Crear componentes UI base (Button, Card, Badge, Input)
- Definir tipos TypeScript del dominio en `/types/`

**Entregable**: Monorepo funcional con CI/CD, ambos datastores conectados, deploy a Vercel.

---

### Fase 1: MVP (6-8 semanas)

**Sprint 1 - Layout y Navegación (2 semanas)**

- Root Layout con Header (mega-menu responsive) y Footer
- Navegación principal según spec sección 4
- Breadcrumbs dinámico
- Página 404 y Error boundary
- SEO base: `generateMetadata`, robots.txt, sitemap.ts dinámico
- Schemas Sanity: NavigationMenu, SiteConfig
- Seed de datos de navegación en Sanity

**Sprint 2 - Home y Partidos (2 semanas)**

- **Home**: Hero con próximo partido, resultados recientes, noticias destacadas, tabla, sponsors, newsletter CTA
- **Partidos listado**: Calendario y resultados con filtros (temporada, competición, local/visita)
- **Partido detalle básico**: Marcador, contexto, resumen
- Migraciones DB: seasons, competitions, teams, matches, match_events
- Script de seed con datos ficticios (temporada, 20+ partidos, 4+ competiciones)
- Componentes: MatchCard, Scoreboard, MatchList, FilterBar
- Schema.org: SportsEvent

**Sprint 3 - Equipo y Competición (2 semanas)**

- **Plantilla**: Grid de jugadores con filtros por posición
- **Perfil jugador**: Header, bio, stats por temporada, últimos partidos
- **Staff**: Lista con roles
- **Competición landing**: Tabla/clasificación, calendario del torneo
- Migraciones DB: players, player_season_stats, staff, standings
- Seed: 25 jugadores, 8 staff, tablas de 2 competiciones
- Componentes: PlayerCard, StaffCard, SquadGrid, StandingsTable
- Schema.org: SportsTeam, Person

**Sprint 4 - Noticias, Media y Contenido (2 semanas)**

- **Noticias listado**: Grid con destacado, filtros por categoría, paginación
- **Noticia detalle**: Portable Text renderer, media embeds, relacionados, share
- **Media**: Videos y Galerías (listado y detalle)
- **Club**: Historia, Identidad, Estadio, Contacto (páginas CMS)
- Schemas Sanity: Article, Video, Gallery, Page, Stadium
- Sanity webhook → Next.js revalidation
- Seed: 15 noticias, 5 videos, 3 galerías, páginas institucionales
- Schema.org: NewsArticle, VideoObject

**Sprint MVP-Final - Comercial y QA (1 semana)**

- **Entradas**: Landing con listado de partidos + CTA externo, info de estadio
- **Tienda**: Catálogo con categorías, producto detalle + CTA externo
- **Búsqueda simple**: Full-text search PostgreSQL + Sanity
- Schemas Sanity: TicketProduct, ShopProduct, Sponsor
- Completar sitemap.ts con todas las rutas dinámicas
- Audit de accesibilidad (axe-core)
- Audit de performance (Lighthouse CI)
- Tests E2E de flujos críticos

**Entregable MVP**: Sitio completo navegable con contenido ficticio, 30+ páginas, SEO base, accesible, en producción.

---

### Fase 2: V1 (6-8 semanas)

**Sprint V1-1 - Match Center Ampliado (2 semanas)**

- Tabs completos: Estadísticas comparativas, Alineaciones visuales, Minuto a minuto (timeline)
- Galería y video por partido
- Selectores de temporada y competición persistentes (URL state + cookies)

**Sprint V1-2 - Internacionalización (2 semanas)**

- i18n con Next.js middleware + diccionarios
- Estructura: `app/[lang]/(...)` con middleware de detección
- Traducción UI (es/en inicialmente)
- Contenido localizable en Sanity
- Formateo de fechas, monedas y terminología por locale
- Selector de idioma en header

**Sprint V1-3 - Fans, Membresía y Media Avanzada (2 semanas)**

- Membresía con niveles, beneficios, CTA externo
- Eventos de comunidad
- Newsletter opt-in con Resend
- Media con taxonomías robustas y filtros avanzados

**Sprint V1-4 - Analytics, Sponsors y QA (2 semanas)**

- Google Analytics 4 / Vercel Analytics
- Banner de consentimiento de cookies (GDPR)
- Sponsors: Landing con tiers, detalle con activaciones
- Academy: Programas, inscripción
- Búsqueda mejorada: migración a Algolia/Meilisearch
- Tests E2E ampliados y optimization pass

**Entregable V1**: Sitio bilingüe, match center completo, área de fans, búsqueda avanzada, analytics, consentimiento.

---

### Fase 3: V2 (8-10 semanas)

**Sprint V2-1 - Live Match Center (3 semanas)**

- WebSocket o Server-Sent Events para tiempo real
- Marcador live, eventos y comentarios en tiempo real
- Notificaciones push (Web Push API)
- Infraestructura: Supabase Realtime

**Sprint V2-2 - Cuenta de Fan (3 semanas)**

- Autenticación con Supabase Auth (email, social)
- Perfil de usuario con preferencias
- Personalización de homepage
- Favoritos (jugadores, noticias guardadas)

**Sprint V2-3 - Integraciones Profundas (2 semanas)**

- Checkout embebido de ticketing
- Integración con plataforma e-commerce
- Sync bidireccional de inventario

**Sprint V2-4 - Contenido Evergreen y Automatización (2 semanas)**

- Contenido histórico: temporadas pasadas, hall of fame
- Workflows editoriales avanzados en Sanity
- Automatización de contenido relacionado
- Generación automática de crónicas post-partido

**Entregable V2**: Experiencia live, personalizada, con comercio integrado y contenido histórico.

---

## 5) Integraciones Clave por Fase

| Integración            | Fase | Mecanismo                                                |
| ---------------------- | ---- | -------------------------------------------------------- |
| Sanity CMS             | MVP  | GROQ queries en Server Components + webhook revalidation |
| PostgreSQL             | MVP  | Drizzle ORM queries en Server Components                 |
| Sanity Preview         | MVP  | Draft mode de Next.js + Sanity preview API               |
| Email (Resend)         | V1   | API route para newsletter signup                         |
| Búsqueda (Algolia)     | V1   | Sync desde ambos datastores via webhooks/cron            |
| Analytics (GA4/Vercel) | V1   | Script tag con consent management                        |
| Ticketing Provider     | V2   | API REST o iframe embebido                               |
| E-commerce             | V2   | Shopify Storefront API o similar                         |
| WebSocket (live)       | V2   | Supabase Realtime channels                               |
| Push Notifications     | V2   | Web Push API + service worker                            |
| Auth (Supabase)        | V2   | Supabase Auth con middleware Next.js                     |

---

## 6) Estrategia de Testing

```
         /  E2E (Playwright)  \        ~15 tests
        / Visual (Storybook)   \       ~50 stories
       / Integration (Vitest)   \      ~80 tests
      / Unit (Vitest)            \     ~120 tests
     / A11y (axe-core+Playwright) \    automatizado
    / Lighthouse CI                \   automatizado
```

**Unit Tests (Vitest)**: Funciones de formateo, queries DB (mock), utilidades SEO, lógica de filtros, transformadores CMS → UI.

**Integration Tests (Vitest)**: Data fetching con DB/CMS reales, combinación datos CMS + DB, validación schemas Zod.

**Component Tests (Storybook)**: Catálogo visual de componentes. Estados: loading, empty, error, lleno. Variantes responsive.

**E2E Tests (Playwright)**: Flujos Home → Partidos → Detalle, Noticias → Detalle, Equipo → Jugador, Búsqueda, Tienda → Producto. Navegación mobile completa. Verificación de meta tags y schema markup.

**Accesibilidad**: axe-core automatizado en cada E2E test. Checklist manual WCAG 2.1 AA por sprint. Tests de navegación por teclado y focus management.

**Performance**: Lighthouse CI en GitHub Actions (mínimo: Performance 90, A11y 95, SEO 95). Bundle analyzer en cada PR.

---

## 7) DevOps y CI/CD

### Pipeline CI (GitHub Actions)

```
quality:
  - pnpm install (cached)
  - turbo lint
  - turbo typecheck
  - turbo test:unit
  - turbo build

e2e (post quality):
  - Playwright tests contra preview deploy de Vercel

lighthouse (post quality):
  - Lighthouse CI contra preview deploy
  - Fail si scores bajo umbral
```

### Pipeline CD (Vercel)

- **PR abierto**: Preview deployment automático con URL única
- **Merge a develop**: Deploy a staging
- **Merge a main**: Deploy a producción
- **Sanity webhook**: On publish → `POST /api/revalidate` con tag del tipo de contenido

### Estrategia de Branches

```
main (producción)
  └── develop (staging)
       ├── feature/sprint-1-layout
       ├── feature/sprint-2-home
       └── fix/match-card-responsive
```

### Monitoreo

- **Vercel Analytics**: Web Vitals (LCP, FID, CLS)
- **Sentry**: Error tracking en frontend y API routes
- **Uptime Robot**: Monitoreo de disponibilidad

---

## 8) Buenas Prácticas Transversales

### SEO Técnico

- **MVP**: `generateMetadata()` en cada ruta, sitemap.ts dinámico, robots.ts, canonical URLs, Open Graph, JSON-LD (SportsTeam, SportsEvent, NewsArticle, VideoObject)
- **V1**: hreflang para i18n, breadcrumbs con schema, hubs de enlazado interno
- **V2**: FAQ schema, Event schema, Product schema

### Accesibilidad

- Semantic HTML (nav, main, article, section, aside)
- Skip-to-content link
- Focus visible con `:focus-visible`
- Tablas con `scope`, `caption`, `aria-label`
- Alt text obligatorio en schemas Sanity
- `prefers-reduced-motion` para animaciones
- Contraste WCAG AA mínimo

### Performance

- `next/image` con WebP/AVIF y sizes responsivos
- `next/font` para fuentes del club (sin layout shift)
- Suspense boundaries para carga progresiva
- `loading.tsx` por ruta para skeleton states
- Dynamic imports para componentes pesados (VideoPlayer, GalleryViewer)
- Cache headers: `s-maxage=60, stale-while-revalidate=300`
