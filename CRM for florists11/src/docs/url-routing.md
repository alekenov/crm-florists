# 🌸 URL Routing в цветочном магазине

## 🔄 Новая архитектура routing

Приложение теперь использует **URL-based routing** вместо state-based routing!

### ✅ Что изменилось

**До (State Routing):**
```
currentScreen: 'product-detail'
selectedProductId: 123
```

**После (URL Routing):**
```
URL: /products/123
currentScreen: 'product-detail' (автоматически из URL)
selectedProductId: 123 (автоматически из URL)
```

## 🗺️ Карта маршрутов

### 📱 Основные табы
```
/               → orders (main screen)
/orders         → orders tab
/products       → products tab  
/inventory      → inventory tab
/customers      → customers tab
/profile        → profile tab
```

### 🛍️ Товары (Products)
```
/products                   → список товаров
/products/add              → выбор типа товара
/products/add/vitrina      → форма витрины
/products/add/catalog      → форма каталога
/products/123              → детали товара
/products/123/edit         → редактирование товара
```

### 📦 Заказы (Orders)
```
/orders                    → список заказов
/orders/add               → создание заказа
/orders/ORD-123           → детали заказа
```

### 📊 Склад (Inventory)
```
/inventory                 → список товаров на складе
/inventory/add            → добавление товара
/inventory/123            → детали товара
/inventory/audit          → инвентаризация
```

### 👥 Клиенты (Customers)
```
/customers                 → список клиентов
/customers/add            → добавление клиента
/customers/123            → детали клиента
```

### ⚙️ Профиль (Profile)
```
/profile                   → настройки профиля
/dashboard                 → дашборд администратора
```

## 🔧 Использование в коде

### useUrlRouter Hook
```typescript
import { useUrlRouter } from '../src/hooks/useUrlRouter';

function MyComponent() {
  const { currentRoute, navigate, buildUrl } = useUrlRouter();
  
  // Текущий маршрут
  console.log(currentRoute.path);    // "/products/123"
  console.log(currentRoute.screen);  // "product-detail"
  console.log(currentRoute.params);  // { id: "123" }
  
  // Навигация
  const goToProduct = (id: number) => {
    navigate(buildUrl.productDetail(id));
  };
  
  return <div>Current: {currentRoute.path}</div>;
}
```

### Обновленный useAppState
```typescript
import { useAppState } from '../src/hooks/useAppState';

function MyComponent() {
  const state = useAppState();
  
  // Состояние автоматически синхронизируется с URL
  console.log(state.currentScreen);     // из URL
  console.log(state.activeTab);         // из URL
  console.log(state.selectedProductId); // из URL params
  
  // Навигация обновляет URL
  state.navigateToScreen('product-detail', 123);
  // URL станет: /products/123
}
```

### BuildUrl Helpers
```typescript
// Вместо ручного построения URL используйте helpers
const { buildUrl } = useUrlRouter();

// ✅ Правильно
navigate(buildUrl.productDetail(123));
navigate(buildUrl.orderAdd());
navigate(buildUrl.customerDetail(456));

// ❌ Неправильно
navigate('/products/' + id);
navigate('/orders/add');
```

## 🎯 Преимущества нового подхода

### ✅ URL адреса для всех страниц
- `/products/123` - прямая ссылка на товар
- `/orders/ORD-456` - прямая ссылка на заказ
- `/customers/789` - прямая ссылка на клиента

### ✅ Browser History
- **Back/Forward** кнопки работают
- **F5 (refresh)** сохраняет состояние
- **Bookmarks** работают корректно

### ✅ Поделиться ссылками
```typescript
// Скопировать ссылку на товар
const productUrl = window.location.origin + buildUrl.productDetail(123);
navigator.clipboard.writeText(productUrl);
```

### ✅ SEO готовность
- Каждая страница имеет уникальный URL
- Готовность к server-side rendering
- Корректная индексация поисковиками

## 🔄 Миграция существующего кода

### Навигация между экранами
```typescript
// ❌ Старый способ
setCurrentScreen('product-detail');
setSelectedProductId(123);

// ✅ Новый способ
navigateToScreen('product-detail', 123);
// или
navigate(buildUrl.productDetail(123));
```

### Обработка параметров
```typescript
// ❌ Старый способ
const productId = selectedProductId;

// ✅ Новый способ  
const { params } = useUrlRouter();
const productId = parseInt(params.id || '0');
```

### Переключение табов
```typescript
// ❌ Старый способ
setActiveTab('products');
setCurrentScreen('main');

// ✅ Новый способ
setActiveTab('products'); // автоматически навигирует на /products
```

## 🧪 Тестирование URL routing

### Ручное тестирование
1. Откройте `/products/1` - должна открыться детальная страница товара
2. Обновите страницу F5 - состояние должно сохраниться
3. Используйте кнопку Back - должен вернуться к списку
4. Скопируйте URL и откройте в новой вкладке

### Programmatic тестирование
```typescript
// Тест навигации
test('should navigate to product detail', () => {
  const { navigate, buildUrl } = useUrlRouter();
  
  navigate(buildUrl.productDetail(123));
  
  expect(window.location.pathname).toBe('/products/123');
});

// Тест параметров
test('should parse URL parameters', () => {
  window.history.pushState(null, '', '/products/123');
  
  const { params } = useUrlRouter();
  
  expect(params.id).toBe('123');
});
```

## ⚠️ Важные замечания

### Обратная совместимость
- Старые методы навигации продолжают работать
- Постепенная миграция на новые URL
- Fallback на главную страницу при неизвестных маршрутах

### Параметры в URL
- **ID товаров**: `/products/123` (number)
- **ID заказов**: `/orders/ORD-123` (string)  
- **ID клиентов**: `/customers/456` (number)
- **ID склада**: `/inventory/789` (number)

### Browser History
- **navigate()** добавляет в историю
- **navigate(url, true)** заменяет текущую запись
- **goBack()** использует browser back

## 🔮 Будущие улучшения

### Query Parameters (v1.1)
```
/products?category=roses&sort=price
/orders?status=new&date=2024-01-01
```

### Hash Routing (если нужно)
```
/#/products/123
/#/orders/add
```

### Nested Routes (v2.0)
```
/products/123/variants
/orders/123/items
```

---

**🎉 Теперь приложение имеет полноценный URL routing с поддержкой browser history!**