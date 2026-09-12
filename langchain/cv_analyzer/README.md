# cv_analyzer - Analizador de CVs

Mini-proyecto independiente (con su propia app Streamlit) que analiza hojas de vida en PDF y evalúa qué tan bien se ajusta un candidato a una descripción de puesto, usando LangChain + `with_structured_output`.

Qué se aprende: aplicar salida estructurada (`with_structured_output` + Pydantic) a un caso de uso real de principio a fin, separando responsabilidades en capas (modelos, prompts, servicios, UI).

> **Nota:** a diferencia de los ejemplos de `Tema1`/`Tema2`, este mini-proyecto usa `ChatOpenAI` (requiere `OPENAI_API_KEY`).

## Archivos

- **`models/cv_model.py`**: define `AnalisisCV`, el modelo Pydantic que estructura la salida del análisis (nombre, años de experiencia, habilidades clave, educación, fortalezas, áreas de mejora y porcentaje de ajuste al puesto).
- **`prompts/cv_prompts.py`**: construye un `ChatPromptTemplate` a partir de un `SystemMessagePromptTemplate` (rol de reclutador experto con sus criterios de evaluación) y un `HumanMessagePromptTemplate` (instrucciones para analizar el CV frente a la descripción del puesto).
- **`services/pdf_processor.py`**: usa `PyPDF2` para extraer el texto de cada página del PDF subido, concatenándolo en un único string.
- **`services/cv_evaluator.py`**: arma la cadena LCEL `chat_prompt | modelo.with_structured_output(AnalisisCV)` usando `ChatOpenAI` (`gpt-4o-mini`) y expone `evaluar_candidato(texto_cv, descripcion_puesto)`.
- **`ui/streamlit_ui.py`**: interfaz Streamlit con dos columnas (entrada: subir PDF + descripción del puesto; resultado: perfil del candidato, habilidades, fortalezas, áreas de mejora y recomendación final según el porcentaje de ajuste).
- **`app.py`**: punto de entrada que arranca la interfaz de `ui/streamlit_ui.py`.

## Cómo ejecutarlo

```bash
cd cv_analyzer
streamlit run app.py
```

> **Importante:** ejecútalo con `streamlit run`, no con `python app.py`. Streamlit necesita su propio runner para levantar el servidor web; si lo ejecutas con `python` verás el error `missing ScriptRunContext` y no se abrirá nada en el navegador.

Si no tienes `streamlit` en el PATH (por ejemplo, con el entorno virtual desactivado), invócalo desde el venv:

```bash
../.venv/bin/streamlit run app.py
```

## Requisitos

`OPENAI_API_KEY` en el `.env` de la raíz (ver [README principal](../README.md#configuración)).

## Dependencias (de `requirements.txt`)

- `langchain-core` — `ChatPromptTemplate`, `SystemMessagePromptTemplate`, `HumanMessagePromptTemplate`
- `langchain-openai` — `ChatOpenAI` + `with_structured_output`
- `pydantic` — modelo `AnalisisCV`
- `PyPDF2` — extracción de texto del PDF subido
- `streamlit` — interfaz web
