"""
Schema models for API validation
Import and export all schemas for easy access
"""

from .client import (
    ClientBase,
    ClientCreate,
    ClientRead,
    ClientUpdate
)

from .product import (
    ProductBase,
    ProductCreate,
    ProductRead,
    ProductUpdate,
    ProductInventoryBase,
    ProductInventoryCreate,
    ProductInventoryRead
)

from .inventory import (
    InventoryBase,
    InventoryCreate,
    InventoryRead,
    InventoryUpdate
)

from .order import (
    OrderBase,
    OrderCreate,
    OrderRead,
    OrderUpdate,
    OrderReadWithItems,
    OrderItemBase,
    OrderItemCreate,
    OrderItemRead,
    OrderItemReadWithProduct,
    OrderHistoryRead
)

from .common import (
    PaginationParams,
    StatusUpdateRequest,
    CommonResponse,
    ErrorResponse,
    PaginatedResponse,
    BulkOperationRequest,
    BulkOperationResponse
)

__all__ = [
    # Client schemas
    "ClientBase",
    "ClientCreate",
    "ClientRead",
    "ClientUpdate",

    # Product schemas
    "ProductBase",
    "ProductCreate",
    "ProductRead",
    "ProductUpdate",
    "ProductInventoryBase",
    "ProductInventoryCreate",
    "ProductInventoryRead",

    # Inventory schemas
    "InventoryBase",
    "InventoryCreate",
    "InventoryRead",
    "InventoryUpdate",

    # Order schemas
    "OrderBase",
    "OrderCreate",
    "OrderRead",
    "OrderUpdate",
    "OrderReadWithItems",
    "OrderItemBase",
    "OrderItemCreate",
    "OrderItemRead",
    "OrderItemReadWithProduct",
    "OrderHistoryRead",

    # Common schemas
    "PaginationParams",
    "StatusUpdateRequest",
    "CommonResponse",
    "ErrorResponse",
    "PaginatedResponse",
    "BulkOperationRequest",
    "BulkOperationResponse"
]