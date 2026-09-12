# Tema 3 - Document loaders, text splitters y embeddings

Qué se aprende: cómo cargar documentos desde distintas fuentes (PDF local, web, Google Drive), por qué hay que dividir textos largos en chunks antes de mandarlos a un LLM (límites de tokens), y cómo los embeddings capturan significado semántico (similitud coseno).

## Archivos

- **`document_loaders.py`**: dos ejemplos de carga de documentos. Primero usa `PyPDFLoader` para extraer texto de `Profile.pdf` página por página. Después usa `WebBaseLoader` sobre varias URLs de la documentación de LangChain, filtrando el HTML con `bs4.SoupStrainer` para quedarse solo con los `div` de clase `main-content`/`article-content`.
- **`google_drive_loader.py`**: usa `GoogleDriveLoader` (paquete `langchain-google-community`) para cargar todos los documentos de una carpeta de Google Drive de forma recursiva. Requiere `credentials.json` y genera `token.json` tras la autorización (ver [Google Drive](#google-drive-credentialsjson) más abajo).
- **`text_splitters_parte1.py`**: carga `quijote.pdf` completo, concatena todas las páginas en un único string y se lo pasa entero al LLM (`ChatGoogleGenerativeAI`) para pedirle un resumen. Útil como punto de comparación frente a `text_splitters_parte2.py`, ya que enviar el documento completo de una sola vez puede superar los límites de tokens del modelo.
- **`text_splitters_parte2.py`**: mismo PDF, pero usando `RecursiveCharacterTextSplitter` para dividirlo en chunks de 10000 caracteres (con 200 de overlap) antes de resumir. Resume los primeros 11 chunks uno por uno y luego combina esos resúmenes parciales en un resumen final con una última llamada al LLM.
- **`embeddings_langchain.py`**: genera embeddings de dos frases con `GoogleGenerativeAIEmbeddings` (`models/gemini-embedding-001`) y calcula la similitud coseno entre ambos vectores usando `numpy`, para ilustrar cómo el significado semántico se refleja en la cercanía de los vectores.

## Cómo ejecutarlo

Desde la raíz del repositorio:

```bash
python Tema3/document_loaders.py
python Tema3/google_drive_loader.py
python Tema3/text_splitters_parte1.py
python Tema3/text_splitters_parte2.py
python Tema3/embeddings_langchain.py
```

## Google Drive (`credentials.json`)

`google_drive_loader.py` necesita un archivo `credentials.json` de OAuth 2.0 propio, generado desde Google Cloud Console:

1. Entra a [Google Cloud Console](https://console.cloud.google.com/) y crea (o selecciona) un proyecto.
2. Habilita la **Google Drive API** para ese proyecto (`APIs y servicios` → `Biblioteca`).
3. Configura la **pantalla de consentimiento OAuth** (`APIs y servicios` → `Pantalla de consentimiento OAuth`), tipo "Externo" y agrégate como usuario de prueba.
4. Crea credenciales OAuth (`APIs y servicios` → `Credenciales` → `Crear credenciales` → `ID de cliente de OAuth`), tipo de aplicación **"Aplicación de escritorio"**.
5. Descarga el JSON generado y guárdalo en el proyecto, por ejemplo como `Tema3/credentials.json`.
6. Apunta las variables en el `.env` de la raíz a las rutas de esos archivos:
   ```
   GOOGLE_DRIVE_CREDENTIALS_PATH=Tema3/credentials.json
   GOOGLE_DRIVE_TOKEN_PATH=Tema3/token.json
   ```

`token.json` se genera solo la primera vez que ejecutas el script (te pedirá autorizar en el navegador). Tanto `credentials.json` como `token.json` quedan cubiertos por `.gitignore` (`*credentials*.json`, `*token*.json`) y nunca deben subirse al repositorio.

## Requisitos

`GOOGLE_API_KEY` en el `.env` de la raíz (usada por los scripts que llaman a Gemini) y las credenciales de Google Drive para `google_drive_loader.py` (ver arriba). Ver [README principal](../README.md#configuración).

## Dependencias (de `requirements.txt`)

- `langchain-community` — `PyPDFLoader`, `WebBaseLoader`
- `langchain-text-splitters` — `RecursiveCharacterTextSplitter`
- `langchain-google-genai` — `ChatGoogleGenerativeAI`, `GoogleGenerativeAIEmbeddings`
- `langchain-google-community` — `GoogleDriveLoader`
- `google-api-python-client`, `google-auth-httplib2`, `google-auth-oauthlib` — autenticación OAuth de `google_drive_loader.py`
- `beautifulsoup4` — `bs4.SoupStrainer` en `document_loaders.py`
- `pypdf` — backend de extracción de texto usado por `PyPDFLoader`
- `numpy` — similitud coseno en `embeddings_langchain.py`
- `python-dotenv` — carga del `.env`
