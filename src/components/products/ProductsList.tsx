import React, { useState, useEffect } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Switch } from '../ui/switch';
import { FilterTabs } from '../common/FilterTabs';
import { FilterContainer } from '../common/FilterContainer';
import { EmptyState } from '../common/EmptyState';
import { PageHeader } from '../common/PageHeader';
import { ProductItem } from './ProductItem';
import { Product } from '../../src/types';
import { getTimeAgo } from '../../src/utils/date';
import { urlManager } from '../../src/utils/url';

interface ProductsListProps {
  products: Product[];
  onAddProduct: () => void;
  onViewProduct: (id: number) => void;
  onToggleProduct: (id: number) => void;
}

export function ProductsList({ products, onAddProduct, onViewProduct, onToggleProduct }: ProductsListProps) {
  const urlParams = urlManager.getParams();
  
  const [filter, setFilter] = useState<'vitrina' | 'catalog'>(
    (urlParams.filter as 'vitrina' | 'catalog') || 'vitrina'
  );
  const [searchQuery, setSearchQuery] = useState(urlParams.search || '');
  const [isSearchOpen, setIsSearchOpen] = useState(!!urlParams.search);

  // Listen for URL changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handlePopState = () => {
      const params = urlManager.getParams();
      setFilter((params.filter as 'vitrina' | 'catalog') || 'vitrina');
      setSearchQuery(params.search || '');
      setIsSearchOpen(!!params.search);
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

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

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
    urlManager.setProductsSearch('');
  };

  // Функция поиска товаров
  const searchProducts = (products: Product[], query: string) => {
    if (!query.trim()) return products;
    
    const lowerQuery = query.toLowerCase().trim();
    
    return products.filter(product => {
      return product.title.toLowerCase().includes(lowerQuery) ||
             product.price.toLowerCase().includes(lowerQuery);
    });
  };

  const vitrinaProducts = products.filter(product => product.type === 'vitrina');
  const catalogProducts = products.filter(product => product.type === 'catalog');

  let filteredProducts = filter === 'vitrina' 
    ? vitrinaProducts.filter(product => product.isAvailable)
    : catalogProducts;

  // Применяем поиск
  filteredProducts = searchProducts(filteredProducts, searchQuery);

  const activeVitrinaCount = vitrinaProducts.filter(p => p.isAvailable).length;
  const totalCatalogCount = catalogProducts.length;

  const tabs = [
    { key: 'vitrina', label: 'Витрина', count: activeVitrinaCount },
    { key: 'catalog', label: 'Каталог', count: totalCatalogCount }
  ];

  const headerActions = (
    <>
      <Button variant="ghost" size="sm" className="p-2 lg:hidden" onClick={onAddProduct}>
        <Plus className="w-5 h-5 text-gray-600" />
      </Button>
      <Button 
        variant="ghost" 
        size="sm" 
        className={`p-2 ${isSearchOpen ? 'bg-gray-100' : ''}`}
        onClick={handleSearchClick}
      >
        <Search className="w-5 h-5 text-gray-600" />
      </Button>
    </>
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
          <h1>Товары</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`p-2 ${isSearchOpen ? 'bg-gray-100' : ''}`}
            onClick={handleSearchClick}
          >
            <Search className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative">
            <input
              type="text"
              placeholder="Поиск по названию товара или цене..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full px-3 py-2 pr-10 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-600">
              Найдено: {filteredProducts.length} товаров
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <FilterContainer>
        <FilterTabs 
          tabs={tabs} 
          activeTab={filter} 
          onTabChange={(tab) => handleFilterChange(tab as any)} 
        />
      </FilterContainer>

      {/* Products List - Mobile View */}
      <div className="lg:hidden pb-20">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductItem 
              key={product.id}
              {...product}
              onToggle={onToggleProduct}
              onView={onViewProduct}
              searchQuery={searchQuery}
            />
          ))
        ) : (
          <EmptyState
            icon={searchQuery ? <Search className="w-8 h-8 text-gray-400" /> : <Plus className="w-8 h-8 text-gray-400" />}
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
          />
        )}
      </div>

      {/* Products Table - Desktop View */}
      <div className="hidden lg:block">
        {filteredProducts.length > 0 ? (
          <div className="border border-gray-200 rounded-lg mx-4 my-4">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-medium">
                {filter === 'vitrina' ? 'Товары в витрине' : 'Каталог товаров'} ({filteredProducts.length})
              </h3>
              <Button onClick={onAddProduct} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Добавить товар
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Фото</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead className="w-32">Цена</TableHead>
                  <TableHead className="w-24">Статус</TableHead>
                  <TableHead className="w-32">Добавлен</TableHead>
                  <TableHead className="w-20">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.map((product) => (
                  <TableRow 
                    key={product.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onViewProduct(product.id)}
                  >
                    <TableCell>
                      <div 
                        className="w-12 h-12 bg-cover bg-center rounded-lg relative overflow-hidden"
                        style={{ backgroundImage: `url('${product.image}')` }}
                      >
                        {!product.isAvailable && <div className="absolute inset-0 bg-white/60"></div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`${product.isAvailable ? 'text-gray-900' : 'text-gray-500'}`}>
                        {product.title}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`${product.isAvailable ? 'text-gray-700' : 'text-gray-500'}`}>
                        {product.price}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 rounded text-xs inline-block ${
                        product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {product.isAvailable ? 'Активен' : 'Неактивен'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-600 text-sm">
                        {getTimeAgo(product.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={product.isAvailable} 
                        onCheckedChange={() => onToggleProduct(product.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="mx-4 my-8">
            <EmptyState
              icon={searchQuery ? <Search className="w-8 h-8 text-gray-400" /> : <Plus className="w-8 h-8 text-gray-400" />}
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
            />
          </div>
        )}
      </div>
    </div>
  );
}