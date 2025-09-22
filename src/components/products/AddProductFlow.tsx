import React, { useState, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Save,
  Upload,
  Plus,
  X,
  Package,
  Image as ImageIcon,
  Tag,
  Palette,
  Clock,
  Ruler,
  Camera,
  Check,
  AlertTriangle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { Alert, AlertDescription } from '../ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { Product, InventoryItem } from '../../src/types';

interface AddProductFlowProps {
  inventoryItems?: InventoryItem[];
  onSave: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

type ProductType = 'catalog' | 'custom';
type StepType = 'type' | 'basic' | 'details' | 'images' | 'review';

interface ProductFormData {
  type: ProductType;
  title: string;
  description: string;
  price: string;
  category: string;
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

const INITIAL_FORM_DATA: ProductFormData = {
  type: 'catalog',
  title: '',
  description: '',
  price: '',
  category: '',
  isAvailable: true,
  image: '',
  images: [],
  preparationTime: 30,
  productionTime: '30 минут',
  width: '',
  height: '',
  colors: [],
  ingredients: []
};

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

const PRESET_INGREDIENTS = [
  'Розы',
  'Тюльпаны',
  'Гвоздики',
  'Хризантемы',
  'Лилии',
  'Альстромерии',
  'Гипсофила',
  'Зелень',
  'Упаковка',
  'Лента'
];

export function AddProductFlow({ inventoryItems = [], onSave, onCancel }: AddProductFlowProps) {
  const [currentStep, setCurrentStep] = useState<StepType>('type');
  const [formData, setFormData] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps: { key: StepType; title: string; description: string }[] = [
    { key: 'type', title: 'Тип товара', description: 'Выберите тип создаваемого товара' },
    { key: 'basic', title: 'Основная информация', description: 'Название, цена и категория' },
    { key: 'details', title: 'Детали', description: 'Размеры, цвета и состав' },
    { key: 'images', title: 'Изображения', description: 'Загрузите фотографии товара' },
    { key: 'review', title: 'Проверка', description: 'Проверьте и сохраните товар' }
  ];

  const currentStepIndex = steps.findIndex(step => step.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  // Form validation
  const validateStep = (step: StepType): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 'basic':
        if (!formData.title.trim()) {
          newErrors.title = 'Название товара обязательно';
        }
        if (!formData.price.trim()) {
          newErrors.price = 'Цена обязательна';
        }
        if (!formData.category) {
          newErrors.category = 'Выберите категорию';
        }
        break;

      case 'images':
        if (!formData.image && formData.images.length === 0) {
          newErrors.image = 'Добавьте хотя бы одно изображение';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form handlers
  const handleInputChange = (field: keyof ProductFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // Clear related errors
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageUrl = e.target?.result as string;

          if (!formData.image) {
            handleInputChange('image', imageUrl);
          } else {
            handleArrayAdd('images', imageUrl);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  // Navigation
  const goToNextStep = () => {
    if (validateStep(currentStep)) {
      const nextIndex = currentStepIndex + 1;
      if (nextIndex < steps.length) {
        setCurrentStep(steps[nextIndex].key);
      }
    }
  };

  const goToPreviousStep = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].key);
    }
  };

  const handleSave = () => {
    if (validateStep('review')) {
      const product: Omit<Product, 'id' | 'createdAt'> = {
        ...formData,
        name: formData.title // Map title to name for compatibility
      };
      onSave(product);
    }
  };

  // Get suggested ingredients based on inventory
  const getSuggestedIngredients = () => {
    return inventoryItems
      .filter(item => item.category === 'flowers' || item.category === 'accessories')
      .map(item => item.name)
      .slice(0, 10);
  };

  const allImages = [formData.image, ...formData.images].filter(Boolean);

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Добавить товар</h1>
              <p className="text-sm text-gray-600">
                {steps[currentStepIndex].title} • {steps[currentStepIndex].description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {currentStepIndex + 1} из {steps.length}
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-4">
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step indicators */}
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className={`flex items-center space-x-2 ${
                index <= currentStepIndex ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  index < currentStepIndex
                    ? 'bg-primary text-white'
                    : index === currentStepIndex
                    ? 'bg-primary/20 text-primary border-2 border-primary'
                    : 'bg-gray-200 text-gray-400'
                }`}
              >
                {index < currentStepIndex ? (
                  <Check className="w-4 h-4" />
                ) : (
                  index + 1
                )}
              </div>
              <span className="text-sm hidden lg:block">{step.title}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 lg:p-6">
        <div className="max-w-2xl mx-auto">
          {/* Step 1: Type Selection */}
          {currentStep === 'type' && (
            <Card>
              <CardHeader>
                <CardTitle>Выберите тип товара</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup
                  value={formData.type}
                  onValueChange={(value) => handleInputChange('type', value as ProductType)}
                >
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="catalog" id="catalog" className="mt-1" />
                      <Label htmlFor="catalog" className="cursor-pointer flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Package className="w-5 h-5 text-blue-600" />
                          <span className="font-medium">Каталожный товар</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Стандартный товар с фиксированными характеристиками.
                          Подходит для готовых букетов и композиций.
                        </p>
                        <ul className="text-xs text-gray-500 mt-2 space-y-1">
                          <li>• Фиксированная цена</li>
                          <li>• Стандартные размеры</li>
                          <li>• Отслеживание остатков</li>
                        </ul>
                      </Label>
                    </div>

                    <div className="flex items-start space-x-3 p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                      <RadioGroupItem value="custom" id="custom" className="mt-1" />
                      <Label htmlFor="custom" className="cursor-pointer flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Tag className="w-5 h-5 text-purple-600" />
                          <span className="font-medium">Индивидуальный товар</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          Товар под заказ с возможностью кастомизации.
                          Подходит для уникальных композиций и спецзаказов.
                        </p>
                        <ul className="text-xs text-gray-500 mt-2 space-y-1">
                          <li>• Гибкая цена</li>
                          <li>• Индивидуальные размеры</li>
                          <li>• Кастомизация по запросу</li>
                        </ul>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Basic Information */}
          {currentStep === 'basic' && (
            <Card>
              <CardHeader>
                <CardTitle>Основная информация</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Название товара *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Введите название товара"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description">Описание</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Опишите товар"
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Цена *</Label>
                  <Input
                    id="price"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0 ₸"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Категория *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
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
                  {errors.category && (
                    <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="availability">Сразу сделать доступным</Label>
                  <Switch
                    id="availability"
                    checked={formData.isAvailable}
                    onCheckedChange={(checked) => handleInputChange('isAvailable', checked)}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Details */}
          {currentStep === 'details' && (
            <div className="space-y-6">
              {/* Production */}
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
                      onChange={(e) => handleInputChange('preparationTime', parseInt(e.target.value) || 0)}
                      min="0"
                    />
                  </div>

                  <div>
                    <Label htmlFor="productionTime">Время изготовления</Label>
                    <Input
                      id="productionTime"
                      value={formData.productionTime}
                      onChange={(e) => handleInputChange('productionTime', e.target.value)}
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="width">Ширина</Label>
                      <Input
                        id="width"
                        value={formData.width}
                        onChange={(e) => handleInputChange('width', e.target.value)}
                        placeholder="30 см"
                      />
                    </div>

                    <div>
                      <Label htmlFor="height">Высота</Label>
                      <Input
                        id="height"
                        value={formData.height}
                        onChange={(e) => handleInputChange('height', e.target.value)}
                        placeholder="40 см"
                      />
                    </div>
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
                        <button
                          onClick={() => handleArrayRemove('colors', index)}
                          className="ml-1 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  <Select onValueChange={(value) => handleArrayAdd('colors', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Добавить цвет" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLORS.filter(color => !formData.colors.includes(color)).map(color => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
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
                        <button
                          onClick={() => handleArrayRemove('ingredients', index)}
                          className="ml-1 text-gray-400 hover:text-gray-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>

                  {/* Preset ingredients */}
                  <div>
                    <Label className="text-sm text-gray-600">Быстрый выбор:</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {PRESET_INGREDIENTS
                        .filter(ingredient => !formData.ingredients.includes(ingredient))
                        .map(ingredient => (
                        <Button
                          key={ingredient}
                          variant="outline"
                          size="sm"
                          onClick={() => handleArrayAdd('ingredients', ingredient)}
                          className="text-xs"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          {ingredient}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Custom ingredient input */}
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
                        if (input && input.value.trim()) {
                          handleArrayAdd('ingredients', input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  {/* Suggested from inventory */}
                  {getSuggestedIngredients().length > 0 && (
                    <div>
                      <Label className="text-sm text-gray-600">Доступно на складе:</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {getSuggestedIngredients()
                          .filter(ingredient => !formData.ingredients.includes(ingredient))
                          .map(ingredient => (
                          <Button
                            key={ingredient}
                            variant="outline"
                            size="sm"
                            onClick={() => handleArrayAdd('ingredients', ingredient)}
                            className="text-xs bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            {ingredient}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Images */}
          {currentStep === 'images' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" />
                  Изображения товара
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {errors.image && (
                  <Alert variant="destructive">
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>{errors.image}</AlertDescription>
                  </Alert>
                )}

                {/* Upload area */}
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Загрузите изображения
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Перетащите файлы сюда или нажмите для выбора
                  </p>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Выбрать файлы
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />

                {/* Image preview */}
                {allImages.length > 0 && (
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Загруженные изображения ({allImages.length})
                    </Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {allImages.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={image}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            onClick={() => {
                              if (index === 0) {
                                // Remove main image
                                if (formData.images.length > 0) {
                                  handleInputChange('image', formData.images[0]);
                                  handleArrayRemove('images', 0);
                                } else {
                                  handleInputChange('image', '');
                                }
                              } else {
                                handleArrayRemove('images', index - 1);
                              }
                            }}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          {index === 0 && (
                            <Badge className="absolute bottom-2 left-2 bg-blue-600">
                              Основное
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <p className="text-sm text-gray-500">
                  Рекомендуется загружать изображения в формате JPG или PNG размером не менее 800x800 пикселей.
                  Первое изображение будет использовано как основное.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Step 5: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Проверка данных</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Images */}
                    <div>
                      <Label className="font-medium">Изображения</Label>
                      {allImages.length > 0 ? (
                        <div className="mt-2">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={allImages[0]}
                              alt={formData.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          {allImages.length > 1 && (
                            <p className="text-sm text-gray-600 mt-2">
                              +{allImages.length - 1} дополнительных изображений
                            </p>
                          )}
                        </div>
                      ) : (
                        <div className="mt-2 aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="space-y-4">
                      <div>
                        <Label className="font-medium">Основная информация</Label>
                        <div className="mt-2 space-y-2 text-sm">
                          <div><span className="text-gray-600">Название:</span> {formData.title}</div>
                          <div><span className="text-gray-600">Цена:</span> {formData.price}</div>
                          <div><span className="text-gray-600">Категория:</span> {formData.category}</div>
                          <div><span className="text-gray-600">Тип:</span> {formData.type === 'catalog' ? 'Каталожный' : 'Индивидуальный'}</div>
                          <div><span className="text-gray-600">Статус:</span> {formData.isAvailable ? 'Доступен' : 'Недоступен'}</div>
                        </div>
                      </div>

                      {formData.description && (
                        <div>
                          <Label className="font-medium">Описание</Label>
                          <p className="mt-1 text-sm text-gray-600">{formData.description}</p>
                        </div>
                      )}

                      {(formData.width || formData.height) && (
                        <div>
                          <Label className="font-medium">Размеры</Label>
                          <div className="mt-1 text-sm text-gray-600">
                            {formData.width && `Ширина: ${formData.width}`}
                            {formData.width && formData.height && ' • '}
                            {formData.height && `Высота: ${formData.height}`}
                          </div>
                        </div>
                      )}

                      {formData.colors.length > 0 && (
                        <div>
                          <Label className="font-medium">Цвета</Label>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {formData.colors.map((color, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {color}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {formData.ingredients.length > 0 && (
                        <div>
                          <Label className="font-medium">Состав</Label>
                          <div className="mt-2 flex flex-wrap gap-1">
                            {formData.ingredients.map((ingredient, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {ingredient}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-gray-200 p-4">
        <div className="max-w-2xl mx-auto flex justify-between">
          <Button
            variant="outline"
            onClick={currentStepIndex === 0 ? onCancel : goToPreviousStep}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {currentStepIndex === 0 ? 'Отмена' : 'Назад'}
          </Button>

          {currentStep === 'review' ? (
            <Button onClick={handleSave} className="bg-emerald-600 hover:bg-emerald-700">
              <Save className="w-4 h-4 mr-2" />
              Сохранить товар
            </Button>
          ) : (
            <Button onClick={goToNextStep}>
              Далее
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}