import socket

from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI

# La conectividad IPv6 de este equipo no funciona hacia las APIs de Google:
# resuelve AAAA pero el connect() se queda colgado. Forzamos IPv4 para evitarlo.
_getaddrinfo_original = socket.getaddrinfo


def _getaddrinfo_ipv4(host, port, family=0, type=0, proto=0, flags=0):
    return _getaddrinfo_original(host, port, socket.AF_INET, type, proto, flags)


socket.getaddrinfo = _getaddrinfo_ipv4

load_dotenv()

llm = ChatGoogleGenerativeAI(model="gemini-3.6-flash", temperature=0.7)

pregunta = "En qué año llegó el hombre a la luna?"
print("Pregunta: " + pregunta)

respuesta = llm.invoke(pregunta)
print("Respuesta: " + respuesta.text)