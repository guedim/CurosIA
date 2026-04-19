from pydantic import BaseModel, EmailStr, Field


class ClienteCreate(BaseModel):
    """Payload for creating or updating a client (no id)."""

    nombres: str = Field(..., description="Client full name(s).")
    teléfono: str = Field(
        ...,
        min_length=10,
        max_length=10,
        pattern=r"^\d{10}$",
        description="10-digit phone number.",
    )
    email: EmailStr = Field(..., description="Valid email address.")


class Cliente(BaseModel):
    """Client entity model."""

    id: int | None = Field(
        default=None,
        description="Auto-increment integer identifier.",
    )
    nombres: str = Field(..., description="Client full name(s).")
    teléfono: str = Field(
        ...,
        min_length=10,
        max_length=10,
        pattern=r"^\d{10}$",
        description="10-digit phone number.",
    )
    email: EmailStr = Field(..., description="Valid email address.")
