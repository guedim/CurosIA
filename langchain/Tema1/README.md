# Tema 1 - Primeros pasos con LangChain

Qué se aprende: instanciar un modelo de chat con LangChain, invocarlo directamente vs. encadenarlo con un `PromptTemplate` (LCEL), y comparar proveedores (OpenAI vs. Google Gemini) usando la misma interfaz.

## Archivos

- **`hello_world_openai.py`**: primer contacto con LangChain. Carga las variables de entorno, instancia un modelo `ChatOpenAI` (`gpt-4o-mini`) y le hace una pregunta simple, imprimiendo la respuesta.
- **`hello_world_avanzado.py`**: mismo caso de uso que `hello_world_openai.py`, pero en lugar de llamar a `.invoke()` directamente sobre el modelo, construye un `PromptTemplate` y lo encadena con el operador `|` (LCEL: `chain = plantilla | chat`).
- **`hello_world_gemini.py`**: la misma idea que `hello_world_openai.py` pero usando `ChatGoogleGenerativeAI` (`gemini-3.6-flash`), para comparar cómo LangChain permite intercambiar el proveedor del modelo sin cambiar la lógica del programa.

  > **Nota:** este script incluye un monkeypatch de `socket.getaddrinfo` que fuerza la resolución IPv4. Es un workaround para un problema de red local (algunas redes resuelven el registro AAAA de la API de Google, pero el `connect()` por IPv6 se queda colgado indefinidamente). Si tu conexión no tiene ese problema, el bloque es inofensivo y puedes ignorarlo.

- **`streamlit_chatbot.py`**: chatbot con interfaz web construido con Streamlit + LangChain (LCEL), con historial de conversación (acotado a los últimos turnos) y streaming de respuestas.

## Cómo ejecutarlo

Desde la raíz del repositorio:

```bash
python Tema1/hello_world_openai.py
python Tema1/hello_world_avanzado.py
python Tema1/hello_world_gemini.py
```

`streamlit_chatbot.py` levanta un servidor web y **no se ejecuta con `python`**:

```bash
streamlit run Tema1/streamlit_chatbot.py
```

Si no tienes `streamlit` en el PATH, invócalo desde el venv: `../.venv/bin/streamlit run Tema1/streamlit_chatbot.py`.

Esto abrirá `http://localhost:8501` en tu navegador. Requiere `OPENAI_API_KEY` configurada en el `.env` de la raíz, ya que usa modelos de OpenAI. Desde la barra lateral puedes ajustar la temperatura y elegir el modelo (`gpt-3.5-turbo`, `gpt-4` o `gpt-4o-mini`), y el botón "🗑️ Nueva conversación" reinicia el historial del chat.

## Requisitos

`OPENAI_API_KEY` y/o `GOOGLE_API_KEY` en el `.env` de la raíz (ver [README principal](../README.md#configuración)).

## Dependencias (de `requirements.txt`)

- `langchain-core` — `PromptTemplate`, `ChatPromptTemplate`, `MessagesPlaceholder`, mensajes
- `langchain-openai` — `ChatOpenAI`
- `langchain-google-genai` — `ChatGoogleGenerativeAI`
- `python-dotenv` — carga del `.env`
- `streamlit` — `streamlit_chatbot.py`
