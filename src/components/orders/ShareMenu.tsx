import React from 'react';
import { Link, Eye, Copy, FileText } from 'lucide-react';

interface ShareMenuProps {
  orderId: string;
  orderData: {
    senderName?: string;
    senderPhone: string;
    recipientName?: string;
    recipientPhone: string;
    address?: string;
    deliveryDate: string;
    status: string;
    comment?: string;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function ShareMenu({ orderId, orderData, isOpen, onClose }: ShareMenuProps) {
  const handleShareColleagueLink = async () => {
    try {
      const orderUrl = `${window.location.origin}/order/${orderId}`;
      await navigator.clipboard.writeText(orderUrl);
      console.log("Ссылка скопирована");
    } catch (error) {
      console.error("Ошибка копирования", error);
    }
    onClose();
  };

  const handleShareStatusLink = async () => {
    try {
      const statusUrl = `${window.location.origin}/order-status/${orderId}`;
      await navigator.clipboard.writeText(statusUrl);
      console.log("Ссылка для клиента скопирована");
    } catch (error) {
      console.error("Ошибка копирования", error);
    }
    onClose();
  };

  const handleCopyOrderText = async () => {
    try {
      const orderText = `
Заказ #${orderId}
Клиент: ${orderData.senderName || 'Не указано'}
Телефон: ${orderData.senderPhone}
Получатель: ${orderData.recipientName || 'Не указано'}
Телефон получателя: ${orderData.recipientPhone}
Адрес: ${orderData.address || 'Не указан'}
Дата доставки: ${orderData.deliveryDate}
Статус: ${orderData.status}
Комментарий: ${orderData.comment || 'Не указан'}
      `.trim();
      
      await navigator.clipboard.writeText(orderText);
      console.log("Заказ скопирован");
    } catch (error) {
      console.error("Ошибка копирования", error);
    }
    onClose();
  };

  const handleSharePDF = () => {
    console.log("PDF экспорт будет доступен скоро");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full right-0 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="py-1">
        <button
          onClick={handleShareColleagueLink}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3"
        >
          <Link className="w-4 h-4 text-gray-500" />
          <div>
            <div>Ссылка на заказ</div>
            <div className="text-sm text-gray-500">Для коллег</div>
          </div>
        </button>
        <button
          onClick={handleShareStatusLink}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3"
        >
          <Eye className="w-4 h-4 text-gray-500" />
          <div>
            <div>Ссылка на статус</div>
            <div className="text-sm text-gray-500">Для клиента</div>
          </div>
        </button>
        <button
          onClick={handleCopyOrderText}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3"
        >
          <Copy className="w-4 h-4 text-gray-500" />
          <div>
            <div>Копировать текст</div>
            <div className="text-sm text-gray-500">Весь заказ</div>
          </div>
        </button>
        <button
          onClick={handleSharePDF}
          className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 border-t border-gray-100"
        >
          <FileText className="w-4 h-4 text-gray-500" />
          <div>
            <div>Экспорт в PDF</div>
            <div className="text-sm text-gray-500">Для печати</div>
          </div>
        </button>
      </div>
    </div>
  );
}