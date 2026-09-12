from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
import numpy as np

load_dotenv()

embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")

texto1 = "La capital de Francia es París."
texto2 = "París es un nombre común para mascotas."

vec1 = embeddings.embed_query(texto1)
vec2 = embeddings.embed_query(texto2)

print(f"Dimensión de los vectores - V1: {len(vec1)} y V2: {len(vec2)}")

cos_sim = np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

print(f"Similitud coseno entre vec1 y vec2: {cos_sim:.3f}")