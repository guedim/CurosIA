from enum import Enum

from dotenv import load_dotenv
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI

load_dotenv()

class Sentimiento(str, Enum):
    POSITIVO = "Positivo"
    NEGATIVO = "Negativo"
    NEUTRO = "Neutro"

class AnalisisTexto(BaseModel):
    resumen: str = Field(description="Resumen breve del texto.")
    sentimiento: Sentimiento = Field(description="Sentimiento del texto (Positivo, Negativo o Neutro)")

llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite", temperature=0.6)

structured_llm = llm.with_structured_output(AnalisisTexto)

texto_prueba = "Me encantó la nueva película de acción, tiene muchos efectos especiales y emoción."

resultado = structured_llm.invoke(f"Analiza el siguiente texto: {texto_prueba}")

print(resultado.model_dump_json())