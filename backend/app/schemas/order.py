"""
Order schema models for API validation with EN/RU status support
"""

from typing import Optional, List, TYPE_CHECKING
from datetime import datetime
from sqlmodel import SQLModel, Field
from pydantic import validator, computed_field
import re

if TYPE_CHECKING:
    from app.schemas.client import ClientRead
    from app.schemas.product import ProductRead


class OrderBase(SQLModel):
    """Base order model with shared fields"""
    client_id: int = Field(gt=0)
    recipient_id: int = Field(gt=0)
    executor_id: Optional[int] = Field(default=None, gt=0)
    status: str = "NEW"  # EN codes as source of truth
    delivery_date: datetime
    delivery_address: str
    delivery_time_range: Optional[str] = None  # e.g., "10:00-12:00"
    total_price: Optional[float] = Field(default=None, ge=0)
    comment: Optional[str] = None

    @validator("status", pre=True)
    def validate_and_normalize_status(cls, v):
        """Validate and normalize status to EN code"""
        from app.core.mappings import normalize_status
        normalized = normalize_status(v)
        return normalized.value

    @validator("delivery_address")
    def validate_delivery_address(cls, v):
        """Validate delivery address"""
        if not v or not v.strip():
            raise ValueError("Delivery address is required")
        return v.strip()

    @validator("delivery_time_range")
    def validate_delivery_time_range(cls, v):
        """Validate delivery time range format"""
        if v is not None and v.strip():
            time_pattern = r'^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$'
            if not re.match(time_pattern, v.strip()):
                raise ValueError("Delivery time range must be in format 'HH:MM-HH:MM'")
            return v.strip()
        return v


class OrderCreate(OrderBase):
    """Schema for creating a new order"""
    pass


class OrderRead(OrderBase):
    """Schema for reading order data"""
    id: int
    created_at: datetime

    @computed_field
    @property
    def status_label_ru(self) -> str:
        """Get Russian label for status"""
        from app.core.mappings import STATUS_EN_TO_RU
        return STATUS_EN_TO_RU.get(self.status, self.status)

    class Config:
        from_attributes = True
        populate_by_name = True


class OrderUpdate(SQLModel):
    """Schema for updating order data (all fields optional)"""
    client_id: Optional[int] = Field(default=None, gt=0)
    recipient_id: Optional[int] = Field(default=None, gt=0)
    executor_id: Optional[int] = Field(default=None, gt=0)
    status: Optional[str] = None
    delivery_date: Optional[datetime] = None
    delivery_address: Optional[str] = None
    delivery_time_range: Optional[str] = None
    total_price: Optional[float] = Field(default=None, ge=0)
    comment: Optional[str] = None

    @validator("status", pre=True)
    def validate_and_normalize_status(cls, v):
        """Validate and normalize status to EN code if provided"""
        if v is not None:
            from app.core.mappings import normalize_status
            normalized = normalize_status(v)
            return normalized.value
        return v

    @validator("delivery_address")
    def validate_delivery_address(cls, v):
        """Validate delivery address if provided"""
        if v is not None and (not v or not v.strip()):
            raise ValueError("Delivery address cannot be empty")
        return v.strip() if v else v

    @validator("delivery_time_range")
    def validate_delivery_time_range(cls, v):
        """Validate delivery time range format if provided"""
        if v is not None and v.strip():
            time_pattern = r'^(\d{1,2}:\d{2})\s*-\s*(\d{1,2}:\d{2})$'
            if not re.match(time_pattern, v.strip()):
                raise ValueError("Delivery time range must be in format 'HH:MM-HH:MM'")
            return v.strip()
        return v


# Order Item Schemas
class OrderItemBase(SQLModel):
    """Base order item model with shared fields"""
    order_id: int = Field(gt=0)
    product_id: int = Field(gt=0)
    quantity: int = Field(default=1, gt=0)
    price: float = Field(gt=0)


class OrderItemCreate(OrderItemBase):
    """Schema for creating a new order item"""
    pass


class OrderItemRead(OrderItemBase):
    """Schema for reading order item data"""
    id: int

    class Config:
        from_attributes = True
        populate_by_name = True


# Order History Schema
class OrderHistoryRead(SQLModel):
    """Schema for reading order history data"""
    id: int
    order_id: int
    status: str  # EN code
    changed_by: str = "Система"
    notes: Optional[str] = None
    created_at: datetime

    @computed_field
    @property
    def status_label_ru(self) -> str:
        """Get Russian label for status"""
        from app.core.mappings import STATUS_EN_TO_RU
        return STATUS_EN_TO_RU.get(self.status, self.status)

    class Config:
        from_attributes = True
        populate_by_name = True


# Nested Response Schemas
class ProductRead(SQLModel):
    """Product read schema - minimal definition for order items"""
    id: int
    name: str
    category: str
    price: float

    class Config:
        from_attributes = True


class ClientRead(SQLModel):
    """Client read schema - minimal definition for orders"""
    id: int
    name: str
    phone: str
    email: Optional[str] = None

    class Config:
        from_attributes = True


class OrderItemReadWithProduct(OrderItemRead):
    """Order item with nested product data"""
    product: Optional[ProductRead] = None

    class Config:
        from_attributes = True
        populate_by_name = True


class OrderReadWithItems(OrderRead):
    """Order with nested items and related data"""
    client: Optional[ClientRead] = None
    recipient: Optional[ClientRead] = None
    order_items: List[OrderItemReadWithProduct] = []
    history_entries: List[OrderHistoryRead] = []

    class Config:
        from_attributes = True
        populate_by_name = True


# Status update request schema
class StatusUpdateRequest(SQLModel):
    """Request to update order status"""
    status: str  # Accept both EN and RU
    comment: Optional[str] = None

    @validator("status", pre=True)
    def validate_and_normalize_status(cls, v):
        """Validate and normalize status to EN code"""
        from app.core.mappings import normalize_status
        normalized = normalize_status(v)
        return normalized.value