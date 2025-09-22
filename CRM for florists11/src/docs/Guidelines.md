# 🌸 Цветочный магазин - Руководство разработчика

## 🏗️ Архитектурные принципы

### Centralized State Management
```typescript
// ✅ Правильно - используем централизованное состояние
const state = useAppState();
const actions = useAppActions(state);

// ❌ Неправильно - локальное состояние для глобальных данных
const [products, setProducts] = useState([]);
```

### Component Hierarchy
```
/components/
├── AppWrapper.tsx       # 🎯 Layout обертка (ОБЯЗАТЕЛЬНО для всех страниц)
├── MainTabView.tsx      # 📱 Основное табличное представление
├── common/              # 🔄 Переиспользуемые компоненты
│   ├── FilterTabs.tsx
│   ├── EmptyState.tsx
│   ├── PageHeader.tsx
│   └── index.ts
├── products/            # 🛍️ Продуктовые компоненты
│   ├── ProductsList.tsx
│   ├── ProductItem.tsx
│   └── index.ts
├── ui/                  # 🎨 ShadCN компоненты (НЕ МОДИФИЦИРОВАТЬ)
└── [Feature]*.tsx       # 📄 Страничные ком��оненты
```

### AppWrapper Pattern (ОБЯЗАТЕЛЬНО)
```typescript
// ✅ Все страницы должны использовать AppWrapper
return (
  <AppWrapper {...wrapperProps}>
    <YourComponent />
  </AppWrapper>
);

// ❌ НЕ дублируйте AppLayout + Toaster вручную
return (
  <>
    <AppLayout>
      <YourComponent />
    </AppLayout>
    <Toaster />
  </>
);
```

## 📱 Mobile-First Responsive Design

### Обязательные паттерны
```typescript
// ✅ Правильная структура responsive компонента
<div className="bg-white min-h-screen">
  {/* Mobile Header */}
  <div className="lg:hidden">
    <MobileHeader />
  </div>
  
  {/* Desktop Header */}
  <div className="hidden lg:block border-b border-gray-200 p-6">
    <DesktopHeader />
  </div>
  
  {/* Desktop Layout */}
  <div className="hidden lg:block p-6">
    <DesktopContent />
  </div>
  
  {/* Mobile Layout */}
  <div className="lg:hidden pb-20">
    <MobileContent />
  </div>
</div>
```

### Touch-Friendly Design
- **48px minimum** touch targets
- **16px+ padding** для кнопок
- **Thumb zone** навигация (bottom 25% экрана)
- **Single-hand operation** приоритет

### Desktop Enhancement
```typescript
// ✅ Card-based desktop layout
<Card>
  <CardHeader>
    <CardTitle>Заголовок</CardTitle>
  </CardHeader>
  <CardContent>
    {/* Content */}
  </CardContent>
</Card>

// ✅ Table-based data display
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Название</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        <TableCell>{item.name}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

## 🔒 Privacy-First Approach

### Сбор данных клиентов
```typescript
// ✅ Правильная форма клиента
interface CustomerForm {
  name?: string;        // Опционально
  phone: string;        // Обязательно
  // НЕТ email!
  // НЕТ адреса!
  // НЕТ персональных данных!
}

// ✅ UI индикаторы
<Label>
  Имя клиента
  <span className="text-gray-400 text-sm">(опционально)</span>
</Label>
<Label>
  Номер телефона
  <span className="text-red-500">*</span>
</Label>
```

### Privacy UI Messages
```typescript
// ✅ Информационные блоки о privacy
<Card className="border-blue-200 bg-blue-50">
  <CardContent className="p-6">
    <div className="flex items-start gap-3">
      <Info className="w-4 h-4 text-blue-600" />
      <div>
        <h4 className="font-medium text-blue-900">Информация о клиентах</h4>
        <p className="text-blue-800 text-sm">
          Мы собираем только имя и номер телефона. Email и другие 
          персональные данные не требуются.
        </p>
      </div>
    </div>
  </CardContent>
</Card>
```

## 🎨 Design System

### CSS Variables (Tailwind V4)
```css
/* globals.css - НЕ МОДИФИЦИРОВАТЬ без необходимости */
:root {
  --font-size: 14px;              /* Base font size */
  --primary: #7c3aed;             /* Purple accent */
  --background: #ffffff;          /* Main background */
  --input-background: #f3f3f5;    /* Input fields */
  --border: rgba(0, 0, 0, 0.1);   /* Borders */
  --radius: 0.625rem;             /* Border radius */
}
```

### 🚫 Запрещенные Tailwind классы
```typescript
// ❌ НЕ используйте font-size классы
<h1 className="text-2xl">         // ЗАПРЕЩЕНО
<p className="text-sm">           // ЗАПРЕЩЕНО

// ❌ НЕ используйте font-weight классы  
<span className="font-bold">      // ЗАПРЕЩЕНО
<span className="font-medium">    // ЗАПРЕЩЕНО

// ❌ НЕ используйте line-height классы
<p className="leading-tight">     // ЗАПРЕЩЕНО

// ✅ Используйте естественную типографику
<h1>Заголовок</h1>               // Автоматические стили из globals.css
<p>Параграф</p>                  // Автоматические стили из globals.css
```

### ✅ Типографическая иерархия
```typescript
// Автоматически стилизуется через globals.css
<h1>24px, medium, line-height: 1.5</h1>
<h2>20px, medium, line-height: 1.5</h2>  
<h3>18px, medium, line-height: 1.5</h3>
<h4>16px, medium, line-height: 1.5</h4>
<p>16px, normal, line-height: 1.5</p>
<label>16px, medium, line-height: 1.5</label>
<button>16px, medium, line-height: 1.5</button>
<input>16px, normal, line-height: 1.5</input>
```

### 🎯 Component Guidelines

#### Cards (Desktop)
```typescript
// ✅ Правильная Card структура
<Card>
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <Icon className="w-5 h-5" />
      Заголовок карточки
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="space-y-4">
      {/* Content */}
    </div>
  </CardContent>
</Card>

// ❌ НЕ создавайте кастомные card обертки
<div className="border rounded-lg p-4">  // ИЗБЕГАЙТЕ
```

#### Tables (Desktop)
```typescript
// ✅ Правил��ная Table структура
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-16">Фото</TableHead>
      <TableHead>Название</TableHead>
      <TableHead className="w-32">Цена</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {items.map((item) => (
      <TableRow 
        key={item.id}
        className="cursor-pointer hover:bg-gray-50"
        onClick={() => onView(item.id)}
      >
        <TableCell>{/* Content */}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>
```

#### Status Badges
```typescript
// ✅ Цветовое кодирование статусов
const statusConfig = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  vip: 'bg-purple-100 text-purple-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700'
};

<Badge className={statusConfig[status]}>
  {statusLabel}
</Badge>
```

### 🎨 Иконки (Lucide React)
```typescript
// ✅ Правильные размеры иконок
import { User, Settings, Plus } from 'lucide-react';

// Inline иконки (16px)
<User className="w-4 h-4 text-gray-500" />

// Button иконки (20px)  
<Plus className="w-5 h-5 text-gray-600" />

// Header иконки (24px)
<Settings className="w-6 h-6 text-gray-900" />

// Large иконки (32px)
<User className="w-8 h-8 text-gray-400" />
```

## 🛍️ Доменные правила

### Товары (Products)
```typescript
// ✅ Два типа товаров
type ProductType = 'vitrina' | 'catalog';

interface Product {
  type: ProductType;
  // Витрина: простая форма (фото + цена)
  // Каталог: расширенная форма (видео, состав, цвета, время)
}

// ✅ Цветовая палитра (круглые иконки)
const ColorPicker = () => (
  <div className="flex flex-wrap gap-2">
    {colors.map((color) => (
      <button
        key={color}
        className="w-8 h-8 rounded-full border-2"
        style={{ backgroundColor: color }}
      />
    ))}
  </div>
);

// ✅ Время изготовления (селектируемые теги)
const ProductionTime = () => (
  <div className="flex flex-wrap gap-2">
    {timeTags.map((tag) => (
      <button
        key={tag}
        className={`px-3 py-1 rounded-full text-sm ${
          selected ? 'bg-primary text-white' : 'bg-gray-100'
        }`}
      >
        {tag}
      </button>
    ))}
  </div>
);
```

### Заказы (Orders)
```typescript
// ✅ Статусы заказов (строгий порядок)
type OrderStatus = 
  | 'new'        // Новый заказ
  | 'paid'       // Оплачен
  | 'accepted'   // Принят в работу
  | 'assembled'  // Собран
  | 'in-transit' // В доставке
  | 'completed'; // Завершен

// ✅ Цветовое кодирование
const orderStatusConfig = {
  new: 'bg-gray-100 text-gray-700',
  paid: 'bg-blue-100 text-blue-700',
  accepted: 'bg-yellow-100 text-yellow-700',
  assembled: 'bg-orange-100 text-orange-700',
  'in-transit': 'bg-purple-100 text-purple-700',
  completed: 'bg-green-100 text-green-700'
};
```

### Склад (Inventory)
```typescript
// ✅ Инвентаризация с audit trail
interface InventoryAudit {
  id: string;
  date: Date;
  items: AuditItem[];
  results: {
    discrepancies: number;
    adjustments: number;
  };
}

// ✅ Поставки (batch processing)
interface Supply {
  items: SupplyItem[];
  totalCost: number;
  supplier: string;
  date: Date;
}
```

### Клиенты (Customers) - Privacy First
```typescript
// ✅ Минимальные данные
interface Customer {
  id: number;
  name?: string;        // ОПЦИОНАЛЬНО!
  phone: string;        // ОБЯЗАТЕЛЬНО
  memberSince: Date;
  totalOrders: number;
  totalSpent: number;
  status: 'active' | 'vip' | 'inactive';
  notes?: string;
  // НЕТ EMAIL!
  // НЕТ АДРЕСА!
  // НЕТ ПЕРСОНАЛЬНЫХ ДАННЫХ!
}
```

## 💻 Code Style & Patterns

### Import Order
```typescript
// 1. ⚛️ React и сторонние библиотеки
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

// 2. 🔧 Типы и утилиты из src/
import { Product } from '../src/types';
import { formatCurrency } from '../src/utils/currency';
import { useAppState } from '../src/hooks/useAppState';

// 3. 🧩 Локальные компоненты
import { ProductItem } from './ProductItem';
import { FilterTabs } from '../common/FilterTabs';
```

### Component Structure
```typescript
// ✅ Правильная структура компонента
interface ComponentProps {
  // Обязательные props первыми
  data: Product[];
  onAction: (id: number) => void;
  
  // Опциональные props после
  className?: string;
  showHeader?: boolean;
}

export function Component({ 
  data, 
  onAction, 
  className,
  showHeader = true 
}: ComponentProps) {
  // 1. 🎣 Hooks
  const [state, setState] = useState();
  const appState = useAppState();
  
  // 2. 🎯 Handlers
  const handleClick = (id: number) => {
    onAction(id);
  };
  
  // 3. 💰 Computed values
  const filteredData = useMemo(() => 
    data.filter(item => item.active), [data]
  );
  
  // 4. 🎨 Render
  return (
    <div className={className}>
      {/* Content */}
    </div>
  );
}
```

### State Management Patterns
```typescript
// ✅ Глобальное состояние
const state = useAppState();
const actions = useAppActions(state);

// ✅ Локальное UI состояние
const [isOpen, setIsOpen] = useState(false);
const [searchQuery, setSearchQuery] = useState('');

// ✅ URL состояние (для фильтров/поиска)
const urlParams = urlManager.getParams();
urlManager.setProductsFilter('vitrina');

// ❌ НЕ дублируйте глобальное состояние локально
const [products, setProducts] = useState([]); // НЕПРАВИЛЬНО!
```

### Error Handling
```typescript
// ✅ Graceful degradation
if (!customer) {
  return (
    <EmptyState
      icon={<User className="w-8 h-8" />}
      title="Клиент не найден"
      description="Вернитесь к списку клиентов"
    />
  );
}

// ✅ Loading states
if (isLoading) {
  return <Skeleton className="w-full h-32" />;
}
```