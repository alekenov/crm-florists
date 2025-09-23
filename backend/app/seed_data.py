"""
Seed data for SQLModel CRM Florist System
Создает тестовые данные для демонстрации функциональности
"""

from datetime import datetime, timedelta
from sqlmodel import Session, select
from typing import List
import random

from app.db import engine
from app.models import (
    Client, Product, Inventory, Order, OrderItem, OrderHistory,
    ClientType, OrderStatus, ProductCategory
)


def create_seed_data():
    """Создание seed данных для SQLModel архитектуры"""

    with Session(engine) as session:
        print("🌱 Создание seed данных...")

        # Проверяем есть ли уже данные
        existing_products = session.exec(select(Product)).first()
        if existing_products:
            print("✅ Данные уже существуют, пропускаем создание")
            return

        # 1. Создаем клиентов
        clients = [
            Client(
                name="Анна Петрова",
                phone="+77017777777",
                email="anna@example.com",
                address="Алматы, ул. Абая 150",
                client_type=ClientType.CUSTOMER,
                notes="Постоянный клиент, любит розы"
            ),
            Client(
                name="Бауржан Касымов",
                phone="+77012345678",
                email="baur@example.com",
                address="Алматы, мкр. Самал-2, 45",
                client_type=ClientType.BOTH,
                notes="Корпоративный клиент"
            ),
            Client(
                name="Елена Ким",
                phone="+77019876543",
                email="elena.kim@company.kz",
                address="Астана, пр. Назарбаева 10",
                client_type=ClientType.RECIPIENT,
                notes="Получатель корпоративных заказов"
            ),
            Client(
                name="Дмитрий Волков",
                phone="+77075555555",
                address="Алматы, ул. Тимирязева 42",
                client_type=ClientType.CUSTOMER,
                notes="Предпочитает композиции"
            ),
            Client(
                name="Айгерим Нурланова",
                phone="+77777777777",
                email="aigera@gmail.com",
                address="Шымкент, ул. Абылай-хана 25",
                client_type=ClientType.BOTH
            )
        ]

        for client in clients:
            session.add(client)
        session.commit()
        print(f"✅ Создано {len(clients)} клиентов")

        # 2. Создаем продукты
        products = [
            Product(
                name="Букет Весенний",
                description="Красивый весенний букет из тюльпанов и нарциссов",
                price=15000.0,
                category=ProductCategory.BOUQUET,
                preparation_time=30,
                image_url="https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400"
            ),
            Product(
                name="Букет 'Нежность'",
                description="25 белых роз с эвкалиптом",
                price=18000.0,
                category=ProductCategory.BOUQUET,
                preparation_time=45,
                image_url="/images/bouquet_white_roses.jpg"
            ),
            Product(
                name="Букет 'Страсть'",
                description="31 красная роза премиум класса",
                price=25000.0,
                category=ProductCategory.BOUQUET,
                preparation_time=30,
                image_url="/images/bouquet_red_roses.jpg"
            ),
            Product(
                name="Букет 'Весенний'",
                description="Тюльпаны, нарциссы и мимоза",
                price=12000.0,
                category=ProductCategory.BOUQUET,
                preparation_time=40,
                image_url="/images/bouquet_spring.jpg"
            ),
            Product(
                name="Букет 'Полевой'",
                description="Ромашки, васильки и колоски",
                price=8000.0,
                category=ProductCategory.BOUQUET,
                preparation_time=35,
                image_url="/images/bouquet_field.jpg"
            ),
            Product(
                name="Букет 'Экзотика'",
                description="Орхидеи, антуриум и стрелиция",
                price=35000.0,
                category=ProductCategory.BOUQUET,
                preparation_time=60,
                image_url="/images/bouquet_exotic.jpg"
            ),
            Product(
                name="Композиция 'Офисная'",
                description="Композиция для офисного стола",
                price=15000.0,
                category=ProductCategory.COMPOSITION,
                preparation_time=90,
                image_url="/images/composition_office.jpg"
            ),
            Product(
                name="Композиция 'Свадебная'",
                description="Центральная композиция для свадьбы",
                price=45000.0,
                category=ProductCategory.COMPOSITION,
                preparation_time=120,
                image_url="/images/composition_wedding.jpg"
            ),
            Product(
                name="Композиция 'Корзина фруктов и цветов'",
                description="Фрукты с цветочным декором",
                price=28000.0,
                category=ProductCategory.COMPOSITION,
                preparation_time=80,
                image_url="/images/composition_fruit.jpg"
            ),
            Product(
                name="Орхидея Фаленопсис",
                description="Белая орхидея в керамическом горшке",
                price=20000.0,
                category=ProductCategory.POTTED,
                preparation_time=15,
                image_url="/images/potted_orchid.jpg"
            ),
            Product(
                name="Спатифиллум",
                description="Женское счастье в декоративном кашпо",
                price=8500.0,
                category=ProductCategory.POTTED,
                preparation_time=10,
                image_url="/images/potted_spathiphyllum.jpg"
            ),
            Product(
                name="Фикус Бенджамина",
                description="Большой фикус для офиса",
                price=15000.0,
                category=ProductCategory.POTTED,
                preparation_time=20,
                image_url="/images/potted_ficus.jpg"
            )
        ]

        for product in products:
            session.add(product)
        session.commit()
        print(f"✅ Создано {len(products)} продуктов")

        # 3. Создаем инвентарь
        inventory_items = [
            Inventory(name="Розы красные", quantity=50, unit="шт", min_quantity=10, supplier="Голландия"),
            Inventory(name="Розы белые", quantity=30, unit="шт", min_quantity=10, supplier="Голландия"),
            Inventory(name="Тюльпаны желтые", quantity=25, unit="шт", min_quantity=5, supplier="Местный"),
            Inventory(name="Эвкалипт", quantity=15, unit="веток", min_quantity=5, supplier="Местный"),
            Inventory(name="Упаковочная бумага", quantity=100, unit="листов", min_quantity=20, supplier="Канцтовары+"),
            Inventory(name="Ленты атласные", quantity=200, unit="метров", min_quantity=50, supplier="Текстиль КЗ"),
            Inventory(name="Флористическая губка", quantity=80, unit="шт", min_quantity=20, supplier="Флора-Снаб"),
            Inventory(name="Горшки керамические", quantity=15, unit="шт", min_quantity=5, supplier="Керамика+"),
            Inventory(name="Орхидеи", quantity=8, unit="шт", min_quantity=2, supplier="Тропики КЗ"),
            Inventory(name="Декор (бусины)", quantity=500, unit="шт", min_quantity=100, supplier="Рукоделие")
        ]

        for item in inventory_items:
            session.add(item)
        session.commit()
        print(f"✅ Создано {len(inventory_items)} позиций инвентаря")

        # 4. Создаем заказы
        # Получаем созданных клиентов и продукты
        db_clients = session.exec(select(Client)).all()
        db_products = session.exec(select(Product)).all()

        orders = []
        today = datetime.now()

        # Заказ 1 - Новый
        order1 = Order(
            client_id=db_clients[0].id,
            recipient_id=db_clients[0].id,
            delivery_date=today + timedelta(days=2),
            delivery_time_range="14:00-16:00",
            delivery_address="Алматы, ул. Абая 150",
            status=OrderStatus.NEW,
            total_price=33000.0,
            notes="Ко дню рождения, упаковать красиво",
            phone="+77017777777"
        )
        session.add(order1)
        session.commit()
        session.refresh(order1)

        # Позиции для заказа 1
        order1_items = [
            OrderItem(order_id=order1.id, product_id=db_products[1].id, quantity=1, price=18000.0),
            OrderItem(order_id=order1.id, product_id=db_products[4].id, quantity=1, price=8000.0),
            OrderItem(order_id=order1.id, product_id=db_products[10].id, quantity=1, price=8500.0)
        ]
        for item in order1_items:
            session.add(item)

        # Заказ 2 - В работе
        order2 = Order(
            client_id=db_clients[1].id,
            recipient_id=db_clients[2].id,
            delivery_date=today + timedelta(days=1),
            delivery_time_range="10:00-12:00",
            delivery_address="Астана, пр. Назарбаева 10",
            status=OrderStatus.IN_PROGRESS,
            total_price=45000.0,
            notes="Корпоративный заказ, нужен чек",
            phone="+77012345678"
        )
        session.add(order2)
        session.commit()
        session.refresh(order2)

        # Позиции для заказа 2
        order2_items = [
            OrderItem(order_id=order2.id, product_id=db_products[7].id, quantity=1, price=45000.0)
        ]
        for item in order2_items:
            session.add(item)

        # Заказ 3 - Готов
        order3 = Order(
            client_id=db_clients[3].id,
            recipient_id=db_clients[3].id,
            delivery_date=today,
            delivery_time_range="16:00-18:00",
            delivery_address="Алматы, ул. Тимирязева 42",
            status=OrderStatus.READY,
            total_price=25000.0,
            notes="Самовывоз",
            phone="+77075555555"
        )
        session.add(order3)
        session.commit()
        session.refresh(order3)

        # Позиции для заказа 3
        order3_items = [
            OrderItem(order_id=order3.id, product_id=db_products[2].id, quantity=1, price=25000.0)
        ]
        for item in order3_items:
            session.add(item)

        # Заказ 4 - Доставлен
        order4 = Order(
            client_id=db_clients[4].id,
            recipient_id=db_clients[4].id,
            delivery_date=today - timedelta(days=1),
            delivery_time_range="12:00-14:00",
            delivery_address="Шымкент, ул. Абылай-хана 25",
            status=OrderStatus.DELIVERED,
            total_price=43000.0,
            notes="Заказ выполнен успешно",
            phone="+77777777777"
        )
        session.add(order4)
        session.commit()
        session.refresh(order4)

        # Позиции для заказа 4
        order4_items = [
            OrderItem(order_id=order4.id, product_id=db_products[5].id, quantity=1, price=35000.0),
            OrderItem(order_id=order4.id, product_id=db_products[3].id, quantity=1, price=12000.0)
        ]
        for item in order4_items:
            session.add(item)

        session.commit()
        orders = [order1, order2, order3, order4]
        print(f"✅ Создано {len(orders)} заказов с позициями")

        # 5. Создаем историю заказов
        history_entries = [
            OrderHistory(
                order_id=order1.id,
                status=OrderStatus.NEW,
                changed_by="Система",
                notes="Заказ создан"
            ),
            OrderHistory(
                order_id=order2.id,
                status=OrderStatus.NEW,
                changed_by="Система",
                notes="Заказ создан"
            ),
            OrderHistory(
                order_id=order2.id,
                status=OrderStatus.IN_PROGRESS,
                changed_by="Флорист Мария",
                notes="Начата работа над заказом"
            ),
            OrderHistory(
                order_id=order3.id,
                status=OrderStatus.NEW,
                changed_by="Система",
                notes="Заказ создан"
            ),
            OrderHistory(
                order_id=order3.id,
                status=OrderStatus.IN_PROGRESS,
                changed_by="Флорист Анна",
                notes="Букет в работе"
            ),
            OrderHistory(
                order_id=order3.id,
                status=OrderStatus.READY,
                changed_by="Флорист Анна",
                notes="Букет готов к выдаче"
            ),
            OrderHistory(
                order_id=order4.id,
                status=OrderStatus.DELIVERED,
                changed_by="Курьер Олег",
                notes="Заказ доставлен получателю"
            )
        ]

        for entry in history_entries:
            session.add(entry)
        session.commit()
        print(f"✅ Создано {len(history_entries)} записей истории")

        print(f"\n🎉 Seed данные успешно созданы!")
        print(f"   📦 Клиенты: {len(clients)}")
        print(f"   🌸 Продукты: {len(products)}")
        print(f"   📊 Инвентарь: {len(inventory_items)}")
        print(f"   📋 Заказы: {len(orders)}")
        print(f"   📝 История: {len(history_entries)}")


if __name__ == "__main__":
    create_seed_data()