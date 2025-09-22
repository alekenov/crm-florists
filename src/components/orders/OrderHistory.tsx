import React from 'react';
import { ShoppingCart, CreditCard, User, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { OrderHistoryItem } from '../../src/types';

interface OrderHistoryProps {
  history: OrderHistoryItem[];
}

export function OrderHistory({ history }: OrderHistoryProps) {
  // Определяем тип события по описанию
  const getEventInfo = (desc: string) => {
    if (desc.includes('Создание заказа')) {
      return {
        icon: <ShoppingCart className="w-4 h-4" />,
        color: 'bg-blue-500',
        title: 'Создание заказа',
        detail: 'Заказ был создан в системе'
      };
    }
    if (desc.includes('Оплата заказа')) {
      return {
        icon: <CreditCard className="w-4 h-4" />,
        color: 'bg-green-500',
        title: 'Оплата заказа',
        detail: desc.includes('Kaspi') ? 'Платёжная система: Kaspi' : 'Заказ был оплачен'
      };
    }
    if (desc.includes('стал ответственным')) {
      const florist = desc.match(/Флорист ([^с]+)/)?.[1]?.trim();
      return {
        icon: <User className="w-4 h-4" />,
        color: 'bg-gray-500',
        title: 'Назначен флорист',
        detail: florist ? `Флорист: ${florist}` : desc
      };
    }
    if (desc.includes('собран') || desc.includes('готов')) {
      return {
        icon: <Package className="w-4 h-4" />,
        color: 'bg-orange-500',
        title: 'Заказ собран',
        detail: 'Товар готов к доставке'
      };
    }
    if (desc.includes('доставка') || desc.includes('курьер')) {
      return {
        icon: <Truck className="w-4 h-4" />,
        color: 'bg-indigo-500',
        title: 'Доставка',
        detail: 'Заказ передан курьеру'
      };
    }
    if (desc.includes('завершен') || desc.includes('доставлен')) {
      return {
        icon: <CheckCircle className="w-4 h-4" />,
        color: 'bg-emerald-500',
        title: 'Заказ завершен',
        detail: 'Заказ успешно доставлен'
      };
    }
    
    return {
      icon: <Clock className="w-4 h-4" />,
      color: 'bg-gray-500',
      title: 'Обновление статуса',
      detail: desc
    };
  };

  // Конвертируем дату в относительное время
  const getRelativeTime = (dateStr: string) => {
    try {
      // Парсим дату в формате "04 фев 2021 16:42"
      const [day, month, year, time] = dateStr.split(' ');
      const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
      const monthIndex = months.indexOf(month);
      const [hours, minutes] = time.split(':');
      
      const eventDate = new Date(parseInt(year), monthIndex, parseInt(day), parseInt(hours), parseInt(minutes));
      const now = new Date();
      const diffInMs = now.getTime() - eventDate.getTime();
      const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
      const diffInDays = Math.floor(diffInHours / 24);

      if (diffInDays > 0) {
        return `${diffInDays} ${diffInDays === 1 ? 'день' : diffInDays < 5 ? 'дня' : 'дней'} назад`;
      } else if (diffInHours > 0) {
        return `${diffInHours} ${diffInHours === 1 ? 'час' : diffInHours < 5 ? 'часа' : 'часов'} назад`;
      } else {
        return 'Только что';
      }
    } catch {
      return dateStr;
    }
  };

  return (
    <div>
      <h3 className="mb-4">История заказа</h3>
      <div className="space-y-1">
        {history.map((item, index) => {
          const eventInfo = getEventInfo(item.description);
          const isLast = index === history.length - 1;
          
          return (
            <div key={index} className="relative flex items-start gap-4 pb-6 last:pb-0 group hover:bg-white/50 rounded-lg p-2 -m-2 transition-colors">
              {/* Timeline line */}
              {!isLast && (
                <div className="absolute left-6 top-10 w-0.5 h-full bg-gradient-to-b from-gray-300 to-gray-200"></div>
              )}
              
              {/* Event icon */}
              <div className={`flex-shrink-0 w-12 h-12 ${eventInfo.color} rounded-full flex items-center justify-center text-white shadow-lg z-10 ring-4 ring-white group-hover:scale-105 transition-transform duration-200`}>
                {eventInfo.icon}
              </div>
              
              {/* Event content */}
              <div className="flex-1 min-w-0 pt-1">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="group-hover:text-gray-800">{eventInfo.title}</h4>
                  <div className="flex flex-col items-end ml-2">
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      {getRelativeTime(item.date)}
                    </span>
                    <span className="text-xs text-gray-400 whitespace-nowrap mt-0.5">
                      {item.date.split(' ').slice(-1)[0]} {/* Показываем только время */}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 leading-relaxed mb-2">{eventInfo.detail}</p>
                
                {/* Additional context from original description */}
                {item.description !== eventInfo.detail && (
                  <div className="text-xs text-gray-500 bg-gray-100 rounded-md px-2 py-1 mt-1">
                    {item.description}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}