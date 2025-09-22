import React, { useState, useEffect } from 'react';
import { Order } from '../../src/types';
import { useAppState } from '../../src/hooks/useAppState';

import { OrderHeader } from './OrderHeader';
import { OrderContent } from './OrderContent';
import { StatusPanel } from './StatusPanel';
import { toast } from 'sonner@2.0.3';

interface OrderDetailProps {
  orderId: string;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpdateStatus?: (status: string) => void;
}

export function OrderDetail({ 
  orderId, 
  onClose, 
  onEdit, 
  onDelete, 
  onUpdateStatus 
}: OrderDetailProps) {
  const { orders, setOrders } = useAppState();
  const [isEditing, setIsEditing] = useState(false);
  
  // Editable fields state
  const [editableData, setEditableData] = useState({
    postcard: '',
    comment: '',
    address: '',
    deliveryDate: '',
    recipientName: '',
    recipientPhone: '',
    senderName: '',
    senderPhone: ''
  });

  // Find order data
  const order = orders.find(o => o.id === orderId);

  // Initialize editable data when order is loaded
  useEffect(() => {
    if (order) {
      setEditableData({
        postcard: order.postcard || '',
        comment: order.comment || '',
        address: order.deliveryAddress || '',
        deliveryDate: order.deliveryDate,
        recipientName: order.recipient.name || '',
        recipientPhone: order.recipient.phone,
        senderName: order.sender.name || '',
        senderPhone: order.sender.phone
      });
    }
  }, [order]);

  if (!order) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2">Заказ не найден</h2>
          <p className="text-gray-600 mb-4">Заказ с ID {orderId} не существует</p>
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Вернуться к заказам
          </button>
        </div>
      </div>
    );
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Update order with editable data
    const updatedOrder: Order = {
      ...order,
      postcard: editableData.postcard,
      comment: editableData.comment,
      deliveryAddress: editableData.address,
      deliveryDate: editableData.deliveryDate as "today" | "tomorrow",
      recipient: {
        ...order.recipient,
        name: editableData.recipientName,
        phone: editableData.recipientPhone
      },
      sender: {
        ...order.sender,
        name: editableData.senderName,
        phone: editableData.senderPhone
      },
      updatedAt: new Date()
    };

    // Update orders in state
    setOrders(prevOrders => 
      prevOrders.map(o => o.id === orderId ? updatedOrder : o)
    );

    setIsEditing(false);
    onEdit?.();
    
    toast.success("Заказ обновлен", {
      description: "Изменения успешно сохранены"
    });
  };

  const handleCancel = () => {
    // Reset to original data
    if (order) {
      setEditableData({
        postcard: order.postcard || '',
        comment: order.comment || '',
        address: order.deliveryAddress || '',
        deliveryDate: order.deliveryDate,
        recipientName: order.recipient.name || '',
        recipientPhone: order.recipient.phone,
        senderName: order.sender.name || '',
        senderPhone: order.sender.phone
      });
    }
    setIsEditing(false);
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditableData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleStatusChange = (newStatus: string) => {
    // Update order status
    const updatedOrder: Order = {
      ...order,
      status: newStatus as Order['status'],
      updatedAt: new Date()
    };

    // Update orders in state
    setOrders(prevOrders => 
      prevOrders.map(o => o.id === orderId ? updatedOrder : o)
    );

    onUpdateStatus?.(newStatus);
    
    toast.success("Статус обновлен", {
      description: `Статус заказа изменен на "${newStatus}"`
    });
  };

  const handleResponsibleChange = (person: string) => {
    const updatedOrder: Order = {
      ...order,
      executor: {
        ...order.executor,
        florist: person === 'Не назначен' ? undefined : person
      },
      updatedAt: new Date()
    };

    setOrders(prevOrders => 
      prevOrders.map(o => o.id === orderId ? updatedOrder : o)
    );

    toast.success("Флорист назначен", {
      description: `Ответственный флорист: ${person}`
    });
  };

  const handleCourierChange = (courier: string) => {
    const updatedOrder: Order = {
      ...order,
      executor: {
        ...order.executor,
        courier: courier === 'Не назначен' ? undefined : courier
      },
      updatedAt: new Date()
    };

    setOrders(prevOrders => 
      prevOrders.map(o => o.id === orderId ? updatedOrder : o)
    );

    toast.success("Курьер назначен", {
      description: `Курьер: ${courier}`
    });
  };

  const handlePhotoAdd = () => {
    toast.info("Добавление фото", {
      description: "Функция добавления фото будет доступна скоро"
    });
  };

  const handleNotifyReplacement = () => {
    toast.info("Уведомление отправлено", {
      description: "Клиент будет уведомлен о возможной замене цветов"
    });
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.dropdown-container')) {
        // Dropdowns are handled in child components
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white min-h-screen">
      <OrderHeader
        order={order}
        isEditing={isEditing}
        onClose={onClose}
        onEdit={handleEdit}
        onSave={handleSave}
        onCancel={handleCancel}
      />

      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="px-4 pb-20">
          <OrderContent
            order={order}
            isEditing={isEditing}
            editableData={editableData}
            onFieldChange={handleFieldChange}
            onPhotoAdd={handlePhotoAdd}
            onNotifyReplacement={handleNotifyReplacement}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex">
        {/* Main Content - Left Side (60%) */}
        <div className="flex-1 p-6">
          <OrderContent
            order={order}
            isEditing={isEditing}
            editableData={editableData}
            onFieldChange={handleFieldChange}
            onPhotoAdd={handlePhotoAdd}
            onNotifyReplacement={handleNotifyReplacement}
          />
        </div>

        {/* Status & History Panel - Right Side (40%) */}
        <div className="w-2/5 border-l bg-gray-50 p-6">
          <StatusPanel
            order={order}
            onStatusChange={handleStatusChange}
            onResponsibleChange={handleResponsibleChange}
            onCourierChange={handleCourierChange}
          />
        </div>
      </div>
    </div>
  );
}