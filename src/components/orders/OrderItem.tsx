import { Button } from "../ui/button";
import { ApiOrder } from "../../types/api";
import { getTimeAgo } from "../../src/utils/date";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderItemProps {
  order: ApiOrder;
  onClick?: (id: string) => void;
  onStatusChange?: (id: string, newStatus: string) => void;
  searchQuery?: string;
}

const ACTION_BUTTONS = {
  'новый': 'Принять',
  'в работе': '+ Фото',
  'готов': '→ Курьеру'
};

export function OrderItem({ order, onClick, onStatusChange, searchQuery }: OrderItemProps) {
  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const statusFlow = {
      'новый': 'в работе',
      'в работе': 'готов',
      'готов': 'доставлен'
    } as const;

    const newStatus = statusFlow[order.status];
    if (newStatus && onStatusChange) {
      onStatusChange(String(order.id), newStatus);
    }
  };

  // Функция для подсветки совпадений в поиске
  const highlightMatch = (text: string, query?: string) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  // Получаем все товары в заказе из order_items
  const allProductImages = order.order_items?.map(item => ({
    image: item.product?.image_url,
    id: item.product?.id
  })).filter(item => item.image) || [];

  // Показываем максимум 3 изображения + счетчик для остальных
  const maxVisible = 3;
  const visibleImages = allProductImages.slice(0, maxVisible);
  const extraCount = allProductImages.length > maxVisible ? allProductImages.length - maxVisible : 0;
  
  return (
    <div 
      className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onClick?.(order.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span>{highlightMatch(`№${order.id}`, searchQuery)}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="text-gray-700">
            {order.delivery_address || 'Уточнить адрес доставки'}
          </div>
          <div className="text-gray-600">
            {order.delivery_date}, {order.delivery_time_range || 'уточнить время'} • {getTimeAgo(new Date(order.created_at))}
          </div>
          {/* Показываем совпадения имен и телефонов при поиске */}
          {searchQuery && (
            <div className="text-gray-600 mt-1 space-y-0.5">
              {order.client?.name && order.client.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                <div>Заказчик: {highlightMatch(order.client.name, searchQuery)}</div>
              )}
              {order.recipient?.name && order.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                <div>Получатель: {highlightMatch(order.recipient.name, searchQuery)}</div>
              )}
              {order.client?.phone && searchQuery.replace(/\D/g, '') && order.client.phone.replace(/\D/g, '').includes(searchQuery.replace(/\D/g, '')) && (
                <div>Тел. заказчика: {highlightMatch(order.client.phone, searchQuery)}</div>
              )}
              {order.recipient?.phone && searchQuery.replace(/\D/g, '') && order.recipient.phone.replace(/\D/g, '').includes(searchQuery.replace(/\D/g, '')) && (
                <div>Тел. получателя: {highlightMatch(order.recipient.phone, searchQuery)}</div>
              )}
            </div>
          )}
        </div>
        {order.status !== 'доставлен' && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-gray-900 hover:bg-gray-100 hover:border-gray-300"
            onClick={handleStatusClick}
          >
            {ACTION_BUTTONS[order.status]}
          </Button>
        )}
      </div>

      {order.executor?.name && (
        <div className="mb-3 text-gray-600">
          Флорист: {order.executor.name}
        </div>
      )}

      {/* Превью товаров в заказе */}
      <div className="flex items-center">
        {visibleImages.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="w-12 h-12 rounded-full border-2 border-white bg-cover bg-center"
            style={{ 
              backgroundImage: `url('${product.image}')`,
              marginLeft: index > 0 ? '-8px' : '0'
            }}
          />
        ))}
        {extraCount > 0 && (
          <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center ml-2">
            <span className="text-gray-600">{extraCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}