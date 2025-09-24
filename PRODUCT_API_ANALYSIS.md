# Анализ соответствия Product API между Frontend и Backend

## Текущая ситуация

### Backend (SQLModel) возвращает:
```python
class Product(SQLModel, table=True):
    id: int
    name: str
    description: Optional[str]
    price: float
    category: ProductCategory  # "букет", "композиция", "горшечный"
    preparation_time: Optional[int]  # минуты
    image_url: Optional[str]
    created_at: datetime
```

### Frontend API слой ожидает (src/api/types.ts):
```typescript
interface Product {
    id: number;
    name: string;
    description?: string;
    price: number;
    category: 'букет' | 'композиция' | 'горшечный';
    preparation_time?: number;
    image_url?: string;
    created_at: string;
}
```

### Frontend UI компоненты используют (src/types/index.ts):
```typescript
interface Product {
    id: number;
    title: string;  // ⚠️ НЕСООТВЕТСТВИЕ: backend использует "name"
    name?: string;
    price: string;  // ⚠️ НЕСООТВЕТСТВИЕ: backend возвращает number
    image: string;  // ⚠️ НЕСООТВЕТСТВИЕ: backend использует "image_url"
    images?: string[];  // ⚠️ ОТСУТСТВУЕТ в backend
    isAvailable: boolean;  // ⚠️ ОТСУТСТВУЕТ в backend
    createdAt: Date;
    type: "catalog" | "custom";  // ⚠️ ОТСУТСТВУЕТ в backend
    category?: string;
    description?: string;
    preparationTime?: number;
    productionTime?: string;  // ⚠️ ОТСУТСТВУЕТ в backend
    width?: string;  // ⚠️ ОТСУТСТВУЕТ в backend
    height?: string;  // ⚠️ ОТСУТСТВУЕТ в backend
    colors?: string[];  // ⚠️ ОТСУТСТВУЕТ в backend
    catalogWidth?: string;  // ⚠️ ОТСУТСТВУЕТ в backend
    catalogHeight?: string;  // ⚠️ ОТСУТСТВУЕТ в backend
    ingredients?: string[];  // ⚠️ ОТСУТСТВУЕТ в backend
}
```

## Выявленные несоответствия

### Критические несоответствия:
1. **title vs name** - UI ожидает `title`, backend возвращает `name`
2. **image vs image_url** - разные названия полей
3. **isAvailable** - UI требует флаг доступности, backend не предоставляет
4. **type** - UI требует тип продукта (catalog/custom), backend не предоставляет

### Несоответствия типов:
1. **price** - backend: `float`, UI: `string`
2. **createdAt** - backend: `datetime`, UI: `Date`

### Отсутствующие поля в backend:
- `images[]` - массив изображений
- `productionTime` - время производства (строка)
- `width`, `height` - размеры продукта
- `colors[]` - доступные цвета
- `catalogWidth`, `catalogHeight` - размеры в каталоге
- `ingredients[]` - состав/ингредиенты

## План исправления

### Вариант 1: Расширить Backend модель (РЕКОМЕНДУЕТСЯ)

Добавить недостающие поля в SQLModel:

```python
class Product(SQLModel, table=True):
    # Существующие поля
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str  # Используем как title в UI
    description: Optional[str] = None
    price: float
    category: ProductCategory
    preparation_time: Optional[int] = None
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

    # НОВЫЕ поля для соответствия Frontend
    is_available: bool = Field(default=True)
    product_type: str = Field(default="catalog")  # "catalog" | "custom"
    images: Optional[str] = None  # JSON массив URL изображений
    production_time: Optional[str] = None  # Например: "2-3 дня"
    width: Optional[str] = None  # Например: "30 см"
    height: Optional[str] = None  # Например: "40 см"
    colors: Optional[str] = None  # JSON массив цветов
    catalog_width: Optional[str] = None
    catalog_height: Optional[str] = None
    ingredients: Optional[str] = None  # JSON массив ингредиентов
```

### Вариант 2: Создать адаптер на Frontend

Создать файл `src/adapters/productAdapter.ts`:

```typescript
export function adaptBackendProduct(backendProduct: ApiProduct): Product {
    return {
        id: backendProduct.id,
        title: backendProduct.name,  // Маппинг name -> title
        name: backendProduct.name,
        price: backendProduct.price.toString(),
        image: backendProduct.image_url || '',
        images: [],  // Пока пустой массив
        isAvailable: true,  // По умолчанию true
        createdAt: new Date(backendProduct.created_at),
        type: "catalog" as const,  // По умолчанию catalog
        category: backendProduct.category,
        description: backendProduct.description,
        preparationTime: backendProduct.preparation_time,
        // Остальные поля undefined или дефолтные значения
    };
}
```

## Рекомендации

1. **Срочно**: Реализовать адаптер (Вариант 2) для быстрого восстановления работоспособности
2. **Долгосрочно**: Расширить backend модель (Вариант 1) для полной поддержки функционала
3. **Документация**: Создать API контракт между frontend и backend
4. **Тестирование**: Добавить интеграционные тесты для проверки соответствия структур данных

## Команды для тестирования

```bash
# Проверить текущий API ответ
curl http://localhost:8011/api/products | python3 -m json.tool

# Запустить frontend и проверить консоль на ошибки
npm run dev
# Открыть http://localhost:3000 и перейти на вкладку "Витрина"
```