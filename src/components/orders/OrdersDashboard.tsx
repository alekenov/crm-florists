import React, { useState, useMemo } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { Plus, Search, Clock, CheckCircle, Package, Truck } from 'lucide-react';
import { useIntegratedAppState } from '../../hooks/useIntegratedAppState';
import { formatCurrency } from '../../src/utils/currency';

// Status configuration
const STATUS_CONFIG = {
  'новый': {
    icon: Clock,
    color: 'bg-blue-100 text-blue-700',
    label: 'Новый'
  },
  'в работе': {
    icon: Package,
    color: 'bg-yellow-100 text-yellow-700',
    label: 'В работе'
  },
  'готов': {
    icon: CheckCircle,
    color: 'bg-green-100 text-green-700',
    label: 'Готов'
  },
  'доставлен': {
    icon: Truck,
    color: 'bg-gray-100 text-gray-700',
    label: 'Доставлен'
  }
};

interface OrdersDashboardProps {
  onViewOrder: (orderId: string) => void;
  onAddOrder: () => void;
}

export function OrdersDashboard({ onViewOrder, onAddOrder }: OrdersDashboardProps) {
  const state = useIntegratedAppState();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState<{ [key: string]: boolean }>({});

  // Filter orders based on search and status
  const filteredOrders = useMemo(() => {
    let filtered = state.orders || [];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(order =>
        order.customer?.name?.toLowerCase().includes(query) ||
        order.customer?.phone?.includes(query) ||
        order.deliveryAddress?.toLowerCase().includes(query) ||
        order.number?.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    return filtered.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [state.orders, searchQuery, statusFilter]);

  // Quick status update
  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    setIsUpdatingStatus(prev => ({ ...prev, [orderId]: true }));
    try {
      await state.apiActions.updateOrderStatus(parseInt(orderId), newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setIsUpdatingStatus(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Get orders count by status
  const statusCounts = useMemo(() => {
    const counts = { all: 0, 'новый': 0, 'в работе': 0, 'готов': 0, 'доставлен': 0 };
    state.orders?.forEach(order => {
      counts.all++;
      counts[order.status as keyof typeof counts]++;
    });
    return counts;
  }, [state.orders]);

  if (state.loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Заказы</h1>
        <Button onClick={onAddOrder} className="flex items-center gap-2">
          <Plus size={16} />
          Новый заказ
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Поиск по клиенту, телефону, адресу..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Status filters */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
            statusFilter === 'all'
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          Все ({statusCounts.all})
        </button>
        {Object.entries(STATUS_CONFIG).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
              statusFilter === status
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {config.label} ({statusCounts[status as keyof typeof statusCounts]})
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchQuery ? 'Заказы не найдены' : 'Заказов пока нет'}
          </div>
        ) : (
          filteredOrders.map((order) => {
            const StatusIcon = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG]?.icon || Clock;
            const statusConfig = STATUS_CONFIG[order.status as keyof typeof STATUS_CONFIG];

            return (
              <div
                key={order.id}
                className="bg-white border rounded-lg p-4 space-y-3 cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => onViewOrder(order.id)}
              >
                {/* Order header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">#{order.number}</span>
                      <Badge className={statusConfig?.color}>
                        <StatusIcon size={12} className="mr-1" />
                        {statusConfig?.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {order.customer?.name || 'Клиент'} • {order.customer?.phone}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(order.totalPrice)}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(order.deliveryDate).toLocaleDateString('ru-RU')}
                    </p>
                  </div>
                </div>

                {/* Order items preview */}
                <div className="text-sm text-gray-600">
                  {order.items?.slice(0, 2).map((item, index) => (
                    <span key={item.id}>
                      {item.quantity}x {item.product?.title || 'Товар'}
                      {index < Math.min(order.items.length - 1, 1) && ', '}
                    </span>
                  ))}
                  {order.items.length > 2 && ` и еще ${order.items.length - 2}`}
                </div>

                {/* Delivery info */}
                <div className="text-sm text-gray-600">
                  📍 {order.deliveryAddress}
                  {order.deliveryTimeRange && ` • ${order.deliveryTimeRange}`}
                </div>

                {/* Quick status update buttons */}
                <div className="flex gap-2 pt-2" onClick={(e) => e.stopPropagation()}>
                  {order.status === 'новый' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(order.id, 'в работе')}
                      disabled={isUpdatingStatus[order.id]}
                      className="text-xs"
                    >
                      В работу
                    </Button>
                  )}
                  {order.status === 'в работе' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(order.id, 'готов')}
                      disabled={isUpdatingStatus[order.id]}
                      className="text-xs"
                    >
                      Готов
                    </Button>
                  )}
                  {order.status === 'готов' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusUpdate(order.id, 'доставлен')}
                      disabled={isUpdatingStatus[order.id]}
                      className="text-xs"
                    >
                      Доставлен
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Loading indicator for updates */}
      {state.ordersLoading && (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
        </div>
      )}
    </div>
  );
}