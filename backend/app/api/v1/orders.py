"""
Orders API router for CRM Florist System
Compatible with working SQLModel API structure
"""

from fastapi import APIRouter, HTTPException, Depends, Query, status
from typing import List, Optional
from datetime import datetime, date
from sqlmodel import Session, select, func
from pydantic import BaseModel

from app.models import (
    Client, Product, Order, OrderStatus, OrderItem, OrderHistory,
    Inventory, ProductInventory, User
)
from app.db import get_session

router = APIRouter()


class StatusUpdateRequest(BaseModel):
    new_status: str
    comment: Optional[str] = None


@router.get("/", response_model=List[Order])
async def get_orders(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    status: Optional[str] = None,
    client_id: Optional[int] = None,
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: Session = Depends(get_session)
):
    """Получить список заказов"""
    query = select(Order)

    if status:
        query = query.where(Order.status == status)

    if client_id:
        query = query.where(
            (Order.client_id == client_id) | (Order.recipient_id == client_id)
        )

    if date_from:
        query = query.where(Order.delivery_date >= datetime.combine(date_from, datetime.min.time()))

    if date_to:
        query = query.where(Order.delivery_date <= datetime.combine(date_to, datetime.max.time()))

    query = query.order_by(Order.created_at.desc()).offset(skip).limit(limit)
    orders = db.exec(query).all()
    return orders


@router.get("/{order_id}")
async def get_order(order_id: int, db: Session = Depends(get_session)):
    """Получить заказ по ID с полной информацией"""
    # Получаем заказ
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Загружаем связанные объекты
    client = db.get(Client, order.client_id) if order.client_id else None
    recipient = db.get(Client, order.recipient_id) if order.recipient_id else None
    executor = db.get(User, order.executor_id) if order.executor_id else None

    # Получаем элементы заказа
    order_items = db.exec(select(OrderItem).where(OrderItem.order_id == order.id)).all()

    # Формируем items с продуктами
    items_with_products = []
    for item in order_items:
        product = db.get(Product, item.product_id) if item.product_id else None
        items_with_products.append({
            "id": item.id,
            "order_id": item.order_id,
            "product_id": item.product_id,
            "quantity": item.quantity,
            "price": item.price,
            "product": product.model_dump() if product else None
        })

    # Собираем полный ответ
    response = {
        "id": order.id,
        "client_id": order.client_id,
        "recipient_id": order.recipient_id,
        "executor_id": order.executor_id,
        "status": order.status,
        "delivery_date": order.delivery_date.isoformat() if order.delivery_date else None,
        "delivery_address": order.delivery_address,
        "delivery_time_range": order.delivery_time_range,
        "total_price": order.total_price,
        "comment": order.comment,
        "created_at": order.created_at.isoformat() if order.created_at else None,
        # Вложенные объекты
        "client": client.model_dump() if client else None,
        "recipient": recipient.model_dump() if recipient else None,
        "executor": executor.model_dump() if executor else None,
        "order_items": items_with_products
    }

    return response


@router.post("/", response_model=Order)
async def create_order(
    order: Order,
    db: Session = Depends(get_session)
):
    """Создать новый заказ"""
    # Проверка клиентов
    client = db.get(Client, order.client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Client not found")

    recipient = db.get(Client, order.recipient_id)
    if not recipient:
        raise HTTPException(status_code=404, detail="Recipient not found")

    db.add(order)
    db.commit()
    db.refresh(order)

    # Добавляем историю
    history = OrderHistory(
        order_id=order.id,
        action="created",
        new_status=order.status,
        comment="Заказ создан"
    )
    db.add(history)
    db.commit()

    return order


@router.put("/{order_id}", response_model=Order)
async def update_order(
    order_id: int,
    order_update: Order,
    db: Session = Depends(get_session)
):
    """Обновить заказ"""
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    old_status = order.status
    update_data = order_update.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        if key != 'id':
            setattr(order, key, value)

    db.add(order)
    db.commit()

    # Если изменился статус, добавляем в историю
    if old_status != order.status:
        history = OrderHistory(
            order_id=order_id,
            action="status_changed",
            old_status=old_status,
            new_status=order.status,
            comment=f"Статус изменен с {old_status} на {order.status}"
        )
        db.add(history)
        db.commit()

    db.refresh(order)
    return order


@router.patch("/{order_id}")
async def patch_order(
    order_id: int,
    order_update: dict,
    db: Session = Depends(get_session)
):
    """Частично обновить заказ"""
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Применяем только переданные поля
    for key, value in order_update.items():
        if key != 'id' and hasattr(order, key):
            setattr(order, key, value)

    db.add(order)
    db.commit()
    db.refresh(order)

    # Если изменился статус, добавляем в историю
    if 'status' in order_update:
        history = OrderHistory(
            order_id=order_id,
            action="status_changed",
            new_status=order_update['status'],
            comment=f"Статус изменен на {order_update['status']}"
        )
        db.add(history)
        db.commit()

    return order


@router.put("/{order_id}/status")
async def update_order_status(
    order_id: int,
    status_update: StatusUpdateRequest,
    db: Session = Depends(get_session)
):
    """Обновить статус заказа"""
    # Маппинг английских статусов на значения из OrderStatus enum
    status_map = {
        'new': OrderStatus.NEW.value,           # "новый"
        'paid': OrderStatus.PAID.value,         # "оплачен"
        'accepted': OrderStatus.IN_WORK.value,  # "в работе"
        'assembled': OrderStatus.COLLECTED.value, # "собран"
        'in-transit': OrderStatus.READY.value,  # "готов"
        'completed': OrderStatus.DELIVERED.value # "доставлен"
    }

    # Преобразуем статус если это английский
    status = status_map.get(status_update.new_status, status_update.new_status)

    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    old_status = order.status
    order.status = status

    db.add(order)

    # Добавляем запись в историю
    history = OrderHistory(
        order_id=order_id,
        action="status_changed",
        old_status=old_status,
        new_status=status,
        comment=status_update.comment or f"Статус изменен с {old_status} на {status}"
    )
    db.add(history)
    db.commit()
    db.refresh(order)

    return {"message": "Status updated", "order": order}


@router.delete("/{order_id}")
async def delete_order(order_id: int, db: Session = Depends(get_session)):
    """Удалить заказ"""
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Удаляем связанные позиции заказа
    items = db.exec(select(OrderItem).where(OrderItem.order_id == order_id)).all()
    for item in items:
        db.delete(item)

    # Удаляем историю изменений заказа
    histories = db.exec(select(OrderHistory).where(OrderHistory.order_id == order_id)).all()
    for h in histories:
        db.delete(h)

    # Теперь удаляем сам заказ
    db.delete(order)
    db.commit()
    return {"message": "Order deleted successfully"}


# ============= ORDER ITEMS API =============

@router.post("/{order_id}/items", response_model=OrderItem)
async def add_order_item(
    order_id: int,
    item: OrderItem,
    db: Session = Depends(get_session)
):
    """Добавить позицию в заказ"""
    order = db.get(Order, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    product = db.get(Product, item.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    item.order_id = order_id
    item.price = item.price or product.price

    db.add(item)
    db.commit()

    # Обновляем общую сумму заказа
    total = db.exec(
        select(func.sum(OrderItem.price * OrderItem.quantity))
        .where(OrderItem.order_id == order_id)
    ).one()

    order.total_price = total or 0
    db.add(order)
    db.commit()

    db.refresh(item)
    return item


@router.delete("/{order_id}/items/{item_id}")
async def delete_order_item(
    order_id: int,
    item_id: int,
    db: Session = Depends(get_session)
):
    """Удалить позицию из заказа"""
    item = db.exec(
        select(OrderItem)
        .where(OrderItem.id == item_id, OrderItem.order_id == order_id)
    ).first()

    if not item:
        raise HTTPException(status_code=404, detail="Order item not found")

    db.delete(item)
    db.commit()

    # Обновляем общую сумму заказа
    order = db.get(Order, order_id)
    total = db.exec(
        select(func.sum(OrderItem.price * OrderItem.quantity))
        .where(OrderItem.order_id == order_id)
    ).one()

    order.total_price = total or 0
    db.add(order)
    db.commit()

    return {"message": "Order item deleted successfully"}