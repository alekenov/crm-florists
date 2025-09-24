# API Contract - CRM for Florists

## OpenAPI Specification
- **Version**: 3.1.0
- **API Title**: CRM for Florists API
- **API Description**: API для системы управления цветочным бизнесом
- **API Version**: 2.0.0

## Server
- **Development**: `http://localhost:8011`
- **Description**: Development server

## API Endpoints

### 🗂️ Clients (Клиенты)

#### `GET /api/clients/`
Получить список клиентов с фильтрацией

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| skip | integer | No | 0 | Пропустить N записей |
| limit | integer | No | 100 | Лимит записей (max: 1000) |
| search | string | No | - | Поиск по имени/телефону |
| client_type | string | No | - | Фильтр по типу клиента |

**Responses:**
- `200` - Successful Response (Array of Client)
- `422` - Validation Error

---

#### `POST /api/clients/`
Создать нового клиента

**Request Body:** Client object (application/json)

**Responses:**
- `200` - Successful Response (Client)
- `422` - Validation Error

---

#### `GET /api/clients/{client_id}`
Получить клиента по ID

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| client_id | integer | Yes | ID клиента |

**Responses:**
- `200` - Successful Response (Client)
- `422` - Validation Error

---

#### `PUT /api/clients/{client_id}`
Обновить клиента

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| client_id | integer | Yes | ID клиента |

**Request Body:** Client object (application/json)

**Responses:**
- `200` - Successful Response (Client)
- `422` - Validation Error

---

#### `DELETE /api/clients/{client_id}`
Удалить клиента

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| client_id | integer | Yes | ID клиента |

**Responses:**
- `200` - Successful Response
- `422` - Validation Error

---

#### `GET /api/clients/{client_id}/orders`
Получить заказы клиента

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| client_id | integer | Yes | ID клиента |

**Responses:**
- `200` - Successful Response (Array of Order)
- `422` - Validation Error

---

### 📦 Products (Продукты)

#### `GET /api/products/`
Получить список продуктов

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| skip | integer | No | 0 | Пропустить N записей |
| limit | integer | No | 100 | Лимит записей (max: 1000) |
| category | string | No | - | Фильтр по категории |
| min_price | number | No | - | Минимальная цена |
| max_price | number | No | - | Максимальная цена |
| search | string | No | - | Поиск по названию |

**Responses:**
- `200` - Successful Response (Array of Product)
- `422` - Validation Error

---

#### `POST /api/products/`
Создать новый продукт

**Request Body:** Product object (application/json)

**Responses:**
- `200` - Successful Response (Product)
- `422` - Validation Error

---

#### `GET /api/products/{product_id}`
Получить продукт по ID

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| product_id | integer | Yes | ID продукта |

**Responses:**
- `200` - Successful Response (Product)
- `422` - Validation Error

---

#### `PUT /api/products/{product_id}`
Обновить продукт

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| product_id | integer | Yes | ID продукта |

**Request Body:** Product object (application/json)

**Responses:**
- `200` - Successful Response (Product)
- `422` - Validation Error

---

#### `DELETE /api/products/{product_id}`
Удалить продукт

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| product_id | integer | Yes | ID продукта |

**Responses:**
- `200` - Successful Response
- `422` - Validation Error

---

### 📋 Inventory (Инвентарь)

#### `GET /api/inventory/`
Получить список складских позиций

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| skip | integer | No | 0 | Пропустить N записей |
| limit | integer | No | 100 | Лимит записей (max: 1000) |
| low_stock | boolean | No | - | Только с низким остатком |
| search | string | No | - | Поиск по названию |

**Responses:**
- `200` - Successful Response (Array of Inventory)
- `422` - Validation Error

---

#### `POST /api/inventory/`
Создать новую складскую позицию

**Request Body:** Inventory object (application/json)

**Responses:**
- `200` - Successful Response (Inventory)
- `422` - Validation Error

---

#### `GET /api/inventory/{inventory_id}`
Получить складскую позицию по ID

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| inventory_id | integer | Yes | ID позиции |

**Responses:**
- `200` - Successful Response (Inventory)
- `422` - Validation Error

---

#### `PUT /api/inventory/{inventory_id}`
Обновить складскую позицию

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| inventory_id | integer | Yes | ID позиции |

**Request Body:** Inventory object (application/json)

**Responses:**
- `200` - Successful Response (Inventory)
- `422` - Validation Error

---

#### `DELETE /api/inventory/{inventory_id}`
Удалить складскую позицию

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| inventory_id | integer | Yes | ID позиции |

**Responses:**
- `200` - Successful Response
- `422` - Validation Error

---

### 🛒 Orders (Заказы)

#### `GET /api/orders/`
Получить список заказов

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| skip | integer | No | 0 | Пропустить N записей |
| limit | integer | No | 100 | Лимит записей (max: 1000) |
| status | string | No | - | Фильтр по статусу |
| client_id | integer | No | - | Фильтр по клиенту |
| date_from | date | No | - | Начальная дата |
| date_to | date | No | - | Конечная дата |

**Responses:**
- `200` - Successful Response (Array of Order)
- `422` - Validation Error

---

#### `POST /api/orders/`
Создать новый заказ

**Request Body:** Order object (application/json)

**Responses:**
- `200` - Successful Response (Order)
- `422` - Validation Error

---

#### `GET /api/orders/{order_id}`
Получить заказ по ID с полной информацией

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_id | integer | Yes | ID заказа |

**Responses:**
- `200` - Successful Response (Order)
- `422` - Validation Error

---

#### `PUT /api/orders/{order_id}`
Обновить заказ

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_id | integer | Yes | ID заказа |

**Request Body:** Order object (application/json)

**Responses:**
- `200` - Successful Response (Order)
- `422` - Validation Error

---

#### `PATCH /api/orders/{order_id}`
Частично обновить заказ

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_id | integer | Yes | ID заказа |

**Request Body:** Partial Order object (application/json)

**Responses:**
- `200` - Successful Response (Order)
- `422` - Validation Error

---

#### `DELETE /api/orders/{order_id}`
Удалить заказ

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_id | integer | Yes | ID заказа |

**Responses:**
- `200` - Successful Response
- `422` - Validation Error

---

#### `PUT /api/orders/{order_id}/status`
Обновить статус заказа

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_id | integer | Yes | ID заказа |

**Request Body:** StatusUpdateRequest object (application/json)

**Responses:**
- `200` - Successful Response (Order)
- `422` - Validation Error

---

#### `POST /api/orders/{order_id}/items`
Добавить позицию в заказ

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_id | integer | Yes | ID заказа |

**Request Body:** OrderItem object (application/json)

**Responses:**
- `200` - Successful Response (Order)
- `422` - Validation Error

---

#### `DELETE /api/orders/{order_id}/items/{item_id}`
Удалить позицию из заказа

**Path Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| order_id | integer | Yes | ID заказа |
| item_id | integer | Yes | ID позиции |

**Responses:**
- `200` - Successful Response (Order)
- `422` - Validation Error

---

### 📊 Statistics (Статистика)

#### `GET /api/stats/dashboard`
Получить статистику для дашборда

**Responses:**
- `200` - Successful Response (Dashboard statistics)
- `422` - Validation Error

---

#### `GET /api/stats/sales`
Получить статистику продаж

**Query Parameters:**
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| date_from | date | No | - | Начальная дата |
| date_to | date | No | - | Конечная дата |

**Responses:**
- `200` - Successful Response (Sales statistics)
- `422` - Validation Error

---

### 🔧 System Endpoints

#### `GET /`
Root endpoint

**Responses:**
- `200` - Successful Response (API info)
- `422` - Validation Error

---

#### `GET /health`
Health check

**Responses:**
- `200` - Successful Response (Health status)
- `422` - Validation Error

---

## 💰 Валюта
Все цены в системе указаны в **Казахстанских тенге (KZT/₸)**
- Формат: целые числа без дробной части
- Пример: 15000 = 15,000 ₸

## 👥 Роли пользователей и команда заказа

### User (Пользователь системы)
```typescript
{
  id?: integer
  name: string
  phone: string
  role: "admin" | "manager" | "florist" | "courier"
  email?: string
  created_at: datetime
}
```

### Роли в системе:
- **Admin** - Полный доступ, управление пользователями
- **Manager** - Прием заказов, назначение исполнителей
- **Florist** - Сборка букетов и композиций
- **Courier** - Доставка заказов

### Команда заказа:
Каждый заказ может иметь:
- 1 менеджера (manager_id)
- 1-3 флористов (florist_ids[])
- 1 курьера (courier_id)

### API для управления командой:
- `PUT /api/orders/{id}/manager` - Назначить менеджера
- `PUT /api/orders/{id}/florists` - Назначить флористов
- `PUT /api/orders/{id}/courier` - Назначить курьера
- `GET /api/orders/{id}/team` - Получить всю команду

## 🔗 Связь Продуктов и Склада

### ProductComposition (Состав продукта)
```typescript
{
  id?: integer
  product_id: integer // ID продукта
  inventory_id: integer // ID складской позиции
  quantity: number // Количество для 1 продукта
}
```

**Пример**: Букет "Нежность" состоит из:
- 15 шт роз белых (inventory_id: 1)
- 5 шт эустомы (inventory_id: 2)
- 1 шт упаковка (inventory_id: 3)

### Дополнительные эндпоинты для состава:
- `GET /api/products/{id}/composition` - Получить состав продукта
- `POST /api/products/{id}/composition` - Добавить компонент
- `DELETE /api/products/{id}/composition/{composition_id}` - Удалить компонент

## Data Models

### Client (Клиент)
```typescript
{
  id?: integer
  name?: string
  phone: string // Required
  email?: string
  address?: string
  client_type: "заказчик" | "получатель" | "оба" // Default: "оба"
  notes?: string
  created_at: datetime
}
```

### Product (Продукт)
```typescript
{
  id?: integer
  name: string // Required
  description?: string
  price: number // Required
  category: "букет" | "композиция" | "горшечный" // Required
  preparation_time?: integer // В минутах
  image_url?: string
  created_at: datetime

  // Расширенные поля (добавлены в v2.1.0, протестированы)
  is_available?: boolean // Default: true - Доступность товара
  product_type?: string // Default: "catalog" - Тип товара ("catalog" | "custom")
  images?: string // JSON массив URL дополнительных изображений
  production_time?: string // Время производства (например: "2-3 часа")
  width?: string // Ширина букета в см (например: "35")
  height?: string // Высота букета в см (например: "45")
  colors?: string // JSON массив цветов (например: ["red", "white", "pink"])
  catalog_width?: string // Ширина в каталоге
  catalog_height?: string // Высота в каталоге
  ingredients?: string // JSON массив состава (например: ["розы", "лилии", "зелень"])
}
```

#### Примеры запросов Product API

**GET /api/products/1** - Получить товар:
```json
{
  "name": "Букет роз 'Классик'",
  "product_type": "catalog",
  "catalog_height": null,
  "description": "Букет из 11 красных роз с зеленью",
  "images": "[]",
  "ingredients": null,
  "price": 15000.0,
  "production_time": "",
  "category": "букет",
  "width": "35",
  "preparation_time": 30,
  "height": "45",
  "image_url": "https://example.com/roses.jpg",
  "colors": "[\"red\",\"white\"]",
  "id": 1,
  "created_at": "2025-09-23T13:20:13.745515",
  "catalog_width": null,
  "is_available": true
}
```

**POST /api/products** - Создать товар с новыми полями:
```json
{
  "name": "Букет Премиум",
  "description": "Роскошный букет из элитных цветов",
  "price": 25000,
  "category": "букет",
  "preparation_time": 60,
  "image_url": "https://example.com/premium.jpg",
  "is_available": true,
  "product_type": "custom",
  "production_time": "3-4 часа",
  "width": "45",
  "height": "55",
  "colors": "[\"красный\", \"белый\", \"розовый\"]",
  "catalog_width": "40",
  "catalog_height": "50",
  "ingredients": "[\"розы\", \"лилии\", \"орхидеи\", \"зелень\"]",
  "images": "[\"https://example.com/img1.jpg\", \"https://example.com/img2.jpg\"]"
}
```

**PUT /api/products/{id}** - Обновить товар (частичное обновление):
```json
{
  "price": 35000,
  "is_available": false,
  "width": "50",
  "height": "60",
  "colors": "[\"золотой\", \"белый\", \"красный\", \"черный\"]"
}

### Inventory (Инвентарь)
```typescript
{
  id?: integer
  name: string // Required
  quantity: number // Required
  unit: string // Required
  min_quantity?: number
  price_per_unit?: number
  created_at: datetime
}
```

### Order (Заказ)
```typescript
{
  id?: integer
  client_id: integer // Required - ID заказчика
  recipient_id: integer // Required - ID получателя
  manager_id?: integer // ID менеджера, принявшего заказ
  florist_ids?: integer[] // IDs флористов, собирающих заказ
  courier_id?: integer // ID курьера для доставки
  executor_id?: integer // ID основного исполнителя (deprecated, используйте роли выше)
  status: "новый" | "в работе" | "готов" | "доставлен" | "оплачен" | "собран" | "отменен" // Default: "новый"
  delivery_date: datetime // Required
  delivery_address: string // Required
  delivery_time_range?: string // Например: "14:00-16:00"
  total_price?: number
  comment?: string
  created_at: datetime
  items: OrderItem[] // Состав заказа из товаров
}
```

### OrderItem (Позиция заказа)
```typescript
{
  id?: integer
  order_id: integer // Required
  product_id: integer // Required
  quantity: integer // Default: 1
  price: number // Required
}
```

### StatusUpdateRequest
```typescript
{
  new_status: string // Required
  comment?: string
}
```

## Error Handling

### ValidationError
```typescript
{
  detail: [
    {
      loc: [string | integer] // Путь к полю с ошибкой
      msg: string // Сообщение об ошибке
      type: string // Тип ошибки
    }
  ]
}
```

### HTTP Status Codes
- **200** - OK: Запрос выполнен успешно
- **201** - Created: Ресурс создан
- **204** - No Content: Успешное удаление
- **400** - Bad Request: Неверный формат запроса
- **404** - Not Found: Ресурс не найден
- **422** - Unprocessable Entity: Ошибка валидации
- **500** - Internal Server Error: Внутренняя ошибка сервера

## Notes

### Типы клиентов (ClientType)
- `заказчик` - Тот, кто делает заказ
- `получатель` - Тот, кто получает заказ
- `оба` - Может быть и заказчиком, и получателем

### Категории продуктов (ProductCategory)
- `букет` - Цветочный букет
- `композиция` - Цветочная композиция
- `горшечный` - Горшечное растение

### Статусы заказов (OrderStatus)
- `новый` - Новый заказ
- `в работе` - Заказ в обработке
- `готов` - Заказ готов к доставке
- `доставлен` - Заказ доставлен
- `оплачен` - Заказ оплачен
- `собран` - Заказ собран
- `отменен` - Заказ отменен

## Authentication
В текущей версии API аутентификация не реализована. Планируется добавление JWT токенов в будущих версиях.

## Важные замечания по интеграции (v2.1.0)

### Особенности работы с расширенными полями Product
1. **Сериализация JSON полей**: Поля `colors`, `images`, `ingredients` хранятся как JSON-строки
   - При отправке: Передавайте как JSON-строки (например: `"[\"red\", \"white\"]"`)
   - При получении: Парсите JSON для использования в UI

2. **Параметры FastAPI**: Используется `response_model_exclude_none=False` для возврата всех полей

3. **Редактирование через UI**:
   - Цвета выбираются кнопками (red, white, pink, etc.)
   - Размеры указываются числом в см
   - Состав сохраняется в поле ingredients

4. **Протестированные сценарии**:
   - ✅ Создание продукта со всеми новыми полями
   - ✅ Обновление через UI с сохранением в БД
   - ✅ Отображение характеристик на странице товара
   - ✅ CRUD операции через curl

### Changelog v2.1.0 (2025-09-24)
- Добавлены расширенные поля в модель Product
- Обновлены адаптеры frontend для работы с новыми полями
- Протестирована полная интеграция UI с backend
