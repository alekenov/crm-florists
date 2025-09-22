import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowLeft, Trash2, Info } from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: 'flowers' | 'greenery' | 'accessories';
  price: number;
  unit: string;
  quantity: number;
  image: string;
}

interface SupplyItem {
  id: string;
  name: string;
  quantity: string;
  price: string;
  suggestions: InventoryItem[];
  showSuggestions: boolean;
  existingItem?: InventoryItem;
}

interface AddInventoryItemProps {
  onClose: () => void;
  onProcessSupply?: (items: SupplyItem[]) => void;
}

// Мок данные существующих товаров на складе
const existingItems: InventoryItem[] = [
  {
    id: 1,
    name: "Розы красные",
    category: 'flowers',
    price: 350,
    unit: "шт",
    quantity: 85,
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Тюльпаны белые",
    category: 'flowers',
    price: 250,
    unit: "шт",
    quantity: 12,
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    name: "Лилии розовые",
    category: 'flowers',
    price: 520,
    unit: "шт",
    quantity: 24,
    image: "https://images.unsplash.com/photo-1565011523534-747a8601f1a4?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    name: "Эвкалипт",
    category: 'greenery',
    price: 120,
    unit: "ветка",
    quantity: 45,
    image: "https://images.unsplash.com/photo-1586744687037-b4f9c5d1fcd8?w=100&h=100&fit=crop"
  },
  {
    id: 5,
    name: "Хризантемы желтые",
    category: 'flowers',
    price: 180,
    unit: "шт",
    quantity: 8,
    image: "https://images.unsplash.com/photo-1572731973537-34afe46c4bc6?w=100&h=100&fit=crop"
  },
  {
    id: 6,
    name: "Лента атласная",
    category: 'accessories',
    price: 15,
    unit: "метр",
    quantity: 150,
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop"
  },
  {
    id: 7,
    name: "Гипсофила",
    category: 'flowers',
    price: 80,
    unit: "ветка",
    quantity: 3,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop"
  }
];

export function AddInventoryItem({ onClose, onProcessSupply }: AddInventoryItemProps) {
  const [supplyItems, setSupplyItems] = useState<SupplyItem[]>([
    {
      id: '1',
      name: '',
      quantity: '',
      price: '',
      suggestions: [],
      showSuggestions: false
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Поиск подсказок при вводе названия
  const searchSuggestions = (query: string): InventoryItem[] => {
    if (query.trim().length <= 1) return [];
    return existingItems.filter(item =>
      item.name.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleNameChange = (id: string, value: string) => {
    setSupplyItems(prev => prev.map(item => {
      if (item.id !== id) return item;
      
      const suggestions = searchSuggestions(value);
      return {
        ...item,
        name: value,
        suggestions,
        showSuggestions: suggestions.length > 0,
        // Сбрасываем existingItem если изменили название
        existingItem: item.existingItem && value !== item.existingItem.name ? undefined : item.existingItem
      };
    }));
  };

  const handleSelectSuggestion = (itemId: string, suggestion: InventoryItem) => {
    setSupplyItems(prev => prev.map(item => {
      if (item.id !== itemId) return item;
      
      return {
        ...item,
        name: suggestion.name,
        price: suggestion.price.toString(),
        suggestions: [],
        showSuggestions: false,
        existingItem: suggestion
      };
    }));
  };

  const updateField = (id: string, field: keyof SupplyItem, value: string) => {
    setSupplyItems(prev => prev.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const removeItem = (id: string) => {
    if (supplyItems.length === 1) return; // Не удаляем последнюю строку
    setSupplyItems(prev => prev.filter(item => item.id !== id));
  };

  const addNewRow = () => {
    const newId = Date.now().toString();
    setSupplyItems(prev => [...prev, {
      id: newId,
      name: '',
      quantity: '',
      price: '',
      suggestions: [],
      showSuggestions: false
    }]);
  };

  // Автоматически добавляем новую строку если текущая заполнена
  useEffect(() => {
    const lastItem = supplyItems[supplyItems.length - 1];
    if (lastItem && lastItem.name && lastItem.quantity && lastItem.price) {
      addNewRow();
    }
  }, [supplyItems]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Фильтруем только заполненные строки
    const validItems = supplyItems.filter(item => 
      item.name.trim() && item.quantity.trim() && item.price.trim()
    );

    if (validItems.length === 0) return;

    setIsSubmitting(true);

    try {
      // Обработка поставки
      if (onProcessSupply) {
        onProcessSupply(validItems);
      }

      // Логирование для демонстрации
      validItems.forEach(item => {
        console.log('Добавлена новая серия товара:', {
          name: item.name,
          price: parseFloat(item.price),
          quantity: parseInt(item.quantity),
          supplyDate: new Date().toISOString(),
          wasFromSuggestion: !!item.existingItem
        });
      });

      // Закрытие через небольшую задержку
      setTimeout(() => {
        onClose();
      }, 100);

    } catch (error) {
      console.error('Ошибка при обработке поставки:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasValidItems = supplyItems.some(item => 
    item.name.trim() && item.quantity.trim() && item.price.trim()
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-medium text-gray-900">Принять поставку</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Принять поставку</h1>
            <p className="text-gray-600 mt-1">Добавление новых позиций на склад</p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <CardTitle>Создание новой серии товаров</CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Каждая поставка создает новую серию с датой поступления. Используйте подсказки для быстрого заполнения.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {/* Desktop Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">#</TableHead>
                        <TableHead>Название товара</TableHead>
                        <TableHead className="w-32">Количество</TableHead>
                        <TableHead className="w-32">Цена за единицу</TableHead>
                        <TableHead className="w-32">Сумма</TableHead>
                        <TableHead className="w-12">Действие</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {supplyItems.map((item, index) => {
                        const quantity = parseFloat(item.quantity) || 0;
                        const price = parseFloat(item.price) || 0;
                        const total = quantity * price;
                        
                        return (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium text-gray-500">
                              {index + 1}
                            </TableCell>
                            <TableCell>
                              <div className="relative">
                                <Input
                                  value={item.name}
                                  onChange={(e) => handleNameChange(item.id, e.target.value)}
                                  placeholder="Введите название товара..."
                                  className="min-w-0"
                                  autoComplete="off"
                                />
                                
                                {/* Suggestions Dropdown */}
                                {item.showSuggestions && (
                                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                                    {item.suggestions.map((suggestion) => (
                                      <button
                                        key={suggestion.id}
                                        type="button"
                                        onClick={() => handleSelectSuggestion(item.id, suggestion)}
                                        className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                                      >
                                        <div className="flex items-center space-x-3">
                                          <div 
                                            className="w-8 h-8 bg-cover bg-center rounded-full flex-shrink-0"
                                            style={{ backgroundImage: `url('${suggestion.image}')` }}
                                          />
                                          <div className="flex-1 min-w-0">
                                            <div className="font-medium text-gray-900 truncate">
                                              {suggestion.name}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                              {suggestion.price} ₸ • справочная цена • остаток: {suggestion.quantity} {suggestion.unit}
                                            </div>
                                          </div>
                                        </div>
                                      </button>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateField(item.id, 'quantity', e.target.value)}
                                placeholder="0"
                                min="1"
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <Input
                                type="number"
                                value={item.price}
                                onChange={(e) => updateField(item.id, 'price', e.target.value)}
                                placeholder="0"
                                min="0"
                                step="0.01"
                                className="w-full"
                              />
                            </TableCell>
                            <TableCell>
                              <div className="font-medium text-gray-900">
                                {total > 0 ? `${total.toLocaleString('ru-RU')} ₸` : '—'}
                              </div>
                            </TableCell>
                            <TableCell>
                              {supplyItems.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(item.id)}
                                  className="p-2 text-gray-400 hover:text-red-500"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>

                {/* Summary */}
                <div className="mt-6 flex justify-between items-center">
                  <div className="text-sm text-gray-600">
                    {supplyItems.filter(item => item.name.trim() && item.quantity.trim() && item.price.trim()).length} товаров к поставке
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">Общая сумма:</div>
                    <div className="text-xl font-semibold text-gray-900">
                      {supplyItems.reduce((total, item) => {
                        const quantity = parseFloat(item.quantity) || 0;
                        const price = parseFloat(item.price) || 0;
                        return total + (quantity * price);
                      }, 0).toLocaleString('ru-RU')} ₸
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-6 flex justify-end">
                  <Button 
                    type="submit" 
                    className="px-8"
                    disabled={!hasValidItems || isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Обрабатываем поставку...
                      </>
                    ) : (
                      'Принять поставку'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden">
        {/* Info Banner */}
        <div className="p-4 bg-blue-50 border-b border-gray-100">
          <p className="text-sm text-blue-800 font-medium">
            Создание новой серии товаров
          </p>
          <p className="text-sm text-blue-700 mt-1">
            Каждая поставка создает новую серию с датой поступления
          </p>
        </div>

        {/* Supply List */}
        <form onSubmit={handleSubmit} className="p-4">
        <div className="space-y-3">
          {/* Headers */}
          <div className="grid grid-cols-12 gap-2 px-2 pb-2 border-b border-gray-200">
            <div className="col-span-5">
              <Label className="text-xs font-medium text-gray-600 uppercase">Товар</Label>
            </div>
            <div className="col-span-3">
              <Label className="text-xs font-medium text-gray-600 uppercase">Кол-во</Label>
            </div>
            <div className="col-span-3">
              <Label className="text-xs font-medium text-gray-600 uppercase">Цена ₸</Label>
            </div>
            <div className="col-span-1"></div>
          </div>

          {/* Supply Items */}
          {supplyItems.map((item) => (
            <div key={item.id} className="relative">
              <div className="grid grid-cols-12 gap-2 items-start">
                {/* Name with Suggestions */}
                <div className="col-span-5 relative">
                  <Input
                    value={item.name}
                    onChange={(e) => handleNameChange(item.id, e.target.value)}
                    placeholder="Название..."
                    className="bg-input-background text-sm"
                    autoComplete="off"
                  />
                  
                  {/* Suggestions Dropdown */}
                  {item.showSuggestions && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                      {item.suggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          onClick={() => handleSelectSuggestion(item.id, suggestion)}
                          className="w-full p-2 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                        >
                          <div className="flex items-center space-x-2">
                            <div 
                              className="w-5 h-5 bg-cover bg-center rounded-full flex-shrink-0"
                              style={{ backgroundImage: `url('${suggestion.image}')` }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-medium text-gray-900 truncate">
                                {suggestion.name}
                              </div>
                              <div className="text-xs text-gray-500">
                                {suggestion.price} ₸ • справочная цена
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quantity */}
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateField(item.id, 'quantity', e.target.value)}
                    placeholder="0"
                    className="bg-input-background text-sm"
                    min="1"
                  />
                </div>

                {/* Price */}
                <div className="col-span-3">
                  <Input
                    type="number"
                    value={item.price}
                    onChange={(e) => updateField(item.id, 'price', e.target.value)}
                    placeholder="0"
                    className="bg-input-background text-sm"
                    min="0"
                    step="0.01"
                  />
                </div>

                {/* Delete Button */}
                <div className="col-span-1 flex justify-center">
                  {supplyItems.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeItem(item.id)}
                      className="p-1 h-8 w-8 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>


            </div>
          ))}


        </div>

        {/* Submit Button */}
        <div className="pt-6">
          <Button 
            type="submit" 
            className="w-full bg-purple-600 hover:bg-purple-700 py-3"
            disabled={!hasValidItems || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Обрабатываем поставку...
              </>
            ) : (
              'Принять поставку'
            )}
          </Button>

          {hasValidItems && (
            <div className="text-center mt-2">
              <p className="text-xs text-gray-500">
                {supplyItems.filter(item => item.name.trim() && item.quantity.trim() && item.price.trim()).length} товаров к поставке
              </p>
            </div>
          )}
        </div>
        </form>
      </div>
    </div>
  );
}