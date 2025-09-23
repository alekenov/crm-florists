"""
Products API router for CRM Florist System
Compatible with working SQLModel API structure
"""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from sqlmodel import Session, select

from app.models import Product, ProductCategory
from app.db import get_session

router = APIRouter()


@router.get("/", response_model=List[Product])
async def get_products(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_session)
):
    """Получить список продуктов"""
    query = select(Product)

    if category:
        query = query.where(Product.category == category)

    if min_price is not None:
        query = query.where(Product.price >= min_price)

    if max_price is not None:
        query = query.where(Product.price <= max_price)

    if search:
        query = query.where(
            (Product.name.ilike(f"%{search}%")) |
            (Product.description.ilike(f"%{search}%"))
        )

    query = query.offset(skip).limit(limit)
    products = db.exec(query).all()
    return products


@router.get("/{product_id}", response_model=Product)
async def get_product(product_id: int, db: Session = Depends(get_session)):
    """Получить продукт по ID"""
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/", response_model=Product)
async def create_product(
    product: Product,
    db: Session = Depends(get_session)
):
    """Создать новый продукт"""
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.put("/{product_id}", response_model=Product)
async def update_product(
    product_id: int,
    product_update: Product,
    db: Session = Depends(get_session)
):
    """Обновить продукт"""
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    update_data = product_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key != 'id':
            setattr(product, key, value)

    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/{product_id}")
async def delete_product(product_id: int, db: Session = Depends(get_session)):
    """Удалить продукт"""
    product = db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}