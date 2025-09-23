"""
SQLModel Models for CRM Florist System
Миграция с SQLAlchemy на SQLModel для упрощения кода
"""

# Import enums
from .enums import ClientType, OrderStatus, ProductCategory

# Import models
from .user import User
from .client import Client
from .product import Product, ProductInventory
from .inventory import Inventory
from .order import Order, OrderItem, OrderHistory

# Export all models and enums
__all__ = [
    # Enums
    "ClientType",
    "OrderStatus",
    "ProductCategory",

    # Models
    "User",
    "Client",
    "Product",
    "ProductInventory",
    "Inventory",
    "Order",
    "OrderItem",
    "OrderHistory",
]