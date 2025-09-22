import { Textarea } from "../ui/textarea";

interface OrderData {
  selectedProduct: {
    id: number;
    title: string;
    price: string;
    image: string;
    images?: string[];
  } | null;
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

interface FinalStepProps {
  orderData: OrderData;
  onUpdateData: (updates: Partial<OrderData>) => void;
}

export function FinalStep({ orderData, onUpdateData }: FinalStepProps) {
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
    <div className="px-3">
      <div className="py-4">
        <h2>Подтверждение заказа</h2>
        <p className="text-gray-600 mb-4">Проверьте данные и добавьте дополнительную информацию</p>
      </div>

      <div className="space-y-3">
        {/* Выбранный товар */}
        {orderData.selectedProduct && (
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-gray-600 mb-2">Выбранный товар</div>
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 bg-cover bg-center rounded-full"
                style={{ backgroundImage: `url('${orderData.selectedProduct.images?.[0] || orderData.selectedProduct.image}')` }}
              />
              <div>
                <div className="text-gray-900">{orderData.selectedProduct.title}</div>
                <div className="text-purple-600">{orderData.selectedProduct.price}</div>
              </div>
            </div>
          </div>
        )}

        {/* Детали получения */}
        <div className="bg-gray-50 p-3 rounded-md">
          <div className="text-gray-600 mb-2">Получение</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-700">Способ:</span>
              <span className="text-gray-900">
                {orderData.deliveryType === 'delivery' ? 'Доставка' : 'Самовывоз'}
              </span>
            </div>
            {orderData.deliveryType === 'delivery' && orderData.deliveryAddress && (
              <div className="flex justify-between">
                <span className="text-gray-700">Адрес:</span>
                <span className="text-gray-900 text-right max-w-[200px]">
                  {orderData.deliveryAddress}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-700">Дата:</span>
              <span className="text-gray-900">
                {getDeliveryDateText(orderData.deliveryDate)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-700">Время:</span>
              <span className="text-gray-900">
                {getTimeText(orderData.deliveryTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Открытка */}
        <div>
          <div className="text-gray-600 mb-1">Текст открытки (опционально)</div>
          <Textarea
            value={orderData.postcard}
            onChange={(e) => onUpdateData({ postcard: e.target.value })}
            placeholder="С Днем рождения! Желаем счастья и здоровья!"
            className="w-full min-h-[60px] resize-none"
          />
        </div>

        {/* Комментарий */}
        <div>
          <div className="text-gray-600 mb-1">Комментарий к заказу (опционально)</div>
          <Textarea
            value={orderData.comment}
            onChange={(e) => onUpdateData({ comment: e.target.value })}
            placeholder="Особые пожелания или инструкции"
            className="w-full min-h-[50px] resize-none"
          />
        </div>
      </div>
    </div>
  );
}