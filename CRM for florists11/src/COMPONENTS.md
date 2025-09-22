# 🧩 Справочник компонентов

## 📋 Обзор

Все компоненты в проекте следуют единым принципам:
- **Mobile-first responsive design**
- **TypeScript типизация**
- **ShadCN UI base components**
- **Centralized state management**

## 🏗️ Архитектурные компоненты

### 📦 AppWrapper
**Местоположение:** `/components/AppWrapper.tsx`

Универсальная обертка для всех страниц приложения.

```typescript
interface AppWrapperProps {
  activeTab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile';
  onActiveTabChange: (tab) => void;
  onAddProduct: () => void;
  onAddOrder: () => void;
  onAddInventoryItem: () => void;
  onAddCustomer: () => void;
  children: React.ReactNode;
}
```

**Использование:**
```typescript
<AppWrapper {...wrapperProps}>
  <YourPageComponent />
</AppWrapper>
```

**Функции:**
- ✅ Единообразный layout для всех страниц
- ✅ Централизованное управление навигацией
- ✅ Toaster интеграция
- ✅ Устранение дублирования кода

### 📱 MainTabView  
**Местоположение:** `/components/MainTabView.tsx`

Основное табличное представление приложения.

```typescript
interface MainTabViewProps {
  products: Product[];
  activeTab: Tab;
  onActiveTabChange: (tab: Tab) => void;
  // ... navigation handlers
  ProductsListComponent: React.ComponentType;
  OrdersComponent: React.ComponentType;
  InventoryComponent: React.ComponentType;
  CustomersComponent: React.ComponentType;
  ProfileComponent: React.ComponentType;
}
```

**Особенности:**
- 🎯 Component injection pattern для каждой вкладки
- 📱 AppLayout обертка
- 🔄 Роутинг между вкладками

## 🔄 Переиспользуемые компоненты

### 🏷️ FilterTabs
**Местоположение:** `/components/common/FilterTabs.tsx`

Табы для фильтрации данных с счетчиками.

```typescript
interface Tab {
  key: string;
  label: string;
  count?: number;
}

interface FilterTabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}
```

**Пример использования:**
```typescript
const tabs = [
  { key: 'vitrina', label: 'Витрина', count: 12 },
  { key: 'catalog', label: 'Каталог', count: 45 }
];

<FilterTabs 
  tabs={tabs} 
  activeTab="vitrina" 
  onTabChange={setFilter} 
/>
```

### 🗂️ EmptyState
**Местоположение:** `/components/common/EmptyState.tsx`

Компонент для отображения пустых состояний.

```typescript
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}
```

**Пример использования:**
```typescript
<EmptyState
  icon={<Plus className="w-8 h-8 text-gray-400" />}
  title="Нет товаров"
  description="Добавьте первый товар в каталог"
/>
```

### 📄 PageHeader
**Местоположение:** `/components/common/PageHeader.tsx`

Заголовок страницы с действиями.

```typescript
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}
```

## 🛍️ Продуктовые компоненты

### 📋 ProductsList
**Местоположение:** `/components/products/ProductsList.tsx`

Основной компонент для отображения списка товаров.

**Функции:**
- 🔍 Поиск по названию и цене
- 🏷️ Фильтрация по типу (Витрина/Каталог)
- 📱 Responsive layout (карточки на мобильном, таблица на desktop)
- 🔗 URL state management
- 🎯 Быстрое переключение статуса товаров

```typescript
interface ProductsListProps {
  products: Product[];
  onAddProduct: () => void;
  onViewProduct: (id: number) => void;
  onToggleProduct: (id: number) => void;
}
```

**Mobile Layout:**
- Карточки товаров с ProductItem компонентами
- Bottom padding для FAB
- Touch-friendly элементы управления

**Desktop Layout:**
- Табличное представление с сортировкой
- Bulk actions
- Расширенные фильтры

### 🎴 ProductItem
**Местоположение:** `/components/products/ProductItem.tsx`

Карточка отдельного товара (мобильная версия).

```typescript
interface ProductItemProps extends Product {
  onToggle: (id: number) => void;
  onView: (id: number) => void;
  searchQuery?: string;
}
```

**Особенности:**
- 🎨 Подсветка поиска
- 🔄 Inline toggle для статуса
- 📱 Touch-friendly design
- ⏰ Relative time display

## 📄 Страничные компоненты

### 🎯 ProductTypeSelector
**Местоположение:** `/components/ProductTypeSelector.tsx`

Выбор типа товара при создании.

```typescript
interface ProductTypeSelectorProps {
  onClose: () => void;
  onSelectVitrina: () => void;
  onSelectCatalog: () => void;
}
```

### ➕ AddProductForm / AddCatalogForm
**Местоположение:** `/components/AddProductForm.tsx`, `/components/AddCatalogForm.tsx`

Формы добавления товаров.

**AddProductForm (Витрина):**
- 📸 Загрузка фото
- 💰 Цена
- 📝 Название

**AddCatalogForm (Каталог):**
- 🎬 Фото + видео
- 🌈 Цветовая палитра
- 📏 Размеры (ширина × высота)
- 🌺 Состав букета
- ⏱️ Время изготовления
- 💸 Скидки

### 👁️ ProductDetail
**Местоположение:** `/components/ProductDetail.tsx`

Детальный просмотр товара с возможностью редактирования.

```typescript
interface ProductDetailProps {
  productId: number | null;
  products: Product[];
  onClose: () => void;
  onUpdateProduct: (product: Product) => void;
  onEditProduct: (id: number) => void;
}
```

**Responsive Layout:**
- 📱 Mobile: Вертикальный stack
- 💻 Desktop: Горизонтальная сетка с медиа-контентом

## 📦 Заказы

### 📋 Orders
**Местоположение:** `/components/Orders.tsx`

Список заказов с фильтрацией по статусам.

```typescript
interface OrdersProps {
  orders: Order[];
  onViewOrder?: (orderId: string) => void;
  onStatusChange?: (orderId: string, status: OrderStatus) => void;
  onAddOrder?: () => void;
}
```

**Статусы заказов:**
- 🆕 `new` - Новый заказ
- 💳 `paid` - Оплачен
- ✅ `accepted` - Принят в работу
- 📦 `assembled` - Собран
- 🚚 `in-transit` - В доставке
- ✨ `completed` - Завершен

### ➕ AddOrder
**Местоположение:** `/components/AddOrder.tsx`

Создание нового заказа.

**Функции:**
- 👤 Выбор/создание клиента
- 🛍️ Добавление товаров в корзину
- 📝 Комментарии и особые пожелания
- 💰 Расчет итоговой стоимости

## 👥 Клиенты

### 👥 Customers
**Местоположение:** `/components/Customers.tsx`

Список клиентов с поиском и фильтрацией.

```typescript
interface CustomersProps {
  customers: Customer[];
  onViewCustomer: (id: number) => void;
  onAddCustomer: () => void;
}
```

**Privacy-First подход:**
- ✅ Только имя (опционально) + телефон
- ❌ Никаких email или персональных данных
- 🔒 Explicit privacy indicators в UI

### 👤 CustomerDetail
**Местоположение:** `/components/CustomerDetail.tsx`

Детальная карточка клиента.

**Desktop Layout:**
- 📊 Grid layout (1/3 информация + 2/3 история заказов)
- 📈 Статистика с визуальными индикаторами
- 📋 Табличная история заказов

**Mobile Layout:**
- 📱 Вертикальный stack
- 🎴 Карточки заказов

### ➕ AddCustomer  
**Местоположение:** `/components/AddCustomer.tsx`

Форма добавления клиента.

**Особенности:**
- ℹ️ Privacy information card
- 📞 Автоформатирование телефона
- ✅ Валидация без email

## 📊 Склад

### 📦 Inventory
**Местоположение:** `/components/Inventory.tsx`

Управление складскими остатками.

**Функции:**
- 📋 Текущие остатки
- 🔍 Поиск и фильтрация
- ⚠️ Уведомления о низких остатках
- 📊 Аналитика движения товаров

### 🔍 InventoryAudit
**Местоположение:** `/components/InventoryAudit.tsx`

Проведение инвентаризации.

**Процесс:**
1. Создание audit session
2. Сканирование/подсчет товаров
3. Сравнение с системными данными
4. Фиксация расхождений
5. Генерация отчета

## ⚙️ UI компоненты (ShadCN)

### Основные компоненты
```typescript
// Базовые элементы
import { Button, Input, Label, Textarea } from './ui/';

// Layout компоненты  
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// Data display
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';

// Navigation
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

// Feedback
import { Toaster } from './ui/sonner';
import { Skeleton } from './ui/skeleton';
```

### Кастомные настройки
```typescript
// Switches с кастомной стилизацией
<Switch 
  checked={isActive}
  onCheckedChange={onToggle}
  className="data-[state=checked]:bg-emerald-500"
/>

// Badges с цветовым кодированием
<Badge className="bg-green-100 text-green-700">
  Активен
</Badge>
```

## 🎨 Стилизация компонентов

### Responsive Patterns
```typescript
// Типичная responsive структура
<div className="bg-white min-h-screen">
  {/* Mobile Header */}
  <div className="lg:hidden">
    <MobileHeader />
  </div>
  
  {/* Desktop Header */}
  <div className="hidden lg:block border-b border-gray-200 p-6">
    <DesktopHeader />
  </div>
  
  {/* Desktop Content */}
  <div className="hidden lg:block p-6">
    <DesktopContent />
  </div>
  
  {/* Mobile Content */}
  <div className="lg:hidden pb-20">
    <MobileContent />
  </div>
</div>
```

### Color Scheme
```typescript
// Status colors
const statusColors = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700'
};

// Interactive states
className="hover:bg-gray-50 transition-colors cursor-pointer"
```

### Typography (автоматическая из globals.css)
```typescript
// ✅ Используйте семантические теги
<h1>Автоматический стиль из globals.css</h1>
<h2>20px, medium, line-height: 1.5</h2>
<p>16px, normal, line-height: 1.5</p>

// ❌ НЕ используйте Tailwind font классы
<h1 className="text-2xl font-bold">НЕПРАВИЛЬНО</h1>
```

## 🧪 Тестирование компонентов

### Unit Tests
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductItem } from './ProductItem';

test('should toggle product status', () => {
  const onToggle = jest.fn();
  const product = { id: 1, title: 'Rose', isAvailable: true };
  
  render(<ProductItem {...product} onToggle={onToggle} />);
  
  fireEvent.click(screen.getByRole('switch'));
  expect(onToggle).toHaveBeenCalledWith(1);
});
```

### Integration Tests
```typescript
test('should filter products by search query', () => {
  render(<ProductsList products={mockProducts} />);
  
  fireEvent.change(screen.getByPlaceholderText('Поиск...'), {
    target: { value: 'роза' }
  });
  
  expect(screen.getByText('Букет роз')).toBeInTheDocument();
  expect(screen.queryByText('Букет тюльпанов')).not.toBeInTheDocument();
});
```

---

**Этот справочник поможет быстро найти нужный компонент и понять его API. 🧩**