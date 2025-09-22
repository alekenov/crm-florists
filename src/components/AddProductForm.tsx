import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { X } from "lucide-react";
import { ImageUploader } from "./ImageUploader";
import { useState } from "react";


interface AddProductFormProps {
  onClose: () => void;
  onCreateProduct?: (productData: any) => Promise<void>;
}

export function AddProductForm({ onClose, onCreateProduct }: AddProductFormProps) {
  const [images, setImages] = useState<string[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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
        type: 'vitrina',
        width,
        height,
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
            <h1 className="text-2xl font-semibold text-gray-900">Новый товар витрины</h1>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-8 lg:max-w-2xl lg:mx-auto lg:p-8">
          {/* Photo Upload Section */}
          <div>
            <label className="block text-sm text-gray-700 mb-4 lg:text-base lg:font-medium lg:mb-6">
              Фотографии товара
            </label>
            <ImageUploader 
              images={images}
              onImagesChange={setImages}
              maxImages={10}
            />
          </div>

          {/* Title Section */}
          <div>
            <label className="block text-sm text-gray-700 mb-4 lg:text-base lg:font-medium lg:mb-6">
              Название товара <span className="text-red-500">*</span>
            </label>
            <Input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Введите название товара"
              className="h-12 text-base border-gray-200 focus:border-gray-400 focus:ring-gray-400 touch-manipulation lg:h-10"
            />
          </div>

          {/* Characteristics Section */}
          <div>
            <label className="block text-sm text-gray-700 mb-4 lg:text-base lg:font-medium lg:mb-6">
              Размеры букета
            </label>
            <div className="flex space-x-4 lg:grid lg:grid-cols-2 lg:gap-6 lg:space-x-0">
              <div className="flex-1">
                <Input 
                  value={width}
                  onChange={(e) => setWidth(e.target.value)}
                  placeholder="Ширина, см"
                  className="h-12 text-base border-gray-200 focus:border-gray-400 focus:ring-gray-400 touch-manipulation lg:h-10"
                />
              </div>
              <div className="flex-1">
                <Input 
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="Высота, см"
                  className="h-12 text-base border-gray-200 focus:border-gray-400 focus:ring-gray-400 touch-manipulation lg:h-10"
                />
              </div>
            </div>
          </div>

          {/* Price Section */}
          <div>
            <label className="block text-sm text-gray-700 mb-4 lg:text-base lg:font-medium lg:mb-6">
              Стоимость товара <span className="text-red-500">*</span>
            </label>
            <div className="relative lg:max-w-sm">
              <Input 
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Введите стоимость"
                className="text-lg h-12 pr-16 text-base border-gray-200 focus:border-gray-400 focus:ring-gray-400 touch-manipulation lg:h-10 lg:text-base"
              />
              <span className="absolute right-6 top-1/2 transform -translate-y-1/2 text-gray-500 text-lg lg:text-base">
                ₸
              </span>
            </div>
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex lg:justify-end lg:gap-3 lg:pt-4">
            <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
              Отмена
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Сохранение...' : 'Опубликовать товар'}
            </Button>
          </div>
        </div>

        {/* Mobile Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white border-t border-gray-100 lg:hidden">
          <Button 
            className="w-full h-12 rounded-xl touch-manipulation"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Сохранение...' : 'Опубликовать товар'}
          </Button>
        </div>
      </div>
    </div>
  );
}