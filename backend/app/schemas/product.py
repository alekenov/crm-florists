"""
Product schema models for API validation
"""

from typing import Optional
from datetime import datetime
from sqlmodel import SQLModel, Field
from pydantic import validator


class ProductBase(SQLModel):
    """Base product model with shared fields"""
    name: str
    description: Optional[str] = None
    price: float = Field(gt=0)  # Price must be greater than 0
    category: str  # "букет", "композиция", "горшечный"
    preparation_time: Optional[int] = Field(default=None, ge=0)  # in minutes, non-negative
    image_url: Optional[str] = None

    @validator("category")
    def validate_category(cls, v):
        """Validate product category"""
        valid_categories = ["букет", "композиция", "горшечный"]
        if v not in valid_categories:
            raise ValueError(f"Category must be one of: {valid_categories}")
        return v

    @validator("name")
    def validate_name(cls, v):
        """Validate product name"""
        if not v or not v.strip():
            raise ValueError("Product name is required")
        return v.strip()


class ProductCreate(ProductBase):
    """Schema for creating a new product"""
    pass


class ProductRead(ProductBase):
    """Schema for reading product data"""
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class ProductUpdate(SQLModel):
    """Schema for updating product data (all fields optional)"""
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(default=None, gt=0)
    category: Optional[str] = None
    preparation_time: Optional[int] = Field(default=None, ge=0)
    image_url: Optional[str] = None

    @validator("category")
    def validate_category(cls, v):
        """Validate product category if provided"""
        if v is not None:
            valid_categories = ["букет", "композиция", "горшечный"]
            if v not in valid_categories:
                raise ValueError(f"Category must be one of: {valid_categories}")
        return v

    @validator("name")
    def validate_name(cls, v):
        """Validate product name if provided"""
        if v is not None and (not v or not v.strip()):
            raise ValueError("Product name cannot be empty")
        return v.strip() if v else v


# Product Inventory Schemas
class ProductInventoryBase(SQLModel):
    """Base product inventory model with shared fields"""
    product_id: int = Field(gt=0)
    inventory_id: int = Field(gt=0)
    quantity_needed: float = Field(gt=0)


class ProductInventoryCreate(ProductInventoryBase):
    """Schema for creating a new product inventory relation"""
    pass


class ProductInventoryRead(ProductInventoryBase):
    """Schema for reading product inventory data"""
    id: int

    class Config:
        from_attributes = True