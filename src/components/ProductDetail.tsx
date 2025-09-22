import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ArrowLeft, Edit, ExternalLink, Copy, Check, Share } from "lucide-react";
import { useAppActions } from "../src/hooks/useAppActions";
import { useIntegratedAppState } from "../hooks/useIntegratedAppState";
import { Product } from "../src/types";
import { toast } from "sonner@2.0.3";

interface ProductDetailProps {
  productId: number | null;
  products: Product[];
  onClose: () => void;
  onUpdateProduct: (product: Product) => void;
  onEditProduct?: (id: number) => void;
  onRefreshProducts: () => void;
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

const getProductionTimeLabel = (time: string) => {
  switch (time) {
    case 'short': return 'До 7 дней';
    case 'medium': return 'От 5 до 10';
    case 'long': return 'От 10 дней и более';
    default: return time;
  }
};

export function ProductDetail({ productId, products, onClose, onUpdateProduct, onEditProduct, onRefreshProducts }: ProductDetailProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPrice, setEditedPrice] = useState('');
  const [linkCopied, setLinkCopied] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Используем хуки состояния приложения
  const state = useIntegratedAppState();
  const actions = useAppActions(state);

  useEffect(() => {
    if (productId) {
      const foundProduct = products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
        setEditedPrice(foundProduct.price.replace(' ₸', ''));
      }
    }
  }, [productId, products]);

  if (!product) {
    return null;
  }

  const handleSavePrice = () => {
    if (product) {
      const updatedProduct = { ...product, price: `${editedPrice} ₸` };
      setProduct(updatedProduct);
      onUpdateProduct(updatedProduct);
      setIsEditing(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://shop.example.com/product/${product.id}`);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2000);
  };



  const renderVitrinaDetails = () => (
    <div>
      {/* Редактирование цены */}
      <div className="py-4 border-b border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Цена товара</div>
        {isEditing ? (
          <div className="flex items-center space-x-2">
            <Input
              value={editedPrice}
              onChange={(e) => setEditedPrice(e.target.value)}
              className="flex-1"
              placeholder="Цена"
            />
            <span className="text-gray-500">₸</span>
            <Button onClick={handleSavePrice} size="sm" className="bg-gray-800 hover:bg-gray-900">
              <Check className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <div className="text-gray-900">{product.price}</div>
            <Button 
              onClick={() => setIsEditing(true)} 
              variant="ghost" 
              size="sm"
              className="p-2"
            >
              <Edit className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Ссылка в магазине */}
      <div className="py-4 border-b border-gray-200">
        <div className="text-sm text-gray-600 mb-2">Ссылка в магазине</div>
        <div className="flex items-center justify-between">
          <div className="text-gray-900 flex-1 truncate text-sm">
            shop.example.com/product/{product.id}
          </div>
          <div className="flex space-x-1 ml-2">
            <Button 
              onClick={handleCopyLink} 
              variant="ghost" 
              size="sm"
              className="p-2"
            >
              {linkCopied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button 
              onClick={() => window.open(`https://shop.example.com/product/${product.id}`, '_blank')}
              variant="ghost" 
              size="sm"
              className="p-2"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCatalogDetails = () => (
    <div>
      {/* Цена и скидка */}
      {product.discount && product.discount !== "0" && product.discount !== "" && (
        <div className="py-4 border-b border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Скидка</div>
          <div className="text-gray-900">-{product.discount}%</div>
        </div>
      )}

      {/* Срок изготовления */}
      {product.duration && (
        <div className="py-4 border-b border-gray-200">
          <div className="text-sm text-gray-600 mb-2">Срок изготовления</div>
          <div className="text-gray-900">{product.duration} минут</div>
        </div>
      )}

      {/* Состав букета */}
      {product.composition && product.composition.length > 0 && (
        <div className="py-6 border-t border-gray-200">
          <h3 className="text-gray-900 mb-4">Состав букета</h3>
          <div className="space-y-3">
            {product.composition.map((item, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-gray-700">{item.name}</span>
                <span className="text-gray-900">{item.count} шт</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Характеристики */}
      <div className="py-6 border-t border-gray-200">
        <h3 className="text-gray-900 mb-4">Характеристики</h3>
        
        <div className="space-y-4">
          {/* Цвета */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <div className="text-sm text-gray-600 mb-2">Цвета букета</div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((colorId) => {
                  const color = bouquetColors.find(c => c.id === colorId);
                  return (
                    <div key={colorId} className="flex items-center space-x-2">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-200"
                        style={{
                          background: color?.id === 'mix' ? color.color : color?.color,
                          ...(color?.id === 'white' && { borderColor: '#d1d5db' })
                        }}
                      />
                      <span className="text-sm text-gray-700">{color?.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Размеры */}
          {(product.catalogWidth || product.catalogHeight) && (
            <div className="flex space-x-6">
              {product.catalogWidth && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Ширина</div>
                  <div className="text-gray-900">{product.catalogWidth} см</div>
                </div>
              )}
              {product.catalogHeight && (
                <div>
                  <div className="text-sm text-gray-600 mb-1">Высота</div>
                  <div className="text-gray-900">{product.catalogHeight} см</div>
                </div>
              )}
            </div>
          )}

          {/* Стойкость */}
          {product.productionTime && (
            <div>
              <div className="text-sm text-gray-600 mb-1">Стойкость</div>
              <div className="text-gray-900">{getProductionTimeLabel(product.productionTime)}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white min-h-screen lg:bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen lg:max-w-none lg:mx-0 lg:bg-transparent">
        {/* Mobile Header */}
        <div className="bg-white h-16 flex items-center border-b border-gray-200 lg:hidden">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="p-2 ml-4"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <h1 className="text-gray-900 ml-4">
            {product.title}
          </h1>
          <div className="ml-auto mr-4 flex items-center gap-2">
            <div className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600">
              {product.isAvailable ? 'Активен' : 'Неактивен'}
            </div>
            <Button variant="ghost" size="sm" className="p-2">
              <Share className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block border-b border-gray-200 bg-white p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onClose}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">{product.title}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <div className={`px-2 py-1 rounded text-xs ${
                    product.isAvailable ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {product.isAvailable ? 'Активен' : 'Неактивен'}
                  </div>
                  <span className="text-gray-500 text-sm">•</span>
                  <span className="text-gray-500 text-sm">{product.type === 'vitrina' ? 'Витрина' : 'Каталог'}</span>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm">
              <Share className="w-5 h-5 text-gray-600" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pb-20 lg:max-w-6xl lg:mx-auto lg:p-8 lg:pb-8">
          <div className="lg:grid lg:grid-cols-5 lg:gap-8">
            {/* Изображения - левая часть на desktop */}
            <div className="py-4 border-b border-gray-200 lg:col-span-2 lg:border-0 lg:py-0">
              <div className="flex items-center gap-4 lg:block lg:space-y-4">
                <div 
                  className="w-16 h-16 bg-cover bg-center rounded-full flex-shrink-0 lg:w-full lg:h-80 lg:rounded-lg lg:flex-shrink"
                  style={{ backgroundImage: `url('${product.images?.[currentImageIndex] || product.image}')` }}
                />
                <div className="flex-1 min-w-0 lg:hidden">
                  <div className="text-gray-900">{product.title}</div>
                  <div className="text-gray-900 mt-1">{product.price}</div>
                </div>
              </div>
              
              {/* Миниатюры других изображений */}
              {product.images && product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto mt-4 pb-1 lg:grid lg:grid-cols-4 lg:gap-2 lg:mt-4 lg:pb-0">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-12 h-12 bg-cover bg-center rounded-full transition-all duration-200 touch-manipulation border-2 lg:w-full lg:h-16 lg:rounded-lg ${
                        index === currentImageIndex 
                          ? 'border-gray-800' 
                          : 'border-white opacity-70 hover:opacity-100 lg:border-gray-200'
                      }`}
                      style={{ backgroundImage: `url('${image}')` }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Детали - правая часть на desktop */}
            <div className="lg:col-span-3">
              {/* Заголовок и цена для desktop */}
              <div className="hidden lg:block mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h2>
                <div className="text-2xl font-semibold text-gray-900">{product.price}</div>
              </div>

              {/* Детали в зависимости от типа */}
              {product.type === 'vitrina' ? renderVitrinaDetails() : renderCatalogDetails()}
            </div>
          </div>


        </div>

        {/* Кнопка редактирования для каталога */}
        {product.type === 'catalog' && onEditProduct && (
          <div className="py-6 space-y-3 px-4 lg:px-8 lg:max-w-4xl lg:mx-auto">
            <div className="lg:flex lg:justify-end">
              <Button 
                className="w-full h-12 bg-gray-800 hover:bg-gray-900 text-white lg:w-auto lg:px-6"
                onClick={() => onEditProduct(product.id)}
              >
                Редактировать
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}