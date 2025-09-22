import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  Edit,
  Copy,
  Trash2,
  Save,
  X,
  Upload,
  Plus,
  Minus,
  Camera,
  Image as ImageIcon,
  Package,
  Clock,
  Ruler,
  Palette,
  Tag,
  AlertTriangle,
  Check
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { Product, InventoryItem } from '../../src/types';
import { getTimeAgo } from '../../src/utils/date';

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

interface ProductFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  type: 'catalog' | 'custom';
  isAvailable: boolean;
  image: string;
  images: string[];
  preparationTime: number;
  productionTime: string;
  width: string;
  height: string;
  colors: string[];
  ingredients: string[];
}

const CATEGORIES = [
  'Букеты',
  'Композиции',
  'Корзины',
  'Горшечные растения',
  'Свадебные букеты',
  'Траурные венки',
  'Подарочные наборы',
  'Сезонные цветы'
];

const COLORS = [
  'Красный',
  'Розовый',
  'Белый',
  'Желтый',
  'Оранжевый',
  'Фиолетовый',
  'Синий',
  'Зеленый',
  'Смешанный'
];

export function ProductDetailView({
  product,
  inventoryItems = [],
  isEditing,
  onBack,
  onEdit,
  onSave,
  onCancel,
  onDuplicate,
  onDelete,
  onToggle
}: ProductDetailViewProps) {
  const [formData, setFormData] = useState<ProductFormData>({
    title: product.title,
    description: product.description || '',
    price: product.price,
    category: product.category || '',
    type: product.type,
    isAvailable: product.isAvailable,
    image: product.image,
    images: product.images || [],
    preparationTime: product.preparationTime || 30,
    productionTime: product.productionTime || '30 минут',
    width: product.width || '',
    height: product.height || '',
    colors: product.colors || [],
    ingredients: product.ingredients || []
  });

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Inventory integration
  const getRelatedInventory = () => {
    return inventoryItems.filter(item =>
      formData.ingredients.some(ingredient =>
        item.name.toLowerCase().includes(ingredient.toLowerCase()) ||
        ingredient.toLowerCase().includes(item.name.toLowerCase())
      )
    );
  };

  const getStockStatus = (): 'in_stock' | 'low_stock' | 'out_of_stock' => {
    if (product.type === 'custom') return 'in_stock';

    const relatedInventory = getRelatedInventory();
    if (relatedInventory.length === 0) return 'out_of_stock';

    const hasLowStock = relatedInventory.some(item => item.status === 'low');
    const hasOutOfStock = relatedInventory.some(item => item.quantity === 0);

    if (hasOutOfStock) return 'out_of_stock';
    if (hasLowStock) return 'low_stock';
    return 'in_stock';
  };

  // Form handlers
  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setUnsavedChanges(true);
  };

  const handleArrayAdd = (field: 'colors' | 'ingredients' | 'images', value: string) => {
    if (value.trim() && !formData[field].includes(value.trim())) {
      handleInputChange(field, [...formData[field], value.trim()]);
    }
  };

  const handleArrayRemove = (field: 'colors' | 'ingredients' | 'images', index: number) => {
    handleInputChange(field, formData[field].filter((_, i) => i !== index));
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      // In a real app, you would upload these files and get URLs back
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;
          handleArrayAdd('images', imageUrl);
          if (formData.images.length === 0) {
            handleInputChange('image', imageUrl);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleSave = () => {
    const changes: Partial<Product> = {};

    // Only include changed fields
    Object.keys(formData).forEach(key => {
      const fieldKey = key as keyof ProductFormData;
      if (JSON.stringify(formData[fieldKey]) !== JSON.stringify((product as any)[fieldKey])) {
        (changes as any)[fieldKey] = formData[fieldKey];
      }
    });

    onSave(changes);
    setUnsavedChanges(false);
  };

  const handleCancel = () => {
    setFormData({
      title: product.title,
      description: product.description || '',
      price: product.price,
      category: product.category || '',
      type: product.type,
      isAvailable: product.isAvailable,
      image: product.image,
      images: product.images || [],
      preparationTime: product.preparationTime || 30,
      productionTime: product.productionTime || '30 минут',
      width: product.width || '',
      height: product.height || '',
      colors: product.colors || [],
      ingredients: product.ingredients || []
    });
    setUnsavedChanges(false);
    onCancel();
  };

  const stockStatus = getStockStatus();
  const relatedInventory = getRelatedInventory();
  const allImages = [formData.image, ...formData.images].filter(Boolean);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {isEditing ? 'Редактирование товара' : 'Детали товара'}
              </h1>
              <p className="text-sm text-gray-600">
                ID: {product.id} • Создан {getTimeAgo(product.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Отмена
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!unsavedChanges}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Сохранить
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={onDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  Дублировать
                </Button>
                <Button variant="outline" onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Редактировать
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Unsaved changes warning */}
        {unsavedChanges && isEditing && (
          <Alert className="mt-4">
            <AlertTriangle className="w-4 h-4" />
            <AlertDescription>
              У вас есть несохраненные изменения. Не забудьте сохранить перед выходом.
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        <div className="max-w-6xl mx-auto">
          <Tabs defaultValue="general" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="general">Основное</TabsTrigger>
              <TabsTrigger value="details">Детали</TabsTrigger>
              <TabsTrigger value="inventory">Склад</TabsTrigger>
              <TabsTrigger value="analytics">Аналитика</TabsTrigger>
            </TabsList>

            {/* General Tab */}
            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Images */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <ImageIcon className="w-5 h-5" />
                      Изображения
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Main image display */}
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative">
                      {allImages.length > 0 ? (
                        <img
                          src={allImages[activeImageIndex]}
                          alt={formData.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <div className="text-center">
                            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                            <p className="text-gray-500">Нет изображения</p>
                          </div>
                        </div>
                      )}

                      {isEditing && (
                        <div className="absolute top-2 right-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Upload className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Image thumbnails */}
                    {allImages.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto">
                        {allImages.map((image, index) => (
                          <div
                            key={index}
                            className={`w-16 h-16 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 flex-shrink-0 ${
                              activeImageIndex === index ? 'border-primary' : 'border-transparent'
                            }`}
                            onClick={() => setActiveImageIndex(index)}
                          >
                            <img
                              src={image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Upload input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />

                    {isEditing && (
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Добавить изображения
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Basic info */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Package className="w-5 h-5" />
                      Основная информация
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Title */}
                    <div>
                      <Label htmlFor="title">Название товара *</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Введите название товара"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <Label htmlFor="description">Описание</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        disabled={!isEditing}
                        placeholder="Введите описание товара"
                        rows={3}
                      />
                    </div>

                    {/* Price */}
                    <div>
                      <Label htmlFor="price">Цена *</Label>
                      <Input
                        id="price"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        disabled={!isEditing}
                        placeholder="0 ₸"
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <Label htmlFor="category">Категория</Label>
                      {isEditing ? (
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange('category', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Выберите категорию" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map(category => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input value={formData.category} disabled />
                      )}
                    </div>

                    {/* Type */}
                    <div>
                      <Label htmlFor="type">Тип товара</Label>
                      {isEditing ? (
                        <Select
                          value={formData.type}
                          onValueChange={(value) => handleInputChange('type', value as 'catalog' | 'custom')}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="catalog">Каталожный</SelectItem>
                            <SelectItem value="custom">Индивидуальный</SelectItem>
                          </SelectContent>
                        </Select>
                      ) : (
                        <Input
                          value={formData.type === 'catalog' ? 'Каталожный' : 'Индивидуальный'}
                          disabled
                        />
                      )}
                    </div>

                    {/* Availability */}
                    <div className="flex items-center justify-between">
                      <Label htmlFor="availability">Доступность</Label>
                      <Switch
                        id="availability"
                        checked={formData.isAvailable}
                        onCheckedChange={(checked) => handleInputChange('isAvailable', checked)}
                        disabled={!isEditing}
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </div>

                    {/* Stock status indicator */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-sm font-medium">Статус склада:</span>
                      <Badge
                        variant="outline"
                        className={
                          stockStatus === 'in_stock' ? 'bg-green-100 text-green-700' :
                          stockStatus === 'low_stock' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }
                      >
                        {stockStatus === 'in_stock' ? 'В наличии' :
                         stockStatus === 'low_stock' ? 'Мало' : 'Нет в наличии'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Production details */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5" />
                      Производство
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="preparationTime">Время подготовки (минуты)</Label>
                      <Input
                        id="preparationTime"
                        type="number"
                        value={formData.preparationTime}
                        onChange={(e) => handleInputChange('preparationTime', parseInt(e.target.value))}
                        disabled={!isEditing}
                        min="0"
                      />
                    </div>

                    <div>
                      <Label htmlFor="productionTime">Время изготовления</Label>
                      <Input
                        id="productionTime"
                        value={formData.productionTime}
                        onChange={(e) => handleInputChange('productionTime', e.target.value)}
                        disabled={!isEditing}
                        placeholder="30 минут"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Dimensions */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Ruler className="w-5 h-5" />
                      Размеры
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="width">Ширина</Label>
                      <Input
                        id="width"
                        value={formData.width}
                        onChange={(e) => handleInputChange('width', e.target.value)}
                        disabled={!isEditing}
                        placeholder="30 см"
                      />
                    </div>

                    <div>
                      <Label htmlFor="height">Высота</Label>
                      <Input
                        id="height"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        disabled={!isEditing}
                        placeholder="40 см"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Colors */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Palette className="w-5 h-5" />
                      Цвета
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.colors.map((color, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {color}
                          {isEditing && (
                            <button
                              onClick={() => handleArrayRemove('colors', index)}
                              className="ml-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>

                    {isEditing && (
                      <Select onValueChange={(value) => handleArrayAdd('colors', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Добавить цвет" />
                        </SelectTrigger>
                        <SelectContent>
                          {COLORS.map(color => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </CardContent>
                </Card>

                {/* Ingredients */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="w-5 h-5" />
                      Состав
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {formData.ingredients.map((ingredient, index) => (
                        <Badge key={index} variant="outline" className="flex items-center gap-1">
                          {ingredient}
                          {isEditing && (
                            <button
                              onClick={() => handleArrayRemove('ingredients', index)}
                              className="ml-1 text-gray-400 hover:text-gray-600"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>

                    {isEditing && (
                      <div className="flex gap-2">
                        <Input
                          placeholder="Добавить компонент"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleArrayAdd('ingredients', (e.target as HTMLInputElement).value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }}
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.querySelector('input[placeholder="Добавить компонент"]') as HTMLInputElement;
                            if (input) {
                              handleArrayAdd('ingredients', input.value);
                              input.value = '';
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Связанные материалы склада</CardTitle>
                </CardHeader>
                <CardContent>
                  {relatedInventory.length > 0 ? (
                    <div className="space-y-4">
                      {relatedInventory.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div
                              className="w-12 h-12 bg-cover bg-center rounded-lg"
                              style={{ backgroundImage: `url('${item.image}')` }}
                            />
                            <div>
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-gray-600">
                                {item.quantity} {item.unit} • {item.price}
                              </p>
                            </div>
                          </div>
                          <Badge
                            variant="outline"
                            className={
                              item.status === 'low' ? 'bg-yellow-100 text-yellow-700' :
                              item.quantity === 0 ? 'bg-red-100 text-red-700' :
                              'bg-green-100 text-green-700'
                            }
                          >
                            {item.status === 'low' ? 'Мало' :
                             item.quantity === 0 ? 'Нет в наличии' : 'В наличии'}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">
                        Нет связанных материалов на складе
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Добавьте компоненты в состав товара для отслеживания склада
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">0</div>
                      <div className="text-sm text-gray-600">Всего заказов</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">0 ₸</div>
                      <div className="text-sm text-gray-600">Общая выручка</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-gray-900">0</div>
                      <div className="text-sm text-gray-600">Просмотров</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>История изменений</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
                      <div>
                        <p className="text-sm font-medium">Товар создан</p>
                        <p className="text-xs text-gray-500">
                          {getTimeAgo(product.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Удалить товар?</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">
              Вы уверены, что хотите удалить товар "{product.title}"?
              Это действие нельзя отменить.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
              >
                Отмена
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  onDelete();
                  setShowDeleteDialog(false);
                }}
              >
                Удалить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}