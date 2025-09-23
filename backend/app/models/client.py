"""
Client model for CRM Florist System
"""
from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship
from .enums import ClientType


class Client(SQLModel, table=True):
    """Модель клиента (заказчик/получатель)"""
    __tablename__ = "clients"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: Optional[str] = None  # Имя опционально
    phone: str = Field(index=True)  # +7XXXXXXXXXX format
    email: Optional[str] = None
    address: Optional[str] = None
    client_type: ClientType = Field(default=ClientType.BOTH)
    notes: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships - using string annotations for forward references
    orders_as_client: List["Order"] = Relationship(
        back_populates="client",
        sa_relationship_kwargs={
            "foreign_keys": "Order.client_id",
            "overlaps": "orders_as_recipient,recipient"
        }
    )
    orders_as_recipient: List["Order"] = Relationship(
        back_populates="recipient",
        sa_relationship_kwargs={
            "foreign_keys": "Order.recipient_id",
            "overlaps": "orders_as_client,client"
        }
    )