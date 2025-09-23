import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Search, X, CalendarIcon, Plus } from "lucide-react";
import { FilterTabs } from "../common/FilterTabs";
import { FilterContainer } from "../common/FilterContainer";
import { Order } from "../../src/types";
import { urlManager, parseDateFromURL, formatDateForURL } from "../../src/utils/url";
import { formatOrderDate } from "../../src/utils/date";

type FilterType = 'all' | 'new' | 'paid' | 'accepted' | 'assembled' | 'completed';

interface OrderFiltersProps {
  orders: Order[];
  onAddOrder?: () => void;
  onFiltersChange: (filters: {
    activeFilter: FilterType;
    searchQuery: string;
    selectedDate?: Date;
  }) => void;
  headerActionsOnly?: boolean;
}

// Функция для получения опций фильтра с количеством
const getFilterOptions = (counts: Record<string, number>) => [
  { key: 'all', label: 'Все', count: counts.all },
  { key: 'new', label: 'Новые', count: counts.new },
  { key: 'paid', label: 'Оплаченные', count: counts.paid },
  { key: 'accepted', label: 'Принятые', count: counts.accepted },
  { key: 'assembled', label: 'Собранные', count: counts.assembled },
  { key: 'completed', label: 'Архив', count: counts.completed }
];

export function OrderFilters({ orders, onAddOrder, onFiltersChange, headerActionsOnly = false }: OrderFiltersProps) {
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

  // Notify parent of filter changes
  useEffect(() => {
    onFiltersChange({ activeFilter, searchQuery, selectedDate });
  }, [activeFilter, searchQuery, selectedDate]);

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
    const ordersList = orders || [];
    const counts = {
      all: ordersList.length,
      new: ordersList.filter(o => o.status === 'new').length,
      paid: ordersList.filter(o => o.status === 'paid').length,
      accepted: ordersList.filter(o => o.status === 'accepted').length,
      assembled: ordersList.filter(o => o.status === 'assembled').length,
      completed: ordersList.filter(o => o.status === 'completed').length
    };
    return counts;
  };

  const orderCounts = getOrderCounts();
  const orderCountsByDate = getOrderCountsByDate(orders || []);

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
      return 'Завтра';
    } else {
      return formatOrderDate(date);
    }
  };

  // If we only need header actions, return just the buttons
  if (headerActionsOnly) {
    return (
      <div className="flex items-center gap-2">
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
              <div className="text-gray-600 mb-2">Выберите дату доставки</div>
              <div className="flex items-center gap-4 text-gray-500">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-blue-100 rounded border"></div>
                  <span>Есть заказы</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded text-white flex items-center justify-center">1</div>
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
                hasOrders: 'bg-blue-100 text-blue-900 relative'
              }}
              components={{
                DayContent: ({ date }) => {
                  const dateKey = date.toDateString();
                  const count = orderCountsByDate.get(dateKey);
                  return (
                    <div className="relative w-full h-full flex items-center justify-center">
                      <span>{date.getDate()}</span>
                      {count && count > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center leading-none">
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
      </div>
    );
  }

  // Return filter bars and tabs (for placement after headers)
  return (
    <>
      {/* Date Filter Bar */}
      {selectedDate && (
        <div className="p-4 border-b border-gray-100 bg-blue-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-blue-600" />
              <span className="text-blue-900">
                Заказы на {formatDateForDisplay(selectedDate)}
              </span>
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
        </div>
      )}

      {/* Filter Tabs */}
      <FilterContainer>
        <FilterTabs 
          tabs={getFilterOptions(orderCounts)} 
          activeTab={activeFilter} 
          onTabChange={(tab) => handleFilterChange(tab as FilterType)} 
        />
      </FilterContainer>
    </>
  );
}