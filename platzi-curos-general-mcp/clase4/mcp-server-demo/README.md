# MCP Server - Guía de Instalación con UV

Este proyecto utiliza **uv**, un administrador de paquetes de Python extremadamente rápido, para simplificar la gestión de dependencias y la ejecución del servidor.

## ⚡ Instalación y Configuración

Sigue estos pasos para configurar el entorno desde cero:

### 1. Instalar uv
Si aún no tienes `uv` instalado en tu sistema, puedes hacerlo a través de `pip`:

```bash
pip install uv
```

### 2. Iniciar el Proyecto

Crea la estructura base del proyecto:

```bash
uv init demo-mcp-server
```

### 3. Ingresar al Directorio

Mueve la terminal a la carpeta del proyecto recién creado:

```bash
cd demo-mcp-server
```

### 4. Agregar Dependencias de MCP

Instala el paquete de MCP con las herramientas de línea de comandos necesarias:

```bash
uv add "mcp[cli]"
```

---

## 🚀 Ejecución del Servidor

Para iniciar el servidor en modo desarrollo, utiliza el comando `uv run`. Esto se encargará de gestionar el entorno virtual de forma automática y transparente:

```bash
uv run mcp dev server.py
```

---

## 💡 Notas adicionales

* **No necesitas activar el entorno:** A diferencia del flujo tradicional con `venv`, `uv run` detecta y utiliza automáticamente las dependencias instaladas en el proyecto.
* **Archivo de dependencias:** Verás que se han creado los archivos `pyproject.toml` y `uv.lock`, que mantienen el registro exacto de tu configuración.

```

---

### Un pequeño detalle técnico:
Recuerda que para que el comando final funcione, debes tener un archivo llamado `server.py` en la raíz de tu carpeta `demo-mcp-server`.

```