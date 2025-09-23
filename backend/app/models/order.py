"""
Order, OrderItem, and OrderHistory models for CRM Florist System
"""
from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship
from .enums import OrderStatus


class Order(SQLModel, table=True):
    """Модель заказа"""
    __tablename__ = "orders"

    id: Optional[int] = Field(default=None, primary_key=True)
    client_id: int = Field(foreign_key="clients.id")
    recipient_id: int = Field(foreign_key="clients.id")
    executor_id: Optional[int] = Field(default=None, foreign_key="users.id")
    status: OrderStatus = Field(default=OrderStatus.NEW)
    delivery_date: datetime
    delivery_address: str
    delivery_time_range: Optional[str] = None  # Время доставки, например "10:00-12:00"
    total_price: Optional[float] = None
    comment: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    client: Optional["Client"] = Relationship(
        back_populates="orders_as_client",
        sa_relationship_kwargs={"foreign_keys": "[Order.client_id]"}
    )
    recipient: Optional["Client"] = Relationship(
        back_populates="orders_as_recipient",
        sa_relationship_kwargs={"foreign_keys": "[Order.recipient_id]"}
    )
    executor: Optional["User"] = Relationship(back_populates="executed_orders")
    order_items: List["OrderItem"] = Relationship(back_populates="order")
    history_entries: List["OrderHistory"] = Relationship(back_populates="order")


class OrderItem(SQLModel, table=True):
    """Модель позиции заказа"""
    __tablename__ = "order_items"

    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.id")
    product_id: int = Field(foreign_key="products.id")
    quantity: int = Field(default=1)
    price: float

    # Relationships
    order: Optional[Order] = Relationship(back_populates="order_items")
    product: Optional["Product"] = Relationship(back_populates="order_items")


class OrderHistory(SQLModel, table=True):
    """История изменений заказа"""
    __tablename__ = "order_history"

    id: Optional[int] = Field(default=None, primary_key=True)
    order_id: int = Field(foreign_key="orders.id")
    action: str  # "status_changed", "created", "edited", etc.
    old_status: Optional[str] = None
    new_status: Optional[str] = None
    comment: Optional[str] = None
    changed_by_id: Optional[int] = Field(default=None, foreign_key="users.id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    order: Optional[Order] = Relationship(back_populates="history_entries")
    changed_by: Optional["User"] = Relationship()