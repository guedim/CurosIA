# MCP Server - Math Tools

Este proyecto implementa un servidor de herramientas matemáticas utilizando el **Model Context Protocol (MCP)** con la clase `FastMCP`.

## 🛠️ Instalación y Preparación

Sigue estos pasos para configurar tu entorno virtual e instalar las dependencias necesarias:

```bash
# 1. Crear y activar el entorno virtual
python3 -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate

# 2. Actualizar pip e instalar dependencias
python -m pip install --upgrade pip
pip install azure-ai-inference fastapi starlette uvicorn mcp

```

---

## 🚀 Ejecución del Proyecto

Para trabajar con este servidor, tienes dos modalidades principales:

### 1. Iniciar el Servidor (ASGI)

Para levantar el servidor con recarga automática para desarrollo web o integraciones de red:

```bash
python3 -m uvicorn server:mcp --reload

```

*Nota: Usamos `:mcp` porque es el nombre de la instancia en tu código.*

### 2. Correr y ver en Inspector (MCP)

Para probar y depurar las herramientas (`add`, `substract`, `multiply`, `divide`) directamente en la interfaz del inspector de MCP:

```bash
npx @modelcontextprotocol/inspector mcp run server.py

```

---

## 📝 Herramientas Incluidas

El servidor expone las siguientes funciones matemáticas:

* **add**: Suma dos números decimales.
* **substract**: Resta dos números decimales.
* **multiply**: Multiplica dos números decimales.
* **divide**: Divide dos números (incluye validación de división por cero).