from fastapi import APIRouter, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from app.schema import Cliente, ClienteCreate
from app.settings import settings

app = FastAPI(
    title=settings.app_name,
    description="FastAPI skeleton",
    version="0.1.0",
    debug=settings.debug,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=settings.cors_allow_credentials,
    allow_methods=settings.cors_allow_methods_list,
    allow_headers=settings.cors_allow_headers_list,
)

# --- Clients CRUD (in-memory storage) ---
clientes_router = APIRouter(prefix="/api/clientes", tags=["Clients"])
_clientes_db: dict[int, Cliente] = {}
_next_id = 1


def _get_next_id() -> int:
    """Return the next auto-increment id for a new client and advance the counter."""
    global _next_id
    n = _next_id
    _next_id += 1
    return n


@clientes_router.get(
    "",
    response_model=list[Cliente],
    summary="List clients",
    description="Returns all clients.",
)
async def list_clientes() -> list[Cliente]:
    """Return all clients stored in memory."""
    return list(_clientes_db.values())


@clientes_router.post(
    "",
    response_model=Cliente,
    status_code=status.HTTP_201_CREATED,
    summary="Create client",
    description="Creates a new client. The id is assigned automatically.",
)
async def create_cliente(cliente: ClienteCreate) -> Cliente:
    """Create a new client with an auto-assigned id and return it."""
    new_id = _get_next_id()
    new_cliente = Cliente(id=new_id, **cliente.model_dump())
    _clientes_db[new_id] = new_cliente
    return new_cliente


@clientes_router.get(
    "/{cliente_id}",
    response_model=Cliente,
    summary="Get client",
    description="Returns a client by id.",
    responses={404: {"description": "Client not found"}},
)
async def get_cliente(cliente_id: int) -> Cliente:
    """Return a single client by id. Raises 404 if not found."""
    if cliente_id not in _clientes_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found",
        )
    return _clientes_db[cliente_id]


@clientes_router.put(
    "/{cliente_id}",
    response_model=Cliente,
    summary="Update client",
    description="Replaces a client by id with the provided data.",
    responses={404: {"description": "Client not found"}},
)
async def update_cliente(cliente_id: int, cliente: ClienteCreate) -> Cliente:
    """Replace an existing client by id with the provided data. Raises 404 if not found."""
    if cliente_id not in _clientes_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found",
        )
    updated = Cliente(id=cliente_id, **cliente.model_dump())
    _clientes_db[cliente_id] = updated
    return updated


@clientes_router.delete(
    "/{cliente_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Delete client",
    description="Deletes a client by id.",
    responses={404: {"description": "Client not found"}},
)
async def delete_cliente(cliente_id: int) -> None:
    """Delete a client by id. Raises 404 if not found. Returns 204 on success."""
    if cliente_id not in _clientes_db:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Client not found",
        )
    del _clientes_db[cliente_id]


app.include_router(clientes_router)


@app.get("/")
def root():
    """Root endpoint; returns a welcome message."""
    return {"message": "Hello, World!"}


@app.get("/health")
def health():
    """Health check endpoint for load balancers and monitoring."""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
    )
