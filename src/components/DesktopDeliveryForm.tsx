import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Calendar, Clock } from 'lucide-react';

interface OrderData {
  selectedProduct: any;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress: string;
  deliveryDate: 'today' | 'tomorrow' | string;
  deliveryTime: string;
  recipientName: string;
  recipientPhone: string;
  senderName: string;
  senderPhone: string;
  postcard: string;
  comment: string;
}

interface DesktopDeliveryFormProps {
  orderData: OrderData;
  updateOrderData: (updates: Partial<OrderData>) => void;
}

export function DesktopDeliveryForm({ orderData, updateOrderData }: DesktopDeliveryFormProps) {
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
      updateOrderData({ deliveryDate: 'today' });
    } else if (dateString === tomorrowString) {
      updateOrderData({ deliveryDate: 'tomorrow' });
    } else {
      updateOrderData({ deliveryDate: dateString });
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
    <div className="space-y-6">
      {/* Delivery Type */}
      <div>
        <label className="block font-medium text-gray-700 mb-3">Способ получения</label>
        <div className="grid grid-cols-2 gap-4 max-w-md">
          <button
            onClick={() => updateOrderData({ deliveryType: 'delivery' })}
            className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
              orderData.deliveryType === 'delivery'
                ? 'border-purple-300 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">Доставка</div>
            <div className="text-sm opacity-75">Курьером</div>
          </button>
          <button
            onClick={() => updateOrderData({ deliveryType: 'pickup' })}
            className={`p-4 border rounded-lg transition-all hover:shadow-sm ${
              orderData.deliveryType === 'pickup'
                ? 'border-purple-300 bg-purple-50 text-purple-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="font-medium">Самовывоз</div>
            <div className="text-sm opacity-75">Из магазина</div>
          </button>
        </div>
      </div>

      {/* Delivery Address - only for delivery */}
      {orderData.deliveryType === 'delivery' && (
        <div>
          <label className="block font-medium text-gray-700 mb-2">Адрес доставки</label>
          <Input
            value={orderData.deliveryAddress}
            onChange={(e) => updateOrderData({ deliveryAddress: e.target.value })}
            placeholder="ул. Примерная 123, кв. 45"
            className="max-w-md"
          />
        </div>
      )}

      {/* Date and Time */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-5 h-5 text-purple-600" />
          <label className="font-medium text-gray-700">Дата и время</label>
        </div>

        <div className="space-y-4">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => updateOrderData({ deliveryDate: 'today' })}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                orderData.deliveryDate === 'today'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Сегодня
            </button>
            <button
              onClick={() => updateOrderData({ deliveryDate: 'tomorrow' })}
              className={`py-2 px-4 rounded-lg font-medium transition-colors ${
                orderData.deliveryDate === 'tomorrow'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Завтра
            </button>
            <button
              onClick={() => setShowDatePicker(!showDatePicker)}
              className={`py-2 px-4 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                orderData.deliveryDate !== 'today' && orderData.deliveryDate !== 'tomorrow'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Выбрать дату
            </button>
          </div>

          {showDatePicker && (
            <div className="max-w-xs">
              <Input
                type="date"
                value={getDateForInput(orderData.deliveryDate)}
                onChange={(e) => handleDateChange(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
          )}

          {/* Показываем выбранную дату если это не сегодня/завтра */}
          {orderData.deliveryDate !== 'today' && orderData.deliveryDate !== 'tomorrow' && (
            <div className="text-purple-600 font-medium">
              Выбранная дата: {getDeliveryDateText(orderData.deliveryDate)}
            </div>
          )}

          <div className="grid grid-cols-4 gap-3 max-w-md">
            {timeOptions.map((option) => (
              <button
                key={option.id}
                onClick={() => updateOrderData({ deliveryTime: option.id })}
                className={`py-2 px-3 rounded-lg font-medium transition-colors text-center ${
                  orderData.deliveryTime === option.id
                    ? 'bg-purple-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recipient - only for delivery */}
      {orderData.deliveryType === 'delivery' && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="font-medium text-gray-900 mb-4">Получатель</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-2">Имя получателя</label>
              <Input
                value={orderData.recipientName}
                onChange={(e) => updateOrderData({ recipientName: e.target.value })}
                placeholder="Анна"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-2">Телефон получателя</label>
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
      <div className="border-t border-gray-200 pt-6">
        <h3 className="font-medium text-gray-900 mb-4">
          {orderData.deliveryType === 'pickup' ? 'Контактные данные' : 'Заказчик'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 mb-2">Имя</label>
            <Input
              value={orderData.senderName}
              onChange={(e) => updateOrderData({ senderName: e.target.value })}
              placeholder="Сергей"
            />
          </div>
          <div>
            <label className="block font-medium text-gray-700 mb-2">Телефон</label>
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
  );
}