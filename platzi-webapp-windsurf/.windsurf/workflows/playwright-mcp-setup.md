---
description: Configuración del MCP de Playwright para Windsurf
---

# Configuración MCP de Playwright

## ¿Qué es el MCP de Playwright?

El MCP de Playwright permite a Windsurf interactuar con navegadores web para:
- Automatizar pruebas end-to-end
- Realizar scraping web
- Capturar screenshots
- Interactuar con páginas web

## Configuración

### 1. Configuración automática
El servidor MCP de Playwright ya está configurado en `.windsurf/mcp.json`:
```json
{
  "playwright": {
    "command": "npx",
    "args": [
      "-y",
      "@modelcontextprotocol/server-playwright"
    ]
  }
}
```

### 2. Instalación de dependencias
El servidor se instala automáticamente con `npx -y` cuando Windsurf lo necesita.

### 3. Reiniciar Windsurf
Cierra y vuelve a abrir Windsurf para cargar la nueva configuración.

## Funcionalidades disponibles

### 🎭 **Automatización de navegador**
- Navegación a URLs
- Clicks en elementos
- Formularios
- Esperas y timeouts

### 📸 **Captura de contenido**
- Screenshots
- PDFs
- Texto de páginas
- Metadatos

### 🔍 **Web scraping**
- Extracción de datos
- Análisis de DOM
- Seguimiento de enlaces

### 🧪 **Testing automatizado**
- Pruebas E2E
- Validaciones visuales
- Tests de rendimiento

## Ejemplos de uso

### Básico:
- "Abre google.com y haz una captura de pantalla"
- "Navega a mi sitio y extrae los títulos"
- "Verifica que el formulario funcione correctamente"

### Avanzado:
- "Realiza una prueba E2E completa del flujo de login"
- "Scrapea los productos de esta página e-commerce"
- "Genera un PDF del reporte semanal"

## Notas importantes
- Requiere conexión a internet para funcionamiento
- Playwright maneja automáticamente los navegadores
- No requiere instalación manual de navegadores
- Los navegadores se descargan bajo demanda
