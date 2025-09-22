import { Button } from "../ui/button";
import { Order } from "../../src/types";
import { getTimeAgo } from "../../src/utils/date";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrderItemProps {
  order: Order;
  onClick?: (id: string) => void;
  onStatusChange?: (id: string, newStatus: Order['status']) => void;
  searchQuery?: string;
}

const ACTION_BUTTONS = {
  new: 'Оплачен',
  paid: 'Принять',
  accepted: '+ Фото',
  assembled: '→ Курьеру',
  'in-transit': 'Завершить'
};

export function OrderItem({ order, onClick, onStatusChange, searchQuery }: OrderItemProps) {
  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const statusFlow = {
      new: 'paid',
      paid: 'accepted', 
      accepted: 'assembled',
      assembled: 'in-transit',
      'in-transit': 'completed'
    } as const;
    
    const newStatus = statusFlow[order.status];
    if (newStatus && onStatusChange) {
      onStatusChange(order.id, newStatus);
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

  // Получаем все товары в заказе (основной + дополнительные)
  const allProductImages = [
    ...(order.mainProduct?.image ? [{ image: order.mainProduct.image, id: order.mainProduct.id }] : []),
    ...(order.additionalItems?.map(item => ({
      image: item.productImage,
      id: item.productId
    })).filter(item => item.image) || [])
  ];

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
            <span>{highlightMatch(order.number, searchQuery)}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="text-gray-700">
            {order.deliveryType === 'pickup' ? (
              'Самовывоз'
            ) : (
              order.deliveryAddress ? 
                `${order.deliveryCity}, ${order.deliveryAddress}` : 
                `${order.deliveryCity}, уточнить у получателя`
            )}
          </div>
          <div className="text-gray-600">
            {order.deliveryDate === 'today' ? 'Сегодня' : 'Завтра'}, {order.deliveryTime || 'уточнить у получателя'} • {getTimeAgo(order.createdAt)}
          </div>
          {/* Показываем совпадения имен и телефонов при поиске */}
          {searchQuery && (
            <div className="text-gray-600 mt-1 space-y-0.5">
              {order.sender?.name && order.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                <div>Отправитель: {highlightMatch(order.sender.name, searchQuery)}</div>
              )}
              {order.recipient?.name && order.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                <div>Получатель: {highlightMatch(order.recipient.name, searchQuery)}</div>
              )}
              {order.sender?.phone && searchQuery.replace(/\D/g, '') && order.sender.phone.replace(/\D/g, '').includes(searchQuery.replace(/\D/g, '')) && (
                <div>Тел. отправителя: {highlightMatch(order.sender.phone, searchQuery)}</div>
              )}
              {order.recipient?.phone && searchQuery.replace(/\D/g, '') && order.recipient.phone.replace(/\D/g, '').includes(searchQuery.replace(/\D/g, '')) && (
                <div>Тел. получателя: {highlightMatch(order.recipient.phone, searchQuery)}</div>
              )}
            </div>
          )}
        </div>
        {order.status !== 'completed' && (
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

      {order.executor?.florist && (
        <div className="mb-3 text-gray-600">
          {order.executor.florist}
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