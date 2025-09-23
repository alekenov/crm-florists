# API Routes Documentation - CRM для флористов

## Базовый URL
- **Development**: `http://localhost:8011`
- **Production**: TBD

## Структура URL роутов

### Паттерн URL
```
http://localhost:8011/api/{resource}/{id?}/{sub-resource?}
```

## API Endpoints

### 1. Клиенты (Clients)

#### GET /api/clients/
- **Описание**: Получить список всех клиентов
- **Параметры запроса**:
  - `skip` (int, default=0): Пропустить N записей
  - `limit` (int, default=100, max=1000): Лимит записей
  - `search` (string): Поиск по имени/телефону
  - `client_type` (string): Фильтр по типу клиента
- **Ответ**: Массив объектов Client

#### POST /api/clients/
- **Описание**: Создать нового клиента
- **Тело запроса**: Client объект
- **Ответ**: Созданный Client

#### GET /api/clients/{client_id}
- **Описание**: Получить клиента по ID
- **Параметры пути**: `client_id` (int)
- **Ответ**: Client объект

#### PUT /api/clients/{client_id}
- **Описание**: Обновить данные клиента
- **Параметры пути**: `client_id` (int)
- **Тело запроса**: Client объект
- **Ответ**: Обновленный Client

#### DELETE /api/clients/{client_id}
- **Описание**: Удалить клиента
- **Параметры пути**: `client_id` (int)
- **Ответ**: Подтверждение удаления

#### GET /api/clients/{client_id}/orders
- **Описание**: Получить все заказы клиента
- **Параметры пути**: `client_id` (int)
- **Ответ**: Массив объектов Order

### 2. Продукты (Products)

#### GET /api/products/
- **Описание**: Получить список продуктов
- **Параметры запроса**:
  - `skip` (int): Пропустить N записей
  - `limit` (int): Лимит записей
  - `category` (string): Фильтр по категории
  - `available` (bool): Только доступные товары
- **Ответ**: Массив объектов Product

#### POST /api/products/
- **Описание**: Создать новый продукт
- **Тело запроса**: Product объект
- **Ответ**: Созданный Product

#### GET /api/products/{product_id}
- **Описание**: Получить продукт по ID
- **Параметры пути**: `product_id` (int)
- **Ответ**: Product объект

#### PUT /api/products/{product_id}
- **Описание**: Обновить продукт
- **Параметры пути**: `product_id` (int)
- **Тело запроса**: Product объект
- **Ответ**: Обновленный Product

#### DELETE /api/products/{product_id}
- **Описание**: Удалить продукт
- **Параметры пути**: `product_id` (int)
- **Ответ**: Подтверждение удаления

### 3. Инвентарь (Inventory)

#### GET /api/inventory/
- **Описание**: Получить список инвентаря
- **Параметры запроса**:
  - `skip` (int): Пропустить N записей
  - `limit` (int): Лимит записей
  - `category` (string): Фильтр по категории
  - `in_stock` (bool): Только в наличии
- **Ответ**: Массив объектов Inventory

#### POST /api/inventory/
- **Описание**: Добавить элемент инвентаря
- **Тело запроса**: Inventory объект
- **Ответ**: Созданный Inventory

#### GET /api/inventory/{inventory_id}
- **Описание**: Получить элемент инвентаря по ID
- **Параметры пути**: `inventory_id` (int)
- **Ответ**: Inventory объект

#### PUT /api/inventory/{inventory_id}
- **Описание**: Обновить элемент инвентаря
- **Параметры пути**: `inventory_id` (int)
- **Тело запроса**: Inventory объект
- **Ответ**: Обновленный Inventory

#### DELETE /api/inventory/{inventory_id}
- **Описание**: Удалить элемент инвентаря
- **Параметры пути**: `inventory_id` (int)
- **Ответ**: Подтверждение удаления

### 4. Заказы (Orders)

#### GET /api/orders/
- **Описание**: Получить список заказов
- **Параметры запроса**:
  - `skip` (int): Пропустить N записей
  - `limit` (int): Лимит записей
  - `status` (string): Фильтр по статусу
  - `client_id` (int): Фильтр по клиенту
  - `date_from` (date): Начальная дата
  - `date_to` (date): Конечная дата
- **Ответ**: Массив объектов Order

#### POST /api/orders/
- **Описание**: Создать новый заказ
- **Тело запроса**: Order объект
- **Важные поля**:
  - `delivery_date`: Дата доставки (формат: YYYY-MM-DD или DD.MM.YYYY)
  - `delivery_time_range`: Временной диапазон доставки (например: "10:00-12:00")
  - `items`: Массив позиций заказа
- **Ответ**: Созданный Order

#### GET /api/orders/{order_id}
- **Описание**: Получить заказ по ID
- **Параметры пути**: `order_id` (int)
- **Ответ**: Order объект с полной информацией

#### PUT /api/orders/{order_id}
- **Описание**: Полностью обновить заказ
- **Параметры пути**: `order_id` (int)
- **Тело запроса**: Полный Order объект
- **Ответ**: Обновленный Order

#### PATCH /api/orders/{order_id}
- **Описание**: Частично обновить заказ
- **Параметры пути**: `order_id` (int)
- **Тело запроса**: Частичный Order объект (только изменяемые поля)
- **Ответ**: Обновленный Order

#### DELETE /api/orders/{order_id}
- **Описание**: Удалить заказ
- **Параметры пути**: `order_id` (int)
- **Ответ**: Подтверждение удаления

#### PUT /api/orders/{order_id}/status
- **Описание**: Обновить статус заказа
- **Параметры пути**: `order_id` (int)
- **Тело запроса**: StatusUpdateRequest
  ```json
  {
    "status": "delivered"
  }
  ```
- **Возможные статусы**:
  - `new` - Новый
  - `confirmed` - Подтвержден
  - `processing` - В обработке
  - `ready` - Готов
  - `delivering` - Доставляется
  - `delivered` - Доставлен
  - `cancelled` - Отменен
- **Ответ**: Обновленный Order

#### POST /api/orders/{order_id}/items
- **Описание**: Добавить позицию в заказ
- **Параметры пути**: `order_id` (int)
- **Тело запроса**: OrderItem объект
- **Ответ**: Обновленный Order

#### DELETE /api/orders/{order_id}/items/{item_id}
- **Описание**: Удалить позицию из заказа
- **Параметры пути**:
  - `order_id` (int)
  - `item_id` (int)
- **Ответ**: Обновленный Order

### 5. Статистика (Statistics)

#### GET /api/stats/dashboard
- **Описание**: Получить статистику для дашборда
- **Параметры запроса**:
  - `period` (string): Период (day, week, month, year)
- **Ответ**: DashboardStats объект
  ```json
  {
    "total_orders": 150,
    "total_revenue": 1500000,
    "new_customers": 25,
    "average_order_value": 10000,
    "orders_by_status": {
      "new": 10,
      "processing": 5,
      "delivered": 135
    }
  }
  ```

#### GET /api/stats/sales
- **Описание**: Получить статистику продаж
- **Параметры запроса**:
  - `date_from` (date): Начальная дата
  - `date_to` (date): Конечная дата
  - `group_by` (string): Группировка (day, week, month)
- **Ответ**: SalesStats объект

### 6. Служебные эндпоинты

#### GET /
- **Описание**: Корневой эндпоинт API
- **Ответ**: Информация об API
  ```json
  {
    "name": "CRM for Florists API",
    "version": "2.0.0",
    "description": "API для системы управления цветочным бизнесом"
  }
  ```

#### GET /health
- **Описание**: Проверка состояния API
- **Ответ**: Статус здоровья
  ```json
  {
    "status": "healthy",
    "database": "connected",
    "timestamp": "2025-09-23T12:00:00Z"
  }
  ```

## Обработка ошибок

### Коды ответов
- **200**: Успешный запрос
- **201**: Ресурс создан
- **204**: Успешное удаление
- **400**: Неверный запрос
- **404**: Ресурс не найден
- **422**: Ошибка валидации
- **500**: Внутренняя ошибка сервера

### Формат ошибки
```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

## Аутентификация
В текущей версии API аутентификация не реализована. Планируется добавить JWT токены в будущих версиях.

## Примеры использования

### Создание заказа с временным диапазоном доставки
```bash
curl -X POST "http://localhost:8011/api/orders/" \
  -H "Content-Type: application/json" \
  -d '{
    "client_id": 1,
    "delivery_date": "2025-09-25",
    "delivery_time_range": "14:00-16:00",
    "delivery_address": "ул. Абая, 150",
    "status": "new",
    "total_amount": 25000,
    "items": [
      {
        "product_id": 1,
        "quantity": 1,
        "price": 15000
      },
      {
        "product_id": 3,
        "quantity": 2,
        "price": 5000
      }
    ]
  }'
```

### Поиск клиентов
```bash
curl "http://localhost:8011/api/clients/?search=Алексей&client_type=regular"
```

### Получение статистики
```bash
curl "http://localhost:8011/api/stats/dashboard?period=month"
```

## Миграция с SQLAlchemy на SQLModel

С сентября 2025 года backend использует SQLModel вместо SQLAlchemy. Основные преимущества:
- Единая модель для БД и API (без дублирования Pydantic схем)
- На 59% меньше кода
- Лучшая поддержка типов
- Автоматическая валидация

Все эндпоинты остались обратно совместимыми.