import svgPaths from "../imports/svg-v3feqeu9gq";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { X, ChevronDown, Plus, ChevronUp } from "lucide-react";
import { useState } from "react";
import { ImageUploader } from "./ImageUploader";
import { FlowerNameInput } from "./FlowerNameInput";
import { ColorPicker } from "./common/ColorPicker";
import { useInventoryList } from "../hooks/useInventoryList";


function VideoIcon() {
  return (
    <svg className="w-8 h-8" fill="none" preserveAspectRatio="none" viewBox="0 0 28 23">
      <g>
        <path d={svgPaths.p3b7dbb00} fill="#C8C0D3" />
        <path d={svgPaths.p22574980} fill="#C8C0D3" />
      </g>
    </svg>
  );
}

interface AddCatalogFormProps {
  onClose: () => void;
  onCreateProduct?: (productData: any) => Promise<void>;
}

const bouquetColors = [
  { id: 'pink', name: 'Розовый', color: '#ec4899' },
  { id: 'blue', name: 'Синий', color: '#3b82f6' },
  { id: 'red', name: 'Красный', color: '#ef4444' },
  { id: 'yellow', name: 'Желтый', color: '#f59e0b' },
  { id: 'green', name: 'Зеленый', color: '#10b981' },
  { id: 'purple', name: 'Фиолетовый', color: '#8b5cf6' },
  { id: 'white', name: 'Белый', color: '#ffffff' },
  { id: 'mix', name: 'Микс', color: 'linear-gradient(45deg, #ec4899 0%, #3b82f6 25%, #f59e0b 50%, #10b981 75%, #8b5cf6 100%)' }
];

export function AddCatalogForm({ onClose, onCreateProduct }: AddCatalogFormProps) {
  const [showCharacteristics, setShowCharacteristics] = useState(true);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedDuration, setSelectedDuration] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [discount, setDiscount] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [composition, setComposition] = useState<Array<{ name: string; count: string }>>([]);
  const [newFlowerName, setNewFlowerName] = useState('');
  const [newFlowerCount, setNewFlowerCount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Загружаем список цветов со склада
  const { inventory, loading: inventoryLoading, error: inventoryError } = useInventoryList();

  const handleColorChange = (colors: string[]) => {
    setSelectedColors(colors);
  };

  const handleAddFlower = () => {
    if (newFlowerName.trim() && newFlowerCount.trim()) {
      setComposition(prev => [...prev, { name: newFlowerName.trim(), count: newFlowerCount.trim() }]);
      setNewFlowerName('');
      setNewFlowerCount('');
    }
  };

  const handleSubmit = async () => {
    if (!title || !price) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSubmitting(true);
    try {
      const productData = {
        title,
        price: price.includes('₸') ? price : `${price} ₸`,
        image: images[0] || '',
        images: images,
        type: 'catalog',
        duration,
        discount,
        catalogWidth: width,
        catalogHeight: height,
        colors: selectedColors,
        productionTime: selectedDuration,
        composition,
      };

      if (onCreateProduct) {
        await onCreateProduct(productData);
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Ошибка при создании товара');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen lg:bg-white">
      <div className="max-w-md mx-auto bg-white min-h-screen lg:max-w-none lg:mx-0 lg:bg-transparent">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 lg:hidden">
          <h1 className="text-gray-900">Новый товар</h1>
          <button 
            className="p-3 hover:bg-gray-100 rounded-full transition-colors touch-manipulation" 
            onClick={onClose}
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Новый товар каталога</h1>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-6 lg:max-w-4xl lg:mx-auto lg:p-8 lg:space-y-8">
          {/* Media Upload Section */}
          <div className="p-6 pb-4 lg:p-0">
            <div className="space-y-4 lg:space-y-6">
              <div className="lg:space-y-2">
                <label className="hidden lg:block text-base font-medium text-gray-700 mb-4">
                  Фотографии и видео
                </label>
                <ImageUploader 
                  images={images}
                  onImagesChange={setImages}
                  maxImages={8}
                />
              </div>
              <div className="bg-gray-50 rounded-lg h-16 flex items-center px-4 hover:bg-gray-100 transition-colors cursor-pointer touch-manipulation lg:h-12">
                <VideoIcon />
                <p className="text-gray-900 text-base ml-4 lg:text-sm">Добавьте видео</p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="px-6 space-y-6 lg:px-0 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            <div className="space-y-6">
              {/* Название товара */}
              <div>
                <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">
                  Название товара
                </label>
                <Input 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Название товара"
                  className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
                />
              </div>

              {/* Стоимость и скидка */}
              <div className="space-y-4 lg:space-y-4">
                <div className="flex space-x-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-x-0">
                  <div className="flex-1">
                    <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">
                      Стоимость
                    </label>
                    <Input 
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Стоимость, ₸"
                      className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
                    />
                  </div>
                  <div className="w-32 lg:w-full">
                    <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">
                      Скидка
                    </label>
                    <div className="flex items-end space-x-2 lg:space-x-0">
                      <Input 
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="Скидка, %"
                        className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Время изготовления */}
              <div>
                <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">
                  Время изготовления
                </label>
                <div className="flex items-end space-x-3 lg:space-x-2">
                  <Input 
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Время изготовления"
                    className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
                  />
                  <span className="text-gray-900 text-base pb-3 min-w-[40px] lg:pb-0 lg:text-sm lg:text-gray-600">
                    мин
                  </span>
                </div>
              </div>
            </div>

            {/* Bouquet Composition - в правой колонке на desktop */}
            <div className="space-y-6 lg:col-span-1">
              <div>
                <h3 className="text-gray-900 mb-4 lg:text-base lg:font-medium">Состав букета</h3>
                
                {/* Existing composition */}
                {composition.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {composition.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg lg:p-2">
                        <div className="flex-1">
                          <span className="text-gray-900 lg:text-sm">{item.name}</span>
                          <span className="text-gray-500 ml-2 lg:text-sm">— {item.count} шт</span>
                        </div>
                        <button
                          onClick={() => setComposition(prev => prev.filter((_, i) => i !== index))}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors touch-manipulation lg:p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex space-x-4 mb-4 lg:grid lg:grid-cols-3 lg:gap-2 lg:space-x-0">
                  <div className="flex-1 lg:col-span-2">
                    <FlowerNameInput
                      value={newFlowerName}
                      onChange={setNewFlowerName}
                      placeholder="Название цветка"
                      className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white lg:text-sm"
                      existingFlowers={composition.map(item => item.name)}
                      inventory={inventory}
                      loading={inventoryLoading}
                    />
                  </div>
                  <div className="w-20 lg:w-full lg:col-span-1">
                    <Input 
                      value={newFlowerCount}
                      onChange={(e) => setNewFlowerCount(e.target.value)}
                      placeholder="Кол-во"
                      className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white lg:text-sm"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddFlower}
                  variant="outline" 
                  className="w-full h-12 text-gray-900 border-gray-200 text-base touch-manipulation lg:h-10 lg:text-sm"
                >
                  <Plus className="w-5 h-5 mr-2 lg:w-4 lg:h-4" />
                  Добавить цветок
                </Button>
              </div>
            </div>
          </div>

          {/* Characteristics */}
          <div className="px-6 lg:px-0 lg:col-span-2">
            <button
              onClick={() => setShowCharacteristics(!showCharacteristics)}
              className="flex items-center justify-between w-full py-3 touch-manipulation lg:hidden"
            >
              <h3 className="text-gray-900">Характеристики</h3>
              {showCharacteristics ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <div className="hidden lg:block">
              <h3 className="text-base font-medium text-gray-900 mb-6">Характеристики</h3>
            </div>
            
            {(showCharacteristics || typeof window !== 'undefined') && (
              <div className={`space-y-5 mt-4 lg:mt-0 lg:space-y-6 ${showCharacteristics ? 'block' : 'hidden'} lg:block`}>
                <div className="space-y-4 lg:space-y-3">
                  <p className="text-sm text-gray-700 lg:font-medium">Цвета букета</p>
                  <ColorPicker 
                    colors={bouquetColors}
                    selectedColors={selectedColors}
                    onChange={handleColorChange}
                    multiple={true}
                  />
                </div>
                
                <div className="flex space-x-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-x-0">
                  <div>
                    <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">
                      Ширина
                    </label>
                    <Input 
                      value={width}
                      onChange={(e) => setWidth(e.target.value)}
                      placeholder="Ширина, см"
                      className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
                    />
                  </div>
                  <div>
                    <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">
                      Высота
                    </label>
                    <Input 
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      placeholder="Высота, см"
                      className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <p className="text-sm text-gray-700 lg:font-medium">Стойкость</p>
                  <div className="flex flex-wrap gap-3 lg:gap-2">
                    {[
                      { id: 'short', label: 'До 7 дней' },
                      { id: 'medium', label: 'От 5 до 10' },
                      { id: 'long', label: 'От 10 дней и более' }
                    ].map((duration) => (
                      <button
                        key={duration.id}
                        onClick={() => setSelectedDuration(duration.id)}
                        className={`px-4 py-2.5 rounded text-sm transition-all duration-200 touch-manipulation min-h-[44px] lg:min-h-[36px] lg:px-3 lg:py-2 lg:text-xs ${
                          selectedDuration === duration.id
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {duration.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 pt-8 lg:px-0 lg:col-span-2 lg:flex lg:justify-end lg:gap-3">
            <div className="hidden lg:flex lg:gap-3">
              <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                Отмена
              </Button>
              <Button onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting ? 'Сохранение...' : 'Опубликовать товар'}
              </Button>
            </div>
            <div className="lg:hidden">
              <Button 
                className="w-full h-12 rounded-xl touch-manipulation"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Сохранение...' : 'Опубликовать'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}