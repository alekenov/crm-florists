import React, { useState, useEffect } from 'react';
import { Order } from '../../src/types';
import { useIntegratedAppState } from '../../hooks/useIntegratedAppState';

import { OrderHeader } from './OrderHeader';
import { OrderContent } from './OrderContent';
import { StatusPanel } from './StatusPanel';
import { toast } from 'sonner@2.0.3';

interface OrderDetailProps {
  orderId: string;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpdateStatus?: (orderId: string, status: string) => void;
}

export function OrderDetail({
  orderId,
  onClose,
  onEdit,
  onDelete,
  onUpdateStatus
}: OrderDetailProps) {
  // Always call hooks at the top level - never conditionally
  const { orders, loading, error, apiActions, refetchOrders } = useIntegratedAppState();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<Partial<Order & { postcardText?: string }>>({});

  // Initialize editData when order is found
  useEffect(() => {
    const order = orders?.find(o => o.id === orderId);
    if (order) {
      setEditData({
        address: order.deliveryAddress,  // Changed from deliveryAddress to address
        deliveryDate: order.deliveryDate,
        deliveryTimeRange: order.deliveryTimeRange,
        comment: order.comment,
        postcardText: order.notes || '',
        recipientName: order.recipient?.name || '',
        recipientPhone: order.recipient?.phone || '',
        senderName: order.sender?.name || '',
        senderPhone: order.sender?.phone || '',
      });
    }
  }, [orderId, orders]);

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

  // Find order from global state
  const order = orders?.find(o => o.id === orderId) || null;

  // Event handlers using simplified logic
  const handleEdit = () => {
    if (order) {
      setIsEditing(true);
      setEditData({
        address: order.deliveryAddress,  // Changed from deliveryAddress to address
        deliveryDate: order.deliveryDate,
        deliveryTimeRange: order.deliveryTimeRange,
        comment: order.comment,
        postcardText: order.notes || '',
        recipientName: order.recipient?.name || '',
        recipientPhone: order.recipient?.phone || '',
        senderName: order.sender?.name || '',
        senderPhone: order.sender?.phone || '',
      });
    }
  };

  const handleSave = async () => {
    try {
      // Get numeric order ID
      const orderIdNum = parseInt(orderId);

      // Prepare data for update - only send modified fields
      const updateData: any = {};

      if (editData.comment !== undefined) {
        updateData.comment = editData.comment;
      }
      if (editData.postcardText !== undefined) {
        updateData.notes = editData.postcardText;
      }
      if (editData.address !== undefined) {
        updateData.delivery_address = editData.address;  // Changed from editData.deliveryAddress to editData.address
      }
      if (editData.deliveryTimeRange !== undefined) {
        updateData.delivery_time_range = editData.deliveryTimeRange;
      }
      if (editData.deliveryDate !== undefined) {
        // Convert Russian date strings to ISO date
        const today = new Date();
        let deliveryDate: Date;

        if (editData.deliveryDate === 'Сегодня') {
          deliveryDate = today;
        } else if (editData.deliveryDate === 'Завтра') {
          deliveryDate = new Date(today);
          deliveryDate.setDate(deliveryDate.getDate() + 1);
        } else if (editData.deliveryDate === 'Послезавтра') {
          deliveryDate = new Date(today);
          deliveryDate.setDate(deliveryDate.getDate() + 2);
        } else if (editData.deliveryDate.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
          // Handle DD.MM.YYYY format
          const [day, month, year] = editData.deliveryDate.split('.');
          deliveryDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
        } else {
          // Try to parse as is (ISO format or other)
          deliveryDate = new Date(editData.deliveryDate);
        }

        updateData.delivery_date = deliveryDate.toISOString();
      }

      // Update recipient data if changed
      if (editData.recipientName !== undefined || editData.recipientPhone !== undefined) {
        if (order && order.recipient) {
          const recipientUpdateData: any = {};
          if (editData.recipientName !== undefined && editData.recipientName !== order.recipient.name) {
            recipientUpdateData.name = editData.recipientName;
          }
          if (editData.recipientPhone !== undefined && editData.recipientPhone !== order.recipient.phone) {
            recipientUpdateData.phone = editData.recipientPhone;
          }

          if (Object.keys(recipientUpdateData).length > 0) {
            await apiActions.updateClient(order.recipient.id, recipientUpdateData);
          }
        }
      }

      // Update sender data if changed
      if (editData.senderName !== undefined || editData.senderPhone !== undefined) {
        if (order && order.sender) {
          const senderUpdateData: any = {};
          if (editData.senderName !== undefined && editData.senderName !== order.sender.name) {
            senderUpdateData.name = editData.senderName;
          }
          if (editData.senderPhone !== undefined && editData.senderPhone !== order.sender.phone) {
            senderUpdateData.phone = editData.senderPhone;
          }

          if (Object.keys(senderUpdateData).length > 0) {
            await apiActions.updateClient(order.sender.id, senderUpdateData);
          }
        }
      }

      // Call API to update order
      await apiActions.updateOrder(orderIdNum, updateData);

      // Update local state
      setIsEditing(false);

      // Refresh orders list to get updated data
      await refetchOrders();

      toast.success('Изменения успешно сохранены');
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Ошибка при сохранении изменений');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const handleFieldChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleStatusChange = async (newStatus: string) => {
    try {
      toast.success(`Статус изменен на "${newStatus}"`);
      // Pass both orderId and newStatus
      onUpdateStatus?.(orderId, newStatus);
    } catch (error) {
      toast.error('Ошибка изменения статуса');
    }
  };

  const handleResponsibleChange = async (personId: string) => {
    try {
      const orderIdNum = parseInt(orderId);
      const executorId = personId === 'null' ? null : parseInt(personId);

      await apiActions.updateOrder(orderIdNum, {
        executor_id: executorId
      });

      await refetchOrders();

      const message = executorId === null
        ? 'Флорист убран'
        : `Флорист назначен`;
      toast.success(message);
    } catch (error) {
      console.error('Error updating executor:', error);
      toast.error('Ошибка назначения флориста');
    }
  };

  const handleCourierChange = async (courierId: string) => {
    try {
      const orderIdNum = parseInt(orderId);
      const courierIdNum = courierId === 'null' ? null : parseInt(courierId);

      await apiActions.updateOrder(orderIdNum, {
        courier_id: courierIdNum
      });

      await refetchOrders();

      const message = courierIdNum === null
        ? 'Курьер убран'
        : `Курьер назначен`;
      toast.success(message);
    } catch (error) {
      console.error('Error updating courier:', error);
      toast.error('Ошибка назначения курьера');
    }
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

  // Handle loading state
  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка заказа...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-red-600">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-4">{error}</p>
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

  // Handle order not found
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
            editableData={editData}
            onFieldChange={handleFieldChange}
            onPhotoAdd={handlePhotoAdd}
            onNotifyReplacement={handleNotifyReplacement}
          />

          <StatusPanel
            order={order}
            onStatusChange={handleStatusChange}
            onResponsibleChange={handleResponsibleChange}
            onCourierChange={handleCourierChange}
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="flex gap-6 p-6">
          {/* Main Content */}
          <div className="flex-1">
            <OrderContent
              order={order}
              isEditing={isEditing}
              editableData={editData}
              onFieldChange={handleFieldChange}
              onPhotoAdd={handlePhotoAdd}
              onNotifyReplacement={handleNotifyReplacement}
            />
          </div>

          {/* Status Panel */}
          <div className="w-80">
            <StatusPanel
              order={order}
              onStatusChange={handleStatusChange}
              onResponsibleChange={handleResponsibleChange}
              onCourierChange={handleCourierChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}