import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { ArrowLeft, ArrowRight, Check, Clock, Calendar } from "lucide-react";
import { DesktopDeliveryForm } from "./DesktopDeliveryForm";

interface Product {
  id: number;
  image: string;
  images?: string[];
  title: string;
  price: string;
  isAvailable: boolean;
  createdAt: Date;
  type: 'vitrina' | 'catalog';
  composition?: Array<{ name: string; count: string }>;
}

interface OrderData {
  selectedProduct: Product | null;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress: string;
  deliveryDate: 'today' | 'tomorrow' | string; // Поддерживает конкретные даты в формате YYYY-MM-DD
  deliveryTime: string;
  recipientName: string;
  recipientPhone: string;
  senderName: string;
  senderPhone: string;
  postcard: string;
  comment: string;
}

interface AddOrderProps {
  products: Product[];
  onClose: () => void;
  onCreateOrder: (orderData: OrderData) => void;
}

function ProductSelectionStep({ 
  products, 
  selectedProduct, 
  onSelectProduct 
}: { 
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
}) {
  const availableProducts = products.filter(p => p.isAvailable);

  return (
    <div className="px-3">
      <div className="py-4">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Выберите товар</h2>
        <p className="text-sm text-gray-600 mb-4">Выберите товар для заказа из доступных в каталоге</p>
      </div>

      <div className="space-y-0">
        {availableProducts.map((product) => (
          <div 
            key={product.id}
            className={`p-3 border-b border-gray-200 cursor-pointer transition-colors ${
              selectedProduct?.id === product.id 
                ? 'bg-purple-50 border-purple-200' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelectProduct(product)}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 bg-cover bg-center rounded-full flex-shrink-0"
                style={{ backgroundImage: `url('${product.images?.[0] || product.image}')` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-gray-900 text-sm">{product.title}</span>
                  <div className="px-2 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide bg-white border border-emerald-500 text-emerald-500">
                    {product.type === 'vitrina' ? 'Витрина' : 'Каталог'}
                  </div>
                </div>
                <div className="text-gray-700 text-sm">{product.price}</div>
                {product.composition && (
                  <div className="text-gray-600 text-xs mt-0.5">
                    {product.composition.slice(0, 2).map(item => item.name).join(', ')}
                    {product.composition.length > 2 && '...'}
                  </div>
                )}
              </div>
              {selectedProduct?.id === product.id && (
                <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {availableProducts.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-gray-500 mb-1 text-sm">Нет доступных товаров</div>
          <div className="text-xs text-gray-400">
            Добавьте товары в каталог и активируйте их
          </div>
        </div>
      )}
    </div>
  );
}

function DeliveryStep({ 
  orderData, 
  onUpdateData 
}: { 
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  const timeOptions = [
    { id: '120-150', label: '120–150 мин' },
    { id: '18-19', label: '18:00–19:00' },
    { id: '19-20', label: '19:00–20:00' },
    { id: '20-21', label: '20:00–21:00' }
  ];

  const getDateForInput = (deliveryDate: string) => {
    if (deliveryDate === 'today') {
      return new Date().toISOString().split('T')[0];
    }
    if (deliveryDate === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    }
    return deliveryDate;
  };

  const handleDateChange = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowString = tomorrow.toISOString().split('T')[0];

    if (dateString === today) {
      onUpdateData({ deliveryDate: 'today' });
    } else if (dateString === tomorrowString) {
      onUpdateData({ deliveryDate: 'tomorrow' });
    } else {
      onUpdateData({ deliveryDate: dateString });
    }
  };

  const getDeliveryDateText = (date: string) => {
    if (date === 'today') {
      return 'Сегодня';
    }
    if (date === 'tomorrow') {
      return 'Завтра';
    }
    
    // Если это конкретная дата в формате YYYY-MM-DD
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return date; // Возвращаем исходную строку если не удается распарсить
    }
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // Проверяем, не является ли выбранная дата сегодня или завтра
    if (isSameDay(dateObj, today)) {
      return 'Сегодня';
    }
    if (isSameDay(dateObj, tomorrow)) {
      return 'Завтра';
    }
    
    // Форматируем дату
    return dateObj.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      weekday: 'short'
    });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  return (
    <div className="px-3">
      <div className="py-4">
        <h2 className="text-lg font-medium text-gray-900 mb-2">
          {orderData.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          {orderData.deliveryType === 'delivery' 
            ? 'Укажите адрес и время доставки'
            : 'Выберите время для самовывоза из магазина'
          }
        </p>
      </div>

      <div className="space-y-4">
        {/* Способ получения */}
        <div>
          <div className="text-xs text-gray-600 mb-2">Способ получения</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateData({ deliveryType: 'delivery' })}
              className={`p-2 rounded-sm border transition-colors ${
                orderData.deliveryType === 'delivery'
                  ? 'border-purple-300 bg-purple-100 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <div className="font-medium text-xs">Доставка</div>
              <div className="text-xs opacity-75">Курьером</div>
            </button>
            <button
              onClick={() => onUpdateData({ deliveryType: 'pickup' })}
              className={`p-2 rounded-sm border transition-colors ${
                orderData.deliveryType === 'pickup'
                  ? 'border-purple-300 bg-purple-100 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <div className="font-medium text-xs">Самовывоз</div>
              <div className="text-xs opacity-75">Из магазина</div>
            </button>
          </div>
        </div>

        {/* Адрес доставки - только для доставки */}
        {orderData.deliveryType === 'delivery' && (
          <div>
            <div className="text-xs text-gray-600 mb-1">Адрес доставки</div>
            <Input
              value={orderData.deliveryAddress}
              onChange={(e) => onUpdateData({ deliveryAddress: e.target.value })}
              placeholder="ул. Примерная 123, кв. 45"
              className="w-full text-sm"
            />
          </div>
        )}

        {/* Дата и время */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <Clock className="w-3 h-3 text-white" />
            </div>
            <div className="text-xs text-gray-600">Дата и время</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => onUpdateData({ deliveryDate: 'today' })}
                className={`py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
                  orderData.deliveryDate === 'today'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                Сегодня
              </button>
              <button
                onClick={() => onUpdateData({ deliveryDate: 'tomorrow' })}
                className={`py-1.5 px-3 rounded-md text-xs font-medium transition-colors ${
                  orderData.deliveryDate === 'tomorrow'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                Завтра
              </button>
              <button
                onClick={() => setShowDatePicker(!showDatePicker)}
                className={`py-1.5 px-3 rounded-md text-xs font-medium transition-colors flex items-center gap-1 ${
                  orderData.deliveryDate !== 'today' && orderData.deliveryDate !== 'tomorrow'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                <Calendar className="w-3 h-3" />
                Дата
              </button>
            </div>
            
            {showDatePicker && (
              <div className="mt-2">
                <Input
                  type="date"
                  value={getDateForInput(orderData.deliveryDate)}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full text-sm"
                />
              </div>
            )}

            {/* Показываем выбранную дату если это не сегодня/завтра */}
            {orderData.deliveryDate !== 'today' && orderData.deliveryDate !== 'tomorrow' && (
              <div className="text-xs text-purple-600 mt-1">
                Выбранная дата: {getDeliveryDateText(orderData.deliveryDate)}
              </div>
            )}

            <div className="grid grid-cols-4 gap-2">
              {timeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onUpdateData({ deliveryTime: option.id })}
                  className={`py-1.5 px-1 rounded-md text-xs font-medium transition-colors text-center ${
                    orderData.deliveryTime === option.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Получатель - только для доставки */}
        {orderData.deliveryType === 'delivery' && (
          <div className="border-t border-gray-200 pt-3">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Получатель</h3>
            
            <div className="space-y-2">
              <div>
                <div className="text-xs text-gray-600 mb-1">Имя получателя</div>
                <Input
                  value={orderData.recipientName}
                  onChange={(e) => onUpdateData({ recipientName: e.target.value })}
                  placeholder="Анна"
                  className="w-full text-sm"
                />
              </div>
              <div>
                <div className="text-xs text-gray-600 mb-1">Телефон получателя</div>
                <Input
                  type="tel"
                  value={orderData.recipientPhone}
                  onChange={(e) => onUpdateData({ recipientPhone: e.target.value })}
                  placeholder="+7 (000) 000-00-00"
                  className="w-full text-sm"
                />
              </div>
            </div>
          </div>
        )}

        {/* Заказчик */}
        <div className="border-t border-gray-200 pt-3">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            {orderData.deliveryType === 'pickup' ? 'Контактные данные' : 'Заказчик'}
          </h3>
          
          <div className="space-y-2">
            <div>
              <div className="text-xs text-gray-600 mb-1">Имя</div>
              <Input
                value={orderData.senderName}
                onChange={(e) => onUpdateData({ senderName: e.target.value })}
                placeholder="Сергей"
                className="w-full text-sm"
              />
            </div>
            <div>
              <div className="text-xs text-gray-600 mb-1">Телефон</div>
              <Input
                type="tel"
                value={orderData.senderPhone}
                onChange={(e) => onUpdateData({ senderPhone: e.target.value })}
                placeholder="+7 (000) 000-00-00"
                className="w-full text-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FinalStep({ 
  orderData, 
  onUpdateData 
}: { 
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
}) {
  const getDeliveryDateText = (date: string) => {
    if (date === 'today') {
      return 'Сегодня';
    }
    if (date === 'tomorrow') {
      return 'Завтра';
    }
    
    // Если это конкретная дата в формате YYYY-MM-DD
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return date; // Возвращаем исходную строку если не удается распарсить
    }
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    // Проверяем, не является ли выбранная дата сегодня или завтра
    if (isSameDay(dateObj, today)) {
      return 'Сегодня';
    }
    if (isSameDay(dateObj, tomorrow)) {
      return 'Завтра';
    }
    
    // Форматируем дату
    return dateObj.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      weekday: 'short'
    });
  };

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  };

  const getTimeText = (time: string) => {
    const timeOptions: Record<string, string> = {
      '120-150': '120–150 мин',
      '18-19': '18:00–19:00',
      '19-20': '19:00–20:00',
      '20-21': '20:00–21:00'
    };
    return timeOptions[time] || time;
  };

  return (
    <div className="px-3">
      <div className="py-4">
        <h2 className="text-lg font-medium text-gray-900 mb-2">Подтверждение заказа</h2>
        <p className="text-sm text-gray-600 mb-4">Проверьте данные и добавьте дополнительную информацию</p>
      </div>

      <div className="space-y-3">
        {/* Выбранный товар */}
        {orderData.selectedProduct && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs text-gray-600 mb-2">Выбранный товар</div>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 bg-cover bg-center rounded-full"
                style={{ backgroundImage: `url('${orderData.selectedProduct.images?.[0] || orderData.selectedProduct.image}')` }}
              />
              <div>
                <div className="font-medium text-gray-900 text-sm">{orderData.selectedProduct.title}</div>
                <div className="text-purple-600 font-medium text-sm">{orderData.selectedProduct.price}</div>
              </div>
            </div>
          </div>
        )}

        {/* Детали получения */}
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-xs text-gray-600 mb-2">Получение</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-700 text-xs">Способ:</span>
              <span className="font-medium text-gray-900 text-xs">
                {orderData.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}
              </span>
            </div>
            {orderData.deliveryType === 'delivery' && orderData.deliveryAddress && (
              <div className="flex justify-between">
                <span className="text-gray-700 text-xs">Адрес:</span>
                <span className="font-medium text-gray-900 text-xs text-right max-w-[200px]">
                  {orderData.deliveryAddress}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-700 text-xs">Дата:</span>
              <span className="font-medium text-gray-900 text-xs">
                {getDeliveryDateText(orderData.deliveryDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700 text-xs">Время:</span>
              <span className="font-medium text-gray-900 text-xs">
                {getTimeText(orderData.deliveryTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Открытка */}
        <div>
          <div className="text-xs text-gray-600 mb-1">Текст открытки (опционально)</div>
          <Textarea
            value={orderData.postcard}
            onChange={(e) => onUpdateData({ postcard: e.target.value })}
            placeholder="С Днем рождения! Желаем счастья и здоровья!"
            className="w-full min-h-[60px] resize-none text-sm"
          />
        </div>

        {/* Комментарий */}
        <div>
          <div className="text-xs text-gray-600 mb-1">Комментарий к заказу (опционально)</div>
          <Textarea
            value={orderData.comment}
            onChange={(e) => onUpdateData({ comment: e.target.value })}
            placeholder="Особые пожелания или инструкции"
            className="w-full min-h-[50px] resize-none text-sm"
          />
        </div>
      </div>
    </div>
  );
}

export function AddOrder({ products, onClose, onCreateOrder }: AddOrderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({
    selectedProduct: null,
    deliveryType: 'delivery',
    deliveryAddress: '',
    deliveryDate: 'today',
    deliveryTime: '120-150',
    recipientName: '',
    recipientPhone: '',
    senderName: '',
    senderPhone: '',
    postcard: '',
    comment: ''
  });

  const updateOrderData = (updates: Partial<OrderData>) => {
    setOrderData(prev => {
      const newData = { ...prev, ...updates };
      
      // Если меняется тип доставки, очищаем ненужные поля
      if (updates.deliveryType) {
        if (updates.deliveryType === 'pickup') {
          // Для самовывоза очищаем адрес и данные получателя
          newData.deliveryAddress = '';
          newData.recipientName = '';
          newData.recipientPhone = '';
        }
      }
      
      return newData;
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = () => {
    onCreateOrder(orderData);
    onClose();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return orderData.selectedProduct !== null;
      case 2:
        // Базовые требования - тип доставки, дата, время, имя и телефон заказчика
        const hasBasicInfo = orderData.deliveryType && orderData.deliveryDate && 
                            orderData.deliveryTime && orderData.senderName && orderData.senderPhone;
        
        // Для доставки дополнительно нужен адрес и данные получателя
        if (orderData.deliveryType === 'delivery') {
          return hasBasicInfo && orderData.deliveryAddress && 
                 orderData.recipientName && orderData.recipientPhone;
        }
        
        // Для самовывоза достаточно базовой информации
        return hasBasicInfo;
      case 3:
        return true; // На последнем шаге все опционально
      default:
        return false;
    }
  };

  const isFormValid = () => {
    // Проверяем все обязательные поля
    const hasProduct = orderData.selectedProduct !== null;
    const hasBasicInfo = orderData.deliveryType && orderData.deliveryDate && 
                        orderData.deliveryTime && orderData.senderName && orderData.senderPhone;
    
    if (orderData.deliveryType === 'delivery') {
      return hasProduct && hasBasicInfo && orderData.deliveryAddress && 
             orderData.recipientName && orderData.recipientPhone;
    }
    
    return hasProduct && hasBasicInfo;
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white h-14 flex items-center border-b border-gray-200">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="p-2 ml-3"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <h1 className="font-medium text-lg text-gray-900 ml-3">
            Новый заказ
          </h1>
          <div className="ml-auto mr-3">
            <div className="text-xs text-gray-500">
              {currentStep} из 3
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-3 py-2 bg-gray-50">
          <div className="flex space-x-1">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="pb-20">
          <MobileStepContent />
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 p-3">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button 
                variant="outline"
                onClick={handlePrevious}
                className="flex-1 h-12 border-gray-300 text-gray-900"
              >
                Назад
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button 
                onClick={handleNext}
                disabled={!isStepValid()}
                className={`h-12 ${
                  currentStep === 1 ? 'flex-1' : 'flex-1'
                }`}
              >
                <span className="mr-1">Далее</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreate}
                disabled={!isFormValid()}
                className="flex-1 h-12"
              >
                Создать заказ
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Создание заказа</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Заполните информацию для создания нового заказа
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Отменить
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={!isFormValid()}
                className="ml-2"
              >
                Создать заказ
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="flex">
          {/* Main Form - Left Side (70%) */}
          <div className="flex-1 p-6">
            <DesktopFormContent />
          </div>

          {/* Summary Panel - Right Side (30%) */}
          <div className="w-96 border-l bg-gray-50 p-6">
            <DesktopSummaryPanel />
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Step Content Component
  function MobileStepContent() {
    switch (currentStep) {
      case 1:
        return (
          <ProductSelectionStep
            products={products}
            selectedProduct={orderData.selectedProduct}
            onSelectProduct={(product) => updateOrderData({ selectedProduct: product })}
          />
        );
      case 2:
        return (
          <DeliveryStep
            orderData={orderData}
            onUpdateData={updateOrderData}
          />
        );
      case 3:
        return (
          <FinalStep
            orderData={orderData}
            onUpdateData={updateOrderData}
          />
        );
      default:
        return null;
    }
  }

  // Desktop Form Content Component
  function DesktopFormContent() {
    return (
      <div className="space-y-8 max-w-4xl">
        {/* Product Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
              1
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Выбор товара</h2>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4">
            <DesktopProductSelection />
          </div>
        </div>

        {/* Delivery Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
              2
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Доставка и контакты</h2>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <DesktopDeliveryForm orderData={orderData} updateOrderData={updateOrderData} />
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-medium">
              3
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Дополнительная информация</h2>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-6">
            <DesktopAdditionalInfo />
          </div>
        </div>
      </div>
    );
  }

  // Desktop Product Selection Component
  function DesktopProductSelection() {
    const availableProducts = products.filter(p => p.isAvailable);

    if (availableProducts.length === 0) {
      return (
        <div className="py-12 text-center">
          <div className="text-gray-500 mb-1">Нет доступных товаров</div>
          <div className="text-sm text-gray-400">
            Добавьте товары в каталог и активируйте их
          </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {availableProducts.map((product) => (
          <div 
            key={product.id}
            className={`p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
              orderData.selectedProduct?.id === product.id 
                ? 'border-purple-300 bg-purple-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => updateOrderData({ selectedProduct: product })}
          >
            <div className="flex items-start gap-4">
              <div 
                className="w-16 h-16 bg-cover bg-center rounded-lg flex-shrink-0"
                style={{ backgroundImage: `url('${product.images?.[0] || product.image}')` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-medium text-gray-900">{product.title}</h3>
                  <div className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-600">
                    {product.type === 'vitrina' ? 'Витрина' : 'Каталог'}
                  </div>
                  {orderData.selectedProduct?.id === product.id && (
                    <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center ml-auto">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-purple-600 font-medium mb-2">{product.price}</div>
                {product.composition && (
                  <div className="text-sm text-gray-600">
                    {product.composition.slice(0, 3).map(item => item.name).join(', ')}
                    {product.composition.length > 3 && '...'}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Desktop Delivery Form Component
  function DesktopDeliveryForm() {
    const timeOptions = [
      { id: '120-150', label: '120–150 мин' },
      { id: '18-19', label: '18:00–19:00' },
      { id: '19-20', label: '19:00–20:00' },
      { id: '20-21', label: '20:00–21:00' }
    ];

    return (
      <div className="space-y-6">
        {/* Delivery Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Способ получения</label>
          <div className="grid grid-cols-2 gap-4 max-w-md">
            <button
              onClick={() => updateOrderData({ deliveryType: 'delivery' })}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                orderData.deliveryType === 'delivery'
                  ? 'border-purple-300 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-medium mb-1">Доставка</div>
              <div className="text-sm opacity-75">Курьером</div>
            </button>
            <button
              onClick={() => updateOrderData({ deliveryType: 'pickup' })}
              className={`p-4 rounded-lg border-2 transition-colors text-left ${
                orderData.deliveryType === 'pickup'
                  ? 'border-purple-300 bg-purple-50 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="font-medium mb-1">Самовывоз</div>
              <div className="text-sm opacity-75">Из магазина</div>
            </button>
          </div>
        </div>

        {/* Date and Time */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">Дата и время</label>
          <div className="space-y-4">
            <div className="flex gap-3">
              <button
                onClick={() => updateOrderData({ deliveryDate: 'today' })}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  orderData.deliveryDate === 'today'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Сегодня
              </button>
              <button
                onClick={() => updateOrderData({ deliveryDate: 'tomorrow' })}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  orderData.deliveryDate === 'tomorrow'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Завтра
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3 max-w-lg">
              {timeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateOrderData({ deliveryTime: option.id })}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                    orderData.deliveryTime === option.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Address (only for delivery) */}
        {orderData.deliveryType === 'delivery' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Адрес доставки</label>
            <Input
              value={orderData.deliveryAddress}
              onChange={(e) => updateOrderData({ deliveryAddress: e.target.value })}
              placeholder="ул. Примерная 123, кв. 45"
              className="max-w-md"
            />
          </div>
        )}

        {/* Contact Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Recipient (only for delivery) */}
          {orderData.deliveryType === 'delivery' && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Получатель</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Имя получателя</label>
                  <Input
                    value={orderData.recipientName}
                    onChange={(e) => updateOrderData({ recipientName: e.target.value })}
                    placeholder="Анна"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Телефон получателя</label>
                  <Input
                    type="tel"
                    value={orderData.recipientPhone}
                    onChange={(e) => updateOrderData({ recipientPhone: e.target.value })}
                    placeholder="+7 (000) 000-00-00"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Sender */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">
              {orderData.deliveryType === 'pickup' ? 'Контактные данные' : 'Заказчик'}
            </h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
                <Input
                  value={orderData.senderName}
                  onChange={(e) => updateOrderData({ senderName: e.target.value })}
                  placeholder="Сергей"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <Input
                  type="tel"
                  value={orderData.senderPhone}
                  onChange={(e) => updateOrderData({ senderPhone: e.target.value })}
                  placeholder="+7 (000) 000-00-00"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Desktop Additional Info Component
  function DesktopAdditionalInfo() {
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Текст открытки (опционально)
          </label>
          <Textarea
            value={orderData.postcard}
            onChange={(e) => updateOrderData({ postcard: e.target.value })}
            placeholder="С Днем рождения! Желаем счастья и здоровья!"
            className="min-h-[100px] resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Комментарий к заказу (опционально)
          </label>
          <Textarea
            value={orderData.comment}
            onChange={(e) => updateOrderData({ comment: e.target.value })}
            placeholder="Особые пожелания или инструкции"
            className="min-h-[80px] resize-none"
          />
        </div>
      </div>
    );
  }

  // Desktop Summary Panel Component
  function DesktopSummaryPanel() {
    const getDeliveryDateText = (date: string) => {
      return date === 'today' ? 'Сегодня' : 'Завтра';
    };

    const getTimeText = (time: string) => {
      const timeOptions: Record<string, string> = {
        '120-150': '120–150 мин',
        '18-19': '18:00–19:00',
        '19-20': '19:00–20:00',
        '20-21': '20:00–21:00'
      };
      return timeOptions[time] || time;
    };

    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Сводка заказа</h3>

        {/* Selected Product */}
        {orderData.selectedProduct ? (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-3">Выбранный товар</div>
            <div className="flex items-start gap-3">
              <div 
                className="w-12 h-12 bg-cover bg-center rounded-lg flex-shrink-0"
                style={{ backgroundImage: `url('${orderData.selectedProduct.images?.[0] || orderData.selectedProduct.image}')` }}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">{orderData.selectedProduct.title}</div>
                <div className="text-purple-600 font-medium text-sm">{orderData.selectedProduct.price}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500">Товар не выбран</div>
          </div>
        )}

        {/* Delivery Information */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-3">Доставка</div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Способ:</span>
              <span className="font-medium">
                {orderData.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}
              </span>
            </div>
            {orderData.deliveryType === 'delivery' && orderData.deliveryAddress && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Адрес:</span>
                <span className="font-medium text-right max-w-[160px] break-words">
                  {orderData.deliveryAddress}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Дата:</span>
              <span className="font-medium">{getDeliveryDateText(orderData.deliveryDate)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Время:</span>
              <span className="font-medium">{getTimeText(orderData.deliveryTime)}</span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="text-sm text-gray-600 mb-3">Контакты</div>
          <div className="space-y-3">
            {orderData.deliveryType === 'delivery' && (
              <div>
                <div className="text-xs text-gray-500 mb-1">Получатель</div>
                <div className="text-sm">
                  {orderData.recipientName && (
                    <div className="font-medium">{orderData.recipientName}</div>
                  )}
                  {orderData.recipientPhone && (
                    <div className="text-gray-600">{orderData.recipientPhone}</div>
                  )}
                  {!orderData.recipientName && !orderData.recipientPhone && (
                    <div className="text-gray-400">Не указан</div>
                  )}
                </div>
              </div>
            )}
            <div>
              <div className="text-xs text-gray-500 mb-1">
                {orderData.deliveryType === 'pickup' ? 'Клиент' : 'Заказчик'}
              </div>
              <div className="text-sm">
                {orderData.senderName && (
                  <div className="font-medium">{orderData.senderName}</div>
                )}
                {orderData.senderPhone && (
                  <div className="text-gray-600">{orderData.senderPhone}</div>
                )}
                {!orderData.senderName && !orderData.senderPhone && (
                  <div className="text-gray-400">Не указан</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        {(orderData.postcard || orderData.comment) && (
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-600 mb-3">Дополнительно</div>
            <div className="space-y-2">
              {orderData.postcard && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Открытка</div>
                  <div className="text-sm text-gray-900 line-clamp-3">{orderData.postcard}</div>
                </div>
              )}
              {orderData.comment && (
                <div>
                  <div className="text-xs text-gray-500 mb-1">Комментарий</div>
                  <div className="text-sm text-gray-900 line-clamp-3">{orderData.comment}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Validation Status */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Статус заполнения</div>
          <div className={`text-sm font-medium ${isFormValid() ? 'text-green-600' : 'text-red-600'}`}>
            {isFormValid() ? '✓ Готов к созданию' : '⚠ Заполните обязательные поля'}
          </div>
        </div>
      </div>
    );
  }
}