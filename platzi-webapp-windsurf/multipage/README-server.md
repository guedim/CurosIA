# Servidor de Blog API con Bun

Este es un servidor HTTP simple creado con Bun.js que expone un endpoint para listar todos los posts del blog.

## 🚀 Requisitos

- [Bun](https://bun.sh/) instalado en el sistema

## 📦 Instalación

```bash
# Instalar dependencias de tipos
bun install --bun bun-package.json
```

## 🏃‍♂️ Ejecutar el servidor

```bash
# Modo desarrollo (con hot reload)
bun run dev

# Modo producción
bun run start
```

## 📡 Endpoint

### GET /api/posts

Lista todos los posts disponibles del blog.

**URL:** `http://localhost:3001/api/posts`

**Respuesta:**
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
    },
    // ... más posts
  ]
}
```

## 📝 Notas

- El servidor corre en el puerto **3001** para no conflictuar con Next.js (puerto 3000)
- Los datos están almacenados localmente en el archivo `server.ts`
- No requiere base de datos ni dependencias externas
- Utiliza el API nativo de Bun para alto rendimiento
