// Updated Orders component using real API
import { useState, useCallback } from "react";
import { Search } from "lucide-react";

import { Order } from "../../src/types";
import { EmptyState } from "../common/EmptyState";
import { PageHeader } from "../common/PageHeader";
import { OrderFilters } from "./OrderFilters";
import { OrderItem } from "./OrderItem";
import { OrdersTable } from "./OrdersTable";
import { useOrders } from "../../hooks/useApiOrders";

type FilterType = 'all' | 'new' | 'paid' | 'accepted' | 'assembled' | 'completed';

interface OrdersWithAPIProps {
  onViewOrder?: (orderId: string) => void;
  onAddOrder?: () => void;
}

export function OrdersWithAPI({ onViewOrder, onAddOrder }: OrdersWithAPIProps) {
  const [filters, setFilters] = useState<{
    activeFilter: FilterType;
    searchQuery: string;
    selectedDate?: Date;
  }>({
    activeFilter: 'all',
    searchQuery: '',
    selectedDate: undefined
  });

  // Use our new API-integrated hook
  const {
    orders,
    loading,
    error,
    refetch: refreshOrders,
    updateOrderStatus
  } = useOrders();

  const handleStatusChange = useCallback(async (orderId: string, newStatus: Order['status']) => {
    try {
      // Convert string to number for API and frontend status to backend status
      const statusMap: Record<string, any> = {
        'new': 'новый',
        'paid': 'новый',
        'accepted': 'в работе',
        'assembled': 'готов',
        'in-transit': 'готов',
        'completed': 'доставлен'
      };
      await updateOrderStatus(parseInt(orderId), statusMap[newStatus] || 'новый');
    } catch (error) {
      // Error is already handled in the hook
    }
  }, [updateOrderStatus]);

  // Search orders function (same as original)
  const searchOrders = (orders: Order[], query: string) => {
    if (!query.trim()) return orders;

    const lowerQuery = query.toLowerCase().trim();

    return orders.filter(order => {
      // Search by order number
      if (order.number.toLowerCase().includes(lowerQuery)) return true;

      // Search by sender name
      if (order.sender?.name && order.sender.name.toLowerCase().includes(lowerQuery)) return true;

      // Search by recipient name
      if (order.recipient?.name && order.recipient.name.toLowerCase().includes(lowerQuery)) return true;

      // Search by phone numbers
      if (order.sender?.phone.includes(lowerQuery)) return true;
      if (order.recipient?.phone.includes(lowerQuery)) return true;

      // Search by delivery address
      if (order.deliveryAddress?.toLowerCase().includes(lowerQuery)) return true;

      // Search by comment
      if (order.comment?.toLowerCase().includes(lowerQuery)) return true;

      // Search by product name
      if (order.mainProduct?.title.toLowerCase().includes(lowerQuery)) return true;

      return false;
    });
  };

  // Filter orders function (same as original)
  const filterOrders = (orders: Order[]) => {
    let filtered = [...orders];

    // Apply active filter
    if (filters.activeFilter !== 'all') {
      filtered = filtered.filter(order => order.status === filters.activeFilter);
    }

    // Apply date filter
    if (filters.selectedDate) {
      const selectedDateStr = filters.selectedDate.toDateString();
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt).toDateString();
        return orderDate === selectedDateStr;
      });
    }

    // Apply search
    filtered = searchOrders(filtered, filters.searchQuery);

    return filtered;
  };

  const filteredOrders = filterOrders(orders);

  // Handle loading state
  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка заказов...</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600 mb-2">Ошибка загрузки</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={refreshOrders}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <PageHeader
        title="Заказы"
        subtitle={`Всего заказов: ${orders.length}`}
        onAdd={onAddOrder}
        addButtonText="Добавить заказ"
      />

      {/* Filters */}
      <OrderFilters
        orders={orders}
        onAddOrder={onAddOrder}
        onFiltersChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
      />

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {filteredOrders.length === 0 ? (
          <EmptyState
            title="Заказы не найдены"
            description="Попробуйте изменить фильтры или добавить новый заказ"
            actionText="Добавить заказ"
            onAction={onAddOrder}
          />
        ) : (
          <>
            {/* Mobile view */}
            <div className="lg:hidden space-y-4 p-4 overflow-y-auto h-full">
              {filteredOrders.map((order) => (
                <OrderItem
                  key={order.id}
                  order={order}
                  onView={() => onViewOrder?.(order.id)}
                  onStatusChange={(newStatus) => handleStatusChange(order.id, newStatus)}
                />
              ))}
            </div>

            {/* Desktop view */}
            <div className="hidden lg:block h-full">
              <OrdersTable
                orders={filteredOrders}
                onViewOrder={(orderId) => onViewOrder?.(orderId)}
                onStatusChange={handleStatusChange}
                activeFilter={filters.activeFilter}
                onAddOrder={onAddOrder}
              />
            </div>
          </>
        )}
      </div>


      {/* Loading overlay for updates */}
      {loading && orders.length > 0 && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
          </div>
        </div>
      )}
    </div>
  );
}