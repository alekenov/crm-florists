"""
User model for CRM Florist System
"""
from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship


class User(SQLModel, table=True):
    """Модель пользователя системы"""
    __tablename__ = "users"

    id: Optional[int] = Field(default=None, primary_key=True)
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Profile fields
    city: Optional[str] = None
    position: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None

    # Relationships
    executed_orders: List["Order"] = Relationship(back_populates="executor")