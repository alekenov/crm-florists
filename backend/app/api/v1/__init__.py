"""
API v1 Router Aggregation
This module aggregates all API routers for version 1 of the CRM Florist System API.
"""

from fastapi import APIRouter

from .clients import router as clients_router
from .products import router as products_router
from .inventory import router as inventory_router
from .orders import router as orders_router
from .stats import router as stats_router

# Create the main API router for version 1
api_router = APIRouter()

# Include all routers with their respective prefixes
api_router.include_router(
    clients_router,
    prefix="/clients",
    tags=["clients"]
)

api_router.include_router(
    products_router,
    prefix="/products",
    tags=["products"]
)

api_router.include_router(
    inventory_router,
    prefix="/inventory",
    tags=["inventory"]
)

api_router.include_router(
    orders_router,
    prefix="/orders",
    tags=["orders"]
)

api_router.include_router(
    stats_router,
    prefix="/stats",
    tags=["statistics"]
)

# Export all routers
__all__ = [
    "api_router",
    "clients_router",
    "products_router",
    "inventory_router",
    "orders_router",
    "stats_router"
]