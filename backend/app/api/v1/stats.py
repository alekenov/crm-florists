"""
Statistics API router for CRM Florist System
Compatible with working SQLModel API structure
"""

from fastapi import APIRouter, Depends
from typing import Optional
from datetime import datetime, date
from sqlmodel import Session, select, func

from app.models import (
    Client, Product, Order, OrderStatus, Inventory
)
from app.db import get_session

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard_stats(db: Session = Depends(get_session)):
    """Получить статистику для дашборда"""
    today = datetime.now().date()

    # Общее количество заказов
    total_orders = db.exec(select(func.count()).select_from(Order)).one()

    # Заказы за сегодня
    today_orders = db.exec(
        select(func.count()).select_from(Order)
        .where(func.date(Order.created_at) == today)
    ).one()

    # Общее количество клиентов
    total_clients = db.exec(select(func.count()).select_from(Client)).one()

    # Общее количество продуктов
    total_products = db.exec(select(func.count()).select_from(Product)).one()

    # Статистика по статусам
    status_stats = db.exec(
        select(Order.status, func.count())
        .select_from(Order)
        .group_by(Order.status)
    ).all()

    return {
        "total_orders": total_orders,
        "today_orders": today_orders,
        "total_clients": total_clients,
        "total_products": total_products,
        "orders_by_status": {status: count for status, count in status_stats},
        "low_stock_items": db.exec(
            select(func.count()).select_from(Inventory)
            .where(
                (Inventory.min_quantity.isnot(None)) &
                (Inventory.quantity <= Inventory.min_quantity)
            )
        ).one()
    }


@router.get("/sales")
async def get_sales_stats(
    date_from: Optional[date] = None,
    date_to: Optional[date] = None,
    db: Session = Depends(get_session)
):
    """Получить статистику продаж"""
    query = select(
        func.date(Order.delivery_date).label("date"),
        func.count(Order.id).label("orders_count"),
        func.sum(Order.total_price).label("total_revenue")
    ).select_from(Order).where(Order.status != OrderStatus.CANCELED)

    if date_from:
        query = query.where(Order.delivery_date >= datetime.combine(date_from, datetime.min.time()))

    if date_to:
        query = query.where(Order.delivery_date <= datetime.combine(date_to, datetime.max.time()))

    query = query.group_by(func.date(Order.delivery_date)).order_by("date")
    sales_data = db.exec(query).all()

    return [
        {
            "date": row[0],
            "orders_count": row[1],
            "total_revenue": row[2] or 0
        }
        for row in sales_data
    ]