# 🧮 MCP Calculator Server

Este repositorio contiene un servidor basado en el **Model Context Protocol (MCP)** desarrollado en Python utilizando el framework `FastMCP`. El servidor expone herramientas matemáticas básicas (suma, resta, multiplicación y división) para ser utilizadas por clientes de IA como Claude Desktop.

---

## 🚀 Guía de Instalación y Ejecución Local

Sigue estos pasos para configurar tu entorno y probar el servidor en tu máquina.

### 1. Crear y activar el Entorno Virtual (venv)
Es vital aislar las librerías para evitar conflictos con otras instalaciones de Python.

```bash
# 1. Ve a la carpeta raíz de tu proyecto
cd /tu/ruta/al/proyecto/github-mcp-server

# 2. Crea el entorno virtual
python3 -m venv venv

# 3. Actívalo
# En macOS/Linux:
source venv/bin/activate
# En Windows:
# .\venv\Scripts\activate

```

### 2. Instalar las dependencias

Con el entorno virtual activado (verás el prefijo `(venv)` en tu terminal), instala los paquetes necesarios:

```bash
pip install mcp fastmcp

```

### 3. Configuración del Servidor (`server.py`)

Para que el protocolo MCP funcione correctamente por medio de la entrada estándar (STDIO), asegúrate de que tu archivo `src/mi_server/server.py` incluya el punto de entrada principal.

**Nota importante:** Evita usar `print()` en el código, ya que interfiere con la comunicación JSON-RPC.

```python
from mcp.server.fastmcp import FastMCP

# Inicialización de FastMCP
mcp = FastMCP("Calculadora-Pro")

@mcp.tool()
def add(a: float, b: float) -> float:
    """Suma dos números."""
    return a + b

# Asegúrate de incluir esto al final del archivo:
if __name__ == "__main__":
    mcp.run()

```

### 4. Pruebas con el MCP Inspector

El Inspector es una herramienta web para verificar que las herramientas (`tools`) estén bien registradas. Ejecuta el siguiente comando apuntando al ejecutable de Python de tu entorno virtual:

```bash
npx @modelcontextprotocol/inspector ./venv/bin/python ./src/mi_server/server.py

```

Una vez ejecutado, abre [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) en tu navegador para interactuar con el servidor.

---

# 🚀 Guía de Instalación y Ejecución Remota  (Global Installation)


Este proyecto implementa un servidor de **Model Context Protocol (MCP)** desarrollado en Python. Permite a los modelos de lenguaje (LLMs), como Claude, realizar operaciones matemáticas básicas mediante una interfaz estandarizada y segura.

El servidor está configurado para ser instalado como una herramienta global de sistema, facilitando su uso en diferentes clientes sin necesidad de gestionar entornos virtuales manualmente cada vez.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado **UV**, el gestor de paquetes de Python de alto rendimiento:

- **macOS/Linux:**
  ```bash
  curl -LsSf [https://astral.sh/uv/install.sh](https://astral.sh/uv/install.sh) | sh

```

* **Windows:**
```powershell
powershell -c "irm [https://astral.sh/uv/install.ps1](https://astral.sh/uv/install.ps1) | iex"

```



---

## 🚀 Instalación y Despliegue

### 1. Instalación Global del Servidor

En lugar de clonar el repositorio, utilizaremos `uv` para instalar el servidor directamente desde GitHub. Esto registrará el comando `mcp-calc` en tu sistema.

```bash
# Instalamos la herramienta directamente apuntando al subdirectorio del repositorio
uv tool install "mcp-calculator-server @ git+https://github.com/guedim/mcp.git#subdirectory=clase10/github-mcp-server" --force
```

> **¿Qué hace este comando?** Descarga el código, instala las dependencias (`mcp`, `fastmcp`), compila el proyecto y crea un ejecutable binario llamado `mcp-calc` accesible desde cualquier terminal.

### 2. Verificación con MCP Inspector

Para asegurarte de que el servidor responde correctamente al protocolo JSON-RPC, utiliza el inspector oficial:

```bash
npx @modelcontextprotocol/inspector mcp-calc

```

Al ejecutarlo, se abrirá una interfaz web en [http://localhost:3000](https://www.google.com/search?q=http://localhost:3000) donde podrás probar las herramientas `add`, `substract`, `multiply` y `divide`.

---


## 🔄 Actualización

Si el repositorio recibe actualizaciones, simplemente vuelve a ejecutar el comando de instalación con el flag `--force`:

```bash
uv tool install "git+[https://github.com/guedim/mcp.git#subdirectory=clase10/github-mcp-server](https://github.com/guedim/mcp.git#subdirectory=clase10/github-mcp-server)" --force

```

---