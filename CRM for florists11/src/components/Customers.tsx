import React, { useState } from "react";
import { Plus, Search, Calendar, Phone, TrendingUp, X } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { FilterContainer } from "./common/FilterContainer";
import { FilterTabs } from "./common/FilterTabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "./ui/table";
// Temporary inline components to avoid import issues
function StatusBadge({ status, variant = 'default' }: { status: string; variant?: 'default' | 'success' | 'warning' | 'error' }) {
  const variants = {
    default: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    error: 'bg-red-100 text-red-700'
  };
  
  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs ${variants[variant]}`}>
      {status}
    </div>
  );
}



function EmptyState({ icon, title, description, action }: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  action?: React.ReactNode; 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-4">{description}</p>
      {action}
    </div>
  );
}

function PageHeader({ title, subtitle, onBack, actions }: { 
  title: string; 
  subtitle?: string; 
  onBack?: () => void; 
  actions?: React.ReactNode; 
}) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div className="flex items-center">
        {onBack && (
          <Button variant="ghost" size="sm" onClick={onBack} className="p-2 mr-3">
            {/* ArrowLeft icon will be imported separately if needed */}
          </Button>
        )}
        <div>
          <h1 className="text-gray-900">{title}</h1>
          {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex gap-1">{actions}</div>}
    </div>
  );
}

interface Customer {
  id: number;
  name?: string;
  phone: string;
  avatar?: string;
  memberSince: Date;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date;
  status: 'active' | 'vip' | 'inactive';
  notes?: string;
}

interface CustomerItemProps extends Customer {
  onClick: (id: number) => void;
  searchQuery?: string;
}

// Мок данные клиентов
const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "Анна Петрова",
    phone: "+7 (777) 123-45-67",
    memberSince: new Date(2023, 2, 15),
    totalOrders: 12,
    totalSpent: 156000,
    lastOrderDate: new Date(2024, 7, 20),
    status: 'vip'
  },
  {
    id: 2,
    name: "Мар��я Козлова",
    phone: "+7 (777) 234-56-78",
    memberSince: new Date(2023, 5, 8),
    totalOrders: 7,
    totalSpent: 84500,
    lastOrderDate: new Date(2024, 7, 18),
    status: 'active'
  },
  {
    id: 3,
    // Клиент без имени
    phone: "+7 (777) 345-67-89",
    memberSince: new Date(2022, 11, 3),
    totalOrders: 25,
    totalSpent: 320000,
    lastOrderDate: new Date(2024, 7, 25),
    status: 'vip'
  },
  {
    id: 4,
    name: "Ольга Иванова",
    phone: "+7 (777) 456-78-90",
    memberSince: new Date(2024, 1, 20),
    totalOrders: 3,
    totalSpent: 42000,
    lastOrderDate: new Date(2024, 6, 15),
    status: 'active'
  },
  {
    id: 5,
    name: "Наталья Богданова",
    phone: "+7 (777) 567-89-01",
    memberSince: new Date(2023, 8, 12),
    totalOrders: 15,
    totalSpent: 198000,
    lastOrderDate: new Date(2024, 5, 10),
    status: 'vip'
  },
  {
    id: 6,
    // Клиент с пустым именем
    name: "",
    phone: "+7 (777) 678-90-12",
    memberSince: new Date(2024, 0, 5),
    totalOrders: 2,
    totalSpent: 25000,
    lastOrderDate: new Date(2024, 3, 8),
    status: 'inactive'
  },
  {
    id: 7,
    name: "Александра Попова",
    phone: "+7 (777) 789-01-23",
    memberSince: new Date(2023, 6, 25),
    totalOrders: 9,
    totalSpent: 112000,
    lastOrderDate: new Date(2024, 7, 12),
    status: 'active'
  },
  {
    id: 8,
    // Еще один клиент без имени для тестирования
    phone: "+7 (777) 890-12-34",
    memberSince: new Date(2023, 10, 18),
    totalOrders: 6,
    totalSpent: 78000,
    lastOrderDate: new Date(2024, 4, 22),
    status: 'active'
  }
];

function formatDate(date: Date): string {
  const now = new Date();
  const diffInMonths = (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth();
  
  if (diffInMonths === 0) {
    return 'Этот месяц';
  } else if (diffInMonths === 1) {
    return '1 месяц назад';
  } else if (diffInMonths < 12) {
    return `${diffInMonths} мес. назад`;
  } else {
    const years = Math.floor(diffInMonths / 12);
    return `${years} ${years === 1 ? 'год' : 'года'} назад`;
  }
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0
  }).format(amount).replace('KZT', '₸');
}



function CustomerItem({ id, name, phone, memberSince, totalOrders, totalSpent, status, onClick, searchQuery }: CustomerItemProps) {
  


  // Определяем отображаемое имя клиен��а
  const hasName = name && name.trim();
  const displayName = hasName ? name : `Клиент ${phone.slice(-4)}`;

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

  return (
    <div 
      className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onClick(id)}
    >
      <div className="flex items-center justify-between">
        {/* Customer Info */}
        <div className="flex-1 min-w-0">
          <div className="mb-1">
            <span className={`truncate ${hasName ? 'text-gray-900' : 'text-gray-600 italic'}`}>
              {highlightMatch(displayName, searchQuery)}
            </span>
          </div>
          
          <div className="flex items-center text-sm text-gray-600 mb-1">
            <Phone className="w-3 h-3 mr-1" />
            {highlightMatch(phone, searchQuery)}
          </div>
          
          <div className="text-sm text-gray-500">
            Клиент с {formatDate(memberSince)}
          </div>
        </div>
        
        {/* Stats */}
        <div className="text-right flex-shrink-0">
          <div className="text-sm text-gray-900 mb-1">
            {totalOrders} {totalOrders === 1 ? 'заказ' : totalOrders < 5 ? 'заказа' : 'заказов'}
          </div>
          <div className="text-sm text-gray-600">
            {formatCurrency(totalSpent)}
          </div>
        </div>
      </div>
    </div>
  );
}

interface CustomersProps {
  onNavigateBack: () => void;
  onViewCustomer: (customerId: number) => void;
  onAddCustomer?: () => void;
  customers: Customer[];
}

export function Customers({ onNavigateBack, onViewCustomer, onAddCustomer, customers: propCustomers }: CustomersProps) {
  const [customers] = useState<Customer[]>(propCustomers.length > 0 ? propCustomers : mockCustomers);
  const [filter, setFilter] = useState<'all' | 'active' | 'vip' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);



  // Функция поиска клиентов
  const searchCustomers = (customers: Customer[], query: string) => {
    if (!query.trim()) return customers;
    
    const lowerQuery = query.toLowerCase().trim();
    
    return customers.filter(customer => {
      // Поиск по имени
      if (customer.name && customer.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }
      
      // Пои��к по телефону (убираем все нецифровые символы)
      const cleanPhone = customer.phone.replace(/\D/g, '');
      const cleanQuery = lowerQuery.replace(/\D/g, '');
      if (cleanQuery && cleanPhone.includes(cleanQuery)) {
        return true;
      }
      
      // Поиск по слову "клиент" для клиентов без имени
      if (!customer.name?.trim() && lowerQuery.includes('клиент')) {
        return true;
      }
      
      return false;
    });
  };

  // Фильтрация клиентов
  let filteredCustomers = customers.filter(customer => {
    return filter === 'all' || customer.status === filter;
  });

  // Применя��м поиск
  filteredCustomers = searchCustomers(filteredCustomers, searchQuery);

  // Подсчет статистики
  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    vip: customers.filter(c => c.status === 'vip').length,
    inactive: customers.filter(c => c.status === 'inactive').length,
    totalRevenue: customers.reduce((sum, c) => sum + c.totalSpent, 0),
    totalOrders: customers.reduce((sum, c) => sum + c.totalOrders, 0)
  };

  const handleCustomerClick = (customerId: number) => {
    onViewCustomer(customerId);
  };

  const handleSearchClick = () => {
    const newIsSearchOpen = !isSearchOpen;
    setIsSearchOpen(newIsSearchOpen);
    if (!newIsSearchOpen) {
      setSearchQuery('');
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  const headerActions = (
    <>
      <Button variant="ghost" size="sm" className="p-2 lg:hidden" onClick={onAddCustomer}>
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
    </>
  );

  const filterOptions = [
    { key: 'all', label: 'Все', count: stats.total },
    { key: 'vip', label: 'VIP', count: stats.vip },
    { key: 'active', label: 'Акт����вные', count: stats.active },
    { key: 'inactive', label: 'Неактивные', count: stats.inactive }
  ];

  return (
    <div className="bg-white min-h-screen lg:max-w-none max-w-md mx-auto">
      <div className="lg:hidden">
        <PageHeader title="Клиенты" actions={headerActions} />
      </div>
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <h1>Клиенты</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`p-2 ${isSearchOpen ? 'bg-gray-100' : ''}`}
            onClick={handleSearchClick}
          >
            <Search className="w-5 h-5 text-gray-600" />
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative">
            <Input
              type="text"
              placeholder="Поиск по имени, телефону или 'клиент'..."
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
              Найдено: {filteredCustomers.length} клиентов
            </div>
          )}
        </div>
      )}

      {/* Filter Tags */}
      <FilterContainer>
        <FilterTabs 
          tabs={filterOptions} 
          activeTab={filter} 
          onTabChange={(tab) => setFilter(tab as any)} 
        />
      </FilterContainer>

      {/* Customers List - Mobile View */}
      <div className="lg:hidden pb-20">
        {filteredCustomers.length > 0 ? (
          filteredCustomers.map((customer) => (
            <CustomerItem
              key={customer.id}
              {...customer}
              onClick={handleCustomerClick}
              searchQuery={searchQuery}
            />
          ))
        ) : (
          <EmptyState
            icon={searchQuery ? <Search className="w-8 h-8 text-gray-400" /> : <TrendingUp className="w-8 h-8 text-gray-400" />}
            title={searchQuery ? 'Клиенты не найдены' : 'Нет клиентов'}
            description={
              searchQuery 
                ? `Попробуйте изменить поисковый запрос "${searchQuery}"`
                : 'Клиенты появятся после первых заказов'
            }
          />
        )}
      </div>

      {/* Customers Table - Desktop View */}
      <div className="hidden lg:block">
        {filteredCustomers.length > 0 ? (
          <div className="border border-gray-200 rounded-lg mx-4 my-4">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-medium">
                Клиенты ({filteredCustomers.length})
              </h3>
              <Button onClick={onAddCustomer} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Добавить клиента
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Клиент</TableHead>
                  <TableHead className="w-32">Статус</TableHead>
                  <TableHead className="w-32">Заказов</TableHead>
                  <TableHead className="w-32">Потрачено</TableHead>
                  <TableHead className="w-32">Последний заказ</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow 
                    key={customer.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleCustomerClick(customer.id)}
                  >
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {customer.name && customer.name.trim() ? customer.name : 'Клиент'}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {customer.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge 
                        status={
                          customer.status === 'vip' ? 'VIP' :
                          customer.status === 'active' ? 'Активный' : 'Неактивный'
                        } 
                        variant={
                          customer.status === 'vip' ? 'warning' :
                          customer.status === 'active' ? 'success' : 'default'
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 text-gray-400 mr-1" />
                        <span>{customer.totalOrders}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-gray-400 mr-1" />
                        <span>{(customer.totalSpent / 1000).toFixed(0)}k ₸</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {formatDate(customer.lastOrderDate)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="mx-4 my-8">
            <EmptyState
              icon={searchQuery ? <Search className="w-8 h-8 text-gray-400" /> : <TrendingUp className="w-8 h-8 text-gray-400" />}
              title={searchQuery ? 'Клиенты не найдены' : 'Нет клиентов'}
              description={
                searchQuery 
                  ? `Попробуйте изменить поисковый запрос "${searchQuery}"`
                  : 'Клиенты появятся после первых заказов'
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}