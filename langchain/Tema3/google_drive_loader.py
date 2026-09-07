import os

from dotenv import load_dotenv
from langchain_google_community import GoogleDriveLoader

load_dotenv()

credentials_path = os.getenv("GOOGLE_DRIVE_CREDENTIALS_PATH")
token_path = os.getenv("GOOGLE_DRIVE_TOKEN_PATH")

loader = GoogleDriveLoader(
    folder_id="0B5vc7PeSvrUQeDJsSmt1RFVCTGM",
    credentials_path=credentials_path,
    token_path=token_path,
    recursive=True
)

documents = loader.load()

print(f"Metadatos: {documents[0].metadata}")
print(f"Contenido: {documents[0].page_content}")