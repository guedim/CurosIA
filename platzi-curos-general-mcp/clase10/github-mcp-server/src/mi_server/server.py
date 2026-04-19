from mcp.server.fastmcp import FastMCP

mcp = FastMCP("mcp-calculator-server")


@mcp.tool(
    name="add",
    title="add",
    description="Return add two numbers"
)
def add(a: float, b:float) -> float:
    """Add 2 numbers and return the result"""
    return a+b

@mcp.tool(
    name="substract",
    title="substract",
    description="Return substract two numbers"
)
def substract(a: float, b:float) -> float:
    """substract 2 numbers and return the result"""
    return a-b

@mcp.tool(
    name="multiply",
    title="multiply",
    description="Return multiply two numbers"
)
def multiply(a: float, b:float) -> float:
    """multiply 2 numbers and return the result"""
    return a*b


@mcp.tool(
    name="divide",
    title="divide",
    description="Return divide two numbers"
)
def divide(a: float, b:float) -> float:
    """divide 2 numers and return the result"""
    
    if b == 0:
        raise ValueError("Cannot divide by zero")
    
    return a/b

def main():
    mcp.run()

if __name__ == "__main__":
    main()