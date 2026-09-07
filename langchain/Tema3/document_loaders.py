import os

import bs4
from langchain_community.document_loaders import WebBaseLoader
from langchain_community.document_loaders import PyPDFLoader


pdf_path = os.path.join(os.path.dirname(__file__), "Profile.pdf")
loader = PyPDFLoader(pdf_path)
pages = loader.load()
for i, page in enumerate(pages):
    print(f"======== Página {i+1} ========")
    print(f"Contenido: {page.page_content}" )
    print(f"Metadatos: {page.metadata}" )


print("-----")
print("-----")
print("-----")


# Ejemplo avanzado: múltiples URLs con configuración personalizada
urls = [
    "https://python.langchain.com/docs/concepts/",
    "https://python.langchain.com/docs/tutorials/",
    "https://python.langchain.com/docs/how_to/"
]


loader = WebBaseLoader(
    web_paths=urls,
    bs_kwargs=dict(
        parse_only=bs4.SoupStrainer(
            "div", {"class": ["main-content", "article-content"]}
        )
    )
)
       
docs = loader.load()
 
print(f"Páginas cargadas: {len(docs)}")
for i, doc in enumerate(docs):
    print(f"Página {i+1}: {doc.metadata['source']}")
    print(f"Longitud: {len(doc.page_content)} caracteres")
