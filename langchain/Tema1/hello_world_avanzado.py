from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate

load_dotenv()

chat = ChatOpenAI(model_name="gpt-4o-mini", temperature=0.7)

plantilla = PromptTemplate(
    input_variables=["nombre"],
    template="Saluda al usuario con su nombre.\nNombre del usuario: {nombre}\n.Asistente:"
)

chain = plantilla | chat

resultado = chain.invoke({"nombre": "Mario"})
print(resultado.content)