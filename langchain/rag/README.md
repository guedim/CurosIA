# RAG - Asistente Legal de Contratos de Arrendamiento

Mini-proyecto independiente (con su propia app Streamlit) que implementa un sistema RAG (*Retrieval-Augmented Generation*) para responder preguntas sobre contratos de arrendamiento, usando LangChain + modelos de **OpenAI** (modelos económicos, pensado para uso académico).

A diferencia de `vector_store/` (que muestra cada técnica de retrieval por separado), este proyecto las combina todas en un único retriever híbrido y las expone en un chat web.

## Estructura

```
rag/
├── app.py           # Interfaz Streamlit: chat + panel de documentos relevantes
├── config.py        # Configuración (modelos, ruta de Chroma, parámetros del retriever) leída de variables de entorno
├── ingest.py        # Indexa los PDFs de contratos/ en chroma_db/ usando embeddings de OpenAI
├── prompts.py       # Prompts: respuesta RAG, generación de variantes de consulta
├── rag_system.py    # Construye la cadena RAG y el retriever híbrido
└── contratos/       # PDFs de ejemplo (contratos de arrendamiento) a indexar
```

## Arquitectura (`rag_system.py`)

1. **Vector store**: `Chroma` (paquete `langchain-chroma`) con embeddings `OpenAIEmbeddings`.
2. **Dos retrievers base** sobre el mismo vector store:
   - `base_retriever`: búsqueda `MMR` (Maximal Marginal Relevance), para diversidad de resultados.
   - `similarity_retriever`: búsqueda por similitud simple.
3. **`MultiQueryRetriever`**: envuelve `base_retriever` y usa un LLM (`ChatOpenAI`) con un prompt propio (`MULTI_QUERY_PROMPT`) para generar variantes de la consulta original y ampliar la recuperación.
4. **`EnsembleRetriever`** (si `ENABLE_HYBRID_SEARCH=True` en `config.py`): combina `MultiQueryRetriever` (peso 0.7) y `similarity_retriever` (peso 0.3) en un único retriever híbrido.
5. **Cadena RAG**: encadenada con `RunnablePassthrough.assign` en una sola invocación (`{question} → {question, docs} → {..., context} → {..., answer}`), evitando recuperar documentos dos veces. `docs` (para el panel de la UI) y `answer` (`prompt RAG_TEMPLATE` → `llm_generation` → `StrOutputParser`) salen del mismo `rag_chain.invoke(...)`.

`app.py` solo consume `query_rag()` y `get_retriever_info()` de `rag_system.py`; no tiene lógica de LangChain propia.

## Variables de entorno

Todas son opcionales, con valores por defecto orientados a OpenAI (modelos económicos). Se definen en el `.env` de la raíz del repositorio (ver `.env.example`):

| Variable | Por defecto | Descripción |
|---|---|---|
| `OPENAI_API_KEY` | *(requerida)* | API key de OpenAI, usada tanto para embeddings como para los LLMs |
| `RAG_EMBEDDING_MODEL` | `text-embedding-3-small` | Modelo de embeddings para indexar/consultar el vector store |
| `RAG_QUERY_MODEL` | `gpt-4o-mini` | LLM usado por `MultiQueryRetriever` para generar variantes de la consulta |
| `RAG_GENERATION_MODEL` | `gpt-4o-mini` | LLM usado para generar la respuesta final |
| `RAG_CHROMA_DB_PATH` | `rag/chroma_db` (relativo a este directorio) | Ruta a la base de datos Chroma persistida |

> `text-embedding-3-small` y `gpt-4o-mini` son de los modelos más económicos de OpenAI, ideales para un proyecto académico.

## Cómo ejecutarlo

### 1. Generar (o reutilizar) la base de datos Chroma

```bash
python rag/ingest.py
```

Esto carga los PDFs de `rag/contratos/`, los trocea, genera embeddings con OpenAI y persiste el resultado en `rag/chroma_db/`. Solo hace falta ejecutarlo una vez (o cuando cambien los PDFs o el modelo de embeddings).

> Nota: la base de datos debe indexarse siempre con el mismo modelo de embeddings usado luego para consultar (`RAG_EMBEDDING_MODEL`). Si cambias de modelo de embeddings, vuelve a ejecutar `ingest.py`.

### 2. Levantar la app

Desde la raíz del repositorio:

```bash
streamlit run rag/app.py
```

> **Importante:** se ejecuta con `streamlit run`, no con `python`. Ver la nota general al respecto en el [README principal](../README.md#uso).

## Dependencias

Usa las dependencias ya listadas en el `requirements.txt` de la raíz del repositorio (no tiene un `requirements.txt` propio):

- `langchain-core`, `langchain-classic` (`MultiQueryRetriever`, `EnsembleRetriever`)
- `langchain-openai` (`ChatOpenAI`, `OpenAIEmbeddings`)
- `langchain-chroma` + `chromadb` (vector store)
- `streamlit`, `python-dotenv`

Ver [Dependencias principales](../README.md#dependencias-principales) en el README de la raíz para el detalle de cada paquete.
