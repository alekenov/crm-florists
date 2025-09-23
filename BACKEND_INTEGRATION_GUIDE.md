# Backend Integration Guide

## 📋 Checklist для интеграции Backend

### Требования к Backend
- [ ] FastAPI сервер на порту **8011**
- [ ] SQLModel для работы с БД
- [ ] CORS настроен для `http://localhost:3000`
- [ ] SQLite база данных
- [ ] Все эндпоинты из API контракта реализованы

### Структура Backend (ожидаемая)
```
backend/
├── main.py              # Точка входа FastAPI
├── models.py            # SQLModel модели
├── database.py          # Настройки БД
├── routers/
│   ├── clients.py       # /api/clients/*
│   ├── products.py      # /api/products/*
│   ├── inventory.py     # /api/inventory/*
│   ├── orders.py        # /api/orders/*
│   └── stats.py         # /api/stats/*
├── requirements.txt     # Зависимости Python
└── *.db                 # SQLite база данных
```

## 🚀 Команды запуска

### Вариант 1: Backend в папке `backend/` внутри проекта
```bash
cd backend
pip install -r requirements.txt
python -m fastapi dev main.py --port 8011
```

### Вариант 2: Backend в отдельной папке
```bash
cd ../backend-crm
pip install -r requirements.txt
python -m fastapi dev main.py --port 8011
```

## 🔧 Необходимые зависимости Python
```txt
fastapi==0.104.1
sqlmodel==0.0.14
uvicorn[standard]==0.24.0
python-multipart==0.0.6
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
python-dateutil==2.8.2
```

## ⚙️ Минимальная конфигурация CORS
```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## 💰 Валюта и региональные настройки

### Валюта
- **Основная валюта**: Казахстанский тенге (KZT/₸)
- **Формат цен**: Целые числа без копеек (15000 = 15,000 ₸)
- **Отображение**: В UI показывается с символом ₸ или "тг"
- **Примеры цен**:
  - Букет роз: 15,000 ₸
  - Композиция: 25,000 ₸
  - Доставка: 2,000 ₸

## 👥 Роли и команда заказа

### Структура команды для заказа
Каждый заказ может включать несколько исполнителей с разными ролями:

```python
class Order(SQLModel, table=True):
    # ... другие поля ...
    manager_id: int | None = Field(foreign_key="user.id")  # Менеджер
    courier_id: int | None = Field(foreign_key="user.id")  # Курьер
    # Связь с флористами через отдельную таблицу
    florists: list["User"] = Relationship(link_model="OrderFlorist")

class OrderFlorist(SQLModel, table=True):
    """Связь многие-ко-многим между заказами и флористами"""
    order_id: int = Field(foreign_key="order.id", primary_key=True)
    florist_id: int = Field(foreign_key="user.id", primary_key=True)

class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str
    phone: str
    role: str  # "manager" | "florist" | "courier" | "admin"
    email: str | None = None
```

### API для управления командой заказа

```bash
# Назначить менеджера
PUT /api/orders/{id}/manager
{ "manager_id": 5 }

# Назначить флористов
PUT /api/orders/{id}/florists
{ "florist_ids": [2, 3] }

# Назначить курьера
PUT /api/orders/{id}/courier
{ "courier_id": 7 }

# Получить команду заказа
GET /api/orders/{id}/team
```

### Workflow заказа с ролями

1. **Новый заказ** → Автоматически назначается дежурному менеджеру
2. **Менеджер** → Назначает флористов на сборку
3. **Флористы** → Собирают заказ, меняют статус на "собран"
4. **Менеджер** → Назначает курьера для доставки
5. **Курьер** → Доставляет и меняет статус на "доставлен"

## 🔗 Связь Продуктов и Склада

### Композиция продуктов
Продукты (Products) состоят из элементов склада (Inventory):

```
Product (Букет "Нежность")
├── Inventory: Розы белые (15 шт)
├── Inventory: Эустома (5 шт)
├── Inventory: Упаковка крафт (1 шт)
└── Inventory: Лента атласная (1 м)
```

### Модель ProductComposition (рекомендуемая)
```python
class ProductComposition(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    product_id: int = Field(foreign_key="product.id")
    inventory_id: int = Field(foreign_key="inventory.id")
    quantity: float  # Количество из склада для 1 продукта
```

### При создании заказа
1. Проверяется наличие всех компонентов на складе
2. При подтверждении - списывается со склада
3. При отмене - возвращается на склад

### API для состава продукта
```bash
# Получить состав продукта
GET /api/products/{id}/composition

# Добавить компонент в состав
POST /api/products/{id}/composition
{
  "inventory_id": 5,
  "quantity": 15
}

# Удалить компонент из состава
DELETE /api/products/{id}/composition/{composition_id}
```

## 📦 Frontend ожидает от Backend

### 1. Формат дат
- **Входящие**: Поддержка `YYYY-MM-DD` и `DD.MM.YYYY`
- **Исходящие**: ISO формат `YYYY-MM-DDTHH:MM:SS`

### 2. Обязательные поля в ответах

#### Order
```json
{
  "id": 1,
  "client_id": 1,
  "recipient_id": 2,
  "delivery_date": "2025-09-25T00:00:00",
  "delivery_time_range": "14:00-16:00",  // ВАЖНО!
  "delivery_address": "ул. Абая, 150",
  "status": "новый",
  "items": [...],
  "client": {...},      // Вложенный объект
  "recipient": {...}    // Вложенный объект
}
```

#### Client
```json
{
  "id": 1,
  "name": "Алексей",
  "phone": "+77771234567",
  "client_type": "оба",
  "address": "ул. Достык, 5"
}
```

### 3. Статусы заказов (OrderStatus)
Frontend использует эти значения:
- `новый`
- `в работе`
- `готов`
- `доставлен`
- `оплачен`
- `собран`
- `отменен`

### 4. Категории продуктов (ProductCategory)
- `букет`
- `композиция`
- `горшечный`

### 5. Типы клиентов (ClientType)
- `заказчик`
- `получатель`
- `оба`

## 🔄 API вызовы из Frontend

### Основные паттерны
```javascript
// Frontend использует эти базовые вызовы:
GET    /api/clients/
POST   /api/clients/
PUT    /api/clients/{id}
DELETE /api/clients/{id}

GET    /api/products/
POST   /api/products/
PUT    /api/products/{id}
DELETE /api/products/{id}

GET    /api/inventory/
POST   /api/inventory/
PUT    /api/inventory/{id}
DELETE /api/inventory/{id}

GET    /api/orders/
POST   /api/orders/
GET    /api/orders/{id}
PUT    /api/orders/{id}
PATCH  /api/orders/{id}
DELETE /api/orders/{id}
PUT    /api/orders/{id}/status

GET    /api/stats/dashboard
GET    /api/stats/sales
```

## ✅ Тестовые данные для проверки

### Создание тестового клиента
```bash
curl -X POST http://localhost:8011/api/clients/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Тестовый клиент",
    "phone": "+77771234567",
    "email": "test@example.com",
    "address": "ул. Абая, 1",
    "client_type": "оба"
  }'
```

### Создание тестового продукта
```bash
curl -X POST http://localhost:8011/api/products/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Розы красные",
    "description": "Букет из 25 роз",
    "price": 15000,
    "category": "букет"
  }'
```

### Создание тестового заказа
```bash
curl -X POST http://localhost:8011/api/orders/ \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": 1,
    "recipient_id": 1,
    "delivery_date": "2025-09-25",
    "delivery_time_range": "14:00-16:00",
    "delivery_address": "ул. Достык, 5",
    "status": "новый",
    "total_price": 25000
  }'
```

## 🐛 Частые проблемы и решения

### 1. CORS ошибки
**Проблема**: `Access-Control-Allow-Origin` ошибка
**Решение**: Убедитесь что CORS настроен для `http://localhost:3000`

### 2. Порт занят
**Проблема**: Port 8011 already in use
**Решение**:
```bash
lsof -i :8011
kill -9 <PID>
```

### 3. База данных не создается
**Проблема**: No such table
**Решение**: Убедитесь что SQLModel создает таблицы при старте:
```python
from sqlmodel import SQLModel, create_engine

engine = create_engine("sqlite:///database.db")
SQLModel.metadata.create_all(engine)
```

### 4. Даты не сохраняются
**Проблема**: delivery_date или delivery_time_range теряются
**Решение**: Проверьте что модель Order содержит эти поля и они правильно маппятся

## 📝 Логи для отладки

Frontend отправляет запросы на:
```
http://localhost:8011/api/*
```

Проверяйте консоль браузера (F12) и Network вкладку для отладки запросов.

## 🎯 Критические точки интеграции

1. **delivery_time_range** - ОБЯЗАТЕЛЬНОЕ поле для заказов
2. **client** и **recipient** - должны возвращаться как вложенные объекты в Order
3. **Русские enum значения** - используются как есть, не переводить
4. **Формат телефона** - принимать любой формат
5. **ID автоинкремент** - БД должна сама генерировать ID