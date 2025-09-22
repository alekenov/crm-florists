import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Search,
  X,
  Grid3X3,
  List,
  Filter,
  SortAsc,
  Eye,
  EyeOff,
  Edit,
  Copy,
  Trash2,
  Package,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Dropdown, DropdownContent, DropdownItem, DropdownTrigger } from '../ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Checkbox } from '../ui/checkbox';
import { Slider } from '../ui/slider';
import { FilterTabs } from '../common/FilterTabs';
import { FilterContainer } from '../common/FilterContainer';
import { EmptyState } from '../common/EmptyState';
import { PageHeader } from '../common/PageHeader';
import { Product, InventoryItem } from '../../src/types';
import { getTimeAgo } from '../../src/utils/date';
import { urlManager } from '../../src/utils/url';

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

type ViewMode = 'grid' | 'list' | 'table';
type SortBy = 'name' | 'price' | 'created' | 'updated' | 'availability';
type SortOrder = 'asc' | 'desc';

interface ProductFilters {
  categories: string[];
  priceRange: [number, number];
  availability: 'all' | 'available' | 'unavailable';
  stockStatus: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock';
  hasImages: boolean | null;
}

const DEFAULT_FILTERS: ProductFilters = {
  categories: [],
  priceRange: [0, 50000],
  availability: 'all',
  stockStatus: 'all',
  hasImages: null
};

export function ProductsCatalogView({
  products,
  inventoryItems = [],
  onAddProduct,
  onViewProduct,
  onEditProduct,
  onDuplicateProduct,
  onDeleteProduct,
  onToggleProduct,
  onBulkToggle,
  onBulkDelete
}: ProductsCatalogViewProps) {
  const urlParams = urlManager.getParams();

  // State management
  const [filter, setFilter] = useState<'vitrina' | 'catalog'>(
    (urlParams.filter as 'vitrina' | 'catalog') || 'vitrina'
  );
  const [searchQuery, setSearchQuery] = useState(urlParams.search || '');
  const [isSearchOpen, setIsSearchOpen] = useState(!!urlParams.search);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [sortBy, setSortBy] = useState<SortBy>('created');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [filters, setFilters] = useState<ProductFilters>(DEFAULT_FILTERS);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<Set<number>>(new Set());
  const [showBulkActions, setShowBulkActions] = useState(false);

  // Derived data
  const categories = useMemo(() => {
    const cats = products
      .map(p => p.category)
      .filter(Boolean)
      .filter((cat, index, arr) => arr.indexOf(cat) === index);
    return cats as string[];
  }, [products]);

  const priceRange = useMemo(() => {
    const prices = products
      .map(p => parseFloat(p.price.replace(/[^\d]/g, '')))
      .filter(price => !isNaN(price));
    return prices.length ? [Math.min(...prices), Math.max(...prices)] : [0, 50000];
  }, [products]);

  // URL sync
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const params = urlManager.getParams();
      setFilter((params.filter as 'vitrina' | 'catalog') || 'vitrina');
      setSearchQuery(params.search || '');
      setIsSearchOpen(!!params.search);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Inventory integration
  const getStockStatus = (product: Product): 'in_stock' | 'low_stock' | 'out_of_stock' => {
    if (product.type === 'custom') return 'in_stock'; // Custom products don't have stock

    const relatedInventory = inventoryItems.filter(item =>
      product.ingredients?.some(ingredient =>
        item.name.toLowerCase().includes(ingredient.toLowerCase())
      )
    );

    if (relatedInventory.length === 0) return 'out_of_stock';

    const hasLowStock = relatedInventory.some(item => item.status === 'low');
    const hasOutOfStock = relatedInventory.some(item => item.quantity === 0);

    if (hasOutOfStock) return 'out_of_stock';
    if (hasLowStock) return 'low_stock';
    return 'in_stock';
  };

  // Filter and search logic
  const filteredAndSortedProducts = useMemo(() => {
    let result = products;

    // Type filter
    result = filter === 'vitrina'
      ? result.filter(product => product.type === 'vitrina' || product.isAvailable)
      : result.filter(product => product.type === 'catalog');

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(product =>
        product.title.toLowerCase().includes(query) ||
        product.description?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query) ||
        product.price.toLowerCase().includes(query)
      );
    }

    // Advanced filters
    if (filters.categories.length > 0) {
      result = result.filter(product =>
        product.category && filters.categories.includes(product.category)
      );
    }

    if (filters.availability !== 'all') {
      result = result.filter(product =>
        filters.availability === 'available' ? product.isAvailable : !product.isAvailable
      );
    }

    if (filters.stockStatus !== 'all') {
      result = result.filter(product => {
        const stockStatus = getStockStatus(product);
        return stockStatus === filters.stockStatus;
      });
    }

    if (filters.hasImages !== null) {
      result = result.filter(product =>
        filters.hasImages ? (product.images && product.images.length > 0) : (!product.images || product.images.length === 0)
      );
    }

    // Price range filter
    result = result.filter(product => {
      const price = parseFloat(product.price.replace(/[^\d]/g, ''));
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Sorting
    result.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortBy) {
        case 'name':
          aVal = a.title.toLowerCase();
          bVal = b.title.toLowerCase();
          break;
        case 'price':
          aVal = parseFloat(a.price.replace(/[^\d]/g, ''));
          bVal = parseFloat(b.price.replace(/[^\d]/g, ''));
          break;
        case 'created':
          aVal = new Date(a.createdAt).getTime();
          bVal = new Date(b.createdAt).getTime();
          break;
        case 'availability':
          aVal = a.isAvailable ? 1 : 0;
          bVal = b.isAvailable ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [products, filter, searchQuery, filters, sortBy, sortOrder, inventoryItems]);

  // Event handlers
  const handleFilterChange = (newFilter: 'vitrina' | 'catalog') => {
    setFilter(newFilter);
    urlManager.setProductsFilter(newFilter);
  };

  const handleSearchClick = () => {
    const newIsSearchOpen = !isSearchOpen;
    setIsSearchOpen(newIsSearchOpen);
    if (!newIsSearchOpen) {
      setSearchQuery('');
      urlManager.setProductsSearch('');
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    urlManager.setProductsSearch(query);
  };

  const handleSelectProduct = (productId: number, selected: boolean) => {
    const newSelected = new Set(selectedProducts);
    if (selected) {
      newSelected.add(productId);
    } else {
      newSelected.delete(productId);
    }
    setSelectedProducts(newSelected);
    setShowBulkActions(newSelected.size > 0);
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedProducts(new Set(filteredAndSortedProducts.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
    setShowBulkActions(selected && filteredAndSortedProducts.length > 0);
  };

  const handleBulkToggle = (enabled: boolean) => {
    if (onBulkToggle) {
      onBulkToggle(Array.from(selectedProducts), enabled);
    }
    setSelectedProducts(new Set());
    setShowBulkActions(false);
  };

  const handleBulkDelete = () => {
    if (onBulkDelete) {
      onBulkDelete(Array.from(selectedProducts));
    }
    setSelectedProducts(new Set());
    setShowBulkActions(false);
  };

  // Stats
  const vitrinaProducts = products.filter(product => product.type === 'vitrina');
  const catalogProducts = products.filter(product => product.type === 'catalog');
  const activeVitrinaCount = vitrinaProducts.filter(p => p.isAvailable).length;
  const totalCatalogCount = catalogProducts.length;

  const tabs = [
    { key: 'vitrina', label: 'Витрина', count: activeVitrinaCount },
    { key: 'catalog', label: 'Каталог', count: totalCatalogCount }
  ];

  // Header actions
  const headerActions = (
    <div className="flex items-center gap-2">
      {/* View mode toggle */}
      <div className="hidden lg:flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        <Button
          variant={viewMode === 'grid' ? 'default' : 'ghost'}
          size="sm"
          className="p-2 h-8"
          onClick={() => setViewMode('grid')}
        >
          <Grid3X3 className="w-4 h-4" />
        </Button>
        <Button
          variant={viewMode === 'list' ? 'default' : 'ghost'}
          size="sm"
          className="p-2 h-8"
          onClick={() => setViewMode('list')}
        >
          <List className="w-4 h-4" />
        </Button>
      </div>

      {/* Filter toggle */}
      <Button
        variant={showFilters ? 'default' : 'ghost'}
        size="sm"
        className="p-2"
        onClick={() => setShowFilters(!showFilters)}
      >
        <Filter className="w-4 h-4" />
      </Button>

      {/* Search toggle */}
      <Button
        variant={isSearchOpen ? 'default' : 'ghost'}
        size="sm"
        className="p-2"
        onClick={handleSearchClick}
      >
        <Search className="w-4 h-4" />
      </Button>

      {/* Add product (mobile) */}
      <Button variant="ghost" size="sm" className="p-2 lg:hidden" onClick={onAddProduct}>
        <Plus className="w-5 h-5 text-gray-600" />
      </Button>
    </div>
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <PageHeader title="Товары" actions={headerActions} />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Товары</h1>
            <p className="text-gray-600 mt-1">
              Управление каталогом и витриной магазина
            </p>
          </div>
          <div className="flex items-center gap-4">
            {headerActions}
            <Button onClick={onAddProduct} className="ml-4">
              <Plus className="w-4 h-4 mr-2" />
              Добавить товар
            </Button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск по названию, описанию, категории или цене..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setIsSearchOpen(false);
                  urlManager.setProductsSearch('');
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-600">
              Найдено: {filteredAndSortedProducts.length} товаров
            </div>
          )}
        </div>
      )}

      {/* Filters Panel */}
      {showFilters && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="space-y-4">
            {/* Categories */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Категории
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <label key={category} className="flex items-center space-x-2">
                      <Checkbox
                        checked={filters.categories.includes(category)}
                        onCheckedChange={(checked) => {
                          const newCategories = checked
                            ? [...filters.categories, category]
                            : filters.categories.filter(c => c !== category);
                          setFilters(prev => ({ ...prev, categories: newCategories }));
                        }}
                      />
                      <span className="text-sm text-gray-600">{category}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Цена: {filters.priceRange[0]} - {filters.priceRange[1]} ₸
              </label>
              <Slider
                value={filters.priceRange}
                onValueChange={(value) => setFilters(prev => ({ ...prev, priceRange: value as [number, number] }))}
                min={priceRange[0]}
                max={priceRange[1]}
                step={100}
                className="w-full"
              />
            </div>

            {/* Availability */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Доступность
              </label>
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'Все' },
                  { key: 'available', label: 'Доступные' },
                  { key: 'unavailable', label: 'Недоступные' }
                ].map(option => (
                  <Button
                    key={option.key}
                    variant={filters.availability === option.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, availability: option.key as any }))}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Статус склада
              </label>
              <div className="flex gap-2">
                {[
                  { key: 'all', label: 'Все' },
                  { key: 'in_stock', label: 'В наличии' },
                  { key: 'low_stock', label: 'Мало' },
                  { key: 'out_of_stock', label: 'Нет в наличии' }
                ].map(option => (
                  <Button
                    key={option.key}
                    variant={filters.stockStatus === option.key ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilters(prev => ({ ...prev, stockStatus: option.key as any }))}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Clear filters */}
            <div className="pt-2 border-t">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilters(DEFAULT_FILTERS)}
              >
                Сбросить фильтры
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <FilterContainer>
        <div className="flex justify-between items-center">
          <FilterTabs
            tabs={tabs}
            activeTab={filter}
            onTabChange={(tab) => handleFilterChange(tab as any)}
          />

          {/* Sort */}
          <div className="hidden lg:flex items-center gap-2">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-') as [SortBy, SortOrder];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="text-sm border border-gray-300 rounded px-2 py-1"
            >
              <option value="created-desc">Новые первыми</option>
              <option value="created-asc">Старые первыми</option>
              <option value="name-asc">По алфавиту А-Я</option>
              <option value="name-desc">По алфавиту Я-А</option>
              <option value="price-asc">Дешевые первыми</option>
              <option value="price-desc">Дорогие первыми</option>
              <option value="availability-desc">Доступные первыми</option>
            </select>
          </div>
        </div>

        {/* Bulk actions */}
        {showBulkActions && (
          <div className="mt-3 p-3 bg-blue-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-blue-700">
              Выбрано: {selectedProducts.size} товаров
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkToggle(true)}
              >
                <Eye className="w-4 h-4 mr-1" />
                Включить
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleBulkToggle(false)}
              >
                <EyeOff className="w-4 h-4 mr-1" />
                Выключить
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleBulkDelete}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Удалить
              </Button>
            </div>
          </div>
        )}
      </FilterContainer>

      {/* Products Grid/List */}
      <div className="p-4">
        {filteredAndSortedProducts.length > 0 ? (
          <ProductsGrid
            products={filteredAndSortedProducts}
            viewMode={viewMode}
            selectedProducts={selectedProducts}
            onSelectProduct={handleSelectProduct}
            onSelectAll={handleSelectAll}
            onViewProduct={onViewProduct}
            onEditProduct={onEditProduct}
            onDuplicateProduct={onDuplicateProduct}
            onDeleteProduct={onDeleteProduct}
            onToggleProduct={onToggleProduct}
            getStockStatus={getStockStatus}
            searchQuery={searchQuery}
          />
        ) : (
          <EmptyState
            icon={searchQuery ? <Search className="w-8 h-8 text-gray-400" /> : <Package className="w-8 h-8 text-gray-400" />}
            title={
              searchQuery ? "По запросу ничего не найдено" :
              filter === 'vitrina' ? 'Нет товаров в витрине' : 'Нет товаров'
            }
            description={
              searchQuery
                ? `Попробуйте изменить поисковый запрос "${searchQuery}"`
                : filter === 'vitrina'
                ? 'Включите товары в витрину, чтобы они отображались покупателям'
                : 'Добавьте свой первый товар, чтобы начать продавать'
            }
            action={
              !searchQuery && (
                <Button onClick={onAddProduct}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить товар
                </Button>
              )
            }
          />
        )}
      </div>
    </div>
  );
}

// Products Grid Component
interface ProductsGridProps {
  products: Product[];
  viewMode: ViewMode;
  selectedProducts: Set<number>;
  onSelectProduct: (id: number, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onViewProduct: (id: number) => void;
  onEditProduct: (id: number) => void;
  onDuplicateProduct: (id: number) => void;
  onDeleteProduct: (id: number) => void;
  onToggleProduct: (id: number) => void;
  getStockStatus: (product: Product) => 'in_stock' | 'low_stock' | 'out_of_stock';
  searchQuery?: string;
}

function ProductsGrid({
  products,
  viewMode,
  selectedProducts,
  onSelectProduct,
  onSelectAll,
  onViewProduct,
  onEditProduct,
  onDuplicateProduct,
  onDeleteProduct,
  onToggleProduct,
  getStockStatus,
  searchQuery
}: ProductsGridProps) {
  const highlightMatch = (text: string, query?: string) => {
    if (!query || !text) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  const getStockStatusBadge = (product: Product) => {
    const status = getStockStatus(product);
    const configs = {
      in_stock: { label: 'В наличии', className: 'bg-green-100 text-green-700' },
      low_stock: { label: 'Мало', className: 'bg-yellow-100 text-yellow-700' },
      out_of_stock: { label: 'Нет в наличии', className: 'bg-red-100 text-red-700' }
    };

    const config = configs[status];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  if (viewMode === 'grid') {
    return (
      <div>
        {/* Select all - Grid mode */}
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center space-x-2">
            <Checkbox
              checked={selectedProducts.size === products.length && products.length > 0}
              onCheckedChange={onSelectAll}
            />
            <span className="text-sm text-gray-600">
              Выбрать все ({products.length})
            </span>
          </label>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative">
                <div
                  className="aspect-square bg-cover bg-center cursor-pointer"
                  style={{ backgroundImage: `url('${product.image}')` }}
                  onClick={() => onViewProduct(product.id)}
                >
                  {!product.isAvailable && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <Badge variant="secondary">Неактивен</Badge>
                    </div>
                  )}
                </div>

                {/* Selection checkbox */}
                <div className="absolute top-2 left-2">
                  <Checkbox
                    checked={selectedProducts.has(product.id)}
                    onCheckedChange={(checked) => onSelectProduct(product.id, !!checked)}
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {/* Quick actions */}
                <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="secondary" className="p-1 h-8 w-8" onClick={() => onEditProduct(product.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="secondary" className="p-1 h-8 w-8" onClick={() => onDuplicateProduct(product.id)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900 line-clamp-2 flex-1 mr-2">
                      {highlightMatch(product.title, searchQuery)}
                    </h3>
                    <Switch
                      checked={product.isAvailable}
                      onCheckedChange={() => onToggleProduct(product.id)}
                      className="data-[state=checked]:bg-emerald-500 flex-shrink-0"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-semibold text-gray-900">
                      {highlightMatch(product.price, searchQuery)}
                    </span>
                    {getStockStatusBadge(product)}
                  </div>

                  {product.category && (
                    <Badge variant="outline" className="text-xs">
                      {product.category}
                    </Badge>
                  )}

                  <div className="text-xs text-gray-500">
                    {getTimeAgo(product.createdAt)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="space-y-2">
      {/* Select all - List mode */}
      <div className="flex items-center justify-between mb-4">
        <label className="flex items-center space-x-2">
          <Checkbox
            checked={selectedProducts.size === products.length && products.length > 0}
            onCheckedChange={onSelectAll}
          />
          <span className="text-sm text-gray-600">
            Выбрать все ({products.length})
          </span>
        </label>
      </div>

      {products.map((product) => (
        <Card key={product.id} className="overflow-hidden hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              {/* Selection */}
              <Checkbox
                checked={selectedProducts.has(product.id)}
                onCheckedChange={(checked) => onSelectProduct(product.id, !!checked)}
              />

              {/* Image */}
              <div
                className="w-16 h-16 bg-cover bg-center rounded-lg flex-shrink-0 cursor-pointer relative"
                style={{ backgroundImage: `url('${product.image}')` }}
                onClick={() => onViewProduct(product.id)}
              >
                {!product.isAvailable && (
                  <div className="absolute inset-0 bg-white/60 rounded-lg"></div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0 mr-4">
                    <h3 className="font-medium text-gray-900 truncate">
                      {highlightMatch(product.title, searchQuery)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {highlightMatch(product.price, searchQuery)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      {product.category && (
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      )}
                      {getStockStatusBadge(product)}
                      <span className="text-xs text-gray-500">
                        {getTimeAgo(product.createdAt)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" onClick={() => onEditProduct(product.id)}>
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => onDuplicateProduct(product.id)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Switch
                      checked={product.isAvailable}
                      onCheckedChange={() => onToggleProduct(product.id)}
                      className="data-[state=checked]:bg-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}