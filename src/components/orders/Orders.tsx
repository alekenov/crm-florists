import { useState, useCallback } from "react";
import { Search } from "lucide-react";

import { Order } from "../../src/types";
import { formatOrderDate } from "../../src/utils/date";
import { EmptyState } from "../common/EmptyState";
import { PageHeader } from "../common/PageHeader";
import { OrderFilters } from "./OrderFilters";
import { OrderItem } from "./OrderItem";
import { OrdersTable } from "./OrdersTable";

type FilterType = 'all' | 'new' | 'paid' | 'accepted' | 'assembled' | 'completed';

interface OrdersProps {
  orders: Order[];
  onViewOrder?: (orderId: string) => void;
  onStatusChange?: (orderId: string, newStatus: Order['status']) => void;
  onAddOrder?: () => void;
}

export function Orders({ orders, onViewOrder, onStatusChange, onAddOrder }: OrdersProps) {
  const [filters, setFilters] = useState<{
    activeFilter: FilterType;
    searchQuery: string;
    selectedDate?: Date;
  }>({
    activeFilter: 'all',
    searchQuery: '',
    selectedDate: undefined
  });

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    onStatusChange?.(orderId, newStatus);
  };

  // Функция поиска заказов
  const searchOrders = (orders: Order[], query: string) => {
    if (!query.trim()) return orders;
    
    const lowerQuery = query.toLowerCase().trim();
    
    return orders.filter(order => {
      // Поиск по номеру заказа
      if (order.number.toLowerCase().includes(lowerQuery)) return true;
      
      // Поиск по имени отправителя
      if (order.sender?.name && order.sender.name.toLowerCase().includes(lowerQuery)) return true;
      
      // Поиск по имени получателя
      if (order.recipient?.name && order.recipient.name.toLowerCase().includes(lowerQuery)) return true;
      
      // Поиск по телефону отправителя (убираем все нецифровые символы)
      if (order.sender?.phone) {
        const cleanPhone = order.sender.phone.replace(/\D/g, '');
        const cleanQuery = lowerQuery.replace(/\D/g, '');
        if (cleanQuery && cleanPhone.includes(cleanQuery)) return true;
      }
      
      // Поиск по телефону получателя (убираем все нецифровые символы)
      if (order.recipient?.phone) {
        const cleanPhone = order.recipient.phone.replace(/\D/g, '');
        const cleanQuery = lowerQuery.replace(/\D/g, '');
        if (cleanQuery && cleanPhone.includes(cleanQuery)) return true;
      }
      
      return false;
    });
  };

  // Функция фильтрации заказов по дате
  const filterOrdersByDate = (orders: Order[], selectedDate?: Date) => {
    if (!selectedDate) return orders;
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const isToday = selectedDate.toDateString() === today.toDateString();
    const isTomorrow = selectedDate.toDateString() === tomorrow.toDateString();
    
    return orders.filter(order => {
      if (isToday && order.deliveryDate === 'today') return true;
      if (isTomorrow && order.deliveryDate === 'tomorrow') return true;
      return false;
    });
  };

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    setFilters(newFilters);
  }, []);

  // Применяем фильтры
  let filteredOrders = filters.activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === filters.activeFilter);

  // Применяем фильтр по дате
  filteredOrders = filterOrdersByDate(filteredOrders, filters.selectedDate);

  // Применяем поиск
  filteredOrders = searchOrders(filteredOrders, filters.searchQuery);

  const formatDateForDisplay = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    } else {
      return formatOrderDate(date);
    }
  };

  const getEmptyStateConfig = () => {
    if (filters.searchQuery) {
      return {
        title: "По запросу ничего не найдено",
        description: `Попробуйте изменить поисковый запрос "${filters.searchQuery}"`
      };
    }
    
    if (filters.selectedDate) {
      return {
        title: "На выбранную дату заказов нет",
        description: `На ${formatDateForDisplay(filters.selectedDate)} заказов не запланировано`
      };
    }
    
    return {
      title: "Заказов не найдено",
      description: "Попробуйте изменить фильтр или добавить новый заказ"
    };
  };

  const emptyStateConfig = getEmptyStateConfig();

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Header */}
      <div className="lg:hidden">
        <PageHeader 
          title="Заказы" 
          actions={
            <OrderFilters
              orders={orders}
              onAddOrder={onAddOrder}
              onFiltersChange={handleFiltersChange}
              headerActionsOnly={true}
            />
          } 
        />
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <h1>Заказы</h1>
          <OrderFilters
            orders={orders}
            onAddOrder={onAddOrder}
            onFiltersChange={handleFiltersChange}
            headerActionsOnly={true}
          />
        </div>
      </div>

      {/* Filter Tabs and Search/Date bars */}
      <OrderFilters
        orders={orders}
        onAddOrder={onAddOrder}
        onFiltersChange={handleFiltersChange}
        headerActionsOnly={false}
      />

      {/* Orders List - Mobile View */}
      <div className="lg:hidden pb-20">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderItem 
              key={order.id} 
              order={order} 
              onClick={onViewOrder}
              onStatusChange={handleStatusChange}
              searchQuery={filters.searchQuery}
            />
          ))
        ) : (
          <EmptyState
            icon={<Search className="w-8 h-8 text-gray-400" />}
            title={emptyStateConfig.title}
            description={emptyStateConfig.description}
          />
        )}
      </div>

      {/* Orders Table - Desktop View */}
      <OrdersTable
        orders={filteredOrders}
        onViewOrder={onViewOrder}
        onAddOrder={onAddOrder}
        activeFilter={filters.activeFilter}
      />

      {/* Desktop Empty State */}
      {filteredOrders.length === 0 && (
        <div className="hidden lg:block">
          <EmptyState
            icon={<Search className="w-8 h-8 text-gray-400" />}
            title={emptyStateConfig.title}
            description={emptyStateConfig.description}
          />
        </div>
      )}
    </div>
  );
}