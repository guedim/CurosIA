# Mario Guerrero Portfolio

Este es un portfolio personal desarrollado con [Next.js](https://nextjs.org) que incluye pruebas unitarias y E2E.

## 🚀 Getting Started

### Prerrequisitos
- Node.js 18+ 
- npm o yarn
- [Bun.js](https://bun.sh/) instalado en el sistema

### 1. Instalación de dependencias
```bash
# Instalar dependencias de Next.js
npm install
# o
yarn install

# Instalar dependencias de Bun (para el servidor API)
bun install
```

### 2. Iniciar el servidor API de Bun
```bash
# Iniciar servidor API en modo desarrollo (con hot reload)
bun run dev

# El servidor API estará disponible en http://localhost:3002
```

### 3. Iniciar la aplicación Next.js
```bash
# Abrir otra terminal y ejecutar
npm run dev
# o
yarn dev
```

La aplicación estará disponible en **http://localhost:3000**

**Importante**: Asegúrate de que el servidor API de Bun esté corriendo en `http://localhost:3002` antes de iniciar Next.js, ya que el sitio web consume los posts desde este endpoint.

### 4. (Opcional) Verificar que todo funciona
```bash
# Verificar que el servidor API responde
curl http://localhost:3002/api/posts

# Debería retornar un JSON con los posts del blog
```

### Compilación para producción
```bash
npm run build
# o
yarn build
```

### Ejecutar en modo producción
```bash
npm run start
# o
yarn start
```

## 🧪 Testing

### Unit Tests (Jest + React Testing Library)
```bash
# Ejecutar todos los tests unitarios
npm test

# Ejecutar en modo watch
npm run test:watch

# Ejecutar con coverage
npm run test:coverage
```

### E2E Tests (Playwright)

#### 1. Instalar navegadores de Playwright
```bash
npx playwright install
```

#### 2. Ejecutar pruebas E2E
```bash
# Ejecutar todas las pruebas E2E
npx playwright test __tests__/e2e/portfolio.spec.ts

# Ejecutar con ventana visible
npx playwright test __tests__/e2e/portfolio.spec.ts --headed

# Ejecutar con UI de Playwright
npx playwright test __tests__/e2e/portfolio.spec.ts --ui

# Ejecutar un test específico
npx playwright test __tests__/e2e/portfolio.spec.ts --grep "Validar página principal"

# Ejecutar en modo debug
npx playwright test __tests__/e2e/portfolio.spec.ts --debug
```

## 📁 Estructura del Proyecto

```
multipage/
├── app/                    # Páginas de Next.js (App Router)
├── components/             # Componentes reutilizables
├── __tests__/              # Tests
│   ├── components/         # Tests unitarios de componentes
│   └── e2e/              # Tests E2E con Playwright
├── jest.config.js         # Configuración de Jest
├── jest.setup.js          # Setup de React Testing Library
├── server.ts             # Servidor API con Bun
├── bun-package.json      # Configuración de dependencias para Bun
└── portfolio.spec.ts       # Archivo de pruebas E2E
```

## 🛠️ Tecnologías

- **Next.js 16** - Framework React
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de CSS
- **Jest** - Framework de testing unitario
- **React Testing Library** - Testing de componentes
- **Playwright** - Testing E2E
- **Bun.js** - Runtime JavaScript y servidor HTTP

## 🌐 Servidor API con Bun

### Prerrequisitos
- [Bun.js](https://bun.sh/) instalado en el sistema

### Instalación del servidor
```bash
# Instalar dependencias de tipos para Bun
bun install --bun bun-package.json
```

### Ejecutar servidor API
```bash
# Modo desarrollo (con hot reload)
bun run dev

# Modo producción
bun run start
```

El servidor API estará disponible en **http://localhost:3002**

### Endpoint disponible

#### GET /api/posts
Lista todos los posts del blog con datos mock.

**URL:** `http://localhost:3002/api/posts`

**Ejemplo de respuesta:**
```json
{
  "success": true,
  "count": 7,
  "data": [
    {
      "id": 1,
      "title": "Getting Started with Next.js 15",
      "summary": "Learn how to build modern web applications with the latest Next.js features and App Router...",
      "content": "Next.js 15 introduces powerful new features that make building web applications easier than ever..."
    }
  ]
}
```

## 🌐 Despliegue

La forma más fácil de desplegar esta aplicación es usar [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme).

Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.

## 📝 Notas de Desarrollo

- El servidor de desarrollo se ejecuta en **http://localhost:3000**
- El servidor API de Bun se ejecuta en **http://localhost:3002**
- Los tests unitarios usan jsdom como entorno
- Los tests E2E requieren instalación previa de navegadores
- El proyecto sigue las convenciones de commit semántico
- El servidor API utiliza datos mock del archivo `blog/page.tsx`
- **Orden de inicio requerido**: Primero iniciar el servidor API de Bun, luego Next.js
