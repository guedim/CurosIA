from mcp import ClientSession, StdioServerParameters, types
from mcp.client.stdio import stdio_client
from dotenv import load_dotenv  
import os
import json
from azure.ai.inference import ChatCompletionsClient
from azure.ai.inference.models import SystemMessage, UserMessage
from azure.core.credentials import AzureKeyCredential


load_dotenv()

github_token = os.getenv("GITHUB_TOKEN")
system_prompt = """Eres un asisitente muy bueno.
                    Usa la funcion add para poder realizar las sumas que el usuario requiera. 
                    No debes inventar resultados"""
            
            
if not github_token:
    raise ValueError("Asegúrate de haber creado el archivo .env con GITHUB_KEY")


# Create server parameters for stdio connection
server_params = StdioServerParameters(
    command="mcp",  # Executable
    args=["run", "server.py"],  # Optional command line arguments
    env=None,  # Optional environment variables
)



def function_schema_tool(tool):
    return {
        "type": "function",
        "function": {
            "name": tool.name,
            "description":tool.description,
            "type":"function",
            "parameters": {
                "type": "object",
                "properties": tool.inputSchema["properties"]
            }
        }
    }


def call_llm(prompt, functions):
    
    token = github_token
    endpoint = "https://models.inference.ai.azure.com"
    model_name = "gpt-4o"
    
    
    client = ChatCompletionsClient(
        endpoint=endpoint,
        credential=AzureKeyCredential(token),
    )
    
    print("Calling LLM")
    response = client.complete(
        model=model_name,
        tools=functions,
        temperature=1.0,
        max_tokens=1000,
        top_p=1.0,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": prompt},
        ],

    )

    response_message = response.choices[0].message
    print("LLM response:", response_message)

    functions_to_call = []
    if response_message.tool_calls:
        for tool_call in response_message.tool_calls:
            print("TOOL: ", tool_call)
            name = tool_call.function.name
            args = json.loads(tool_call.function.arguments)
            functions_to_call.append({"name": name, "args": args})

    return functions_to_call



async def run():
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(
            read, write
        ) as session:
            # Initialize the connection
            await session.initialize()
            
            # List available resources
            resources = await session.list_resources()
            print("LISTING RESOURCES")
            for resource in resources:
                print("Resource: ", resource)

            # List available tools
            tools = await session.list_tools()
            print("LISTING TOOLS")
            for tool in tools.tools:
                print("Tool: ", tool.name)
                
            
            # List available promts
            promts = await session.list_prompts()
            print("LISTING PROMPTS")
            for promt in promts:
                print("Tool: ", promt)
            
                
            # Read a resource
            print("READING RESOURCE")
            content, mime_type = await session.read_resource("greeting://hello")
            print(content)

            # Call a tool
            print("CALL TOOL")
            result = await session.call_tool("add", arguments={"a": 1, "b": 7})
            print(result.content)
            
            
            # Call a tool
            print("CALL PROMPT")
            result = await session.get_prompt("greet_user", arguments={"name": "Mario", "style": "casual"})
            print(result)
            
            
            
            # Obtener las funciones desde las herrameintas
            print("PRINT TOOLS")
            functions = []
            for tool in tools.tools:
                print("Tool: ", tool.name)
                print("Tool: ", tool.inputSchema["properties"])
                functions.append(function_schema_tool(tool))
            
            
            prompt = "suma  15 y 37"
            # ask LLM what tools to all, if any
            functions_to_call = call_llm(prompt, functions)

            # call suggested functions
            for f in functions_to_call:
                result = await session.call_tool(f["name"], arguments=f["args"])
                print("TOOLS result: ", result.content)
            
          

if __name__ == "__main__":
    import asyncio

    asyncio.run(run())