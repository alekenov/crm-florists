"""
Clients API router for CRM Florist System
Compatible with working SQLModel API structure
"""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from sqlmodel import Session, select, func
import re

from app.models import Client, Order, ClientType
from app.db import get_session

router = APIRouter()


@router.get("/", response_model=List[Client])
async def get_clients(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    search: Optional[str] = None,
    client_type: Optional[str] = None,
    db: Session = Depends(get_session)
):
    """Получить список клиентов с фильтрацией"""
    query = select(Client)

    if search:
        search_pattern = f"%{search}%"
        query = query.where(
            (Client.name.ilike(search_pattern)) |
            (Client.phone.ilike(search_pattern)) |
            (Client.email.ilike(search_pattern))
        )

    if client_type and client_type in ["заказчик", "получатель", "оба"]:
        query = query.where(Client.client_type == client_type)

    query = query.offset(skip).limit(limit)
    clients = db.exec(query).all()
    return clients


@router.get("/{client_id}", response_model=Client)
async def get_client(client_id: int, db: Session = Depends(get_session)):
    """Получить клиента по ID"""
    client = db.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")
    return client


@router.post("/", response_model=Client)
async def create_client(
    client: Client,
    db: Session = Depends(get_session)
):
    """Создать нового клиента"""
    # Валидация телефона
    if not re.match(r'^\+7\d{10}$', client.phone):
        raise HTTPException(
            status_code=400,
            detail="Phone must be in format +7XXXXXXXXXX"
        )

    # Проверка на дубликат телефона
    existing = db.exec(
        select(Client).where(Client.phone == client.phone)
    ).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail="Client with this phone already exists"
        )

    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@router.put("/{client_id}", response_model=Client)
async def update_client(
    client_id: int,
    client_update: Client,
    db: Session = Depends(get_session)
):
    """Обновить клиента"""
    client = db.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Обновляем только переданные поля
    update_data = client_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        if key != 'id':
            setattr(client, key, value)

    db.add(client)
    db.commit()
    db.refresh(client)
    return client


@router.delete("/{client_id}")
async def delete_client(client_id: int, db: Session = Depends(get_session)):
    """Удалить клиента"""
    client = db.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Проверяем, есть ли заказы
    orders_count = db.exec(
        select(func.count()).select_from(Order)
        .where((Order.client_id == client_id) | (Order.recipient_id == client_id))
    ).one()

    if orders_count > 0:
        raise HTTPException(
            status_code=400,
            detail=f"Cannot delete client with {orders_count} orders"
        )

    db.delete(client)
    db.commit()
    return {"message": "Client deleted successfully"}


@router.get("/{client_id}/orders")
async def get_client_orders(
    client_id: int,
    db: Session = Depends(get_session)
):
    """Получить заказы клиента"""
    client = db.get(Client, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    # Заказы где клиент - заказчик
    as_customer = db.exec(
        select(Order).where(Order.client_id == client_id)
    ).all()

    # Заказы где клиент - получатель
    as_recipient = db.exec(
        select(Order).where(Order.recipient_id == client_id)
    ).all()

    return {
        "client": client,
        "orders_as_customer": as_customer,
        "orders_as_recipient": as_recipient,
        "total_orders": len(as_customer) + len(as_recipient)
    }