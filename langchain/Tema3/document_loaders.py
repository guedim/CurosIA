import os

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



loader = WebBaseLoader("https://bold.co")
docs = loader.load()
pages = loader.load()
for i, page in enumerate(pages):
    print(f"======== Página {i+1} ========")
    print(f"Contenido: {page.page_content}" )
    print(f"Metadatos: {page.metadata}" )
