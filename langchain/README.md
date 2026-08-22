# Curso de LangChain

Repositorio de apuntes y ejercicios del curso de **LangChain**, con ejemplos prácticos de cómo integrar distintos proveedores de LLM (OpenAI y Google Gemini) usando la misma interfaz de LangChain.

## Estructura del proyecto

```
langchain/
├── .env                        # Variables de entorno con las API keys (no se sube a git)
├── .gitignore
├── requirements.txt             # Dependencias de Python del proyecto
└── Tema1/
    ├── hello_world.py           # Ejemplo básico usando OpenAI (gpt-4o-mini)
    ├── hello_world_gemini.py    # Mismo ejemplo usando Google Gemini (gemini-2.5-flash)
    └── streamlit_chatbot.py     # Chatbot con interfaz web usando Streamlit
```

- **`Tema1/hello_world.py`**: primer contacto con LangChain. Carga las variables de entorno, instancia un modelo `ChatOpenAI` y le hace una pregunta simple, imprimiendo la respuesta.
- **`Tema1/hello_world_gemini.py`**: la misma idea que el anterior pero usando `ChatGoogleGenerativeAI`, para comparar cómo LangChain permite intercambiar el proveedor del modelo sin cambiar la lógica del programa.
- **`Tema1/streamlit_chatbot.py`**: chatbot con interfaz web construido con Streamlit + LangChain (LCEL), con historial de conversación y streaming de respuestas.

## Requisitos previos

- Python 3.14 (o compatible)
- Una API key de [OpenAI](https://platform.openai.com/api-keys) y/o de [Google AI Studio](https://aistudio.google.com/app/apikey), según los ejemplos que quieras ejecutar

## Instalación

```bash
# Crear entorno virtual
python -m venv venv

# Activar el entorno virtual
source venv/bin/activate   # Linux/macOS
venv\Scripts\activate      # Windows

# Instalar dependencias
pip install -r requirements.txt
```

## Configuración

Crea un archivo `.env` en la raíz del proyecto con tus claves de API:

```
OPENAI_API_KEY=tu_api_key_de_openai
GOOGLE_API_KEY=tu_api_key_de_google
```

> El archivo `.env` ya está incluido en `.gitignore`, así que las credenciales nunca se suben al repositorio remoto.

## Dependencias principales

| Paquete | Propósito |
|---|---|
| `langchain-core` | Núcleo de LangChain: abstracciones base (mensajes, prompts, modelos, etc.) |
| `langchain-openai` | Integración de LangChain con los modelos de OpenAI (`ChatOpenAI`) |
| `langchain-google-genai` | Integración de LangChain con los modelos de Google Gemini (`ChatGoogleGenerativeAI`) |
| `python-dotenv` | Carga las variables de entorno del archivo `.env` |
| `streamlit` | Framework para construir la interfaz web del chatbot |

## Uso

Ejecuta cualquiera de los ejemplos desde la raíz del proyecto:

```bash
python Tema1/hello_world.py
python Tema1/hello_world_gemini.py
```

El chatbot con interfaz web (`streamlit_chatbot.py`) es distinto: al usar Streamlit, **no se ejecuta con `python`**, sino con el comando `streamlit run`, que levanta un servidor local y abre la app en el navegador:

```bash
./venv/bin/streamlit run Tema1/streamlit_chatbot.py
```

Esto abrirá automáticamente `http://localhost:8501` en tu navegador con el chatbot.
