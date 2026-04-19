# cursor-ai

REST API with FastAPI using CursorAI

## Requirements

- **Python** >= 3.14
- **uv** (project and dependency manager): [installation](https://docs.astral.sh/uv/getting-started/installation/)

## Installation

1. Clone the repository and enter the project folder:

   ```bash
   cd cursor-ai
   ```

2. Install dependencies with uv (creates the virtual environment and installs what is defined in `pyproject.toml`):

   ```bash
   uv sync
   ```

   Main dependencies installed:
   - FastAPI
   - Uvicorn
   - Pydantic Settings
   - **email-validator**: required to use `EmailStr` in Pydantic models (email validation). If you use the `EmailStr` type in your schemas, this dependency must be installed.

## Running the project

Always from the **project root**:

**Option 1 – Using the module (uses host and port from `settings`):**

```bash
uv run python -m app.main
```

**Option 2 – Using uvicorn (recommended for development with reload):**

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Then open in your browser:

- API: http://localhost:8000
- Swagger docs: http://localhost:8000/docs
- Health: http://localhost:8000/health

## Configuration

Optional: create a `.env` file in the project root to override default values:

```env
APP_NAME="My API"
DEBUG=false
HOST=0.0.0.0
PORT=8000
CORS_ORIGINS=["*"]
```
