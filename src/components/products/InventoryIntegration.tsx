import React, { useState, useMemo } from 'react';
import {
  Package,
  AlertTriangle,
  Check,
  X,
  Search,
  Plus,
  Minus,
  ExternalLink,
  TrendingDown,
  TrendingUp,
  Clock,
  Info
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Alert, AlertDescription } from '../ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Checkbox } from '../ui/checkbox';
import { Product, InventoryItem } from '../../src/types';
import { getTimeAgo } from '../../src/utils/date';

interface InventoryIntegrationProps {
  products: Product[];
  inventoryItems: InventoryItem[];
  onUpdateProduct?: (productId: number, updates: Partial<Product>) => void;
  onViewInventoryItem?: (itemId: number) => void;
  onAddInventoryItem?: () => void;
  onUpdateInventoryItem?: (itemId: number, updates: Partial<InventoryItem>) => void;
}

interface ProductInventoryStatus {
  product: Product;
  relatedItems: InventoryItem[];
  status: 'available' | 'low_stock' | 'out_of_stock' | 'no_ingredients';
  availableQuantity?: number;
  totalCost?: number;
  missingIngredients: string[];
}

interface InventoryAlert {
  type: 'critical' | 'warning' | 'info';
  message: string;
  productIds: number[];
  action?: string;
}

export function InventoryIntegration({
  products,
  inventoryItems,
  onUpdateProduct,
  onViewInventoryItem,
  onAddInventoryItem,
  onUpdateInventoryItem
}: InventoryIntegrationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showOnlyIssues, setShowOnlyIssues] = useState(false);

  // Calculate inventory status for products
  const productInventoryStatus = useMemo((): ProductInventoryStatus[] => {
    return products.map(product => {
      const relatedItems = inventoryItems.filter(item => {
        if (!product.ingredients || product.ingredients.length === 0) {
          return false;
        }

        return product.ingredients.some(ingredient =>
          item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
          ingredient.toLowerCase().includes(item.name.toLowerCase())
        );
      });

      const missingIngredients = product.ingredients?.filter(ingredient =>
        !inventoryItems.some(item =>
          item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
          ingredient.toLowerCase().includes(item.name.toLowerCase())
        )
      ) || [];

      let status: ProductInventoryStatus['status'] = 'available';
      let availableQuantity = 0;
      let totalCost = 0;

      if (product.ingredients && product.ingredients.length > 0) {
        if (missingIngredients.length > 0) {
          status = 'no_ingredients';
        } else if (relatedItems.some(item => item.quantity === 0)) {
          status = 'out_of_stock';
        } else if (relatedItems.some(item => item.status === 'low')) {
          status = 'low_stock';
        }

        // Calculate minimum available quantity based on ingredients
        if (relatedItems.length > 0) {
          availableQuantity = Math.min(...relatedItems.map(item => item.quantity));
        }

        // Calculate total cost
        totalCost = relatedItems.reduce((sum, item) => {
          const price = parseFloat(item.price.replace(/[^\d]/g, '')) || 0;
          return sum + price;
        }, 0);
      } else {
        status = 'no_ingredients';
      }

      return {
        product,
        relatedItems,
        status,
        availableQuantity,
        totalCost,
        missingIngredients
      };
    });
  }, [products, inventoryItems]);

  // Generate alerts
  const alerts = useMemo((): InventoryAlert[] => {
    const alerts: InventoryAlert[] = [];

    const criticalProducts = productInventoryStatus.filter(p => p.status === 'out_of_stock');
    const lowStockProducts = productInventoryStatus.filter(p => p.status === 'low_stock');
    const noIngredientsProducts = productInventoryStatus.filter(p => p.status === 'no_ingredients');

    if (criticalProducts.length > 0) {
      alerts.push({
        type: 'critical',
        message: `${criticalProducts.length} товаров недоступны из-за отсутствия материалов`,
        productIds: criticalProducts.map(p => p.product.id),
        action: 'Пополнить склад'
      });
    }

    if (lowStockProducts.length > 0) {
      alerts.push({
        type: 'warning',
        message: `${lowStockProducts.length} товаров имеют низкие остатки`,
        productIds: lowStockProducts.map(p => p.product.id),
        action: 'Проверить остатки'
      });
    }

    if (noIngredientsProducts.length > 0) {
      alerts.push({
        type: 'info',
        message: `${noIngredientsProducts.length} товаров не имеют привязки к складу`,
        productIds: noIngredientsProducts.map(p => p.product.id),
        action: 'Настроить состав'
      });
    }

    return alerts;
  }, [productInventoryStatus]);

  // Filter products
  const filteredStatus = useMemo(() => {
    let filtered = productInventoryStatus;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.product.title.toLowerCase().includes(query) ||
        item.product.category?.toLowerCase().includes(query)
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.product.category === selectedCategory);
    }

    if (showOnlyIssues) {
      filtered = filtered.filter(item =>
        item.status === 'out_of_stock' ||
        item.status === 'low_stock' ||
        item.status === 'no_ingredients'
      );
    }

    return filtered;
  }, [productInventoryStatus, searchQuery, selectedCategory, showOnlyIssues]);

  // Get unique categories
  const categories = useMemo(() => {
    const cats = products
      .map(p => p.category)
      .filter(Boolean)
      .filter((cat, index, arr) => arr.indexOf(cat) === index);
    return cats as string[];
  }, [products]);

  const getStatusBadge = (status: ProductInventoryStatus['status']) => {
    const configs = {
      available: { label: 'Доступен', className: 'bg-green-100 text-green-700' },
      low_stock: { label: 'Мало на складе', className: 'bg-yellow-100 text-yellow-700' },
      out_of_stock: { label: 'Нет в наличии', className: 'bg-red-100 text-red-700' },
      no_ingredients: { label: 'Нет привязки', className: 'bg-gray-100 text-gray-700' }
    };

    const config = configs[status];
    return (
      <Badge variant="outline" className={config.className}>
        {config.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: ProductInventoryStatus['status']) => {
    switch (status) {
      case 'available':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'low_stock':
        return <TrendingDown className="w-4 h-4 text-yellow-600" />;
      case 'out_of_stock':
        return <X className="w-4 h-4 text-red-600" />;
      case 'no_ingredients':
        return <Info className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Интеграция со складом</h2>
          <p className="text-gray-600 mt-1">
            Отслеживание остатков и доступности товаров
          </p>
        </div>
        <Button onClick={onAddInventoryItem}>
          <Plus className="w-4 h-4 mr-2" />
          Добавить материал
        </Button>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <Alert
              key={index}
              variant={alert.type === 'critical' ? 'destructive' : 'default'}
              className={
                alert.type === 'warning' ? 'border-yellow-200 bg-yellow-50' :
                alert.type === 'info' ? 'border-blue-200 bg-blue-50' : ''
              }
            >
              {alert.type === 'critical' ? (
                <AlertTriangle className="w-4 h-4" />
              ) : alert.type === 'warning' ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <Info className="w-4 h-4" />
              )}
              <AlertDescription className="flex items-center justify-between">
                <span>{alert.message}</span>
                {alert.action && (
                  <Button variant="outline" size="sm">
                    {alert.action}
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {productInventoryStatus.filter(p => p.status === 'available').length}
                </div>
                <div className="text-sm text-gray-600">Доступно</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {productInventoryStatus.filter(p => p.status === 'low_stock').length}
                </div>
                <div className="text-sm text-gray-600">Мало</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <X className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {productInventoryStatus.filter(p => p.status === 'out_of_stock').length}
                </div>
                <div className="text-sm text-gray-600">Нет в наличии</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Info className="w-5 h-5 text-gray-600" />
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {productInventoryStatus.filter(p => p.status === 'no_ingredients').length}
                </div>
                <div className="text-sm text-gray-600">Без привязки</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Category filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Все категории" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Все категории</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Show only issues */}
            <label className="flex items-center space-x-2">
              <Checkbox
                checked={showOnlyIssues}
                onCheckedChange={setShowOnlyIssues}
              />
              <span className="text-sm">Только проблемы</span>
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Products List */}
      <div className="space-y-4">
        {filteredStatus.length > 0 ? (
          filteredStatus.map((item) => (
            <ProductInventoryCard
              key={item.product.id}
              item={item}
              onViewInventoryItem={onViewInventoryItem}
              onUpdateProduct={onUpdateProduct}
            />
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Товары не найдены
              </h3>
              <p className="text-gray-600">
                Попробуйте изменить параметры поиска или фильтры
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// Product Inventory Card Component
interface ProductInventoryCardProps {
  item: ProductInventoryStatus;
  onViewInventoryItem?: (itemId: number) => void;
  onUpdateProduct?: (productId: number, updates: Partial<Product>) => void;
}

function ProductInventoryCard({
  item,
  onViewInventoryItem,
  onUpdateProduct
}: ProductInventoryCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  const { product, relatedItems, status, availableQuantity, totalCost, missingIngredients } = item;

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div
                className="w-16 h-16 bg-cover bg-center rounded-lg"
                style={{ backgroundImage: `url('${product.image}')` }}
              />
              <div>
                <h3 className="font-medium text-gray-900">{product.title}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                <div className="flex items-center space-x-2 mt-1">
                  {getStatusIcon(status)}
                  {getStatusBadge(status)}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-semibold text-gray-900">
                {product.price}
              </div>
              {status === 'available' && availableQuantity !== undefined && (
                <div className="text-sm text-gray-600">
                  Доступно: {availableQuantity} шт
                </div>
              )}
              {totalCost && totalCost > 0 && (
                <div className="text-sm text-gray-600">
                  Себестоимость: {totalCost} ₸
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Скрыть детали' : 'Показать детали'}
            </Button>

            <div className="flex space-x-2">
              {status === 'no_ingredients' && onUpdateProduct && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    // This would open a modal to edit product ingredients
                    console.log('Edit product ingredients', product.id);
                  }}
                >
                  Настроить состав
                </Button>
              )}
              {!product.isAvailable && status === 'available' && onUpdateProduct && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateProduct(product.id, { isAvailable: true })}
                >
                  Включить в витрину
                </Button>
              )}
              {product.isAvailable && (status === 'out_of_stock' || status === 'low_stock') && onUpdateProduct && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateProduct(product.id, { isAvailable: false })}
                >
                  Скрыть из витрины
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Details */}
        {showDetails && (
          <div className="p-4 bg-gray-50">
            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="inventory">Склад</TabsTrigger>
                <TabsTrigger value="ingredients">Состав</TabsTrigger>
                <TabsTrigger value="availability">Доступность</TabsTrigger>
              </TabsList>

              <TabsContent value="inventory" className="mt-4">
                {relatedItems.length > 0 ? (
                  <div className="space-y-3">
                    {relatedItems.map(inventoryItem => (
                      <div
                        key={inventoryItem.id}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border"
                      >
                        <div className="flex items-center space-x-3">
                          <div
                            className="w-10 h-10 bg-cover bg-center rounded"
                            style={{ backgroundImage: `url('${inventoryItem.image}')` }}
                          />
                          <div>
                            <div className="font-medium">{inventoryItem.name}</div>
                            <div className="text-sm text-gray-600">
                              {inventoryItem.quantity} {inventoryItem.unit} • {inventoryItem.price}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Badge
                            variant="outline"
                            className={
                              inventoryItem.status === 'low' ? 'bg-yellow-100 text-yellow-700' :
                              inventoryItem.quantity === 0 ? 'bg-red-100 text-red-700' :
                              'bg-green-100 text-green-700'
                            }
                          >
                            {inventoryItem.status === 'low' ? 'Мало' :
                             inventoryItem.quantity === 0 ? 'Нет' : 'ОК'}
                          </Badge>

                          {onViewInventoryItem && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onViewInventoryItem(inventoryItem.id)}
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-600">Нет связанных материалов</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="ingredients" className="mt-4">
                <div className="space-y-3">
                  {product.ingredients && product.ingredients.length > 0 ? (
                    <div>
                      <div className="flex flex-wrap gap-2">
                        {product.ingredients.map((ingredient, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className={
                              missingIngredients.includes(ingredient)
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : 'bg-green-100 text-green-700 border-green-200'
                            }
                          >
                            {ingredient}
                            {missingIngredients.includes(ingredient) && (
                              <X className="w-3 h-3 ml-1" />
                            )}
                            {!missingIngredients.includes(ingredient) && (
                              <Check className="w-3 h-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>

                      {missingIngredients.length > 0 && (
                        <Alert variant="destructive" className="mt-3">
                          <AlertTriangle className="w-4 h-4" />
                          <AlertDescription>
                            Отсутствуют материалы: {missingIngredients.join(', ')}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-600">Состав не указан</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="availability" className="mt-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">Статус витрины</div>
                      <div className="flex items-center space-x-2 mt-1">
                        {product.isAvailable ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <X className="w-4 h-4 text-red-600" />
                        )}
                        <span className={product.isAvailable ? 'text-green-700' : 'text-red-700'}>
                          {product.isAvailable ? 'Включен' : 'Выключен'}
                        </span>
                      </div>
                    </div>

                    <div>
                      <div className="text-sm text-gray-600">Статус склада</div>
                      <div className="mt-1">
                        {getStatusBadge(status)}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation */}
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-sm">
                        <div className="font-medium text-blue-800">Рекомендация:</div>
                        <div className="text-blue-700 mt-1">
                          {status === 'available' && !product.isAvailable &&
                            'Товар доступен на складе, можно включить в витрину'
                          }
                          {status === 'out_of_stock' && product.isAvailable &&
                            'Товар недоступен на складе, рекомендуется скрыть из витрины'
                          }
                          {status === 'low_stock' &&
                            'Низкие остатки, следите за наличием материалов'
                          }
                          {status === 'no_ingredients' &&
                            'Настройте состав товара для автоматического отслеживания остатков'
                          }
                          {status === 'available' && product.isAvailable &&
                            'Всё в порядке, товар доступен для заказа'
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
}