// Orders component adapted for Backend API integration
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table";
import { Search, Plus, X, CalendarIcon, User } from "lucide-react";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

// Import API hooks and types
import { useOrders } from "../hooks/useApiOrders";
import { useFlorists, useCouriers } from "../hooks/useApiUsers";
import { ApiOrder, OrderStatus } from "../types/api";
import { mapBackendStatusToFrontend, mapFrontendStatusToBackend } from "../api/client";

// Common components
function StatusBadge({ status, variant = 'default' }: { status: string; variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700',
    purple: 'bg-purple-100 text-purple-700'
  };

  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${variants[variant]}`}>
      {status}
    </div>
  );
}

function FilterTabs({ tabs, activeTab, onTabChange }: {
  tabs: Array<{ key: string; label: string; count?: number }>;
  activeTab: string;
  onTabChange: (tab: string) => void;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeTab === tab.key
              ? 'bg-primary text-primary-foreground'
              : 'bg-gray-100 text-gray-700'
          }`}
        >
          <span>{tab.label}</span>
          {tab.count !== undefined && (
            <span className={`px-1.5 py-0.5 rounded text-xs leading-none ${
              activeTab === tab.key
                ? 'bg-white/20 text-primary-foreground'
                : 'bg-white text-gray-600'
            }`}>
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

function EmptyState({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-4">{description}</p>
    </div>
  );
}

function PageHeader({ title, actions }: {
  title: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div>
        <h1 className="text-gray-900">{title}</h1>
      </div>
      {actions && <div className="flex gap-1">{actions}</div>}
    </div>
  );
}

// Status configuration mapping API statuses to display
const STATUS_CONFIG = {
  'новый': { label: 'Новый', variant: 'error' as const },
  'в работе': { label: 'В работе', variant: 'purple' as const },
  'готов': { label: 'Готов', variant: 'warning' as const },
  'доставлен': { label: 'Доставлен', variant: 'success' as const }
};

// Action buttons for status transitions
const ACTION_BUTTONS = {
  'новый': 'В работу',
  'в работе': 'Готов',
  'готов': 'Доставлен'
};

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = STATUS_CONFIG[status];
  if (!config) return <StatusBadge status={status} />;

  return (
    <StatusBadge
      status={config.label}
      variant={config.variant}
    />
  );
}

interface OrderItemProps {
  order: ApiOrder;
  onClick?: (id: number) => void;
  onStatusChange?: (id: number, newStatus: OrderStatus) => void;
  searchQuery?: string;
}

function OrderItem({ order, onClick, onStatusChange, searchQuery }: OrderItemProps) {
  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const statusFlow: Record<OrderStatus, OrderStatus | null> = {
      'новый': 'в работе',
      'в работе': 'готов',
      'готов': 'доставлен',
      'доставлен': null
    };

    const newStatus = statusFlow[order.status];
    if (newStatus && onStatusChange) {
      onStatusChange(order.id, newStatus);
    }
  };

  // Функция для подсветки совпадений в поиске
  const highlightMatch = (text: string, query?: string) => {
    if (!query || !text) return text;

    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  const formatDeliveryDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    }
    return date.toLocaleDateString('ru-RU');
  };

  return (
    <div
      className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onClick?.(order.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-900">Заказ #{order.id}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="text-gray-700">
            {order.delivery_address || 'Адрес не указан'}
          </div>
          <div className="text-gray-600 text-sm">
            {formatDeliveryDate(order.delivery_date)}
            {order.delivery_time_range && `, ${order.delivery_time_range}`}
            {' • '}
            {new Date(order.created_at).toLocaleDateString('ru-RU')}
          </div>

          {/* Показываем совпадения при поиске */}
          {searchQuery && (
            <div className="text-sm text-gray-600 mt-1 space-y-0.5">
              {order.client?.name && order.client.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                <div>Заказчик: {highlightMatch(order.client.name, searchQuery)}</div>
              )}
              {order.recipient?.name && order.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                <div>Получатель: {highlightMatch(order.recipient.name, searchQuery)}</div>
              )}
              {order.client?.phone && searchQuery.replace(/\D/g, '') && order.client.phone.replace(/\D/g, '').includes(searchQuery.replace(/\D/g, '')) && (
                <div>Тел. заказчика: {highlightMatch(order.client.phone, searchQuery)}</div>
              )}
              {order.recipient?.phone && searchQuery.replace(/\D/g, '') && order.recipient.phone.replace(/\D/g, '').includes(searchQuery.replace(/\D/g, '')) && (
                <div>Тел. получателя: {highlightMatch(order.recipient.phone, searchQuery)}</div>
              )}
            </div>
          )}
        </div>
        {order.status !== 'доставлен' && ACTION_BUTTONS[order.status] && (
          <Button
            variant="outline"
            size="sm"
            className="text-gray-900 hover:bg-gray-100 hover:border-gray-300"
            onClick={handleStatusClick}
          >
            {ACTION_BUTTONS[order.status]}
          </Button>
        )}
      </div>

      {/* Исполнитель (флорист) */}
      {order.executor && (
        <div className="mb-3 text-sm text-gray-600">
          Флорист: {order.executor.username}
        </div>
      )}

      {/* Превью товаров */}
      <div className="flex items-center">
        {order.order_items.slice(0, 3).map((item, index) => (
          <div
            key={item.id}
            className="w-12 h-12 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center"
            style={{ marginLeft: index > 0 ? '-8px' : '0' }}
          >
            {item.product.image_url ? (
              <div
                className="w-full h-full rounded-full bg-cover bg-center"
                style={{ backgroundImage: `url('${item.product.image_url}')` }}
              />
            ) : (
              <span className="text-xs text-gray-500 text-center">{item.product.name.slice(0, 2)}</span>
            )}
          </div>
        ))}
        {order.order_items.length > 3 && (
          <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center ml-2">
            <span className="text-gray-600 text-sm">+{order.order_items.length - 3}</span>
          </div>
        )}
      </div>
    </div>
  );
}

type FilterType = 'all' | 'новый' | 'в работе' | 'готов' | 'доставлен';

interface OrdersAPIProps {
  onViewOrder?: (orderId: number) => void;
  onAddOrder?: () => void;
}

export function OrdersAPI({ onViewOrder, onAddOrder }: OrdersAPIProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // API hooks
  const {
    orders,
    loading,
    error,
    refetch,
    updateOrderStatus
  } = useOrders();

  const handleStatusChange = async (orderId: number, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success(`Статус заказа обновлен на "${STATUS_CONFIG[newStatus].label}"`);
    } catch (err) {
      toast.error('Ошибка обновления статуса заказа');
      console.error('Error updating order status:', err);
    }
  };

  // Search function
  const searchOrders = (orders: ApiOrder[], query: string) => {
    if (!query.trim()) return orders;

    const lowerQuery = query.toLowerCase().trim();

    return orders.filter(order => {
      // Поиск по ID заказа
      if (order.id.toString().includes(lowerQuery)) {
        return true;
      }

      // Поиск по имени заказчика
      if (order.client?.name && order.client.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Поиск по имени получателя
      if (order.recipient?.name && order.recipient.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Поиск по телефону заказчика
      if (order.client?.phone) {
        const cleanPhone = order.client.phone.replace(/\D/g, '');
        const cleanQuery = lowerQuery.replace(/\D/g, '');
        if (cleanQuery && cleanPhone.includes(cleanQuery)) {
          return true;
        }
      }

      // Поиск по телефону получателя
      if (order.recipient?.phone) {
        const cleanPhone = order.recipient.phone.replace(/\D/g, '');
        const cleanQuery = lowerQuery.replace(/\D/g, '');
        if (cleanQuery && cleanPhone.includes(cleanQuery)) {
          return true;
        }
      }

      return false;
    });
  };

  // Filter orders by date
  const filterOrdersByDate = (orders: ApiOrder[], selectedDate?: Date) => {
    if (!selectedDate) return orders;

    return orders.filter(order => {
      const orderDate = new Date(order.delivery_date);
      return orderDate.toDateString() === selectedDate.toDateString();
    });
  };

  // Count orders by status
  const getOrderCounts = () => {
    const counts = {
      all: orders.length,
      'новый': orders.filter(o => o.status === 'новый').length,
      'в работе': orders.filter(o => o.status === 'в работе').length,
      'готов': orders.filter(o => o.status === 'готов').length,
      'доставлен': orders.filter(o => o.status === 'доставлен').length
    };
    return counts;
  };

  const orderCounts = getOrderCounts();

  // Apply filters
  let filteredOrders = activeFilter === 'all'
    ? orders
    : orders.filter(order => order.status === activeFilter);

  // Apply date filter
  filteredOrders = filterOrdersByDate(filteredOrders, selectedDate);

  // Apply search
  filteredOrders = searchOrders(filteredOrders, searchQuery);

  const handleSearchClick = () => {
    const newIsSearchOpen = !isSearchOpen;
    setIsSearchOpen(newIsSearchOpen);
    if (!newIsSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
  };

  const handleClearDateFilter = () => {
    setSelectedDate(undefined);
  };

  const formatDateForDisplay = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтра';
    } else {
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const filterOptions = [
    { key: 'all', label: 'Все', count: orderCounts.all },
    { key: 'новый', label: 'Новые', count: orderCounts['новый'] },
    { key: 'в работе', label: 'В работе', count: orderCounts['в работе'] },
    { key: 'готов', label: 'Готовые', count: orderCounts['готов'] },
    { key: 'доставлен', label: 'Доставленные', count: orderCounts['доставлен'] }
  ];

  const headerActions = (
    <>
      <Button variant="ghost" size="sm" className="p-2 lg:hidden" onClick={onAddOrder}>
        <Plus className="w-5 h-5 text-gray-600" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className={`p-2 ${isSearchOpen ? 'bg-gray-100' : ''}`}
        onClick={handleSearchClick}
      >
        <Search className="w-5 h-5 text-gray-600" />
      </Button>

      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={`p-2 ${selectedDate ? 'bg-gray-100' : ''}`}
          >
            <CalendarIcon className="w-5 h-5 text-gray-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
          <div className="p-3 border-b border-gray-100">
            <div className="text-sm text-gray-600 mb-2">Выберите дату доставки</div>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Загрузка заказов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Ошибка загрузки заказов</div>
          <div className="text-gray-500 mb-4">{error}</div>
          <Button onClick={refetch} variant="outline">
            Попробовать снова
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="lg:hidden">
        <PageHeader title="Заказы" actions={headerActions} />
      </div>
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Заказы</h1>
          <div className="flex items-center gap-2">
            {headerActions}
          </div>
        </div>
      </div>

      {/* Date Filter Bar */}
      {selectedDate && (
        <div className="p-4 border-b border-gray-100 bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              <span className="text-blue-900">
                Заказы на {formatDateForDisplay(selectedDate)}
              </span>
              <div className="px-2 py-0.5 bg-blue-200 text-blue-800 rounded text-sm">
                {filteredOrders.length}
              </div>
            </div>
            <button
              onClick={handleClearDateFilter}
              className="text-blue-600 hover:text-blue-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative">
            <Input
              type="text"
              placeholder="Поиск по номеру заказа, имени или телефону..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-gray-600">
              Найдено: {filteredOrders.length} заказов
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="p-4 border-b border-gray-100 overflow-x-auto lg:px-6">
        <FilterTabs
          tabs={filterOptions}
          activeTab={activeFilter}
          onTabChange={(tab) => setActiveFilter(tab as FilterType)}
        />
      </div>

      {/* Orders List - Mobile View */}
      <div className="lg:hidden pb-20">
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <OrderItem
              key={order.id}
              order={order}
              onClick={onViewOrder}
              onStatusChange={handleStatusChange}
              searchQuery={searchQuery}
            />
          ))
        ) : (
          <EmptyState
            icon={<Search className="w-8 h-8 text-gray-400" />}
            title={
              searchQuery ? "По запросу ничего не найдено" :
              selectedDate ? "На выбранную дату заказов нет" :
              "Заказов не найдено"
            }
            description={
              searchQuery
                ? `Попробуйте изменить поисковый запрос "${searchQuery}"`
                : selectedDate
                ? `На ${formatDateForDisplay(selectedDate)} заказов не запланировано`
                : "Попробуйте изменить фильтр или добавить новый заказ"
            }
          />
        )}
      </div>

      {/* Orders Table - Desktop View */}
      <div className="hidden lg:block">
        {filteredOrders.length > 0 ? (
          <div className="border border-gray-200 rounded-lg mx-4 my-4">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-medium">
                Заказы {activeFilter !== 'all' ? `(${STATUS_CONFIG[activeFilter as OrderStatus]?.label || activeFilter})` : ''} ({filteredOrders.length})
              </h3>
              <Button onClick={onAddOrder} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Новый заказ
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Номер</TableHead>
                  <TableHead className="w-24">Товары</TableHead>
                  <TableHead className="w-24">Статус</TableHead>
                  <TableHead>Получатель</TableHead>
                  <TableHead className="w-48">Доставка</TableHead>
                  <TableHead className="w-32">Создан</TableHead>
                  <TableHead className="w-32">Действие</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onViewOrder?.(order.id)}
                  >
                    <TableCell>
                      <div className="font-medium">
                        #{order.id}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {order.order_items.slice(0, 2).map((item, index) => (
                          <div
                            key={item.id}
                            className="w-8 h-8 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center"
                            style={{ marginLeft: index > 0 ? '-4px' : '0' }}
                          >
                            {item.product.image_url ? (
                              <div
                                className="w-full h-full rounded-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${item.product.image_url}')` }}
                              />
                            ) : (
                              <span className="text-xs text-gray-500">{item.product.name.slice(0, 2)}</span>
                            )}
                          </div>
                        ))}
                        {order.order_items.length > 2 && (
                          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center ml-1">
                            <span className="text-gray-600 text-xs">+{order.order_items.length - 2}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{order.recipient?.name || 'Без имени'}</div>
                        <div className="text-sm text-gray-600">{order.recipient?.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{formatDeliveryDate(order.delivery_date)}</div>
                        <div className="text-sm text-gray-600">
                          {order.delivery_time_range || 'Время не указано'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.delivery_address || 'Адрес не указан'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(order.created_at).toLocaleDateString('ru-RU')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {order.status !== 'доставлен' && ACTION_BUTTONS[order.status] && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const statusFlow: Record<OrderStatus, OrderStatus | null> = {
                              'новый': 'в работе',
                              'в работе': 'готов',
                              'готов': 'доставлен',
                              'доставлен': null
                            };
                            const newStatus = statusFlow[order.status];
                            if (newStatus) {
                              handleStatusChange(order.id, newStatus);
                            }
                          }}
                        >
                          {ACTION_BUTTONS[order.status]}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="mx-4 my-4">
            <EmptyState
              icon={<User className="w-8 h-8 text-gray-400" />}
              title="Заказов не найдено"
              description="Попробуйте изменить фильтр или добавить новый заказ"
            />
          </div>
        )}
      </div>
    </div>
  );
}