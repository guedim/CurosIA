# Curso de LangChain

Repositorio de apuntes y ejercicios del curso de **LangChain**, con ejemplos prácticos de cómo integrar distintos proveedores de LLM (OpenAI y Google Gemini) usando la misma interfaz de LangChain.

## Estructura del proyecto

```
langchain/
├── .env                          # Variables de entorno con las API keys (no se sube a git)
├── .env.example                   # Plantilla de variables de entorno
├── .gitignore
├── requirements.txt               # Dependencias de Python del proyecto
├── Tema1/
│   ├── hello_world_openai.py      # Ejemplo básico usando OpenAI (gpt-4o-mini)
│   ├── hello_world_avanzado.py    # Igual que el anterior, pero usando PromptTemplate + LCEL
│   ├── hello_world_gemini.py      # Mismo ejemplo usando Google Gemini (gemini-3.6-flash)
│   └── streamlit_chatbot.py       # Chatbot con interfaz web usando Streamlit
└── Tema2/
    ├── Runnables.py                # Introducción a la interfaz Runnable (LCEL) con RunnableLambda
    ├── analisis_sentimientos_parte1.py  # Pipeline con RunnableParallel: resumen + análisis de sentimiento
    ├── prompt_template.py          # PromptTemplate básico con una variable
    ├── chat_prompt_template.py     # ChatPromptTemplate con mensajes system/human
    ├── message_placeholders.py     # MessagesPlaceholder para inyectar historial de conversación
    ├── rol_prompt_templates.py     # SystemMessagePromptTemplate + HumanMessagePromptTemplate con varias variables
    └── output_parsers_parte1.py    # Modelo Pydantic como base para parsear salidas estructuradas
```

### Tema1

- **`Tema1/hello_world_openai.py`**: primer contacto con LangChain. Carga las variables de entorno, instancia un modelo `ChatOpenAI` y le hace una pregunta simple, imprimiendo la respuesta.
- **`Tema1/hello_world_avanzado.py`**: mismo caso de uso que `hello_world_openai.py`, pero en lugar de llamar a `.invoke()` directamente sobre el modelo, construye un `PromptTemplate` y lo encadena con el operador `|` (LCEL: `chain = plantilla | chat`).
- **`Tema1/hello_world_gemini.py`**: la misma idea que `hello_world_openai.py` pero usando `ChatGoogleGenerativeAI`, para comparar cómo LangChain permite intercambiar el proveedor del modelo sin cambiar la lógica del programa.

  > **Nota:** este script incluye un monkeypatch de `socket.getaddrinfo` que fuerza la resolución IPv4. Es un workaround para un problema de red local (algunas redes resuelven el registro AAAA de la API de Google, pero el `connect()` por IPv6 se queda colgado indefinidamente). Si tu conexión no tiene ese problema, el bloque es inofensivo y puedes ignorarlo.

- **`Tema1/streamlit_chatbot.py`**: chatbot con interfaz web construido con Streamlit + LangChain (LCEL), con historial de conversación (acotado a los últimos turnos) y streaming de respuestas.

### Tema2

- **`Tema2/Runnables.py`**: introduce la interfaz `Runnable` de LangChain (LCEL) usando `RunnableLambda` para envolver funciones Python normales como pasos de una cadena. Define dos runnables (uno que formatea un número como texto y otro que duplica ese texto en una lista) y los encadena con el operador `|`, mostrando cómo componer transformaciones arbitrarias sin necesidad de un LLM.
- **`Tema2/analisis_sentimientos_parte1.py`**: pipeline más avanzado que combina un preprocesador de texto, un `RunnableParallel` con dos ramas (resumen y análisis de sentimiento estructurado en JSON usando `ChatGoogleGenerativeAI`) y un paso final que combina ambos resultados. Incluye `extract_text` para normalizar la respuesta del modelo (Gemini puede devolver `content` como lista de partes en lugar de string) y procesa varias reviews de ejemplo con `chain.batch(...)`.
- **`Tema2/prompt_template.py`**: introduce `PromptTemplate`, la forma más básica de plantilla de prompt en LangChain, con una única variable (`producto`) rellenada con `.format(...)`.
- **`Tema2/chat_prompt_template.py`**: usa `ChatPromptTemplate.from_messages(...)` con tuplas `("system", ...)` / `("human", ...)` para construir una conversación con roles, en lugar de un único texto plano.
- **`Tema2/message_placeholders.py`**: muestra cómo usar `MessagesPlaceholder` para inyectar dinámicamente un historial de conversación (lista de `HumanMessage`/`AIMessage`) dentro de un `ChatPromptTemplate`, manteniendo el contexto de turnos anteriores.
- **`Tema2/rol_prompt_templates.py`**: combina `SystemMessagePromptTemplate` y `HumanMessagePromptTemplate` (cada uno con varias variables) dentro de un `ChatPromptTemplate`, simulando un asistente con rol, especialidad y tono configurables.
- **`Tema2/output_parsers_parte1.py`**: primer paso hacia los *output parsers* de LangChain: define un modelo `Usuario` con Pydantic (`BaseModel`) y muestra cómo valida y castea datos crudos (por ejemplo, castea el `id` de string a int) al construir la instancia.

## Requisitos previos

- Python 3.14 (o compatible)
- Una API key de [OpenAI](https://platform.openai.com/api-keys) y/o de [Google AI Studio](https://aistudio.google.com/app/apikey), según los ejemplos que quieras ejecutar

## Instalación

```bash
# Crear entorno virtual
python -m venv venv

# Activar el entorno virtual
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows

# Instalar dependencias
pip install -r requirements.txt
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con tus claves de API:

```
OPENAI_API_KEY=tu_api_key_de_openai
GOOGLE_API_KEY=tu_api_key_de_google
```

> El archivo `.env` ya está incluido en `.gitignore`, así que las credenciales nunca se suben al repositorio remoto. También puedes copiar `.env.example` como punto de partida: `cp .env.example .env`.

## Notas de seguridad

- **Permisos de `.env`**: restringe el acceso en máquinas compartidas:
  ```bash
  chmod 600 .env
  ```
- **`streamlit run` escucha en todas las interfaces de red por defecto** (sin autenticación). Este repo ya incluye `.streamlit/config.toml` con `address = "127.0.0.1"` para limitarlo a uso local; si lo quitas, cualquier persona en tu misma red podría acceder al chatbot y consumir tu API key.

## Dependencias principales

| Paquete | Propósito |
|---|---|
| `langchain-core` | Núcleo de LangChain: abstracciones base (mensajes, prompts, modelos, etc.) |
| `langchain-openai` | Integración de LangChain con los modelos de OpenAI (`ChatOpenAI`) |
| `langchain-google-genai` | Integración de LangChain con los modelos de Google Gemini (`ChatGoogleGenerativeAI`) |
| `python-dotenv` | Carga las variables de entorno del archivo `.env` |
| `streamlit` | Framework para construir la interfaz web del chatbot |

## Uso

Ejecuta cualquiera de los ejemplos desde la raíz del proyecto:

```bash
python Tema1/hello_world_openai.py
python Tema1/hello_world_avanzado.py
python Tema1/hello_world_gemini.py
python Tema2/Runnables.py
python Tema2/analisis_sentimientos_parte1.py
python Tema2/prompt_template.py
python Tema2/chat_prompt_template.py
python Tema2/message_placeholders.py
python Tema2/rol_prompt_templates.py
python Tema2/output_parsers_parte1.py
```

El chatbot con interfaz web (`streamlit_chatbot.py`) es distinto: al usar Streamlit, **no se ejecuta con `python`**, sino con el comando `streamlit run`, que levanta un servidor local y abre la app en el navegador:

```bash
streamlit run Tema1/streamlit_chatbot.py
```

Si no tienes `streamlit` en el PATH (por ejemplo, con el entorno virtual desactivado), puedes invocarlo directamente desde el venv:

```bash
./venv/bin/streamlit run Tema1/streamlit_chatbot.py
```

Esto abrirá automáticamente `http://localhost:8501` en tu navegador con el chatbot. Requiere tener configurada la variable `OPENAI_API_KEY` en el `.env`, ya que usa modelos de OpenAI. Desde la barra lateral de la app puedes ajustar la temperatura y elegir el modelo (`gpt-3.5-turbo`, `gpt-4` o `gpt-4o-mini`), y el botón "🗑️ Nueva conversación" reinicia el historial del chat.
