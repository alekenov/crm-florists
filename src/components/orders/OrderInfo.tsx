import React from 'react';
import { Order } from '../../types';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';

interface OrderInfoProps {
  order: Order;
  isEditing?: boolean;
  editableData?: {
    postcard: string;
    comment: string;
    address: string;
    deliveryDate: string;
    recipientName: string;
    recipientPhone: string;
    senderName: string;
    senderPhone: string;
  };
  onFieldChange?: (field: string, value: string) => void;
}

export function OrderInfo({ 
  order, 
  isEditing = false, 
  editableData,
  onFieldChange 
}: OrderInfoProps) {
  const handleChange = (field: string, value: string) => {
    onFieldChange?.(field, value);
  };

  return (
    <div>
      <h3 className="mb-4">Информация о заказе</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Postcard & Comment */}
        <div className="space-y-4">
          <div>
            <Label>Текст открытки</Label>
            {isEditing ? (
              <Textarea
                value={editableData?.postcardText || order.notes || ''}
                onChange={(e) => handleChange('postcardText', e.target.value)}
                placeholder="Текст для открытки..."
                className="mt-1"
                rows={4}
              />
            ) : (
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{order.notes || 'Не указан'}</p>
              </div>
            )}
          </div>

          <div>
            <Label>Комментарий к заказу</Label>
            {isEditing ? (
              <Textarea
                value={editableData?.comment || order.comment || ''}
                onChange={(e) => handleChange('comment', e.target.value)}
                placeholder="Комментарий..."
                className="mt-1"
                rows={3}
              />
            ) : (
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{order.comment || 'Не указан'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Delivery Information */}
        <div className="space-y-4">
          <div>
            <Label>Город доставки</Label>
            <div className="mt-1 p-3 bg-gray-50 rounded-md">
              <p className="text-sm">{order.deliveryCity}</p>
            </div>
          </div>

          <div>
            <Label>Дата доставки</Label>
            {isEditing ? (
              <select
                value={editableData?.deliveryDate || order.deliveryDate}
                onChange={(e) => handleChange('deliveryDate', e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Сегодня">Сегодня</option>
                <option value="Завтра">Завтра</option>
                <option value="Послезавтра">Послезавтра</option>
              </select>
            ) : (
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{order.deliveryDate}</p>
              </div>
            )}
          </div>

          <div>
            <Label>Адрес доставки</Label>
            {isEditing ? (
              <Input
                type="text"
                value={editableData?.address || order.deliveryAddress || ''}
                onChange={(e) => handleChange('address', e.target.value)}
                className="mt-1"
              />
            ) : (
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{order.deliveryAddress || 'Не указан'}</p>
              </div>
            )}
          </div>

          <div>
            <Label>Время доставки</Label>
            {isEditing ? (
              <select
                value={editableData?.deliveryTimeRange || order.deliveryTimeRange || order.deliveryTime || ''}
                onChange={(e) => handleChange('deliveryTimeRange', e.target.value)}
                className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Выберите время</option>
                <option value="09:00-12:00">09:00-12:00</option>
                <option value="12:00-15:00">12:00-15:00</option>
                <option value="15:00-18:00">15:00-18:00</option>
                <option value="18:00-21:00">18:00-21:00</option>
                <option value="В течение дня">В течение дня</option>
              </select>
            ) : (
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{order.deliveryTimeRange || order.deliveryTime || 'Не указано'}</p>
              </div>
            )}
          </div>
        </div>

        {/* Customer Information */}
        <div className="space-y-4">
          <h4>Получатель</h4>
          
          <div>
            <Label>Имя получателя</Label>
            {isEditing ? (
              <Input
                type="text"
                value={editableData?.recipientName || order.recipient.name || ''}
                onChange={(e) => handleChange('recipientName', e.target.value)}
                className="mt-1"
              />
            ) : (
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{order.recipient.name || 'Не указано'}</p>
              </div>
            )}
          </div>

          <div>
            <Label>Телефон получателя</Label>
            {isEditing ? (
              <Input
                type="tel"
                value={editableData?.recipientPhone || order.recipient.phone}
                onChange={(e) => handleChange('recipientPhone', e.target.value)}
                className="mt-1"
              />
            ) : (
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{order.recipient.phone}</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <h4>Отправитель</h4>
          
          <div>
            <Label>Имя отправителя</Label>
            {isEditing ? (
              <Input
                type="text"
                value={editableData?.senderName || order.sender.name || ''}
                onChange={(e) => handleChange('senderName', e.target.value)}
                className="mt-1"
              />
            ) : (
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{order.sender.name || 'Не указано'}</p>
              </div>
            )}
          </div>

          <div>
            <Label>Телефон отправителя</Label>
            {isEditing ? (
              <Input
                type="tel"
                value={editableData?.senderPhone || order.sender.phone}
                onChange={(e) => handleChange('senderPhone', e.target.value)}
                className="mt-1"
              />
            ) : (
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{order.sender.phone}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Information */}
        <div className="md:col-span-2">
          <h4 className="mb-4">Оплата</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Сумма</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{(order.payment?.amount || 0).toLocaleString()} ₸</p>
              </div>
            </div>
            <div>
              <Label>Статус</Label>
              <div className="mt-1 p-3 bg-gray-50 rounded-md">
                <p className="text-sm">{order.payment.status === 'paid' ? 'Оплачено' : 'Не оплачено'}</p>
              </div>
            </div>
            {order.payment.method && (
              <div>
                <Label>Способ оплаты</Label>
                <div className="mt-1 p-3 bg-gray-50 rounded-md">
                  <p className="text-sm">{order.payment.method}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}