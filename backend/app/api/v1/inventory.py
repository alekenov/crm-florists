"""
Inventory API router for CRM Florist System
Compatible with working SQLModel API structure
"""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from sqlmodel import Session, select

from app.models import Inventory
from app.db import get_session

router = APIRouter()


@router.get("/", response_model=List[Inventory])
async def get_inventory(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    low_stock: Optional[bool] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_session)
):
    """Получить список складских позиций"""
    query = select(Inventory)

    if low_stock:
        query = query.where(
            (Inventory.min_quantity.isnot(None)) &
            (Inventory.quantity <= Inventory.min_quantity)
        )

    if search:
        query = query.where(Inventory.name.ilike(f"%{search}%"))

    query = query.offset(skip).limit(limit)
    items = db.exec(query).all()
    return items


@router.get("/{inventory_id}", response_model=Inventory)
async def get_inventory_item(inventory_id: int, db: Session = Depends(get_session)):
    """Получить складскую позицию по ID"""
    item = db.get(Inventory, inventory_id)
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")
    return item


@router.post("/", response_model=Inventory)
async def create_inventory_item(
    item: Inventory,
    db: Session = Depends(get_session)
):
    """Создать новую складскую позицию"""
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{inventory_id}", response_model=Inventory)
async def update_inventory_item(
    inventory_id: int,
    item_update: Inventory,
    db: Session = Depends(get_session)
):
    """Обновить складскую позицию"""
    item = db.get(Inventory, inventory_id)
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    update_data = item_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key != 'id':
            setattr(item, key, value)

    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{inventory_id}")
async def delete_inventory_item(inventory_id: int, db: Session = Depends(get_session)):
    """Удалить складскую позицию"""
    item = db.get(Inventory, inventory_id)
    if not item:
        raise HTTPException(status_code=404, detail="Inventory item not found")

    db.delete(item)
    db.commit()
    return {"message": "Inventory item deleted successfully"}