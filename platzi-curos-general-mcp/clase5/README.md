# MCP Server & Client

Este repositorio contiene ejemplo de un cliente y un server MCP
- Lista recursos
- Lista Tools
- Lista Prompts


## 💻 Instalar prerequisitos

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

## ✅ Ejecución

Para confirmar el cliente se conecta al sevidor, ejecuta el siguiente comando

```bash
python client.py
```
