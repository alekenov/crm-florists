# Frontend API Usage Reference

## 📍 Где Frontend вызывает API

### 1. **hooks/useApiClients.ts**
```typescript
// Получение списка клиентов
GET /api/clients/?search={query}

// Создание клиента
POST /api/clients/
Body: { name, phone, email, address, client_type }

// Обновление клиента
PUT /api/clients/{id}
Body: { name, phone, email, address, client_type }

// Удаление клиента
DELETE /api/clients/{id}
```

### 2. **hooks/useApiProducts.ts**
```typescript
// Получение продуктов
GET /api/products/?category={category}&search={query}

// Создание продукта
POST /api/products/
Body: { name, description, price, category, image_url }

// Обновление продукта
PUT /api/products/{id}
Body: { name, description, price, category, image_url }

// Удаление продукта
DELETE /api/products/{id}
```

### 3. **hooks/useApiInventory.ts**
```typescript
// Получение инвентаря
GET /api/inventory/?search={query}&low_stock={bool}

// Создание элемента
POST /api/inventory/
Body: { name, quantity, unit, min_quantity, price_per_unit }

// Обновление элемента
PUT /api/inventory/{id}
Body: { name, quantity, unit, min_quantity, price_per_unit }

// Удаление элемента
DELETE /api/inventory/{id}
```

### 4. **hooks/useApiOrders.ts**
```typescript
// Получение заказов
GET /api/orders/?status={status}&client_id={id}&date_from={date}&date_to={date}

// Получение одного заказа
GET /api/orders/{id}

// Создание заказа
POST /api/orders/
Body: {
  client_id,
  recipient_id,
  delivery_date,
  delivery_time_range,  // "14:00-16:00"
  delivery_address,
  status: "новый",
  items: [
    { product_id, quantity, price }
  ]
}

// Полное обновление заказа
PUT /api/orders/{id}
Body: { ...все поля заказа }

// Частичное обновление заказа
PATCH /api/orders/{id}
Body: { delivery_time_range: "10:00-12:00" }

// Обновление статуса
PUT /api/orders/{id}/status
Body: { new_status: "доставлен" }

// Удаление заказа
DELETE /api/orders/{id}
```

### 5. **hooks/useApiStats.ts**
```typescript
// Статистика дашборда
GET /api/stats/dashboard

// Статистика продаж
GET /api/stats/sales?date_from={date}&date_to={date}
```

## 🔄 Адаптеры данных

### **adapters/orderAdapter.ts**
Преобразует данные заказа между Frontend и Backend форматами:
- Конвертирует даты (ISO ↔ DD.MM.YYYY)
- Обрабатывает вложенные объекты (client, recipient)
- Форматирует delivery_time_range

### **adapters/clientAdapter.ts**
- Нормализует телефонные номера
- Обрабатывает client_type enum

### **adapters/productAdapter.ts**
- Обрабатывает category enum
- Форматирует цены

## 📊 Ожидаемые форматы ответов

### Успешный ответ списка
```json
[
  { "id": 1, "name": "..." },
  { "id": 2, "name": "..." }
]
```

### Успешный ответ объекта
```json
{
  "id": 1,
  "name": "...",
  "created_at": "2025-09-23T12:00:00"
}
```

### Ошибка валидации (422)
```json
{
  "detail": [
    {
      "loc": ["body", "phone"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Order с вложенными объектами
```json
{
  "id": 1,
  "client_id": 1,
  "client": {
    "id": 1,
    "name": "Иван",
    "phone": "+77771234567"
  },
  "recipient_id": 2,
  "recipient": {
    "id": 2,
    "name": "Мария",
    "phone": "+77779876543"
  },
  "delivery_time_range": "14:00-16:00",
  "items": [
    {
      "id": 1,
      "product_id": 1,
      "product": {
        "name": "Розы",
        "category": "букет"
      },
      "quantity": 1,
      "price": 15000
    }
  ]
}
```

## 🎨 UI компоненты и их API зависимости

| Компонент | API эндпоинты |
|-----------|--------------|
| OrderList | GET /api/orders/ |
| OrderDetail | GET /api/orders/{id}, PUT /api/orders/{id}/status |
| OrderForm | POST /api/orders/, GET /api/clients/, GET /api/products/ |
| ClientList | GET /api/clients/ |
| ClientForm | POST /api/clients/, PUT /api/clients/{id} |
| ProductCatalog | GET /api/products/ |
| ProductForm | POST /api/products/, PUT /api/products/{id} |
| InventoryList | GET /api/inventory/ |
| DashboardStats | GET /api/stats/dashboard |

## 🚨 Критические моменты

1. **delivery_time_range** - ВСЕГДА должно сохраняться и возвращаться
2. **Вложенные объекты** - Order должен включать client и recipient
3. **Enum на русском** - не переводить значения статусов/категорий
4. **Формат дат** - Backend должен принимать оба формата
5. **CORS** - обязательно для localhost:3000

## 📱 Мобильная версия

Frontend адаптивный и оптимизирован для мобильных устройств.
API должен быстро отвечать для хорошего UX на мобильных.