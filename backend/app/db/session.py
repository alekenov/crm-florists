"""
Database session management for SQLModel CRM application.
"""

from sqlmodel import SQLModel, create_engine, Session
from typing import Generator

# Import all models to ensure they are registered with SQLModel
from app.models import (
    User, Client, Product, ProductInventory,
    Inventory, Order, OrderItem, OrderHistory
)


# Database URL for SQLite - using existing database with data
DATABASE_URL = "sqlite:///./leken_sqlmodel.db"

# Create the engine
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL query logging during development
    connect_args={"check_same_thread": False}  # Required for SQLite
)


def create_db_and_tables() -> None:
    """
    Create all database tables based on SQLModel metadata.
    Should be called once during application startup.
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    FastAPI dependency that provides a database session.

    Yields:
        Session: SQLModel database session

    Usage:
        @app.get("/items/")
        def read_items(session: Session = Depends(get_session)):
            # Use session here
            pass
    """
    with Session(engine) as session:
        yield session