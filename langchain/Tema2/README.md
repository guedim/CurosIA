# Tema 2 - LCEL, prompts y output parsers

Qué se aprende: la interfaz `Runnable` de LangChain (LCEL) para componer pasos con `|`, las distintas formas de construir prompts (`PromptTemplate`, `ChatPromptTemplate`, `MessagesPlaceholder`), y cómo forzar salidas estructuradas y validadas con Pydantic.

## Archivos

- **`Runnables.py`**: introduce la interfaz `Runnable` de LangChain (LCEL) usando `RunnableLambda` para envolver funciones Python normales como pasos de una cadena. Define dos runnables (uno que formatea un número como texto y otro que duplica ese texto en una lista) y los encadena con el operador `|`, mostrando cómo componer transformaciones arbitrarias sin necesidad de un LLM.
- **`analisis_sentimientos_parte1.py`**: pipeline más avanzado que combina un preprocesador de texto, un `RunnableParallel` con dos ramas (resumen y análisis de sentimiento estructurado en JSON usando `ChatGoogleGenerativeAI`) y un paso final que combina ambos resultados. Incluye `extract_text` para normalizar la respuesta del modelo (Gemini puede devolver `content` como lista de partes en lugar de string) y procesa varias reviews de ejemplo con `chain.batch(...)`.
- **`prompt_template.py`**: introduce `PromptTemplate`, la forma más básica de plantilla de prompt en LangChain, con una única variable (`producto`) rellenada con `.format(...)`.
- **`chat_prompt_template.py`**: usa `ChatPromptTemplate.from_messages(...)` con tuplas `("system", ...)` / `("human", ...)` para construir una conversación con roles, en lugar de un único texto plano.
- **`message_placeholders.py`**: muestra cómo usar `MessagesPlaceholder` para inyectar dinámicamente un historial de conversación (lista de `HumanMessage`/`AIMessage`) dentro de un `ChatPromptTemplate`, manteniendo el contexto de turnos anteriores.
- **`rol_prompt_templates.py`**: combina `SystemMessagePromptTemplate` y `HumanMessagePromptTemplate` (cada uno con varias variables) dentro de un `ChatPromptTemplate`, simulando un asistente con rol, especialidad y tono configurables.
- **`output_parsers_parte1.py`**: primer paso hacia los *output parsers* de LangChain: define un modelo `Usuario` con Pydantic (`BaseModel`) y muestra cómo valida y castea datos crudos (por ejemplo, castea el `id` de string a int) al construir la instancia.
- **`output_parsers_parte2.py`**: usa `with_structured_output` sobre `ChatGoogleGenerativeAI` para forzar que el modelo devuelva un objeto `AnalisisTexto` (resumen + sentimiento) validado con Pydantic. El campo `sentimiento` es un `Enum` (`Positivo`, `Negativo`, `Neutro`), por lo que el modelo solo puede devolver uno de esos tres valores.

## Cómo ejecutarlo

Desde la raíz del repositorio:

```bash
python Tema2/Runnables.py
python Tema2/analisis_sentimientos_parte1.py
python Tema2/prompt_template.py
python Tema2/chat_prompt_template.py
python Tema2/message_placeholders.py
python Tema2/rol_prompt_templates.py
python Tema2/output_parsers_parte1.py
python Tema2/output_parsers_parte2.py
```

## Requisitos

`GOOGLE_API_KEY` en el `.env` de la raíz (varios scripts usan `ChatGoogleGenerativeAI`). Ver [README principal](../README.md#configuración).

## Dependencias (de `requirements.txt`)

- `langchain-core` — `Runnable`/`RunnableLambda`/`RunnableParallel`, prompts, mensajes
- `langchain-google-genai` — `ChatGoogleGenerativeAI`
- `pydantic` — modelos `BaseModel` para los output parsers
- `python-dotenv` — carga del `.env`
