import os
from operator import itemgetter

from langchain_chroma import Chroma
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_core.prompts import PromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_classic.retrievers.multi_query import MultiQueryRetriever
from langchain_classic.retrievers.ensemble import EnsembleRetriever
import streamlit as st

from config import *
from prompts import *

# Separador de rutas del sistema operativo actual ("\\" en Windows, "/" en Linux/Mac)
PATH_SEPARATOR = os.sep

@st.cache_resource
def initialize_rag_system():

    # Vector Store
    vectorstore = Chroma(
        embedding_function=OpenAIEmbeddings(model=EMBEDDING_MODEL),
        persist_directory=CHROMA_DB_PATH
    )

    # Modelos
    llm_queries = ChatOpenAI(model=QUERY_MODEL, temperature=0)
    llm_generation = ChatOpenAI(model=GENERATION_MODEL, temperature=0)

    # Retriever MMR (Maximal Margin Relevance)
    base_retriever = vectorstore.as_retriever(
        search_type=SEARCH_TYPE,
        search_kwargs={
            "k": SEARCH_K,
            "lambda_mult": MMR_DIVERSITY_LAMBDA,
            "fetch_k": MMR_FETCH_K
        }
    )

    # Retriever adicional con similarity para comparar
    similarity_retriever = vectorstore.as_retriever(
        search_type="similarity",
        search_kwargs={"k": SEARCH_K}
    )

    # Prompt personalizado para MultiQueryRetriever
    multi_query_prompt = PromptTemplate.from_template(MULTI_QUERY_PROMPT)

    # MultiQueryRetriever con prompt personalizado
    mmr_multi_retriever = MultiQueryRetriever.from_llm(
        retriever=base_retriever,
        llm=llm_queries,
        prompt=multi_query_prompt
    )

    # Ensemble Retriever que combinar MMR y similarity
    if ENABLE_HYBRID_SEARCH:
        ensemble_retriever = EnsembleRetriever(
            retrievers=[mmr_multi_retriever, similarity_retriever],
            weights=[0.7, 0.3], # mayor peso a MMR
        )
        final_retriever = ensemble_retriever
    else:
        final_retriever = mmr_multi_retriever

    prompt = PromptTemplate.from_template(RAG_TEMPLATE)

    # Funcion para formatear y preprocesar los documentos recuperados
    def format_docs(docs):
        formatted = []

        for i, doc in enumerate(docs, 1):
            header = f"[Fragmento {i}]"
            
            if doc.metadata:
                if 'source' in doc.metadata:
                    source = doc.metadata['source'].split(PATH_SEPARATOR)[-1] if PATH_SEPARATOR in doc.metadata['source'] else doc.metadata['source']
                    header += f" - Fuente: {source}"
                if 'page' in doc.metadata:
                    header += f" - Pagina: {doc.metadata['page']}"
        
            content = doc.page_content.strip()
            formatted.append(f"{header}\n{content}")
        
        return "\n\n".join(formatted)

    rag_chain = (
        RunnablePassthrough.assign(docs=itemgetter("question") | final_retriever)
        | RunnablePassthrough.assign(context=lambda x: format_docs(x["docs"]))
        | RunnablePassthrough.assign(answer=prompt | llm_generation | StrOutputParser())
    )

    return rag_chain


def query_rag(question):
    try:
        rag_chain = initialize_rag_system()

        # Obtener respuesta y documentos en una sola invocación
        result = rag_chain.invoke({"question": question})
        response = result["answer"]
        docs = result["docs"]

        # Formatear los documentos para mostrar
        docs_info = []
        for i, doc in enumerate(docs[:SEARCH_K], 1):
            doc_info = {
                "fragmento": i,
                "contenido": doc.page_content[:1000] + "..." if len(doc.page_content) > 1000 else doc.page_content,
                "fuente": doc.metadata.get('source', 'No especificada').split(PATH_SEPARATOR)[-1],
                "pagina": doc.metadata.get('page', 'No especificada')
            }
            docs_info.append(doc_info)

        return response, docs_info

    except Exception as e:
        error_msg = f"Error al procesar la consulta: {str(e)}"
        return error_msg, []
    
def get_retriever_info():
    """Obtiene información sobre la configuración del retriever"""
    return {
        "tipo": f"{SEARCH_TYPE.upper()} + MultiQuery" + (" + Hybrid" if ENABLE_HYBRID_SEARCH else ""),
        "documentos": SEARCH_K,
        "diversidad": MMR_DIVERSITY_LAMBDA,
        "candidatos": MMR_FETCH_K,
    }