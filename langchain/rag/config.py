import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

# Configuración de modelos (OpenAI, modelos económicos)
EMBEDDING_MODEL = os.getenv("RAG_EMBEDDING_MODEL", "text-embedding-3-small")
QUERY_MODEL = os.getenv("RAG_QUERY_MODEL", "gpt-4o-mini")
GENERATION_MODEL = os.getenv("RAG_GENERATION_MODEL", "gpt-4o-mini")

# Configuración del vector store
CHROMA_DB_PATH = os.getenv("RAG_CHROMA_DB_PATH", str(BASE_DIR / "chroma_db"))

# Configuración del retriever
SEARCH_TYPE = "mmr"
MMR_DIVERSITY_LAMBDA = 0.7
MMR_FETCH_K = 20
SEARCH_K = 2

# Configuracion alternativa para retriever hibrido
ENABLE_HYBRID_SEARCH = True
SIMILARITY_THRESHOLD = 0.70
