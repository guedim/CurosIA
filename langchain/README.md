# Curso de LangChain

Repositorio de apuntes y ejercicios del curso de **LangChain**, con ejemplos prácticos de cómo integrar distintos proveedores de LLM (OpenAI y Google Gemini) usando la misma interfaz de LangChain.

## Estructura del proyecto

```
langchain/
├── .env                          # Variables de entorno con las API keys (no se sube a git)
├── .env.example                   # Plantilla de variables de entorno
├── .gitignore
├── requirements.txt               # Dependencias de Python del proyecto
├── cv_analyzer/                   # Mini-proyecto: analizador de CVs con IA (Streamlit + LangChain)
│   ├── app.py                     # Punto de entrada de la app Streamlit
│   ├── models/cv_model.py         # Modelo Pydantic `AnalisisCV` (salida estructurada del análisis)
│   ├── prompts/cv_prompts.py      # System/Human prompts del "reclutador experto"
│   ├── services/pdf_processor.py  # Extracción de texto desde un PDF con PyPDF2
│   ├── services/cv_evaluator.py   # Cadena LCEL: prompt | modelo con salida estructurada
│   └── ui/streamlit_ui.py         # Interfaz Streamlit: carga de CV, descripción del puesto y resultados
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
    ├── output_parsers_parte1.py    # Modelo Pydantic como base para parsear salidas estructuradas
    └── output_parsers_parte2.py    # with_structured_output con Gemini y un Enum para restringir valores
└── Tema3/
    ├── document_loaders.py         # PyPDFLoader + WebBaseLoader (con bs4.SoupStrainer)
    ├── google_drive_loader.py      # GoogleDriveLoader (langchain-google-community) sobre una carpeta de Drive
    ├── text_splitters_parte1.py    # Carga un PDF completo y lo resume de una sola vez con el LLM
    ├── text_splitters_parte2.py    # RecursiveCharacterTextSplitter: divide el PDF en chunks y resume por partes
    └── embeddings_langchain.py     # OpenAIEmbeddings + similitud coseno entre dos frases
└── vector_store/
    ├── vector_stores.py            # Indexa PDFs de contratos en Chroma y hace una búsqueda semántica de ejemplo
    ├── retrievers_langchain.py     # Abre el Chroma ya indexado y consulta con un retriever (as_retriever)
    ├── multi_query_retriever.py    # Igual, pero usando MultiQueryRetriever (genera varias variantes de la consulta con un LLM)
    ├── contratos/                  # PDFs de ejemplo (contratos de arrendamiento) a indexar
    └── chroma_db/                  # Base de datos Chroma persistida (se genera al ejecutar el script, NO se sube a git)
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
- **`Tema2/output_parsers_parte2.py`**: usa `with_structured_output` sobre `ChatGoogleGenerativeAI` para forzar que el modelo devuelva un objeto `AnalisisTexto` (resumen + sentimiento) validado con Pydantic. El campo `sentimiento` es un `Enum` (`Positivo`, `Negativo`, `Neutro`), por lo que el modelo solo puede devolver uno de esos tres valores.

### Tema3

- **`Tema3/document_loaders.py`**: dos ejemplos de carga de documentos. Primero usa `PyPDFLoader` para extraer texto de `Profile.pdf` página por página. Después usa `WebBaseLoader` sobre varias URLs de la documentación de LangChain, filtrando el HTML con `bs4.SoupStrainer` para quedarse solo con los `div` de clase `main-content`/`article-content`.
- **`Tema3/google_drive_loader.py`**: usa `GoogleDriveLoader` (paquete `langchain-google-community`) para cargar todos los documentos de una carpeta de Google Drive de forma recursiva. Requiere `credentials.json` y genera `token.json` tras la autorización (ver sección [Google Drive](#google-drive-credentialsjson) más abajo).
- **`Tema3/text_splitters_parte1.py`**: carga `quijote.pdf` completo, concatena todas las páginas en un único string y se lo pasa entero al LLM (`ChatGoogleGenerativeAI`) para pedirle un resumen. Útil como punto de comparación frente a `text_splitters_parte2.py`, ya que enviar el documento completo de una sola vez puede superar los límites de tokens del modelo.
- **`Tema3/text_splitters_parte2.py`**: mismo PDF, pero usando `RecursiveCharacterTextSplitter` para dividirlo en chunks de 10000 caracteres (con 200 de overlap) antes de resumir. Resume los primeros 11 chunks uno por uno y luego combina esos resúmenes parciales en un resumen final con una última llamada al LLM.
- **`Tema3/embeddings_langchain.py`**: genera embeddings de dos frases con `OpenAIEmbeddings` (`text-embedding-3-large`) y calcula la similitud coseno entre ambos vectores usando `numpy`, para ilustrar cómo el significado semántico se refleja en la cercanía de los vectores.

### vector_store

- **`vector_store/vector_stores.py`**: carga todos los PDF de un directorio con `PyPDFDirectoryLoader`, los divide en chunks con `RecursiveCharacterTextSplitter` (5000 caracteres, 1000 de overlap) y los indexa en una base de datos vectorial `Chroma` usando `GoogleGenerativeAIEmbeddings` (`models/gemini-embedding-001`). Termina con una búsqueda semántica de ejemplo (`similarity_search`) sobre los documentos indexados.
  - Por defecto lee los PDF desde `vector_store/contratos/` (contratos de arrendamiento de ejemplo) y persiste la base de datos en `vector_store/chroma_db/`. Ambas rutas se resuelven relativas al script, no están hardcodeadas.
  - Ambas rutas son configurables por línea de comandos:
    ```bash
    python vector_store/vector_stores.py --contratos-dir /ruta/a/tus/contratos --persist-dir /ruta/a/chroma_db
    ```
  - Requiere `GOOGLE_API_KEY` configurada en `.env` (usa `load_dotenv()`), y el paquete `chromadb` instalado (ver [Dependencias principales](#dependencias-principales)).
  - `vector_store/chroma_db/` es un directorio generado (contiene la base de datos vectorial persistida): no es necesario ni se debe subir a git, está incluido en `.gitignore`. Se regenera solo con volver a ejecutar el script.
- **`vector_store/retrievers_langchain.py`**: abre la base de datos `Chroma` ya persistida en `vector_store/chroma_db/` (misma ruta resuelta relativa al script) usando el mismo modelo de embeddings `GoogleGenerativeAIEmbeddings` (`models/gemini-embedding-001`), y consulta con un `retriever` (`as_retriever`, `search_type="similarity"`, `k=2`) en lugar de `similarity_search` directo.
  - Requiere haber ejecutado antes `vector_store/vector_stores.py` (o tener ya un `chroma_db/` generado), y `GOOGLE_API_KEY` configurada en `.env`.
- **`vector_store/multi_query_retriever.py`**: misma base (`Chroma` en `vector_store/chroma_db/` + `GoogleGenerativeAIEmbeddings`), pero envuelve el retriever base con `MultiQueryRetriever.from_llm`, que usa un LLM (`ChatGoogleGenerativeAI`, `gemini-3.6-flash`) para generar varias variantes de la consulta original y ampliar así los documentos recuperados.
  - Requiere `GOOGLE_API_KEY` configurada en `.env` (se usa tanto para los embeddings como para el LLM).

### cv_analyzer

Mini-proyecto independiente (con su propia app Streamlit) que analiza hojas de vida en PDF y evalúa qué tan bien se ajusta un candidato a una descripción de puesto, usando LangChain + `with_structured_output`.

- **`cv_analyzer/models/cv_model.py`**: define `AnalisisCV`, el modelo Pydantic que estructura la salida del análisis (nombre, años de experiencia, habilidades clave, educación, fortalezas, áreas de mejora y porcentaje de ajuste al puesto).
- **`cv_analyzer/prompts/cv_prompts.py`**: construye un `ChatPromptTemplate` a partir de un `SystemMessagePromptTemplate` (rol de reclutador experto con sus criterios de evaluación) y un `HumanMessagePromptTemplate` (instrucciones para analizar el CV frente a la descripción del puesto).
- **`cv_analyzer/services/pdf_processor.py`**: usa `PyPDF2` para extraer el texto de cada página del PDF subido, concatenándolo en un único string.
- **`cv_analyzer/services/cv_evaluator.py`**: arma la cadena LCEL `chat_prompt | modelo.with_structured_output(AnalisisCV)` usando `ChatOpenAI` (`gpt-4o-mini`) y expone `evaluar_candidato(texto_cv, descripcion_puesto)`.
- **`cv_analyzer/ui/streamlit_ui.py`**: interfaz Streamlit con dos columnas (entrada: subir PDF + descripción del puesto; resultado: perfil del candidato, habilidades, fortalezas, áreas de mejora y recomendación final según el porcentaje de ajuste).
- **`cv_analyzer/app.py`**: punto de entrada que arranca la interfaz de `ui/streamlit_ui.py`.

> **Nota:** a diferencia de los ejemplos de `Tema1`/`Tema2`, este mini-proyecto usa `ChatOpenAI` (requiere `OPENAI_API_KEY`).

Para ejecutarlo:

```bash
cd cv_analyzer
streamlit run app.py
```

> **Importante:** ejecútalo con `streamlit run`, no con `python app.py`. Streamlit necesita su propio runner para levantar el servidor web; si lo ejecutas con `python` verás el error `missing ScriptRunContext` y no se abrirá nada en el navegador.

Si no tienes `streamlit` en el PATH (por ejemplo, con el entorno virtual desactivado), invócalo desde el venv:

```bash
../.venv/bin/streamlit run app.py
```

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

### Google Drive (`credentials.json`)

Los ejemplos que usan `GoogleDriveLoader` (ver `Tema3/google_drive_loader.py`) necesitan un archivo `credentials.json` de OAuth 2.0 propio, generado desde Google Cloud Console:

1. Entra a [Google Cloud Console](https://console.cloud.google.com/) y crea (o selecciona) un proyecto.
2. Habilita la **Google Drive API** para ese proyecto (`APIs y servicios` → `Biblioteca`).
3. Configura la **pantalla de consentimiento OAuth** (`APIs y servicios` → `Pantalla de consentimiento OAuth`), tipo "Externo" y agrégate como usuario de prueba.
4. Crea credenciales OAuth (`APIs y servicios` → `Credenciales` → `Crear credenciales` → `ID de cliente de OAuth`), tipo de aplicación **"Aplicación de escritorio"**.
5. Descarga el JSON generado y guárdalo en el proyecto, por ejemplo como `Tema3/credentials.json`.
6. Apunta las variables en tu `.env` a las rutas de esos archivos:
   ```
   GOOGLE_DRIVE_CREDENTIALS_PATH=Tema3/credentials.json
   GOOGLE_DRIVE_TOKEN_PATH=Tema3/token.json
   ```

`token.json` se genera solo la primera vez que ejecutas el script (te pedirá autorizar en el navegador). Tanto `credentials.json` como `token.json` quedan cubiertos por `.gitignore` (`*credentials*.json`, `*token*.json`) y nunca deben subirse al repositorio.

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
| `python-dotenv` | Carga las variables de entorno del archivo `.env` |
| `streamlit` | Framework para construir la interfaz web del chatbot |
| `PyPDF2` | Extracción de texto desde archivos PDF (usado en `cv_analyzer`) |
| `google-api-python-client` | Cliente oficial para consumir APIs de Google (Drive, Docs, etc.) |
| `google-auth-httplib2` | Adaptador de autenticación de Google para `httplib2` |
| `google-auth-oauthlib` | Flujo de autenticación OAuth 2.0 de Google |
| `langchain-google-community` | `GoogleDriveLoader` mantenido (reemplaza al deprecado de `langchain-community`) |
| `beautifulsoup4` | Parseo de HTML, usado por `WebBaseLoader` (`bs4.SoupStrainer`) |
| `pypdf` | Backend de extracción de texto usado por `PyPDFLoader` |
| `numpy` | Operaciones vectoriales (similitud coseno entre embeddings) |
| `chromadb` | Base de datos vectorial usada por `Chroma` en `vector_store/vector_stores.py` |

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
python Tema2/output_parsers_parte2.py
python Tema3/document_loaders.py
python Tema3/google_drive_loader.py
python Tema3/text_splitters_parte1.py
python Tema3/text_splitters_parte2.py
python Tema3/embeddings_langchain.py
python vector_store/vector_stores.py
python vector_store/retrievers_langchain.py
python vector_store/multi_query_retriever.py
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
