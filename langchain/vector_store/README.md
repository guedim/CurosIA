# vector_store - Bases de datos vectoriales y retrievers

Qué se aprende: cómo indexar documentos en una base de datos vectorial (`Chroma`) y las distintas estrategias de retriever sobre esos datos — búsqueda por similitud simple, `as_retriever`, `MultiQueryRetriever` — y cuándo conviene cada una.

## Archivos

- **`vector_stores.py`**: carga todos los PDF de un directorio con `PyPDFDirectoryLoader`, los divide en chunks con `RecursiveCharacterTextSplitter` (5000 caracteres, 1000 de overlap) y los indexa en una base de datos vectorial `Chroma` usando `GoogleGenerativeAIEmbeddings` (`models/gemini-embedding-001`). Termina con una búsqueda semántica de ejemplo (`similarity_search`) sobre los documentos indexados.
  - Por defecto lee los PDF desde `vector_store/contratos/` (contratos de arrendamiento de ejemplo) y persiste la base de datos en `vector_store/chroma_db/`. Ambas rutas se resuelven relativas al script, no están hardcodeadas.
  - Ambas rutas son configurables por línea de comandos:
    ```bash
    python vector_store/vector_stores.py --contratos-dir /ruta/a/tus/contratos --persist-dir /ruta/a/chroma_db
    ```
  - Requiere `GOOGLE_API_KEY` configurada en `.env` (usa `load_dotenv()`), y el paquete `chromadb` instalado (ver [Dependencias principales](../README.md#dependencias-principales)).
  - `vector_store/chroma_db/` es un directorio generado (contiene la base de datos vectorial persistida): no es necesario ni se debe subir a git, está incluido en `.gitignore`. Se regenera solo con volver a ejecutar el script.
- **`retrievers_langchain.py`**: abre la base de datos `Chroma` ya persistida en `vector_store/chroma_db/` (misma ruta resuelta relativa al script) usando el mismo modelo de embeddings `GoogleGenerativeAIEmbeddings` (`models/gemini-embedding-001`), y consulta con un `retriever` (`as_retriever`, `search_type="similarity"`, `k=2`) en lugar de `similarity_search` directo.
  - Requiere haber ejecutado antes `vector_store/vector_stores.py` (o tener ya un `chroma_db/` generado), y `GOOGLE_API_KEY` configurada en `.env`.
- **`multi_query_retriever.py`**: misma base (`Chroma` en `vector_store/chroma_db/` + `GoogleGenerativeAIEmbeddings`), pero envuelve el retriever base con `MultiQueryRetriever.from_llm`, que usa un LLM (`ChatGoogleGenerativeAI`, `gemini-3.6-flash`) para generar varias variantes de la consulta original y ampliar así los documentos recuperados.
  - Requiere `GOOGLE_API_KEY` configurada en `.env` (se usa tanto para los embeddings como para el LLM).
- **`contratos/`**: PDFs de ejemplo (contratos de arrendamiento) a indexar.
- **`chroma_db/`**: base de datos Chroma persistida (se genera al ejecutar `vector_stores.py`, NO se sube a git).

## Cómo ejecutarlo

Desde la raíz del repositorio, en orden (los dos últimos requieren que `chroma_db/` ya exista):

```bash
python vector_store/vector_stores.py
python vector_store/retrievers_langchain.py
python vector_store/multi_query_retriever.py
```

## Requisitos

`GOOGLE_API_KEY` en el `.env` de la raíz (ver [README principal](../README.md#configuración)).

## Dependencias (de `requirements.txt`)

- `langchain-community` — `Chroma` (vector store), `PyPDFDirectoryLoader`
- `langchain-text-splitters` — `RecursiveCharacterTextSplitter`
- `langchain-google-genai` — `GoogleGenerativeAIEmbeddings`, `ChatGoogleGenerativeAI`
- `langchain-classic` — `MultiQueryRetriever`
- `chromadb` — motor de la base de datos vectorial
- `python-dotenv` — carga del `.env`
