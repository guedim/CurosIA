import streamlit as st
from langchain_openai import ChatOpenAI
from langchain_core.messages import AIMessage, HumanMessage
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from dotenv import load_dotenv

MAX_TURNS = 10  # ventana de historial enviada al modelo (turnos usuario+asistente)

load_dotenv()

# Configuración inicial
st.set_page_config(page_title="Chatbot Básico", page_icon="🤖")
st.title("🤖 Chatbot Básico con LangChain")
st.markdown("Este es un *chatbot de ejemplo* construido con LangChain + Streamlit. ¡Escribe tu mensaje abajo para comenzar!")

with st.sidebar:
    st.header("Configuración")
    temperature = st.slider("Temperatura", 0.0, 1.0, 0.5, 0.1)
    model_name = st.selectbox("Modelo", ["gpt-3.5-turbo", "gpt-4", "gpt-4o-mini"])


@st.cache_resource
def get_chat_model(model_name: str, temperature: float) -> ChatOpenAI:
    return ChatOpenAI(model=model_name, temperature=temperature)


chat_model = get_chat_model(model_name, temperature)

# Inicializar el historial de mensajes en session_state
if "mensajes" not in st.session_state:
    st.session_state.mensajes = []

# Prompt tipado: el sistema y el usuario quedan separados del historial,
# que se pasa como mensajes reales en vez de interpolarse como texto.
prompt_template = ChatPromptTemplate.from_messages([
    ("system", "Eres un asistente útil y amigable llamado ChatBot Pro. "
               "Responde de manera clara y concisa."),
    MessagesPlaceholder("historial"),
    ("human", "{mensaje}"),
])

# Crear cadena usando LCEL (LangChain Expression Language)
cadena = prompt_template | chat_model

# Renderizar historial existente
for msg in st.session_state.mensajes:
    role = "assistant" if isinstance(msg, AIMessage) else "user"
    with st.chat_message(role):
        st.markdown(msg.text)

if st.button("🗑️ Nueva conversación"):
    st.session_state.mensajes = []
    st.rerun()

# Input de usuario
pregunta = st.chat_input("Escribe tu mensaje:")

if pregunta:
    # Mostrar y almacenar mensaje del usuario
    with st.chat_message("user"):
        st.markdown(pregunta)
    
    # Generar y mostrar respuesta del asistente
    try:
        with st.chat_message("assistant"):
            response_placeholder = st.empty()
            full_response = ""

            # Streaming de la respuesta (solo se envían los últimos MAX_TURNS turnos)
            historial = st.session_state.mensajes[-MAX_TURNS * 2:]
            for chunk in cadena.stream({"mensaje": pregunta, "historial": historial}):
                full_response += chunk.text
                response_placeholder.markdown(full_response + "▌")
            
            response_placeholder.markdown(full_response)
        
        st.session_state.mensajes.append(HumanMessage(content=pregunta))
        st.session_state.mensajes.append(AIMessage(content=full_response))
        
    except Exception as e:
        st.error(f"Error al generar respuesta: {str(e)}")
        st.info("Verifica que tu API Key de OpenAI esté configurada correctamente.")