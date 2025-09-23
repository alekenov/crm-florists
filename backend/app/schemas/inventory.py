"""
Inventory schema models for API validation
"""

from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field
from pydantic import validator


class InventoryBase(SQLModel):
    """Base inventory model with shared fields"""
    name: str
    quantity: float = Field(ge=0)  # Quantity must be non-negative
    unit: str  # 'шт', 'м', 'кг', etc.
    min_quantity: Optional[float] = Field(default=None, ge=0)  # For low stock warnings
    price_per_unit: Optional[float] = Field(default=None, ge=0)

    @validator("name")
    def validate_name(cls, v):
        """Validate inventory item name"""
        if not v or not v.strip():
            raise ValueError("Inventory item name is required")
        return v.strip()

    @validator("unit")
    def validate_unit(cls, v):
        """Validate unit of measurement"""
        if not v or not v.strip():
            raise ValueError("Unit of measurement is required")
        # Common units for florist inventory
        valid_units = ["шт", "м", "кг", "г", "л", "мл", "букет", "упак"]
        if v.strip() not in valid_units:
            # Allow custom units but warn
            pass
        return v.strip()


class InventoryCreate(InventoryBase):
    """Schema for creating a new inventory item"""
    pass


class InventoryRead(InventoryBase):
    """Schema for reading inventory data"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class InventoryUpdate(SQLModel):
    """Schema for updating inventory data (all fields optional)"""
    name: Optional[str] = None
    quantity: Optional[float] = Field(default=None, ge=0)
    unit: Optional[str] = None
    min_quantity: Optional[float] = Field(default=None, ge=0)
    price_per_unit: Optional[float] = Field(default=None, ge=0)

    @validator("name")
    def validate_name(cls, v):
        """Validate inventory item name if provided"""
        if v is not None and (not v or not v.strip()):
            raise ValueError("Inventory item name cannot be empty")
        return v.strip() if v else v

    @validator("unit")
    def validate_unit(cls, v):
        """Validate unit of measurement if provided"""
        if v is not None and (not v or not v.strip()):
            raise ValueError("Unit of measurement cannot be empty")
        return v.strip() if v else v