# Products UI Specification: Florist CRM

## Overview

This specification provides comprehensive documentation for the Products module UI components designed for the florist CRM application. The design follows modern UX principles, Russian language requirements, mobile-first responsive design, and accessibility standards.

## Component Architecture

### 1. ProductsCatalogView - Main Products Interface

#### Purpose
Primary interface for browsing, searching, and managing the product catalog with support for both vitrina (storefront) and catalog views.

#### Key Features
- **Dual View Modes**: Grid and list layouts for optimal content browsing
- **Advanced Filtering**: Category, price range, availability, and stock status filters
- **Smart Search**: Real-time search with highlighting of matching terms
- **Bulk Operations**: Multi-select with bulk enable/disable and delete actions
- **Inventory Integration**: Real-time stock status indicators
- **Responsive Design**: Optimized for mobile, tablet, and desktop

#### UI Layout
```
┌─ Header (Desktop) / PageHeader (Mobile) ─────────────────┐
│ Title: "Товары"                          [View] [🔍] [+] │
├─ Search Bar (Conditional) ──────────────────────────────┤
│ [Search Input with clear button]         Found: X items │
├─ Filters Panel (Conditional) ───────────────────────────┤
│ Categories: [☐] [☐] [☐]  Price: ━━●━━  Status: [Все]   │
├─ Filter Tabs ────────────────────────────────────────────┤
│ [Витрина (X)] [Каталог (Y)]              Sort: [Новые▼] │
├─ Bulk Actions (Conditional) ─────────────────────────────┤
│ Selected: X items  [👁 Включить] [🚫 Выключить] [🗑 Удалить] │
├─ Products Grid/List ─────────────────────────────────────┤
│ ┌─Product Card──┐ ┌─Product Card──┐ ┌─Product Card──┐   │
│ │ [☐] Image     │ │ [☐] Image     │ │ [☐] Image     │   │
│ │ Title         │ │ Title         │ │ Title         │   │
│ │ Price [Badge] │ │ Price [Badge] │ │ Price [Badge] │   │
│ │ [Edit][Copy]  │ │ [Edit][Copy]  │ │ [Edit][Copy]  │   │
│ │        Toggle │ │        Toggle │ │        Toggle │   │
│ └───────────────┘ └───────────────┘ └───────────────┘   │
└─────────────────────────────────────────────────────────┘
```

#### Component Props
```typescript
interface ProductsCatalogViewProps {
  products: Product[];
  inventoryItems?: InventoryItem[];
  onAddProduct: () => void;
  onViewProduct: (id: number) => void;
  onEditProduct: (id: number) => void;
  onDuplicateProduct: (id: number) => void;
  onDeleteProduct: (id: number) => void;
  onToggleProduct: (id: number) => void;
  onBulkToggle?: (ids: number[], enabled: boolean) => void;
  onBulkDelete?: (ids: number[]) => void;
}
```

#### Responsive Breakpoints
- **Mobile**: < 768px - Single column, touch-friendly targets
- **Tablet**: 768px - 1024px - 2-3 columns, mixed interactions
- **Desktop**: > 1024px - 4+ columns, mouse optimized

### 2. ProductDetailView - Product Management Interface

#### Purpose
Comprehensive product view and editing interface with tabbed information display and inventory integration.

#### Key Features
- **Tabbed Interface**: General, Details, Inventory, Analytics sections
- **Image Gallery**: Multi-image support with thumbnail navigation
- **Form Validation**: Real-time validation with clear error messages
- **Inventory Tracking**: Real-time stock status and related materials
- **Version Control**: Change tracking and history display
- **Mobile Optimized**: Touch-friendly editing on mobile devices

#### UI Layout
```
┌─ Header ─────────────────────────────────────────────────┐
│ [← Back] Product Details / Edit Mode    [Copy][Edit][🗑] │
│ ID: 123 • Created 2 days ago                            │
├─ Tabs ───────────────────────────────────────────────────┤
│ [Основное] [Детали] [Склад] [Аналитика]                 │
├─ Tab Content ────────────────────────────────────────────┤
│ ┌─Images─────────────┐ ┌─Product Info─────────────────┐ │
│ │ [Main Image]       │ │ Title: [Input]               │ │
│ │ [📷] Upload        │ │ Description: [Textarea]      │ │
│ │ ○ ○ ○ Thumbnails   │ │ Price: [Input]               │ │
│ │                    │ │ Category: [Select]           │ │
│ └────────────────────┘ │ Available: [Toggle]          │ │
│                        │ Stock Status: [Badge]        │ │
│                        └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

#### Component Props
```typescript
interface ProductDetailViewProps {
  product: Product;
  inventoryItems?: InventoryItem[];
  isEditing: boolean;
  onBack: () => void;
  onEdit: () => void;
  onSave: (updatedProduct: Partial<Product>) => void;
  onCancel: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggle: () => void;
}
```

### 3. AddProductFlow - Multi-Step Product Creation

#### Purpose
Guided multi-step workflow for creating new products with validation and inventory integration.

#### Key Features
- **Step-by-Step Guidance**: 5-step process with clear progress indication
- **Type Selection**: Catalog vs Custom product type selection
- **Smart Suggestions**: Inventory-based ingredient suggestions
- **Image Upload**: Drag-and-drop with preview and management
- **Form Validation**: Real-time validation with step blocking
- **Review Process**: Final review before creation

#### Flow Steps
1. **Type Selection**: Choose between catalog or custom product
2. **Basic Information**: Title, description, price, category
3. **Details**: Dimensions, colors, ingredients, production time
4. **Images**: Upload and organize product images
5. **Review**: Final verification before saving

#### UI Layout
```
┌─ Header ─────────────────────────────────────────────────┐
│ [← Cancel] Add Product                    Step 2 of 5    │
│ Basic Information • Enter title, price and category      │
├─ Progress ───────────────────────────────────────────────┤
│ ●━━●━━○━━○━━○  [Type][Basic][Details][Images][Review]    │
├─ Step Content ───────────────────────────────────────────┤
│ ┌─Step Card─────────────────────────────────────────────┐│
│ │ Title: Product Type Selection                         ││
│ │ ┌─Option 1──────────────────────────────────────────┐││
│ │ │ ○ Catalog Product                                 │││
│ │ │   Standard product with fixed characteristics     │││
│ │ │   • Fixed price • Standard sizes • Stock tracking │││
│ │ └───────────────────────────────────────────────────┘││
│ │ ┌─Option 2──────────────────────────────────────────┐││
│ │ │ ○ Custom Product                                  │││
│ │ │   Individual product with customization           │││
│ │ │   • Flexible price • Custom sizes • Made to order│││
│ │ └───────────────────────────────────────────────────┘││
│ └─────────────────────────────────────────────────────┘│
├─ Footer ─────────────────────────────────────────────────┤
│ [← Back]                                       [Next →] │
└─────────────────────────────────────────────────────────┘
```

#### Component Props
```typescript
interface AddProductFlowProps {
  inventoryItems?: InventoryItem[];
  onSave: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}
```

### 4. InventoryIntegration - Stock Management Interface

#### Purpose
Real-time inventory tracking and product availability management with automated alerts and recommendations.

#### Key Features
- **Status Dashboard**: Overview of product availability across inventory
- **Alert System**: Critical, warning, and informational alerts
- **Product Analysis**: Detailed breakdown of inventory impact per product
- **Bulk Actions**: Mass updates based on inventory status
- **Filtering**: Search and filter by availability status
- **Recommendations**: Automated suggestions for inventory management

#### UI Layout
```
┌─ Header ─────────────────────────────────────────────────┐
│ Inventory Integration                         [+ Add Item]│
│ Track stock levels and product availability              │
├─ Alerts ─────────────────────────────────────────────────┤
│ ⚠️ 3 products out of stock due to missing materials [Fix]│
│ ⚠️ 5 products have low stock levels              [Check] │
├─ Summary Cards ──────────────────────────────────────────┤
│ [✅ 15 Available] [⚠️ 3 Low Stock] [❌ 2 Out] [ℹ️ 1 No Map]│
├─ Filters ────────────────────────────────────────────────┤
│ [🔍 Search] [Category ▼] [☐ Only Issues]               │
├─ Products List ──────────────────────────────────────────┤
│ ┌─Product Card─────────────────────────────────────────┐│
│ │ [Image] Product Name                    [Status Badge]││
│ │ Category • Price                                      ││
│ │ [Show Details ▼]                      [Actions ▼]    ││
│ │ ┌─Details Panel──────────────────────────────────────┐││
│ │ │ [Inventory][Ingredients][Availability] Tabs        │││
│ │ │ Related Materials: Rose(50), Green(0), Pack(8)    │││
│ │ │ Recommendation: Hide from storefront due to stock │││
│ │ └────────────────────────────────────────────────────┘││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

#### Component Props
```typescript
interface InventoryIntegrationProps {
  products: Product[];
  inventoryItems: InventoryItem[];
  onUpdateProduct?: (productId: number, updates: Partial<Product>) => void;
  onViewInventoryItem?: (itemId: number) => void;
  onAddInventoryItem?: () => void;
  onUpdateInventoryItem?: (itemId: number, updates: Partial<InventoryItem>) => void;
}
```

## Design System Integration

### Colors
```css
/* Primary Colors */
--primary: 220 13% 91%;           /* Light gray-blue */
--primary-foreground: 220 9% 46%; /* Dark gray-blue */

/* Status Colors */
--success: 142 76% 36%;    /* Green for available */
--warning: 38 92% 50%;     /* Amber for low stock */
--destructive: 0 84% 60%;  /* Red for out of stock */
--info: 221 83% 53%;       /* Blue for information */

/* Surface Colors */
--background: 0 0% 100%;   /* White */
--card: 0 0% 100%;         /* White */
--border: 220 13% 91%;     /* Light border */
```

### Typography
```css
/* Russian-optimized font stack */
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI',
             'Roboto', 'Helvetica Neue', sans-serif;

/* Heading Scale */
h1: 32px/40px, font-weight: 700;  /* Page titles */
h2: 24px/32px, font-weight: 600;  /* Section headers */
h3: 20px/28px, font-weight: 600;  /* Card titles */
h4: 18px/24px, font-weight: 500;  /* Subsections */

/* Body Text */
body: 16px/24px, font-weight: 400;  /* Main content */
small: 14px/20px, font-weight: 400; /* Secondary text */
caption: 12px/16px, font-weight: 400; /* Captions */
```

### Spacing System
```css
/* Spacing Scale (Tailwind-based) */
xs: 4px;   /* 1 */
sm: 8px;   /* 2 */
md: 16px;  /* 4 */
lg: 24px;  /* 6 */
xl: 32px;  /* 8 */
2xl: 48px; /* 12 */
3xl: 64px; /* 16 */
```

## Russian Language Considerations

### Key Terms
- **Товары** - Products
- **Витрина** - Storefront/Display
- **Каталог** - Catalog
- **Склад** - Warehouse/Inventory
- **Доступен** - Available
- **Нет в наличии** - Out of stock
- **Мало** - Low stock
- **Состав** - Ingredients/Composition
- **Размеры** - Dimensions
- **Цена** - Price

### Text Input Considerations
- Support for Cyrillic characters
- Right-to-left text support where needed
- Proper line breaking for Russian text
- Currency formatting (₸ - Tenge symbol)

## Mobile-First Design Principles

### Touch Targets
- Minimum 44px touch targets
- Adequate spacing between interactive elements
- Large, easy-to-tap buttons and toggles

### Navigation
- Bottom navigation for main actions
- Floating action button for primary actions
- Swipe gestures for image galleries
- Pull-to-refresh for data updates

### Performance
- Lazy loading for images
- Virtualized lists for large datasets
- Optimized bundle sizes
- Progressive loading

## Accessibility Features

### WCAG 2.1 AA Compliance
- Proper heading hierarchy
- Sufficient color contrast (4.5:1 for text)
- Keyboard navigation support
- Screen reader compatibility
- Focus management

### Keyboard Navigation
- Tab order follows logical flow
- Arrow keys for grid navigation
- Escape key for modal dismissal
- Enter/Space for activation

### Screen Reader Support
- Semantic HTML elements
- ARIA labels and descriptions
- Live regions for dynamic content
- Status announcements

## Integration Points

### API Requirements
```typescript
// Product endpoints
GET /api/products - List products with filtering
GET /api/products/:id - Get product details
POST /api/products - Create new product
PUT /api/products/:id - Update product
DELETE /api/products/:id - Delete product
PATCH /api/products/:id/toggle - Toggle availability

// Inventory endpoints
GET /api/inventory - List inventory items
GET /api/inventory/status - Get stock status for products
```

### State Management
```typescript
// Product state
interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  filters: ProductFilters;
  selectedProducts: Set<number>;
}

// Inventory state
interface InventoryState {
  items: InventoryItem[];
  productStatus: ProductInventoryStatus[];
  alerts: InventoryAlert[];
}
```

## Performance Considerations

### Optimization Strategies
- Image lazy loading and compression
- Virtual scrolling for large product lists
- Debounced search input
- Memoized filter calculations
- Optimistic UI updates

### Bundle Optimization
- Code splitting by route
- Dynamic imports for heavy components
- Tree shaking for unused dependencies
- Compressed asset delivery

## Testing Strategy

### Unit Testing
- Component rendering tests
- User interaction tests
- Form validation tests
- Accessibility tests

### Integration Testing
- API integration tests
- State management tests
- Navigation flow tests
- Error handling tests

### E2E Testing
- Complete user workflows
- Cross-browser compatibility
- Mobile device testing
- Performance benchmarks

## Deployment Considerations

### Environment Configuration
```env
# API endpoints
REACT_APP_API_BASE_URL=http://localhost:8011
REACT_APP_IMAGE_UPLOAD_URL=/api/upload

# Feature flags
REACT_APP_ENABLE_BULK_ACTIONS=true
REACT_APP_ENABLE_INVENTORY_INTEGRATION=true
```

### Build Optimization
- Production build optimization
- Asset compression and caching
- CDN integration for images
- Service worker for offline support

## Conclusion

This comprehensive UI specification provides a solid foundation for implementing the Products module in the florist CRM application. The design prioritizes user experience, accessibility, and performance while maintaining consistency with the existing application architecture.

The components are designed to be:
- **Scalable**: Handle growing product catalogs
- **Accessible**: Meet WCAG 2.1 AA standards
- **Responsive**: Work across all device sizes
- **Maintainable**: Follow consistent patterns
- **Performant**: Optimized for real-world usage

Regular reviews and updates should be conducted to ensure the specification remains current with user needs and technology changes.