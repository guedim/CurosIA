# 🧪 Guía de Pruebas E2E para Portfolio

## 📋 Prerrequisitos

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Instalar navegadores de Playwright:**
   ```bash
   npx playwright install
   ```

## 🚀 Ejecutar Pruebas E2E

### **Opción 1: Ejecución completa (Chrome)**
```bash
npm run test:e2e
```

### **Opción 2: Ejecución con interfaz visual**
```bash
npm run test:e2e:ui
```

### **Opción 3: Ejecución con navegador visible**
```bash
npm run test:e2e:headed
```

### **Opción 4: Modo debug**
```bash
npm run test:e2e:debug
```

## 📊 Pruebas Incluidas

### ✅ **Validación Home**
- Título de página
- Elementos principales (h1, nav)
- Enlaces de navegación
- Sin errores de consola

### ✅ **Validación About**
- Navegación correcta
- Contenido visible
- Estructura adecuada

### ✅ **Validación Blog**
- Listado de artículos
- Enlaces funcionales
- Estructura correcta

### ✅ **Validación Enlaces Internos**
- Todos los enlaces funcionan
- Sin errores 404
- Redirecciones correctas

### ✅ **Navegación Completa**
- Flujo Home → About → Blog → Home
- Transiciones suaves

### ✅ **Diseño Responsivo**
- Vista móvil (375x667)
- Vista tablet (768x1024)
- Vista desktop (1920x1080)

## 🌐 Navegadores Soportados

- **Chrome** (principal)
- **Firefox**
- **Safari** (WebKit)
- **Mobile Chrome**
- **Mobile Safari**

## 📱 Configuración

### **URL Base**
Por defecto: `http://localhost:3000`

Para cambiarla:
```bash
BASE_URL=https://tu-sitio.com npm run test:e2e
```

### **Variables de Entorno**
- `BASE_URL`: URL del sitio a probar
- `CI`: Para ejecución en CI/CD

## 📈 Reportes

Los resultados se guardan en:
- **HTML**: `playwright-report/`
- **Screenshots**: `test-results/`
- **Videos**: `test-results/`

## 🔧 Personalización

### **Agregar nuevas pruebas**
Edita: `tests/e2e/portfolio.spec.ts`

### **Modificar configuración**
Edita: `playwright.config.ts`

## 🐛 Troubleshooting

### **Si las pruebas fallan:**
1. Verifica que el servidor esté corriendo en `localhost:3000`
2. Asegúrate de tener los navegadores instalados
3. Revisa la estructura HTML de tu sitio

### **Instalar navegadores manualmente:**
```bash
npx playwright install chromium
npx playwright install firefox
npx playwright install webkit
```

## 🎯 Ejecución Rápida

Para probar solo Chrome rápidamente:
```bash
npx playwright test --project=chromium
```

Para ejecutar pruebas en modo headless:
```bash
npx playwright test --headed=false
```
