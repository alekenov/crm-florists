# CRM for Florists Backend - Архитектура и правила

## Структура проекта

```
backend/
├── app/                       # Основное приложение
│   ├── __init__.py           # Версия приложения
│   ├── main.py               # Точка входа FastAPI
│   ├── auth.py               # Заглушка авторизации (временно)
│   │
│   ├── db/                   # База данных
│   │   ├── __init__.py
│   │   └── session.py        # Engine, сессии, инициализация БД
│   │
│   ├── models/               # SQLModel таблицы (table=True)
│   │   ├── __init__.py       # Экспорт всех моделей
│   │   ├── enums.py          # Enum на английском (для БД)
│   │   ├── user.py           # Модель пользователя
│   │   ├── client.py         # Модель клиента
│   │   ├── product.py        # Модель продукта и связь с инвентарем
│   │   ├── inventory.py      # Модель складского учета
│   │   └── order.py          # Модели заказа, позиций, истории
│   │
│   ├── schemas/              # Pydantic схемы для API
│   │   ├── __init__.py       # Экспорт всех схем
│   │   ├── common.py         # Общие схемы (пагинация, ответы)
│   │   ├── client.py         # ClientCreate, ClientRead, ClientUpdate
│   │   ├── product.py        # ProductCreate, ProductRead, ProductUpdate
│   │   ├── inventory.py      # InventoryCreate, InventoryRead, InventoryUpdate
│   │   └── order.py          # OrderCreate, OrderRead, OrderUpdate, OrderReadWithItems
│   │
│   └── api/
│       └── v1/               # API версии 1
│           ├── __init__.py   # Агрегация всех роутеров
│           ├── clients.py    # CRUD для клиентов
│           ├── products.py   # CRUD для продуктов
│           ├── inventory.py  # CRUD для склада
│           ├── orders.py     # CRUD для заказов + статусы
│           └── stats.py      # Статистика и дашборды
│
├── old/                      # Архив старых файлов (удалить позже)
├── crm.db                   # SQLite база данных
└── CLAUDE.md                # Этот файл

```

## Ключевые принципы SQLModel

### 1. Разделение моделей и схем
- **models/** - только SQLModel с `table=True` для базы данных
- **schemas/** - Pydantic модели для валидации API (Create/Read/Update паттерн)
- Никогда не смешивать таблицы и схемы валидации

### 2. Enum стратегия
- В БД хранятся английские значения (NEW, IN_PROGRESS, DELIVERED)
- В схемах используются русские строки ("новый", "в работе", "доставлен")
- Маппинг происходит на уровне роутеров

### 3. Паттерн Create/Read/Update
```python
# Базовая модель с общими полями
class ProductBase(SQLModel):
    name: str
    price: float

# Для создания - обязательные поля
class ProductCreate(ProductBase):
    category: str  # с валидацией

# Для чтения - добавляем id и timestamps
class ProductRead(ProductBase):
    id: int
    created_at: datetime

# Для обновления - все поля Optional
class ProductUpdate(SQLModel):
    name: Optional[str] = None
    price: Optional[float] = None
```

### 4. Сессии через Depends
```python
from app.db import get_session

@router.get("/items")
async def get_items(session: Session = Depends(get_session)):
    # Автоматическое управление сессией
    return session.exec(select(Item)).all()
```

### 5. Relationships и eager loading
```python
# Модель с relationship
class Order(SQLModel, table=True):
    client: Optional[Client] = Relationship(back_populates="orders")

# Загрузка с selectinload для N+1 проблемы
from sqlalchemy.orm import selectinload
query = select(Order).options(selectinload(Order.client))
```

## API структура

### Endpoints
- `/api/clients/` - управление клиентами (заказчики/получатели)
- `/api/products/` - каталог продуктов
- `/api/inventory/` - складской учет
- `/api/orders/` - управление заказами
- `/api/stats/` - статистика и аналитика

### Стандартные операции
- `GET /` - список с пагинацией (?skip=0&limit=100)
- `GET /{id}` - получить по ID
- `POST /` - создать новый
- `PUT /{id}` - полное обновление
- `PATCH /{id}` - частичное обновление
- `DELETE /{id}` - удалить

### Специальные endpoints
- `PUT /orders/{id}/status` - обновить статус заказа
- `GET /clients/{id}/orders` - заказы клиента
- `GET /stats/dashboard` - статистика для дашборда
- `GET /stats/sales` - аналитика продаж

## Правила разработки

### DO ✅
- Используй SQLModel для моделей БД
- Создавай отдельные схемы для Create/Read/Update
- Валидация в схемах, не в роутерах
- Английские enum в БД, русские в API
- Thin routes - минимум логики в эндпоинтах
- Используй Depends для инъекции зависимостей
- Транзакции через session.commit()

### DON'T ❌
- Не смешивай модели БД и схемы валидации
- Не используй dict для PATCH - только схемы Update
- Не делай валидацию в роутерах - только в схемах
- Не используй русские строки в enum БД
- Не забывай про eager loading для relationships
- Не дублируй код - используй наследование схем

## Команды разработки

```bash
# Запуск backend
cd backend
python3 -m uvicorn app.main:app --port 8011 --reload

# Или через FastAPI CLI
python3 -m fastapi dev app/main.py --port 8011

# Создание миграций (будущее)
alembic init migrations
alembic revision --autogenerate -m "Description"
alembic upgrade head
```

## Тестирование API

```bash
# Список клиентов
curl http://localhost:8011/api/clients/

# Создать клиента
curl -X POST http://localhost:8011/api/clients/ \
  -H "Content-Type: application/json" \
  -d '{"name": "Иван", "phone": "+77001234567", "client_type": "заказчик"}'

# Обновить статус заказа
curl -X PUT http://localhost:8011/api/orders/1/status \
  -H "Content-Type: application/json" \
  -d '{"new_status": "в работе"}'
```

## База данных

- **Текущая БД**: SQLite (`crm.db`)
- **Продакшн план**: PostgreSQL через Supabase
- **Миграции**: Alembic (не настроено)

## Авторизация

Временно используется заглушка в `app/auth.py`:
- Возвращает фиктивного админа
- TODO: Интегрировать JWT авторизацию

## Известные проблемы

1. **Enum mapping** - нужна доработка конвертации между английскими enum и русскими строками
2. **CORS** - сейчас разрешено всё (*), нужно ограничить для продакшна
3. **Авторизация** - заглушка, нужна реальная JWT авторизация
4. **Миграции** - нужно настроить Alembic для версионирования БД

## Связь с frontend

Frontend ожидает API на `http://localhost:8011` со следующей структурой:
- Все списки с пагинацией через `?skip=0&limit=100`
- Статусы на русском языке в ответах
- Вложенные объекты в деталях заказа (client, recipient, order_items с products)
- ISO даты в ответах