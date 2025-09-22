import { useState, useEffect } from "react";
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
import { Search, Plus, X, CalendarIcon } from "lucide-react";

// Import from centralized design system
import { Product, Customer, OrderItem, Order } from "../src/types";
import { getTimeAgo } from "../src/utils/date";
import { urlManager, parseDateFromURL, formatDateForURL } from "../src/utils/url";

// Temporary inline components to avoid import issues
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
    <div className="flex gap-2">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onTabChange(tab.key)}
          className={`px-3 py-1 rounded text-sm transition-colors flex items-center gap-2 ${
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

const STATUS_CONFIG = {
  new: { label: 'Новый', border: 'border-red-500', text: 'text-red-500' },
  paid: { label: 'Оплачен', border: 'border-blue-500', text: 'text-blue-500' },
  accepted: { label: 'Принят', border: 'border-purple-500', text: 'text-purple-500' },
  assembled: { label: 'Собран', border: 'border-orange-500', text: 'text-orange-500' },
  'in-transit': { label: 'В пути', border: 'border-green-500', text: 'text-green-500' },
  completed: { label: 'Завершен', border: 'border-gray-500', text: 'text-gray-500' }
};

// Функция для получения опций фильтра с количеством
const getFilterOptions = (counts: Record<string, number>) => [
  { key: 'all', label: 'Все', count: counts.all },
  { key: 'new', label: 'Новые', count: counts.new },
  { key: 'paid', label: 'Оплаченные', count: counts.paid },
  { key: 'accepted', label: 'Принятые', count: counts.accepted },
  { key: 'assembled', label: 'Собранные', count: counts.assembled },
  { key: 'completed', label: 'Архив', count: counts.completed }
];

const ACTION_BUTTONS = {
  new: 'Оплачен',
  paid: 'Принять',
  accepted: '+ Фото',
  assembled: '→ Курьеру',
  'in-transit': 'Завершить'
};

function OrderStatusBadge({ status }: { status: Order['status'] }) {
  const config = STATUS_CONFIG[status];
  const variantMap = {
    new: 'error' as const,         // Красный - требует внимания
    paid: 'info' as const,         // Синий - оплачен
    accepted: 'purple' as const,   // Фиолетовый - принят в работу
    assembled: 'warning' as const, // Желтый - готов к отправке
    'in-transit': 'success' as const, // Зеленый - доставляется
    completed: 'default' as const  // Серый - архив
  };
  
  return (
    <StatusBadge 
      status={config.label} 
      variant={variantMap[status]} 
    />
  );
}

function OrderItem({ 
  order, 
  onClick, 
  onStatusChange,
  searchQuery 
}: { 
  order: Order; 
  onClick?: (id: string) => void;
  onStatusChange?: (id: string, newStatus: Order['status']) => void;
  searchQuery?: string;
}) {
  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const statusFlow = {
      new: 'paid',
      paid: 'accepted', 
      accepted: 'assembled',
      assembled: 'in-transit',
      'in-transit': 'completed'
    } as const;
    
    const newStatus = statusFlow[order.status];
    if (newStatus && onStatusChange) {
      onStatusChange(order.id, newStatus);
    }
  };

  // Функция для подсветки совпадений в поиске
  const highlightMatch = (text: string, query?: string) => {
    if (!query || !text) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">{part}</mark>
      ) : (
        part
      )
    );
  };

  // Получаем все товары в заказе (основной + дополнительные)
  const allProductImages = [
    { image: order.mainProduct.image, id: order.mainProduct.id },
    ...(order.additionalItems?.map(item => ({ 
      image: item.productImage, 
      id: item.productId 
    })) || [])
  ];

  // Показываем максимум 3 изображения + счетчик для остальных
  const maxVisible = 3;
  const visibleImages = allProductImages.slice(0, maxVisible);
  const extraCount = allProductImages.length > maxVisible ? allProductImages.length - maxVisible : 0;
  
  return (
    <div 
      className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onClick?.(order.id)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-900">{highlightMatch(order.number, searchQuery)}</span>
            <OrderStatusBadge status={order.status} />
          </div>
          <div className="text-gray-700">
            {order.deliveryType === 'pickup' ? (
              'Самовывоз'
            ) : (
              order.deliveryAddress ? 
                `${order.deliveryCity}, ${order.deliveryAddress}` : 
                `${order.deliveryCity}, уточнить у получателя`
            )}
          </div>
          <div className="text-gray-600 text-sm">
            {order.deliveryDate === 'today' ? 'Сегодня' : 'Завтра'}, {order.deliveryTime || 'уточнить у получателя'} • {getTimeAgo(order.createdAt)}
          </div>
          {/* Показываем совпадения имен и телефонов при поиске */}
          {searchQuery && (
            <div className="text-sm text-gray-600 mt-1 space-y-0.5">
              {order.sender?.name && order.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                <div>Отправитель: {highlightMatch(order.sender.name, searchQuery)}</div>
              )}
              {order.recipient?.name && order.recipient.name.toLowerCase().includes(searchQuery.toLowerCase()) && (
                <div>Получатель: {highlightMatch(order.recipient.name, searchQuery)}</div>
              )}
              {order.sender?.phone && searchQuery.replace(/\D/g, '') && order.sender.phone.replace(/\D/g, '').includes(searchQuery.replace(/\D/g, '')) && (
                <div>Тел. отправителя: {highlightMatch(order.sender.phone, searchQuery)}</div>
              )}
              {order.recipient?.phone && searchQuery.replace(/\D/g, '') && order.recipient.phone.replace(/\D/g, '').includes(searchQuery.replace(/\D/g, '')) && (
                <div>Тел. получателя: {highlightMatch(order.recipient.phone, searchQuery)}</div>
              )}
            </div>
          )}
        </div>
        {order.status !== 'completed' && (
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

      {order.executor?.florist && (
        <div className="mb-3 text-sm text-gray-600">
          {order.executor.florist}
        </div>
      )}

      {/* Превью товаро���� в заказе */}
      <div className="flex items-center">
        {visibleImages.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="w-12 h-12 rounded-full border-2 border-white bg-cover bg-center"
            style={{ 
              backgroundImage: `url('${product.image}')`,
              marginLeft: index > 0 ? '-8px' : '0'
            }}
          />
        ))}
        {extraCount > 0 && (
          <div className="w-12 h-12 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center ml-2">
            <span className="text-gray-600 text-sm">+{extraCount}</span>
          </div>
        )}
      </div>
    </div>
  );
}

type FilterType = 'all' | 'new' | 'paid' | 'accepted' | 'assembled' | 'completed';

export function Orders({ 
  orders,
  onViewOrder,
  onStatusChange,
  onAddOrder
}: { 
  orders: Order[];
  onViewOrder?: (orderId: string) => void;
  onStatusChange?: (orderId: string, newStatus: Order['status']) => void;
  onAddOrder?: () => void;
}) {
  // Initialize state from URL parameters
  const urlParams = urlManager.getParams();
  
  const [activeFilter, setActiveFilter] = useState<FilterType>(
    (urlParams.filter as FilterType) || 'all'
  );
  const [searchQuery, setSearchQuery] = useState(urlParams.search || '');
  const [isSearchOpen, setIsSearchOpen] = useState(!!urlParams.search);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    parseDateFromURL(urlParams.date)
  );
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Listen for URL changes (back/forward navigation)
  useEffect(() => {
    const handlePopState = () => {
      const params = urlManager.getParams();
      setActiveFilter((params.filter as FilterType) || 'all');
      setSearchQuery(params.search || '');
      setIsSearchOpen(!!params.search);
      setSelectedDate(parseDateFromURL(params.date));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    onStatusChange?.(orderId, newStatus);
  };

  // Функция поиска заказов
  const searchOrders = (orders: Order[], query: string) => {
    if (!query.trim()) return orders;
    
    const lowerQuery = query.toLowerCase().trim();
    
    return orders.filter(order => {
      // Поиск по номеру заказа
      if (order.number.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Поиск по имени отправителя
      if (order.sender?.name && order.sender.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Поиск по имени получателя
      if (order.recipient?.name && order.recipient.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Поиск по телефону отправителя (убираем все нецифровые символы)
      if (order.sender?.phone) {
        const cleanPhone = order.sender.phone.replace(/\D/g, '');
        const cleanQuery = lowerQuery.replace(/\D/g, '');
        if (cleanQuery && cleanPhone.includes(cleanQuery)) {
          return true;
        }
      }
      
      // Поиск по телефону получателя (убираем все нецифровые символы)
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

  // Функция для подсчета заказов по датам
  const getOrderCountsByDate = (orders: Order[]) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const counts = new Map<string, number>();
    
    // Считаем только заказы на сегодня и завтра
    orders.forEach(order => {
      if (order.deliveryDate === 'today') {
        const dateKey = today.toDateString();
        counts.set(dateKey, (counts.get(dateKey) || 0) + 1);
      } else if (order.deliveryDate === 'tomorrow') {
        const dateKey = tomorrow.toDateString();
        counts.set(dateKey, (counts.get(dateKey) || 0) + 1);
      }
    });
    
    return counts;
  };

  // Подсчитываем количество заказов по статусам
  const getOrderCounts = () => {
    const counts = {
      all: orders.length,
      new: orders.filter(o => o.status === 'new').length,
      paid: orders.filter(o => o.status === 'paid').length,
      accepted: orders.filter(o => o.status === 'accepted').length,
      assembled: orders.filter(o => o.status === 'assembled').length,
      completed: orders.filter(o => o.status === 'completed').length
    };
    return counts;
  };

  const orderCounts = getOrderCounts();

  // Применяем фильтры
  let filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

  // Применяем фильтр по дате
  filteredOrders = filterOrdersByDate(filteredOrders, selectedDate);

  // Применяем поиск
  filteredOrders = searchOrders(filteredOrders, searchQuery);

  // Получаем счетчики заказов по датам для календаря
  const orderCountsByDate = getOrderCountsByDate(orders);

  const handleSearchClick = () => {
    const newIsSearchOpen = !isSearchOpen;
    setIsSearchOpen(newIsSearchOpen);
    if (!newIsSearchOpen) {
      setSearchQuery('');
      urlManager.setOrdersSearch('');
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
    urlManager.setOrdersSearch('');
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    urlManager.setOrdersSearch(query);
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    setIsCalendarOpen(false);
    urlManager.setOrdersDate(date ? formatDateForURL(date) : '');
  };

  const handleClearDateFilter = () => {
    setSelectedDate(undefined);
    urlManager.setOrdersDate('');
  };

  const handleFilterChange = (filter: FilterType) => {
    setActiveFilter(filter);
    urlManager.setOrdersFilter(filter);
  };



  const formatDateForDisplay = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Сегодня';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Завтр��';
    } else {
      return date.toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'short' 
      });
    }
  };

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
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-blue-100 rounded border"></div>
                <span>Есть заказы</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded text-white flex items-center justify-center text-xs">1</div>
                <span>Количество</span>
              </div>
            </div>
          </div>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => {
              // Отключаем даты в прошлом, кроме сегодня
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              return date < today;
            }}
            modifiers={{
              hasOrders: (date) => {
                const dateKey = date.toDateString();
                return orderCountsByDate.has(dateKey);
              }
            }}
            modifiersClassNames={{
              hasOrders: 'bg-blue-100 text-blue-900 font-medium relative'
            }}
            components={{
              DayContent: ({ date }) => {
                const dateKey = date.toDateString();
                const count = orderCountsByDate.get(dateKey);
                return (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <span>{date.getDate()}</span>
                    {count && count > 0 && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center leading-none">
                        {count > 9 ? '9+' : count}
                      </div>
                    )}
                  </div>
                );
              }
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </>
  );

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
              onChange={(e) => handleSearchChange(e.target.value)}
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
        <div className="min-w-max">
          <FilterTabs 
            tabs={getFilterOptions(orderCounts)} 
            activeTab={activeFilter} 
            onTabChange={(tab) => handleFilterChange(tab as FilterType)} 
          />
        </div>
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
                Заказы {activeFilter !== 'all' ? `(${STATUS_CONFIG[activeFilter as keyof typeof STATUS_CONFIG]?.label || activeFilter})` : ''} ({filteredOrders.length})
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
                {filteredOrders.map((order) => {
                  const allProductImages = [
                    { image: order.mainProduct.image, id: order.mainProduct.id },
                    ...(order.additionalItems?.map(item => ({ 
                      image: item.productImage, 
                      id: item.productId 
                    })) || [])
                  ];
                  const visibleImages = allProductImages.slice(0, 2);
                  const extraCount = allProductImages.length > 2 ? allProductImages.length - 2 : 0;

                  return (
                    <TableRow 
                      key={order.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => onViewOrder?.(order.id)}
                    >
                      <TableCell>
                        <div className="font-medium">
                          {order.number}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          {visibleImages.map((product, index) => (
                            <div
                              key={`${product.id}-${index}`}
                              className="w-8 h-8 rounded-full border-2 border-white bg-cover bg-center"
                              style={{ 
                                backgroundImage: `url('${product.image}')`,
                                marginLeft: index > 0 ? '-4px' : '0'
                              }}
                            />
                          ))}
                          {extraCount > 0 && (
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center ml-1">
                              <span className="text-gray-600 text-xs">+{extraCount}</span>
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
                          <div className="font-medium">
                            {order.deliveryType === 'pickup' ? 'Самовывоз' : 
                             order.deliveryAddress ? `${order.deliveryCity}, ${order.deliveryAddress}` : 
                             `${order.deliveryCity}`}
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.deliveryDate === 'today' ? 'Сегодня' : 'Завтра'}, {order.deliveryTime || 'время уточняется'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {getTimeAgo(order.createdAt)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {order.status !== 'completed' && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              const statusFlow = {
                                new: 'paid',
                                paid: 'accepted', 
                                accepted: 'assembled',
                                assembled: 'in-transit',
                                'in-transit': 'completed'
                              } as const;
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
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="mx-4 my-8">
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
          </div>
        )}
      </div>
    </div>
  );
}