"""
Product and ProductInventory models for CRM Florist System
"""
from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship
from .enums import ProductCategory


class Product(SQLModel, table=True):
    """Модель товара/продукта"""
    __tablename__ = "products"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: Optional[str] = None
    price: float
    category: ProductCategory
    preparation_time: Optional[int] = None  # в минутах
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    order_items: List["OrderItem"] = Relationship(back_populates="product")
    product_inventories: List["ProductInventory"] = Relationship(back_populates="product")


class ProductInventory(SQLModel, table=True):
    """Связь продукта с материалами на складе"""
    __tablename__ = "product_inventory"

    id: Optional[int] = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="products.id")
    inventory_id: int = Field(foreign_key="inventory.id")
    quantity_needed: float

    # Relationships
    product: Optional[Product] = Relationship(back_populates="product_inventories")
    inventory: Optional["Inventory"] = Relationship(back_populates="product_inventories")