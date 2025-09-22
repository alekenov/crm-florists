# 🔧 URL Routing - Исправления ошибок

## 🐛 Исправленные ошибки

### 1. **ReferenceError: Cannot access 'parseUrl' before initialization**

**Проблема:**
```javascript
// ❌ Функция использовалась до объявления
const [currentRoute, setCurrentRoute] = useState(() => parseUrl(window.location.pathname));

const parseUrl = useCallback((pathname: string) => {
  // function body
}, []);
```

**Решение:**
```javascript
// ✅ Вынос функций из компонента
const parseUrl = (pathname: string): Route => {
  // function body - объявлена ДО использования
};

const matchRoute = (routePath: string, actualPath: string) => {
  // function body
};

export function useUrlRouter() {
  const [currentRoute, setCurrentRoute] = useState(() => parseUrl(window.location.pathname));
  // ...
}
```

**🎯 Объяснение:**
- Функции `parseUrl` и `matchRoute` вынесены из компонента
- Убраны `useCallback` dependencies
- Функции доступны на момент инициализации состояния

### 2. **Screen name mismatch: 'edit-catalog' vs 'product-edit'**

**Проблема:**
```javascript
// ❌ Разные названия в разных местах
'/products/:id/edit': { screen: 'edit-catalog' }    // URL router
case 'product-edit':                               // AppRouter
```

**Решение:**
```javascript
// ✅ Унифицированные названия
'/products/:id/edit': { screen: 'product-edit' }   // URL router

case 'edit-catalog':      // Старая совместимость
case 'product-edit':      // Новый URL routing
  return <EditCatalogForm />
```

### 3. **Circular dependency в импортах**

**Проблема:**
```javascript
// ❌ Циклические зависимости
useAppState -> useUrlRouter -> useCallback -> parseUrl (undefined)
```

**Решение:**
```javascript
// ✅ Упрощенная структура без циклических зависимостей
// parseUrl и matchRoute - чистые функции вне компонента
// useUrlRouter не зависит от других хуков приложения
```

### 4. **Development environment compatibility**

**Проблема:**
```javascript
// ❌ Figma Make preview pages вызывают warnings
Route not found: /preview_page.html, redirecting to /orders
```

**Решение:**
```javascript
// ✅ Специальная обработка системных URL
if (cleanPath.includes('preview_page.html') || 
    cleanPath.includes('.html') || 
    cleanPath.startsWith('/figma/') ||
    cleanPath === '/index.html') {
  // Тихо используем главную страницу
  return { path: '/orders', tab: 'orders', screen: 'main' };
}
```

## 🎯 Архитектурные улучшения

### Вынос логики парсинга
```javascript
// Чистые функции для парсинга URL
const parseUrl = (pathname: string): Route => { ... };
const matchRoute = (routePath: string, actualPath: string): RouteParams | null => { ... };

// Упрощенный hook
export function useUrlRouter() {
  const [currentRoute, setCurrentRoute] = useState(() => parseUrl(window.location.pathname));
  // ...
}
```

### Обратная совместимость
```javascript
// AppRouter поддерживает оба варианта
case 'edit-catalog':    // Legacy
case 'product-edit':    // New URL routing
  return <EditCatalogForm />;
```

### Улучшенная обработка ошибок
```javascript
// Fallback для неизвестных маршрутов
if (!routeMatch) {
  console.warn(`Route not found: ${pathname}, redirecting to /orders`);
  return {
    path: '/orders',
    tab: 'orders', 
    screen: 'main',
  };
}
```

## 🧪 Тестирование исправлений

### Ручное тестирование
1. **Перезагрузка страницы:** F5 не должна вызывать ошибок
2. **Навигация:** Переходы между страницами работают
3. **Browser history:** Back/Forward кнопки работают
4. **URL параметры:** `/products/123` корректно парсится

### Автоматическое тестирование
```javascript
// Тест парсинга URL
test('parseUrl should handle product detail', () => {
  const route = parseUrl('/products/123');
  expect(route.screen).toBe('product-detail');
  expect(route.params.id).toBe('123');
});

// Тест navigation
test('navigate should update URL and state', () => {
  const { navigate } = useUrlRouter();
  navigate('/products/456');
  expect(window.location.pathname).toBe('/products/456');
});
```

## 📁 Измененные файлы

### `/src/hooks/useUrlRouter.ts`
- ✅ Вынос `parseUrl` и `matchRoute` из компонента
- ✅ Упрощение dependency arrays
- ✅ Улучшенная обработка ошибок

### `/components/AppRouter.tsx`
- ✅ Добавлена поддержка `product-edit` case
- ✅ Обратная совместимость с `edit-catalog`
- ✅ Улучшенный default case

### `/src/hooks/useAppState.ts`
- ✅ Удален неиспользуемый import `useEffect`
- ✅ Упрощена логика инициализации

## 🎉 Результат

**✅ Все ошибки исправлены:**
- ❌ ReferenceError устранена
- ❌ Screen name conflicts разрешены
- ❌ Circular dependencies убраны
- ❌ Preview page routing warnings устранены

**✅ URL Routing полностью работает:**
- 🔗 `/products/123` - детали товара
- 🔗 `/orders/ORD-456` - детали заказа  
- 🔗 `/customers/789` - профиль клиента
- 🔗 F5 refresh сохраняет состояние
- 🔗 Browser history работает
- 🔗 Bookmarks и sharing работают
- 🔗 Development environment compatibility

## 🛠️ URL Debugger для разработки

**Новая функция для отладки URL routing:**

### Включение debugger
```
Ctrl/Cmd + Shift + U - включить/выключить URL debugger
```

### Что показывает
- Текущий pathname
- Распознанный route
- Active screen и tab
- URL параметры
- Быстрые ссылки для тестирования

### Использование
```typescript
import { URLDebugger, useURLDebugger } from './components/URLDebugger';

function App() {
  const { showDebugger } = useURLDebugger();
  
  return (
    <>
      <AppRouter />
      <URLDebugger show={showDebugger} />
    </>
  );
}
```

## 🔮 Следующие шаги

1. **Query parameters** для фильтров: `/products?category=roses`
2. **Nested routes** для сложной навигации
3. **Route guards** для защищенных страниц
4. **Preloading** для быстрой навигации

**🚀 Приложение теперь имеет полноценный URL routing без ошибок и с поддержкой среды разработки!**