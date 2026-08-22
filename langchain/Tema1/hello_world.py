from dotenv import load_dotenv
from langchain_openai import ChatOpenAI

load_dotenv()

llm = ChatOpenAI(model_name="gpt-4o-mini", temperature=0.7)

pregunta = "En qué año llegó el hombre a la luna?"
print("Pregunta: " + pregunta)

respuesta = llm.invoke(pregunta)
print("Respuesta: " + respuesta.content)