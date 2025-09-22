# Backend API Documentation для CRM Florists

Полная документация FastAPI backend для интеграции с React фронтендом.

## 🔗 Base URL
```
http://localhost:8011
```

## 📋 Содержание
- [Аутентификация](#аутентификация)
- [Orders API](#orders-api)
- [Clients API](#clients-api)
- [Products API](#products-api)
- [Inventory API](#inventory-api)
- [Users API](#users-api)
- [Statistics API](#statistics-api)
- [Типы данных](#типы-данных)
- [Примеры кода](#примеры-кода)
- [Обработка ошибок](#обработка-ошибок)

---

## 🔐 Аутентификация

В текущей версии аутентификация не реализована. Все endpoints доступны без токенов.

**Заголовки запросов:**
```http
Content-Type: application/json
Accept: application/json
```

---

## 📦 Orders API

### GET /api/orders
Получить список всех заказов с фильтрацией

**Query Parameters:**
```
limit: number = 1000          # Лимит записей
skip: number = 0              # Пропустить записей
status: string                # Фильтр по статусу
client_id: number             # Фильтр по клиенту
executor_id: number           # Фильтр по флористу
date_from: string (YYYY-MM-DD) # Дата от
date_to: string (YYYY-MM-DD)   # Дата до
```

**Пример запроса:**
```bash
curl "http://localhost:8011/api/orders?limit=10&status=новый"
```

**Ответ 200:**
```json
{
  "orders": [
    {
      "id": 1,
      "client_id": 2,
      "recipient_id": 1,
      "executor_id": 5,
      "courier_id": 10,
      "status": "в работе",
      "delivery_date": "2024-03-17T18:45:00",
      "delivery_address": "ул. Абая 150/230, ТРЦ Dostyk Plaza, Алматы",
      "delivery_time_range": "10:00-18:00",
      "total_price": 36000.0,
      "comment": "Встретиться у главного входа",
      "notes": "Текст для открытки",
      "created_at": "2025-09-21T20:00:58.816065",
      "client": {
        "id": 2,
        "name": "Мария Сергеева",
        "phone": "+77771234562",
        "email": "maria@example.com",
        "address": "ул. Абая 56, кв. 12",
        "client_type": "заказчик",
        "notes": "Постоянный клиент",
        "created_at": "2025-09-21T17:26:41.557393"
      },
      "recipient": {
        "id": 1,
        "name": "Иван Петров",
        "phone": "+77077777755",
        "email": "ivan@example.com",
        "address": "пр. Достык 123, офис 45",
        "client_type": "получатель",
        "notes": "Доставка только в рабочее время",
        "created_at": "2025-09-21T17:26:49.302408"
      },
      "executor": {
        "id": 5,
        "username": "florist_gulnara",
        "email": "gulnara.florist@cvety.kz",
        "city": "Алматы",
        "position": "Флорист"
      },
      "courier": {
        "id": 10,
        "username": "courier_askar",
        "email": "askar.courier@cvety.kz",
        "city": "Астана",
        "position": "Курьер"
      },
      "order_items": [
        {
          "id": 9,
          "product_id": 1,
          "quantity": 3,
          "price": 12000.0,
          "product": {
            "id": 1,
            "name": "Букет роз",
            "description": "Красивый букет из 15 красных роз",
            "price": 12000.0,
            "category": "букет",
            "preparation_time": 30,
            "image_url": null,
            "created_at": "2025-09-21T17:26:56.123674"
          }
        }
      ]
    }
  ],
  "total": 6,
  "page": 1,
  "page_size": 1000,
  "has_more": false
}
```

### GET /api/orders/{order_id}
Получить конкретный заказ по ID

**Пример запроса:**
```bash
curl "http://localhost:8011/api/orders/1"
```

**Ответ 200:** (такой же объект Order как выше)

### POST /api/orders
Создать новый заказ

**Request Body:**
```json
{
  "client_id": 2,
  "recipient_id": 1,
  "executor_id": 5,
  "courier_id": 10,
  "delivery_date": "2024-03-18T14:00:00",
  "delivery_address": "ул. Республики 15, кв. 25",
  "delivery_time_range": "14:00-16:00",
  "comment": "Позвонить за час до доставки",
  "items": [
    {
      "product_id": 1,
      "quantity": 2,
      "price": 12000.0
    }
  ]
}
```

**Ответ 201:** (объект созданного Order)

### PATCH /api/orders/{order_id}
Частичное обновление заказа

**Request Body (любые поля):**
```json
{
  "executor_id": 7,
  "courier_id": 12,
  "delivery_address": "Новый адрес доставки",
  "delivery_time_range": "10:00-12:00",
  "comment": "Обновленный комментарий",
  "notes": "Новый текст открытки"
}
```

**Ответ 200:** (обновленный объект Order)

### PUT /api/orders/{order_id}/status
Обновить только статус заказа

**Request Body:**
```json
{
  "status": "готов"
}
```

**Возможные статусы:**
- `новый`
- `в работе`
- `готов`
- `доставлен`

**Ответ 200:** (обновленный объект Order)

### DELETE /api/orders/{order_id}
Удалить заказ

**Ответ 204:** (пустой ответ)

---

## 👥 Clients API

### GET /api/clients
Получить список клиентов

**Query Parameters:**
```
limit: number = 1000
skip: number = 0
search: string               # Поиск по имени/телефону
client_type: string          # заказчик | получатель | оба
```

**Пример ответа:**
```json
{
  "clients": [
    {
      "id": 1,
      "name": "Анна Иванова",
      "phone": "+77771234567",
      "email": "anna@example.com",
      "address": "ул. Абая 56, кв. 12",
      "client_type": "заказчик",
      "notes": "Постоянный клиент",
      "created_at": "2025-09-21T17:26:41.557393"
    }
  ],
  "total": 12,
  "page": 1,
  "page_size": 1000,
  "has_more": false
}
```

### POST /api/clients
Создать нового клиента

**Request Body:**
```json
{
  "name": "Петр Сидоров",
  "phone": "+77012345678",
  "email": "petr@example.com",
  "address": "пр. Достык 123, офис 45",
  "client_type": "получатель",
  "notes": "Доставка только в рабочее время"
}
```

### PATCH /api/clients/{client_id}
Обновить клиента

**Request Body:**
```json
{
  "name": "Новое имя",
  "phone": "+77087654321",
  "notes": "Обновленные заметки"
}
```

---

## 🌸 Products API

### GET /api/products
Получить список товаров

**Query Parameters:**
```
limit: number = 1000
skip: number = 0
category: string             # букет | композиция | горшечный
search: string               # Поиск по названию
```

**Пример ответа:**
```json
{
  "products": [
    {
      "id": 1,
      "name": "Букет роз",
      "description": "Красивый букет из 15 красных роз",
      "price": 12000.0,
      "category": "букет",
      "preparation_time": 30,
      "image_url": null,
      "created_at": "2025-09-21T17:26:56.123674"
    }
  ],
  "total": 8,
  "page": 1,
  "page_size": 1000,
  "has_more": false
}
```

### POST /api/products
Создать новый товар

**Request Body:**
```json
{
  "name": "Букет тюльпанов",
  "description": "Весенний букет из разноцветных тюльпанов",
  "price": 8500.0,
  "category": "букет",
  "preparation_time": 20,
  "image_url": "https://example.com/image.jpg"
}
```

---

## 📦 Inventory API

### GET /api/inventory
Получить список складских позиций

**Query Parameters:**
```
limit: number = 1000
skip: number = 0
low_stock_only: boolean      # Только позиции с низким остатком
unit: string                 # шт | м | кг
search: string               # Поиск по названию
```

**Пример ответа:**
```json
{
  "inventory": [
    {
      "id": 1,
      "name": "Розы красные",
      "quantity": 150,
      "unit": "шт",
      "min_quantity": 20,
      "price_per_unit": 800.0,
      "created_at": "2025-09-21T17:27:15.456789"
    }
  ],
  "total": 15,
  "page": 1,
  "page_size": 1000,
  "has_more": false
}
```

---

## 👨‍🎨 Users API

### GET /api/users
Получить список пользователей (флористы, курьеры)

**Query Parameters:**
```
position: string             # Флорист | Курьер
city: string                 # Алматы | Астана
```

**Пример ответа:**
```json
{
  "users": [
    {
      "id": 5,
      "username": "florist_gulnara",
      "email": "gulnara.florist@cvety.kz",
      "city": "Алматы",
      "position": "Флорист",
      "phone": "+77012345678",
      "address": "ул. Розыбакиева 123",
      "created_at": "2025-09-21T19:30:15.123456"
    },
    {
      "id": 10,
      "username": "courier_askar",
      "email": "askar.courier@cvety.kz",
      "city": "Астана",
      "position": "Курьер",
      "phone": "+77012345679",
      "address": "пр. Кунаева 456",
      "created_at": "2025-09-21T19:30:20.654321"
    }
  ],
  "total": 5,
  "page": 1,
  "page_size": 1000,
  "has_more": false
}
```

---

## 📊 Statistics API

### GET /api/stats/dashboard
Получить статистику для дашборда

**Пример ответа:**
```json
{
  "total_clients": 12,
  "total_products": 8,
  "total_orders": 6,
  "today_orders": 3,
  "low_stock_items": 2,
  "monthly_revenue": 156000.0,
  "orders_by_status": {
    "новый": 2,
    "в работе": 1,
    "готов": 3,
    "доставлен": 0
  }
}
```

---

## 📝 Типы данных

### Order Status
```typescript
type OrderStatus = 'новый' | 'в работе' | 'готов' | 'доставлен';
```

### Client Type
```typescript
type ClientType = 'заказчик' | 'получатель' | 'оба';
```

### Product Category
```typescript
type ProductCategory = 'букет' | 'композиция' | 'горшечный';
```

### Inventory Unit
```typescript
type InventoryUnit = 'шт' | 'м' | 'кг';
```

### User Position
```typescript
type UserPosition = 'Флорист' | 'Курьер';
```

---

## 💻 Примеры кода

### React Hook для Orders
```typescript
import { useState, useEffect } from 'react';

interface Order {
  id: number;
  status: string;
  client?: {
    name: string;
    phone: string;
  };
  executor?: {
    username: string;
    position: string;
  };
  // ... другие поля
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8011/api/orders');

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setOrders(data.orders);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const response = await fetch(`http://localhost:8011/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      const updatedOrder = await response.json();

      // Обновляем локальное состояние
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );

      return updatedOrder;
    } catch (err) {
      throw err;
    }
  };

  const assignFlorist = async (orderId: number, executorId: number | null) => {
    try {
      const response = await fetch(`http://localhost:8011/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ executor_id: executorId }),
      });

      if (!response.ok) {
        throw new Error(`Failed to assign florist: ${response.statusText}`);
      }

      const updatedOrder = await response.json();

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );

      return updatedOrder;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    updateOrderStatus,
    assignFlorist,
  };
}
```

### API Client
```typescript
const API_BASE_URL = 'http://localhost:8011';

class APIClient {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  // Orders
  async getOrders(params?: Record<string, any>) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/orders${query ? `?${query}` : ''}`);
  }

  async getOrder(id: number) {
    return this.request(`/api/orders/${id}`);
  }

  async updateOrder(id: number, data: Record<string, any>) {
    return this.request(`/api/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateOrderStatus(id: number, status: string) {
    return this.request(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Users
  async getUsers(params?: Record<string, any>) {
    const query = new URLSearchParams(params).toString();
    return this.request(`/api/users${query ? `?${query}` : ''}`);
  }

  async getFlorists() {
    return this.getUsers({ position: 'Флорист' });
  }

  async getCouriers() {
    return this.getUsers({ position: 'Курьер' });
  }
}

export const apiClient = new APIClient();
```

---

## ⚠️ Обработка ошибок

### HTTP Status Codes
- **200** - Успешный запрос
- **201** - Ресурс создан
- **204** - Успешно, без содержимого (для DELETE)
- **400** - Неверный запрос (проверьте JSON)
- **404** - Ресурс не найден
- **422** - Ошибка валидации (неверные данные)
- **500** - Внутренняя ошибка сервера

### Примеры ошибок

**404 Not Found:**
```json
{
  "detail": "Order not found"
}
```

**422 Validation Error:**
```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "client_id"],
      "msg": "Field required",
      "input": {...}
    }
  ]
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Internal server error"
}
```

### Обработка в коде
```typescript
try {
  const order = await apiClient.getOrder(123);
} catch (error) {
  if (error.message.includes('404')) {
    // Заказ не найден
    showNotification('Заказ не найден', 'error');
  } else if (error.message.includes('422')) {
    // Ошибка валидации
    showNotification('Неверные данные', 'error');
  } else {
    // Общая ошибка
    showNotification('Произошла ошибка', 'error');
  }
}
```

---

## 🚀 Быстрый старт

1. **Запустить backend:**
   ```bash
   cd /path/to/backend
   python3 -m fastapi dev main_sqlmodel.py --port 8011
   ```

2. **Проверить доступность:**
   ```bash
   curl http://localhost:8011/api/orders
   ```

3. **Посмотреть Swagger документацию:**
   ```
   http://localhost:8011/docs
   ```

4. **Создать тестовый заказ:**
   ```bash
   curl -X POST "http://localhost:8011/api/orders" \
     -H "Content-Type: application/json" \
     -d '{
       "client_id": 1,
       "recipient_id": 2,
       "delivery_date": "2024-03-18T14:00:00",
       "delivery_address": "Тестовый адрес",
       "items": [{"product_id": 1, "quantity": 1, "price": 12000}]
     }'
   ```

---

## 📞 Поддержка

При возникновении проблем:
1. Проверьте что backend запущен на порту 8011
2. Убедитесь что Content-Type: application/json в заголовках
3. Проверьте логи backend на ошибки
4. Используйте Swagger UI для тестирования: http://localhost:8011/docs

---

*Документация актуальна на: 22 сентября 2025*