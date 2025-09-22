import { Clock } from "lucide-react";
import { Input } from "../ui/input";

interface OrderData {
  selectedProduct: any;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress: string;
  deliveryDate: 'today' | 'tomorrow';
  deliveryTime: string;
  recipientName: string;
  recipientPhone: string;
  senderName: string;
  senderPhone: string;
  postcard: string;
  comment: string;
}

interface DeliveryStepProps {
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
}

export function DeliveryStep({ orderData, onUpdateData }: DeliveryStepProps) {
  const timeOptions = [
    { id: '120-150', label: '120–150 мин' },
    { id: '18-19', label: '18:00–19:00' },
    { id: '19-20', label: '19:00–20:00' },
    { id: '20-21', label: '20:00–21:00' }
  ];

  return (
    <div className="px-3">
      <div className="py-4">
        <h2>
          {orderData.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}
        </h2>
        <p className="text-gray-600 mb-4">
          {orderData.deliveryType === 'delivery' 
            ? 'Укажите адрес и время доставки'
            : 'Выберите время для самовывоза из магазина'
          }
        </p>
      </div>

      <div className="space-y-4">
        {/* Способ получения */}
        <div>
          <div className="text-gray-600 mb-2">Способ получения</div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onUpdateData({ deliveryType: 'delivery' })}
              className={`p-2 rounded-sm border transition-colors ${
                orderData.deliveryType === 'delivery'
                  ? 'border-purple-300 bg-purple-100 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <div>Доставка</div>
              <div className="opacity-75">Курьером</div>
            </button>
            <button
              onClick={() => onUpdateData({ deliveryType: 'pickup' })}
              className={`p-2 rounded-sm border transition-colors ${
                orderData.deliveryType === 'pickup'
                  ? 'border-purple-300 bg-purple-100 text-purple-700'
                  : 'border-gray-200 bg-white text-gray-700'
              }`}
            >
              <div>Самовывоз</div>
              <div className="opacity-75">Из магазина</div>
            </button>
          </div>
        </div>

        {/* Адрес доставки - только для доставки */}
        {orderData.deliveryType === 'delivery' && (
          <div>
            <div className="text-gray-600 mb-1">Адрес доставки</div>
            <Input
              value={orderData.deliveryAddress}
              onChange={(e) => onUpdateData({ deliveryAddress: e.target.value })}
              placeholder="ул. Примерная 123, кв. 45"
              className="w-full"
            />
          </div>
        )}

        {/* Дата и время */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
              <Clock className="w-3 h-3 text-white" />
            </div>
            <div className="text-gray-600">Дата и время</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex gap-2">
              <button
                onClick={() => onUpdateData({ deliveryDate: 'today' })}
                className={`py-1.5 px-3 rounded-md transition-colors ${
                  orderData.deliveryDate === 'today'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                Сегодня
              </button>
              <button
                onClick={() => onUpdateData({ deliveryDate: 'tomorrow' })}
                className={`py-1.5 px-3 rounded-md transition-colors ${
                  orderData.deliveryDate === 'tomorrow'
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}
              >
                Завтра
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {timeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => onUpdateData({ deliveryTime: option.id })}
                  className={`py-1.5 px-1 rounded-md transition-colors text-center ${
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
            <h3 className="text-gray-900 mb-2">Получатель</h3>
            
            <div className="space-y-2">
              <div>
                <div className="text-gray-600 mb-1">Имя получателя</div>
                <Input
                  value={orderData.recipientName}
                  onChange={(e) => onUpdateData({ recipientName: e.target.value })}
                  placeholder="Анна"
                  className="w-full"
                />
              </div>
              <div>
                <div className="text-gray-600 mb-1">Телефон получателя</div>
                <Input
                  type="tel"
                  value={orderData.recipientPhone}
                  onChange={(e) => onUpdateData({ recipientPhone: e.target.value })}
                  placeholder="+7 (000) 000-00-00"
                  className="w-full"
                />
              </div>
            </div>
          </div>
        )}

        {/* Заказчик */}
        <div className="border-t border-gray-200 pt-3">
          <h3 className="text-gray-900 mb-2">
            {orderData.deliveryType === 'pickup' ? 'Контактные данные' : 'Заказчик'}
          </h3>
          
          <div className="space-y-2">
            <div>
              <div className="text-gray-600 mb-1">Имя</div>
              <Input
                value={orderData.senderName}
                onChange={(e) => onUpdateData({ senderName: e.target.value })}
                placeholder="Сергей"
                className="w-full"
              />
            </div>
            <div>
              <div className="text-gray-600 mb-1">Телефон</div>
              <Input
                type="tel"
                value={orderData.senderPhone}
                onChange={(e) => onUpdateData({ senderPhone: e.target.value })}
                placeholder="+7 (000) 000-00-00"
                className="w-full"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}