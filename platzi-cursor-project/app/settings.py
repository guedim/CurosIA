from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Path to .env at project root (parent of app/)
_ENV_FILE = Path(__file__).resolve().parent.parent / ".env"


def _parse_cors_list(value: str) -> list[str]:
    """Convert env value (e.g. '*' or 'a,b,c') to list for CORS."""
    if not value or value.strip() == "*":
        return ["*"]
    return [s.strip() for s in value.split(",") if s.strip()]


class Settings(BaseSettings):
    """Settings from environment variables and .env file at project root."""

    model_config = SettingsConfigDict(
        env_file=_ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # App (from .env: APP_NAME, DEBUG)
    app_name: str = "My API"
    debug: bool = False

    # Server (from .env: HOST, PORT)
    host: str = "0.0.0.0"
    port: int = 8000

    # CORS (in .env use * or comma-separated origins, e.g. http://localhost:3000,http://localhost:8080)
    cors_origins: str = "*"
    cors_allow_credentials: bool = False
    cors_allow_methods: str = "*"
    cors_allow_headers: str = "*"

    @property
    def cors_origins_list(self) -> list[str]:
        """CORS allowed origins as a list (parsed from cors_origins string)."""
        return _parse_cors_list(self.cors_origins)

    @property
    def cors_allow_methods_list(self) -> list[str]:
        """CORS allowed methods as a list (parsed from cors_allow_methods string)."""
        return _parse_cors_list(self.cors_allow_methods)

    @property
    def cors_allow_headers_list(self) -> list[str]:
        """CORS allowed headers as a list (parsed from cors_allow_headers string)."""
        return _parse_cors_list(self.cors_allow_headers)


settings = Settings()
