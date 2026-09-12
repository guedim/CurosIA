# RAG - Asistente Legal de Contratos de Arrendamiento

Mini-proyecto independiente (con su propia app Streamlit) que implementa un sistema RAG (*Retrieval-Augmented Generation*) para responder preguntas sobre contratos de arrendamiento, usando LangChain + modelos de **Google Gemini**.

A diferencia de `vector_store/` (que muestra cada técnica de retrieval por separado), este proyecto las combina todas en un único retriever híbrido y las expone en un chat web.

## Estructura

```
rag/
├── app.py           # Interfaz Streamlit: chat + panel de documentos relevantes
├── config.py        # Configuración (modelos, ruta de Chroma, parámetros del retriever) leída de variables de entorno
├── prompts.py       # Prompts: respuesta RAG, generación de variantes de consulta, relevancia, extracción de entidades
├── rag_system.py    # Construye la cadena RAG y el retriever híbrido
└── contratos/       # PDFs de ejemplo (contratos de arrendamiento) a indexar
```

## Arquitectura (`rag_system.py`)

1. **Vector store**: `Chroma` (paquete `langchain-chroma`) con embeddings `GoogleGenerativeAIEmbeddings`.
2. **Dos retrievers base** sobre el mismo vector store:
   - `base_retriever`: búsqueda `MMR` (Maximal Marginal Relevance), para diversidad de resultados.
   - `similarity_retriever`: búsqueda por similitud simple.
3. **`MultiQueryRetriever`**: envuelve `base_retriever` y usa un LLM (`ChatGoogleGenerativeAI`) con un prompt propio (`MULTI_QUERY_PROMPT`) para generar variantes de la consulta original y ampliar la recuperación.
4. **`EnsembleRetriever`** (si `ENABLE_HYBRID_SEARCH=True` en `config.py`): combina `MultiQueryRetriever` (peso 0.7) y `similarity_retriever` (peso 0.3) en un único retriever híbrido.
5. **Cadena RAG**: `retriever | format_docs` → `prompt (RAG_TEMPLATE)` → `llm_generation` → `StrOutputParser`.

`app.py` solo consume `query_rag()` y `get_retriever_info()` de `rag_system.py`; no tiene lógica de LangChain propia.

## Variables de entorno

Todas son opcionales, con valores por defecto orientados a Gemini. Se definen en el `.env` de la raíz del repositorio (ver `.env.example`):

| Variable | Por defecto | Descripción |
|---|---|---|
| `GOOGLE_API_KEY` | *(requerida)* | API key de Google AI Studio, usada tanto para embeddings como para los LLMs |
| `RAG_EMBEDDING_MODEL` | `models/gemini-embedding-001` | Modelo de embeddings para indexar/consultar el vector store |
| `RAG_QUERY_MODEL` | `gemini-3.6-flash` | LLM usado por `MultiQueryRetriever` para generar variantes de la consulta |
| `RAG_GENERATION_MODEL` | `gemini-3.6-flash` | LLM usado para generar la respuesta final |
| `RAG_CHROMA_DB_PATH` | `rag/chroma_db` (relativo a este directorio) | Ruta a la base de datos Chroma persistida |

## Cómo ejecutarlo

### 1. Generar (o reutilizar) la base de datos Chroma

Este proyecto no incluye su propio script de indexado; reutiliza `vector_store/vector_stores.py` desde la raíz del repositorio. Dos opciones:

- **Indexar los PDFs de `rag/contratos/`** en `rag/chroma_db/` (ruta por defecto):
  ```bash
  python vector_store/vector_stores.py --contratos-dir rag/contratos --persist-dir rag/chroma_db
  ```
- **Reutilizar una base ya generada** (por ejemplo la de `vector_store/chroma_db/`), apuntando `RAG_CHROMA_DB_PATH` en el `.env`:
  ```
  RAG_CHROMA_DB_PATH=vector_store/chroma_db
  ```

### 2. Levantar la app

Desde la raíz del repositorio:

```bash
streamlit run rag/app.py
```

> **Importante:** se ejecuta con `streamlit run`, no con `python`. Ver la nota general al respecto en el [README principal](../README.md#uso).

## Dependencias

Usa las dependencias ya listadas en el `requirements.txt` de la raíz del repositorio (no tiene un `requirements.txt` propio):

- `langchain-core`, `langchain-classic` (`MultiQueryRetriever`, `EnsembleRetriever`)
- `langchain-google-genai` (`ChatGoogleGenerativeAI`, `GoogleGenerativeAIEmbeddings`)
- `langchain-chroma` + `chromadb` (vector store)
- `streamlit`, `python-dotenv`

Ver [Dependencias principales](../README.md#dependencias-principales) en el README de la raíz para el detalle de cada paquete.
