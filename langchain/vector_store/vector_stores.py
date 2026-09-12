import argparse
from pathlib import Path

from dotenv import load_dotenv
from langchain_community.vectorstores import Chroma
from langchain_openai import OpenAIEmbeddings
from langchain_community.document_loaders import PyPDFDirectoryLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent

parser = argparse.ArgumentParser(description="Carga contratos PDF y los indexa en un vector store.")
parser.add_argument(
    "--contratos-dir",
    type=Path,
    default=BASE_DIR / "contratos",
    help="Ruta al directorio con los PDF de contratos.",
)
parser.add_argument(
    "--persist-dir",
    type=Path,
    default=BASE_DIR / "chroma_db",
    help="Ruta donde persistir la base de datos Chroma.",
)
args = parser.parse_args()

loader = PyPDFDirectoryLoader(str(args.contratos_dir))
documentos = loader.load()

print(f"Se cargaron {len(documentos)} documentos desde el directorio.")

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=5000,
    chunk_overlap=1000
)

docs_split = text_splitter.split_documents(documentos)

print(f"Se crearon {len(docs_split)} chunks de texto.")

vectorstore = Chroma.from_documents(
    docs_split,
    embedding=OpenAIEmbeddings(model="text-embedding-3-large"),
    persist_directory=str(args.persist_dir)
)

consulta = "¿Dónde se encuentra el local del contrato en el que participa María Jiménez Campos"

resultados = vectorstore.similarity_search(consulta, k=2)

print("Top 3 documentos mas similares a la consulta:\n")
for i, doc in enumerate(resultados, start=1):
    print(f"Contenido: {doc.page_content}")
    print(f"Metadatos: {doc.metadata}")
