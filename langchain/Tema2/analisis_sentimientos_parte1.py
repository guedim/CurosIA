from langchain_core.runnables import RunnableLambda, RunnableParallel
from langchain_google_genai import ChatGoogleGenerativeAI
import json
from dotenv import load_dotenv


load_dotenv()

# Configuración del modelo
llm = ChatGoogleGenerativeAI(model="gemini-3.6-flash", temperature=0)

def extract_text(content):
    """Normaliza el content de la respuesta (str en OpenAI, list de partes en Gemini)"""
    if isinstance(content, list):
        return "".join(
            part.get("text", "") if isinstance(part, dict) else str(part)
            for part in content
        )
    return content

# Preprocesador: limpia espacios y limita a 500 caracteres
def preprocess_text(text):
    """Limpia el texto eliminando espacios extras y limitando longitud"""
    return text.strip()[:500]

preprocessor = RunnableLambda(preprocess_text)

# Generación de resumen
def generate_summary(text):
    """Genera un resumen conciso del texto"""
    prompt = f"Resume en una sola oración: {text}"
    response = llm.invoke(prompt)
    return extract_text(response.content)

summary_brach = RunnableLambda(generate_summary)

# Análisis de sentimiento con formato JSON
def analyze_sentiment(text):
    """Analiza el sentimiento y devuelve resultado estructurado"""
    prompt = f"""Analiza el sentimiento del siguiente texto.
    Responde ÚNICAMENTE en formato JSON válido:
    {{"sentimiento": "positivo|negativo|neutro", "razon": "justificación breve"}}
    
    Texto: {text}"""
    
    response = llm.invoke(prompt)
    texto = extract_text(response.content).strip()
    if texto.startswith("```"):
        texto = texto.strip("`").removeprefix("json").strip()
    try:
        return json.loads(texto)
    except json.JSONDecodeError:
        return {"sentimiento": "neutro", "razon": "Error en análisis"}
    
sentiment_branch = RunnableLambda(analyze_sentiment)

# Combinación de resultados
def merge_results(data):
    """Combina los resultados de ambas ramas en un formato unificado"""
    return {
        "resumen": data["resumen"],
        "sentimiento": data["sentimiento_data"]["sentimiento"],
        "razon": data["sentimiento_data"]["razon"]
    }

merger = RunnableLambda(merge_results)

parallel_analysis = RunnableParallel({
    "resumen": summary_brach,
    "sentimiento_data": sentiment_branch
})

# Cadena completa
chain = preprocessor | parallel_analysis | merger


reviews_batch = [
    "Excelente producto, muy satisfecho con la compra",
    "Terrible calidad, no lo recomiendo para nada",
    "Está bien, cumple su función básica pero nada especial"
]

resultado_batch = chain.batch(reviews_batch)
print(resultado_batch)