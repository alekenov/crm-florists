import { useState, useEffect, useMemo } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { ArrowLeft, Minus, Plus, Calendar, Package, Camera, Upload, DollarSign, History, Settings } from "lucide-react";
import { toast } from "sonner@2.0.3";
import { inventoryTransactionService } from '../api/services';
import { useInventoryDetail } from "../hooks/useDetailData";
import { adaptBackendInventoryToInventoryItem } from "../adapters/dataAdapters";
import { useIntegratedAppState } from "../hooks/useIntegratedAppState";

interface InventoryTransaction {
  id: number;
  type: 'consumption' | 'adjustment' | 'waste' | 'price_change' | 'supply';
  quantity: number;
  comment: string;
  date: Date;
  referenceType?: string;
  referenceId?: string;
}

interface InventoryItemDetailProps {
  itemId: number | null;
  onClose: () => void;
  onUpdateItem?: (itemId: number, updates: any) => void;
  onRefreshInventory?: () => void;
}

const mockItem = {
  id: 1,
  name: "Розы красные",
  category: 'flowers',
  price: "450 ₸",
  unit: "шт",
  quantity: 85,
  costPrice: "280 ₸", // себестоимость
  retailPrice: "450 ₸", // розничная цена
  markup: 60.7, // процент наценки
  lastDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
  image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=100&h=100&fit=crop"
};

const mockTransactions: InventoryTransaction[] = [
  {
    id: 1,
    type: 'consumption',
    quantity: -12,
    comment: 'Использовано для заказа #40421',
    date: new Date(Date.now() - 6 * 60 * 60 * 1000),
    referenceType: 'order',
    referenceId: '40421'
  },
  {
    id: 2,
    type: 'consumption',
    quantity: -7,
    comment: 'Использовано для заказа #40418',
    date: new Date(Date.now() - 18 * 60 * 60 * 1000),
    referenceType: 'order',
    referenceId: '40418'
  },
  {
    id: 3,
    type: 'waste',
    quantity: -3,
    comment: 'Увяли - списание',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
  },
  {
    id: 4,
    type: 'adjustment',
    quantity: -5,
    comment: 'Корректировка остатков',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
  },
  {
    id: 5,
    type: 'consumption',
    quantity: -15,
    comment: 'Использовано для заказа #40415',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    referenceType: 'order',
    referenceId: '40415'
  }
];

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} дн. назад`;
  } else if (diffInHours > 0) {
    return `${diffInHours} ч. назад`;
  } else {
    return 'Только что';
  }
}

function getTransactionTypeLabel(type: string): string {
  switch (type) {
    case 'consumption': return 'Расход';
    case 'adjustment': return 'Корректировка';
    case 'waste': return 'Списание';
    case 'price_change': return 'Изменение цены';
    case 'supply': return 'Поставка';
    default: return type;
  }
}

function getTransactionTypeColor(type: string): string {
  switch (type) {
    case 'consumption': return 'bg-blue-100 text-blue-700';
    case 'adjustment': return 'bg-orange-100 text-orange-700';
    case 'waste': return 'bg-red-100 text-red-700';
    case 'price_change': return 'bg-purple-100 text-purple-700';
    case 'supply': return 'bg-green-100 text-green-700';
    default: return 'bg-gray-100 text-gray-700';
  }
}

export function InventoryItemDetail({ itemId, onClose, onUpdateItem, onRefreshInventory }: InventoryItemDetailProps) {
  // Fetch individual inventory data
  const { data: backendInventoryItem, loading, error, refetch } = useInventoryDetail(itemId);
  const [transactions, setTransactions] = useState<InventoryTransaction[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);

  // Debug logging
  console.log('InventoryItemDetail Debug:', {
    itemId,
    backendInventoryItem,
    loading,
    error
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editedCostPrice, setEditedCostPrice] = useState('');
  const [editedRetailPrice, setEditedRetailPrice] = useState('');
  const [writeOffQuantity, setWriteOffQuantity] = useState('');
  const [writeOffComment, setWriteOffComment] = useState('');
  const [showWriteOff, setShowWriteOff] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [showImageUpload, setShowImageUpload] = useState(false);

  // State and actions
  const { apiActions } = useIntegratedAppState();

  // Convert backend inventory item to frontend format using useMemo to prevent re-renders
  const item = useMemo(() => {
    return backendInventoryItem ? adaptBackendInventoryToInventoryItem(backendInventoryItem) : null;
  }, [backendInventoryItem]);

  // Initialize prices when item is loaded
  useEffect(() => {
    if (item) {
      setEditedCostPrice(item.costPrice || '');
      setEditedRetailPrice(item.retailPrice || item.price || '');
    }
  }, [item?.id, item?.costPrice, item?.retailPrice, item?.price]);

  // Load transactions when item changes
  useEffect(() => {
    if (itemId && itemId !== -1) {
      setLoadingTransactions(true);
      inventoryTransactionService.getTransactions(itemId)
        .then(data => {
          // Transform backend transactions to frontend format
          const formattedTransactions: InventoryTransaction[] = data.map(t => ({
            id: t.id,
            type: t.type === 'audit' ? 'adjustment' :
                  t.type === 'waste' ? 'waste' :
                  t.type === 'consumption' ? 'consumption' :
                  t.type === 'supply' ? 'supply' :
                  t.type === 'price_change' ? 'price_change' : 'adjustment',
            quantity: t.quantity,
            comment: t.comment,
            // Add 'Z' to indicate UTC time if not already present
            date: new Date(t.date.includes('Z') || t.date.includes('+') ? t.date : t.date + 'Z'),
            referenceType: t.referenceType,
            referenceId: t.referenceId
          }));
          setTransactions(formattedTransactions);
        })
        .catch(error => {
          console.error('Error loading transactions:', error);
          // Fall back to empty array on error
          setTransactions([]);
        })
        .finally(() => {
          setLoadingTransactions(false);
        });
    }
  }, [itemId]);

  // Handle loading state
  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка товара...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-red-600">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={onClose} className="px-4 py-2 bg-primary text-white rounded-lg">
            Вернуться к складу
          </Button>
        </div>
      </div>
    );
  }

  // Handle inventory item not found
  if (!item) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2">Товар не найден</h2>
          <p className="text-gray-600 mb-4">Товар с ID {itemId} не существует</p>
          <Button onClick={onClose} className="px-4 py-2 bg-primary text-white rounded-lg">
            Вернуться к складу
          </Button>
        </div>
      </div>
    );
  }

  // Вычисляем наценку
  const calculateMarkup = (costPrice: string, retailPrice: string) => {
    const cost = parseFloat(costPrice.replace(/[^\d.]/g, ''));
    const retail = parseFloat(retailPrice.replace(/[^\d.]/g, ''));
    if (cost > 0) {
      return ((retail - cost) / cost * 100).toFixed(1);
    }
    return '0';
  };

  const handleSavePrices = async () => {
    if (item) {
      try {
        const itemIdNum = typeof itemId === 'string' ? parseInt(itemId) : itemId;

        // Prepare update data for API
        const updateData: any = {};
        if (editedCostPrice !== item.costPrice) {
          updateData.cost_price = parseFloat(editedCostPrice.replace(/[^\d.]/g, ''));
        }
        if (editedRetailPrice !== (item.retailPrice || item.price)) {
          updateData.price_per_unit = parseFloat(editedRetailPrice.replace(/[^\d.]/g, ''));
        }

        // Update inventory item through API
        await apiActions.updateInventoryItem(itemIdNum!, updateData);

        setIsEditing(false);

        // Refresh this specific item and the inventory list
        await refetch();
        await onRefreshInventory?.();

        toast.success('Цены обновлены');
      } catch (error) {
        console.error('Error updating inventory prices:', error);
        toast.error('Ошибка при обновлении цен');
      }
    }
  };

  const handleWriteOff = async () => {
    const quantity = parseInt(writeOffQuantity);
    if (quantity > 0 && quantity <= item.quantity && writeOffComment.trim()) {
      try {
        // Call API to write off inventory
        await inventoryTransactionService.writeOff(itemId, quantity, writeOffComment);

        // Refresh inventory data
        await refetch();

        // Reload transactions
        const updatedTransactions = await inventoryTransactionService.getTransactions(itemId);
        const formattedTransactions: InventoryTransaction[] = updatedTransactions.map(t => ({
          id: t.id,
          type: t.type === 'audit' ? 'adjustment' :
                t.type === 'waste' ? 'waste' :
                t.type === 'consumption' ? 'consumption' :
                t.type === 'supply' ? 'supply' :
                t.type === 'price_change' ? 'price_change' : 'adjustment',
          quantity: t.quantity,
          comment: t.comment,
          // Add 'Z' to indicate UTC time if not already present
          date: new Date(t.date.includes('Z') || t.date.includes('+') ? t.date : t.date + 'Z'),
          referenceType: t.referenceType,
          referenceId: t.referenceId
        }));
        setTransactions(formattedTransactions);

        // Сбрасываем форму
        setWriteOffQuantity('');
        setWriteOffComment('');
        setShowWriteOff(false);

        toast.success('Товар успешно списан');

        // Refresh inventory list to show updated quantity
        await onRefreshInventory?.();

        if (onUpdateItem && item) {
          onUpdateItem(itemId, { quantity: item.quantity - quantity });
        }
      } catch (error) {
        console.error('Error writing off inventory:', error);
        toast.error('Ошибка при списании товара');
      }
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploadingImage(true);
      
      // Создаем URL для превью
      const imageUrl = URL.createObjectURL(file);
      
      // Имитируем загрузку
      setTimeout(() => {
        setItem(prev => ({
          ...prev,
          image: imageUrl
        }));
        setIsUploadingImage(false);
        setShowImageUpload(false);
        
        toast.success("Фото товара обновлено");
        
        if (onUpdateItem) {
          onUpdateItem(itemId, { image: imageUrl });
        }
      }, 1000);
    }
  };

  const handleDemoImageUpdate = () => {
    setIsUploadingImage(true);
    
    // Для демонстрации используем новое изображение
    const demoImageUrl = "https://images.unsplash.com/photo-1725823964553-7b66681e9143?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWQlMjByb3NlcyUyMGZsb3dlcnN8ZW58MXx8fHwxNzU3MDY0MzA0fDA&ixlib=rb-4.1.0&q=80&w=200&utm_source=figma&utm_medium=referral";
    
    setTimeout(() => {
      setItem(prev => ({
        ...prev,
        image: demoImageUrl
      }));
      setIsUploadingImage(false);
      setShowImageUpload(false);
      
      toast.success("Фото товара обновлено");
      
      if (onUpdateItem) {
        onUpdateItem(itemId, { image: demoImageUrl });
      }
    }, 1000);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-xl font-medium text-gray-900">{item.name}</h1>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">{item.name}</h1>
            <p className="text-gray-600 mt-1">Детальная информация и управление товаром</p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Main Info */}
            <div className="xl:col-span-2 space-y-6">
              {/* Basic Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5" />
                    Основная информация
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <div 
                        className="w-32 h-32 bg-cover bg-center rounded-lg flex-shrink-0 border border-gray-200"
                        style={{ backgroundImage: `url('${item.image}')` }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute -bottom-2 -right-2 w-8 h-8 p-0 bg-white border-gray-300 shadow-sm"
                        onClick={() => setShowImageUpload(true)}
                      >
                        <Camera className="w-4 h-4 text-gray-600" />
                      </Button>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <h2 className="text-xl font-medium text-gray-900 mb-2">{item.name}</h2>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <div className="text-gray-600">Категория</div>
                            <div className="font-medium">
                              {item.category === 'flowers' ? 'Цветы' : 
                               item.category === 'greenery' ? 'Зелень' : 'Аксессуары'}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Остаток</div>
                            <div className={`font-medium text-lg ${item.quantity < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                              {item.quantity} {item.unit}
                            </div>
                          </div>
                          <div>
                            <div className="text-gray-600">Последняя поставка</div>
                            <div className="font-medium">{getTimeAgo(item.lastDelivery)}</div>
                          </div>
                          <div>
                            <div className="text-gray-600">Единица измерения</div>
                            <div className="font-medium">{item.unit}</div>
                          </div>
                        </div>
                      </div>

                      {/* Image Upload Section */}
                      {showImageUpload && (
                        <div className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">Обновить фото товара</h4>
                            <Button variant="ghost" size="sm" onClick={() => setShowImageUpload(false)} className="p-1">
                              ×
                            </Button>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center space-x-3">
                              <input
                                id="image-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                className="hidden"
                                disabled={isUploadingImage}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => document.getElementById('image-upload')?.click()}
                                disabled={isUploadingImage}
                                className="flex items-center space-x-2"
                              >
                                {isUploadingImage ? (
                                  <>
                                    <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                                    <span>Загрузка...</span>
                                  </>
                                ) : (
                                  <>
                                    <Upload className="w-4 h-4" />
                                    <span>Выбрать файл</span>
                                  </>
                                )}
                              </Button>
                              
                              <Button variant="outline" size="sm" onClick={() => setShowImageUpload(false)}>
                                Отмена
                              </Button>
                              
                              <Button 
                                variant="secondary" 
                                size="sm" 
                                onClick={handleDemoImageUpdate}
                                disabled={isUploadingImage}
                              >
                                Демо фото
                              </Button>
                            </div>
                            
                            <p className="text-xs text-gray-500">
                              Поддерживаются форматы: JPG, PNG, GIF. Максимальный размер: 5 МБ
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Transaction History Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    История операций
                    <Badge variant="secondary" className="ml-2">
                      {transactions.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {transactions.length > 0 ? (
                    <div className="border rounded-lg">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Тип операции</TableHead>
                            <TableHead className="w-32">Количество</TableHead>
                            <TableHead>Комментарий</TableHead>
                            <TableHead className="w-32">Дата</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {transactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>
                                <Badge 
                                  variant="secondary" 
                                  className={`text-xs ${getTransactionTypeColor(transaction.type)}`}
                                >
                                  {getTransactionTypeLabel(transaction.type)}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <span className="font-medium text-red-600">
                                  {transaction.quantity} {item.unit}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div>
                                  <div className="text-sm">{transaction.comment}</div>
                                  {transaction.referenceId && (
                                    <div className="text-xs text-gray-500">Заказ #{transaction.referenceId}</div>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-gray-600">
                                  {getTimeAgo(transaction.date)}
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Package className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500">Нет операций</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Controls */}
            <div className="space-y-6">
              {/* Pricing Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5" />
                    Ценообразование
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isEditing ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Себестоимость</Label>
                        <Input 
                          value={editedCostPrice}
                          onChange={(e) => setEditedCostPrice(e.target.value)}
                          placeholder="280 ₸"
                        />
                      </div>
                      <div>
                        <Label>Розничная цена</Label>
                        <Input 
                          value={editedRetailPrice}
                          onChange={(e) => setEditedRetailPrice(e.target.value)}
                          placeholder="450 ₸"
                        />
                      </div>
                      <div className="text-sm text-gray-600">
                        Наценка: {calculateMarkup(editedCostPrice, editedRetailPrice)}%
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" onClick={handleSavePrices} className="flex-1">
                          Сохранить
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setIsEditing(false)} className="flex-1">
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Себестоимость:</span>
                          <span className="font-medium">{item.costPrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Розничная цена:</span>
                          <span className="font-medium">{item.retailPrice}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Наценка:</span>
                          <Badge variant="secondary" className="text-green-700 bg-green-100">
                            +{item.markup}%
                          </Badge>
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setIsEditing(true)}
                        className="w-full"
                      >
                        <Settings className="w-4 h-4 mr-2" />
                        Изменить цены
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Write Off Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Списание товара</CardTitle>
                </CardHeader>
                <CardContent>
                  {showWriteOff ? (
                    <div className="space-y-4">
                      <div>
                        <Label>Количество</Label>
                        <Input 
                          type="number"
                          value={writeOffQuantity}
                          onChange={(e) => setWriteOffQuantity(e.target.value)}
                          placeholder="0"
                          max={item.quantity}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          Максимум: {item.quantity} {item.unit}
                        </div>
                      </div>
                      <div>
                        <Label>Причина</Label>
                        <Input 
                          value={writeOffComment}
                          onChange={(e) => setWriteOffComment(e.target.value)}
                          placeholder="Увяли, брак и т.д."
                        />
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={handleWriteOff}
                          disabled={!writeOffQuantity || !writeOffComment.trim() || parseInt(writeOffQuantity) <= 0}
                          className="flex-1"
                        >
                          Списать
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowWriteOff(false)} className="flex-1">
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-gray-600 text-sm mb-4">
                        Списание товара при браке или порче
                      </p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => setShowWriteOff(true)}
                        className="w-full"
                      >
                        <Minus className="w-4 h-4 mr-2" />
                        Списать товар
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden p-4 space-y-6">
        {/* Item Info */}
        <div className="flex items-start space-x-4">
          <div className="relative">
            <div 
              className="w-20 h-20 bg-cover bg-center rounded-lg flex-shrink-0 border border-gray-200"
              style={{ backgroundImage: `url('${item.image}')` }}
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute -bottom-2 -right-2 w-8 h-8 p-0 bg-white border-gray-300 shadow-sm"
              onClick={() => setShowImageUpload(true)}
            >
              <Camera className="w-4 h-4 text-gray-600" />
            </Button>
          </div>
          <div className="flex-1">
            <h2 className="font-medium text-gray-900 mb-2">{item.name}</h2>
            <div className="space-y-1 text-sm text-gray-600">
              <div>Категория: {item.category === 'flowers' ? 'Цветы' : item.category}</div>
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span className="font-medium text-gray-900">{item.quantity} {item.unit}</span>
                <span className="text-gray-500">в наличии</span>
              </div>
              <div className="text-xs text-gray-500">
                Последняя поставка: {getTimeAgo(item.lastDelivery)}
              </div>
            </div>
          </div>
        </div>

        {/* Image Upload Section */}
        {showImageUpload && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900">Обновить фото товара</h4>
              <Button variant="ghost" size="sm" onClick={() => setShowImageUpload(false)} className="p-1">
                ×
              </Button>
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="image-upload" className="block text-sm text-gray-700">
                Выберите новое изображение
              </Label>
              
              <div className="flex items-center space-x-3">
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  disabled={isUploadingImage}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  disabled={isUploadingImage}
                  className="flex items-center space-x-2"
                >
                  {isUploadingImage ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                      <span>Загрузка...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Выбрать файл</span>
                    </>
                  )}
                </Button>
                
                <Button variant="outline" size="sm" onClick={() => setShowImageUpload(false)}>
                  Отмена
                </Button>
                
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={handleDemoImageUpdate}
                  disabled={isUploadingImage}
                  className="ml-2"
                >
                  Демо фото
                </Button>
              </div>
              
              <p className="text-xs text-gray-500">
                Поддерживаются форматы: JPG, PNG, GIF. Максимальный размер: 5 МБ
              </p>
            </div>
          </div>
        )}

        <Separator />

        {/* Pricing Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Ценообразование</h3>
            {!isEditing && (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                Изменить
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Себестоимость</Label>
                  <Input 
                    value={editedCostPrice}
                    onChange={(e) => setEditedCostPrice(e.target.value)}
                    placeholder="280 ₸"
                  />
                </div>
                <div>
                  <Label>Розничная цена</Label>
                  <Input 
                    value={editedRetailPrice}
                    onChange={(e) => setEditedRetailPrice(e.target.value)}
                    placeholder="450 ₸"
                  />
                </div>
              </div>
              <div className="text-sm text-gray-600">
                Наценка: {calculateMarkup(editedCostPrice, editedRetailPrice)}%
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={handleSavePrices}>
                  Сохранить
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsEditing(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Себестоимость:</span>
                <span className="font-medium">{item.costPrice} / {item.unit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Розничная цена:</span>
                <span className="font-medium">{item.retailPrice} / {item.unit}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Наценка:</span>
                <Badge variant="secondary" className="text-green-700 bg-green-100">
                  +{item.markup}%
                </Badge>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Write Off Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900">Списание</h3>
            {!showWriteOff && (
              <Button variant="outline" size="sm" onClick={() => setShowWriteOff(true)}>
                <Minus className="w-4 h-4 mr-2" />
                Списать
              </Button>
            )}
          </div>

          {showWriteOff && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Количество</Label>
                  <Input 
                    type="number"
                    value={writeOffQuantity}
                    onChange={(e) => setWriteOffQuantity(e.target.value)}
                    placeholder="0"
                    max={item.quantity}
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    Максимум: {item.quantity} {item.unit}
                  </div>
                </div>
                <div>
                  <Label>Причина</Label>
                  <Input 
                    value={writeOffComment}
                    onChange={(e) => setWriteOffComment(e.target.value)}
                    placeholder="Увяли, брак и т.д."
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  size="sm" 
                  variant="destructive"
                  onClick={handleWriteOff}
                  disabled={!writeOffQuantity || !writeOffComment.trim() || parseInt(writeOffQuantity) <= 0}
                >
                  Списать
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowWriteOff(false)}>
                  Отмена
                </Button>
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Transaction History */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <h3 className="font-medium text-gray-900">История операций</h3>
            <Badge variant="secondary" className="text-xs">
              {transactions.length}
            </Badge>
          </div>

          <div className="space-y-3">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getTransactionTypeColor(transaction.type)}`}
                    >
                      {getTransactionTypeLabel(transaction.type)}
                    </Badge>
                    <span className="text-sm font-medium text-red-600">
                      {transaction.quantity} {item.unit}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{transaction.comment}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    <span>{getTimeAgo(transaction.date)}</span>
                    {transaction.referenceId && (
                      <span>• Заказ #{transaction.referenceId}</span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="text-center py-8">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-gray-500">Нет операций</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}