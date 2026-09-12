# Curso de LangChain

Repositorio de apuntes y ejercicios del curso de **LangChain**, con ejemplos prácticos de cómo integrar distintos proveedores de LLM (OpenAI y Google Gemini) usando la misma interfaz de LangChain.

Cada carpeta tiene su propio README con el detalle de cada archivo y qué se aprende en ella.

## Estructura del proyecto

```
langchain/
├── .env                # Variables de entorno con las API keys (no se sube a git)
├── .env.example        # Plantilla de variables de entorno
├── .gitignore
├── requirements.txt     # Dependencias de Python del proyecto
├── Tema1/               # Primeros pasos con LangChain (chat models, LCEL básico, chatbot Streamlit)
├── Tema2/               # LCEL a fondo: Runnables, prompts, output parsers estructurados
├── Tema3/               # Document loaders, text splitters y embeddings
├── vector_store/        # Bases de datos vectoriales (Chroma) y retrievers
├── rag/                 # Mini-proyecto: asistente legal RAG con Google Gemini
└── cv_analyzer/         # Mini-proyecto: analizador de CVs con IA
```

## Temas

- **[Tema1](Tema1/README.md)**: primeros pasos con LangChain — instanciar un modelo de chat (OpenAI y Gemini), invocarlo directo vs. con `PromptTemplate` (LCEL), y un chatbot Streamlit con historial y streaming.
- **[Tema2](Tema2/README.md)**: LCEL a fondo — `Runnable`/`RunnableLambda`/`RunnableParallel`, distintas formas de construir prompts (`PromptTemplate`, `ChatPromptTemplate`, `MessagesPlaceholder`) y salidas estructuradas con Pydantic (`with_structured_output`).
- **[Tema3](Tema3/README.md)**: carga de documentos (PDF, web, Google Drive), por qué dividir texto en chunks antes de mandarlo a un LLM, y embeddings + similitud coseno.
- **[vector_store](vector_store/README.md)**: indexar documentos en una base de datos vectorial `Chroma` y comparar estrategias de retriever (similarity, `as_retriever`, `MultiQueryRetriever`).
- **[rag](rag/README.md)**: mini-proyecto de asistente legal RAG que combina un `EnsembleRetriever` (MMR + MultiQuery + similarity) con modelos de Google Gemini, expuesto en una app Streamlit.
- **[cv_analyzer](cv_analyzer/README.md)**: mini-proyecto que analiza CVs en PDF y evalúa su ajuste a una descripción de puesto usando `with_structured_output` (requiere `OPENAI_API_KEY`).

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

Algunas carpetas tienen variables de entorno adicionales (opcionales, con valores por defecto):

- **`rag/`**: `RAG_EMBEDDING_MODEL`, `RAG_QUERY_MODEL`, `RAG_GENERATION_MODEL`, `RAG_CHROMA_DB_PATH` — ver [rag/README.md](rag/README.md#variables-de-entorno).
- **`Tema3/`**: `GOOGLE_DRIVE_CREDENTIALS_PATH`, `GOOGLE_DRIVE_TOKEN_PATH` (para `google_drive_loader.py`) — ver [Tema3/README.md](Tema3/README.md#google-drive-credentialsjson).

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
| `langchain-community` | Integraciones y utilidades de la comunidad (loaders, vector stores, herramientas de terceros, etc.) |
| `langchain-classic` | Componentes clásicos de LangChain (`MultiQueryRetriever`, `EnsembleRetriever`) |
| `python-dotenv` | Carga las variables de entorno del archivo `.env` |
| `streamlit` | Framework para construir las interfaces web (chatbots, RAG, cv_analyzer) |
| `PyPDF2` | Extracción de texto desde archivos PDF (usado en `cv_analyzer`) |
| `google-api-python-client` | Cliente oficial para consumir APIs de Google (Drive, Docs, etc.) |
| `google-auth-httplib2` | Adaptador de autenticación de Google para `httplib2` |
| `google-auth-oauthlib` | Flujo de autenticación OAuth 2.0 de Google |
| `langchain-google-community` | `GoogleDriveLoader` mantenido (reemplaza al deprecado de `langchain-community`) |
| `beautifulsoup4` | Parseo de HTML, usado por `WebBaseLoader` (`bs4.SoupStrainer`) |
| `pypdf` | Backend de extracción de texto usado por `PyPDFLoader` |
| `numpy` | Operaciones vectoriales (similitud coseno entre embeddings) |
| `chromadb` | Base de datos vectorial usada por `Chroma` |
| `langchain-chroma` | Integración mantenida de `Chroma` como vector store de LangChain (usada en `rag/`, sustituye a la clase deprecada de `langchain-community`) |
| `langchain-text-splitters` | `RecursiveCharacterTextSplitter`, usado en `Tema3/` y `vector_store/` |
| `pydantic` | Modelos de datos y validación, usado en `Tema2/` (output parsers) y `cv_analyzer/` |

## Uso

Cada carpeta tiene en su propio README los comandos exactos para ejecutar sus scripts. En general:

- Los scripts sueltos se ejecutan con `python <ruta_al_script>.py` desde la raíz del repositorio.
- Las apps con interfaz web (`Tema1/streamlit_chatbot.py`, `rag/app.py`, `cv_analyzer/app.py`) se ejecutan con `streamlit run <ruta>`, **no** con `python`.
