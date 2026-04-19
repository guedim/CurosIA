# Proyecto Clase 7: Azure AI Inference & MCP Server

Este proyecto implementa un servidor utilizando **Starlette** para interactuar con modelos de Azure AI, siguiendo el estándar de **Model Context Protocol (MCP)**.

## 🚀 Instalación y Configuración

Sigue estos pasos para configurar tu entorno de desarrollo y evitar conflictos de dependencias.

### 1. Preparar el entorno (Recomendado)
Se recomienda utilizar un entorno virtual para asegurar que las dependencias no entren en conflicto con el sistema.

```bash
python -m venv .venv
source .venv/bin/activate  # En Windows: .venv\Scripts\activate

```

### 2. Instalar dependencias

Actualiza el gestor de paquetes e instala las librerías necesarias:

```bash
# Actualizar pip
python -m pip install --upgrade pip

# Instalar SDK de Azure, FastAPI y dependencias base
pip install azure-ai-inference fastapi starlette

# Instalar servidor ASGI y utilidades
pip install uvicorn

```

---

## 🛠️ Ejecución del Proyecto

### Iniciar el Servidor

Para levantar el servidor de desarrollo con recarga automática, utiliza el siguiente comando (preferiblemente con el prefijo `python -m` para evitar conflictos de rutas):

```bash
python -m uvicorn server:app --reload

```

### Iniciar el Cliente (Inspector MCP)

Para probar el servidor utilizando el inspector del **Model Context Protocol**, ejecuta:

```bash
npx @modelcontextprotocol/inspector mcp run server.py

```

---