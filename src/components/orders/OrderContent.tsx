import React from 'react';
import { Camera } from 'lucide-react';
import { Order } from '../../src/types';
import { Button } from '../ui/button';
import { OrderItems } from './OrderItems';
import { OrderInfo } from './OrderInfo';

interface OrderContentProps {
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
  onPhotoAdd?: () => void;
  onNotifyReplacement?: () => void;
}

export function OrderContent({ 
  order, 
  isEditing = false,
  editableData,
  onFieldChange,
  onPhotoAdd,
  onNotifyReplacement
}: OrderContentProps) {
  return (
    <div className="space-y-8">
      {/* Mobile Content */}
      <div className="lg:hidden">
        {/* Main Product */}
        <div className="py-4 border-b border-gray-200">
          <div className="flex items-center gap-4 py-3">
            <div
              className="w-20 h-24 rounded-lg bg-cover bg-center flex-shrink-0"
              style={{ backgroundImage: order.mainProduct?.image ? `url('${order.mainProduct.image}')` : 'none' }}
            />
            <div className="flex-1 min-w-0">
              <div>{order.mainProduct.title}</div>
              {order.mainProduct.composition && (
                <div className="text-sm text-gray-600">
                  {order.mainProduct.composition.length > 60 ? 
                    `${order.mainProduct.composition.map(c => `${c.name} — ${c.count} шт`).join(', ').substring(0, 60)}...` : 
                    order.mainProduct.composition.map(c => `${c.name} — ${c.count} шт`).join(', ')
                  }
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Photo Before Delivery */}
        <div className="py-4 border-b border-gray-200">
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-full">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 text-gray-500">
                <Camera />
              </div>
              <span>Фото до доставки</span>
            </div>
            <div className="text-sm text-gray-600">
              {order.photoBeforeDelivery ? 'Добавлено' : 'Не добавлено'}
            </div>
          </div>
        </div>

        {/* Notify About Flower Replacement */}
        <div className="py-4">
          <Button 
            variant="outline" 
            className="w-full h-11 border-gray-200"
            onClick={onNotifyReplacement}
          >
            Оповестить о замене цветка
          </Button>
        </div>

        {/* Additional Items */}
        {order.additionalItems && order.additionalItems.length > 0 && (
          <div className="py-4">
            {order.additionalItems.map((item, index) => (
              <div key={index} className="flex items-center gap-4 py-3">
                <div 
                  className="w-20 h-24 rounded-lg bg-cover bg-center flex-shrink-0"
                  style={{ backgroundImage: `url('${item.productImage}')` }}
                />
                <div className="flex-1 min-w-0">
                  <div>{item.productTitle}</div>
                  <div className="text-sm text-gray-600">
                    {item.quantity} шт × {(item.unitPrice || 0).toLocaleString()} ₸
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop Content */}
      <div className="hidden lg:block">
        <OrderItems
          mainProduct={order.mainProduct}
          additionalItems={order.additionalItems}
          onPhotoAdd={onPhotoAdd}
          onNotifyReplacement={onNotifyReplacement}
        />
      </div>

      {/* Order Information */}
      <div className="lg:block">
        <OrderInfo
          order={order}
          isEditing={isEditing}
          editableData={editableData}
          onFieldChange={onFieldChange}
        />
      </div>
    </div>
  );
}