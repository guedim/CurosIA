import os
from pathlib import Path

from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

# Configuración de modelos (Google Gemini)
EMBEDDING_MODEL = os.getenv("RAG_EMBEDDING_MODEL", "models/gemini-embedding-001")
QUERY_MODEL = os.getenv("RAG_QUERY_MODEL", "gemini-3.6-flash")
GENERATION_MODEL = os.getenv("RAG_GENERATION_MODEL", "gemini-3.6-flash")

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
