"""
Inventory model for CRM Florist System
"""
from typing import Optional, List
from datetime import datetime
from sqlmodel import Field, SQLModel, Relationship


class Inventory(SQLModel, table=True):
    """Модель складского учета"""
    __tablename__ = "inventory"

    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    quantity: float
    unit: str  # 'шт', 'м', 'кг'
    min_quantity: Optional[float] = None  # для предупреждений о низком запасе
    price_per_unit: Optional[float] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    product_inventories: List["ProductInventory"] = Relationship(back_populates="inventory")