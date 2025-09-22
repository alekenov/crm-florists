import React, { useState } from 'react';
import { ArrowLeft, Share } from 'lucide-react';
import { Order } from '../../src/types';
import { Button } from '../ui/button';
import { OrderStatusBadge } from './OrderStatusBadge';
import { ShareMenu } from './ShareMenu';

interface OrderHeaderProps {
  order: Order;
  isEditing?: boolean;
  onClose: () => void;
  onEdit?: () => void;
  onSave?: () => void;
  onCancel?: () => void;
}

export function OrderHeader({ 
  order, 
  isEditing = false,
  onClose, 
  onEdit, 
  onSave, 
  onCancel 
}: OrderHeaderProps) {
  const [isShareDropdownOpen, setIsShareDropdownOpen] = useState(false);

  const shareData = {
    senderName: order.sender.name,
    senderPhone: order.sender.phone,
    recipientName: order.recipient.name,
    recipientPhone: order.recipient.phone,
    address: order.deliveryAddress,
    deliveryDate: order.deliveryDate,
    status: order.status,
    comment: order.comment
  };

  return (
    <>
      {/* Mobile Header */}
      <div className="lg:hidden bg-white h-16 flex items-center border-b border-gray-200">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="p-2 ml-4"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Button>
        <h1 className="ml-4">
          № {order.number}
        </h1>
        <div className="ml-auto mr-4 flex items-center gap-2">
          <OrderStatusBadge status={order.status} />
          <div className="relative dropdown-container">
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2"
              onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
            >
              <Share className="w-6 h-6 text-gray-600" />
            </Button>
            <ShareMenu
              orderId={order.id}
              orderData={shareData}
              isOpen={isShareDropdownOpen}
              onClose={() => setIsShareDropdownOpen(false)}
            />
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-gray-200 p-6">
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
              <h1>Заказ № {order.number}</h1>
              <div className="flex items-center gap-2 mt-1">
                <OrderStatusBadge status={order.status} />
                <span className="text-sm text-gray-600">
                  • {order.deliveryCity} • {order.deliveryDate}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={onCancel}>
                  Отменить
                </Button>
                <Button size="sm" onClick={onSave}>
                  Сохранить
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" size="sm" onClick={onEdit}>
                  Редактировать
                </Button>
                <div className="relative dropdown-container">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="p-2"
                    onClick={() => setIsShareDropdownOpen(!isShareDropdownOpen)}
                  >
                    <Share className="w-5 h-5 text-gray-600" />
                  </Button>
                  <ShareMenu
                    orderId={order.id}
                    orderData={shareData}
                    isOpen={isShareDropdownOpen}
                    onClose={() => setIsShareDropdownOpen(false)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}