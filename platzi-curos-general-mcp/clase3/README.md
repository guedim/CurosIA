# MCP Server - Guía de Configuración

Este repositorio contiene la implementación de un servidor basado en el **Model Context Protocol (MCP)**. A continuación, se detallan las instrucciones para ejecutar el servidor tanto en un entorno Dockerizado como de forma local.

---

## 🏗️ Opción 1: Docker (Recomendado)

Utiliza Docker para asegurar un entorno consistente y evitar conflictos de dependencias.

### 1. Construir la imagen
Desde la raíz del proyecto, ejecuta:
```bash
docker buildx build -t mcp-server .
```

### 2. Levantar los servicios

Inicia el contenedor en segundo plano (detached mode):

```bash
docker compose up -d
```

### 3. Acceder al contenedor

Si necesitas ejecutar comandos directamente dentro del entorno:

```bash
docker exec -it mcp-server bash
```

### 4. Ejecutar el Inspector (Dentro del contenedor)

Una vez dentro, inicia el inspector de MCP para probar el servidor:

```bash
npx @modelcontextprotocol/inspector mcp run server.pys
```

### 5. Acceso Web

Abre tu navegador en la siguiente URL (sustituye `TOKEN` por tu token de autenticación):

> [http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=TOKEN#resources](https://www.google.com/search?q=http://localhost:6274/%3FMCP_PROXY_AUTH_TOKEN%3DTOKEN%23resources)

---

## 💻 Opción 2: Ejecutando npx

Si prefieres ejecutarlo directamente en tu sistema operativo, sigue estos pasos:

### Requisitos previos

* **Python**: Asegúrate de tener instalada la versión 3.x.
* **Node.js / npx**: Necesario para ejecutar el inspector de MCP.

### Ejecución

Ejecuta el servidor utilizando el inspector directamente:

```bash
npx @modelcontextprotocol/inspector mcp run server.py
```

### Acceso Web

Abre tu navegador en:

> [http://localhost:6274/?MCP_PROXY_AUTH_TOKEN=TOKEN](https://www.google.com/search?q=http://localhost:6274/%3FMCP_PROXY_AUTH_TOKEN%3DTOKEN)

---

## Notas adicionales

* Asegúrate de que el puerto `6274` no esté siendo utilizado por otro proceso.
* El archivo `server.py` debe estar en el directorio raíz al momento de ejecutar los comandos.

¡Claro! Aquí tienes un diseño limpio y profesional para tu archivo `README.md`. He organizado los pasos de forma lógica y he corregido el pequeño error de dedo en "Ejeuctar".

---

## 💻 Opción 3: Instalndo mcp

Instrucciones para configurar y ejecutar el servidor MCP en un entorno local (macOS/Linux).

## 🚀 Instalación y Ejecución Local

### Opción 1: Instalación Directa
Si prefieres instalarlo directamente en tu sistema:

```bash
pip install "mcp[cli]"
```

> **Nota para usuarios de Mac:** Si encuentras errores con el comando anterior, intenta usar `pip3`:
> ```bash
> pip3 install "mcp[cli]"
> ```
> 
> 

---

### Opción 2: Uso de Entorno Virtual (Recomendado)

Para mantener tu sistema limpio y evitar conflictos entre versiones de librerías, se recomienda usar un entorno virtual:

1. **Crear el entorno:**
```bash
python3 -m venv venv
```


2. **Activar el entorno:**
```bash
source venv/bin/activate
```


3. **Instalar el paquete:**
```bash
pip install "mcp[cli]"
```

---

## ✅ Verificación

Para confirmar que la instalación fue exitosa y que el comando `mcp` está disponible en tu PATH, ejecuta:

```bash
mcp --help
```

---

## 🛠️ Ejecución del Servidor

Una vez instalado, puedes poner en marcha el servidor de desarrollo apuntando a tu archivo principal:

```bash
mcp dev server.py
```