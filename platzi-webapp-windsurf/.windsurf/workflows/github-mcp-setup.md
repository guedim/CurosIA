---
description: Configuración del MCP de GitHub para Windsurf
---

# Configuración MCP de GitHub

## Pasos para configurar el MCP de GitHub en Windsurf:

### 1. Token de GitHub
- Ir a GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
- Generar nuevo token con permisos: `repo`, `issues:read`, `pull_requests:read`, `metadata:read`
- Copiar el token

### 2. Configurar archivo MCP
- Editar `.windsurf/mcp.json`
- Reemplazar `ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx` con el token real

### 3. Reiniciar Windsurf
- Cerrar y volver a abrir Windsurf para que cargue la configuración MCP

### 4. Verificar funcionamiento
- El MCP de GitHub estará disponible en el contexto de Windsurf
- Podrás acceder a información del repositorio, issues, PRs, etc.

## Funcionalidades disponibles:
- Información del repositorio
- Lectura de issues y pull requests
- Metadatos del repositorio
- Estadísticas y actividad

## Notas importantes:
- El token debe mantenerse privado y no compartirse
- El servidor se instala automáticamente con `npx -y`
- No requiere instalación manual global debido a permisos
