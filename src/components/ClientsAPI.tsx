// Clients component adapted for Backend API integration
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "./ui/table";
import { Search, Plus, X, User, Phone, Mail } from "lucide-react";
import { Badge } from "./ui/badge";
import { toast } from "sonner";

// Import API hooks and types
import { useClients } from "../hooks/useApiClients";
import { Client, ClientType } from "../types/api";

// Common components
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

// Client type configuration
const CLIENT_TYPE_CONFIG = {
  'заказчик': { label: 'Заказчик', variant: 'default' as const },
  'получатель': { label: 'Получатель', variant: 'info' as const },
  'оба': { label: 'Заказчик/Получатель', variant: 'purple' as const }
};

function ClientTypeBadge({ clientType }: { clientType: ClientType }) {
  const config = CLIENT_TYPE_CONFIG[clientType];
  if (!config) return <Badge variant="outline">{clientType}</Badge>;

  return (
    <Badge variant={config.variant === 'default' ? 'outline' : 'secondary'}>
      {config.label}
    </Badge>
  );
}

interface ClientItemProps {
  client: Client;
  onClick?: (id: number) => void;
  searchQuery?: string;
}

function ClientItem({ client, onClick, searchQuery }: ClientItemProps) {
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

  return (
    <div
      className="p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
      onClick={() => onClick?.(client.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-900">{highlightMatch(client.name, searchQuery)}</span>
            <ClientTypeBadge clientType={client.client_type} />
          </div>
          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <Phone className="w-4 h-4" />
            <span>{highlightMatch(client.phone, searchQuery)}</span>
          </div>
          {client.email && (
            <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
              <Mail className="w-4 h-4" />
              <span>{highlightMatch(client.email, searchQuery)}</span>
            </div>
          )}
          {client.address && (
            <div className="text-gray-500 text-sm mt-1">
              {highlightMatch(client.address, searchQuery)}
            </div>
          )}
        </div>
      </div>

      {client.notes && (
        <div className="text-gray-500 text-sm mt-2 italic">
          {client.notes}
        </div>
      )}

      <div className="text-gray-400 text-xs mt-2">
        Создан: {new Date(client.created_at).toLocaleDateString('ru-RU')}
      </div>
    </div>
  );
}

type FilterType = 'all' | 'заказчик' | 'получатель' | 'оба';

interface ClientsAPIProps {
  onViewClient?: (clientId: number) => void;
  onAddClient?: () => void;
}

export function ClientsAPI({ onViewClient, onAddClient }: ClientsAPIProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // API hooks
  const {
    clients,
    loading,
    error,
    refetch
  } = useClients();

  // Search function
  const searchClients = (clients: Client[], query: string) => {
    if (!query.trim()) return clients;

    const lowerQuery = query.toLowerCase().trim();

    return clients.filter(client => {
      // Поиск по имени
      if (client.name && client.name.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Поиск по телефону
      if (client.phone) {
        const cleanPhone = client.phone.replace(/\D/g, '');
        const cleanQuery = lowerQuery.replace(/\D/g, '');
        if (cleanQuery && cleanPhone.includes(cleanQuery)) {
          return true;
        }
      }

      // Поиск по email
      if (client.email && client.email.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Поиск по адресу
      if (client.address && client.address.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      return false;
    });
  };

  // Count clients by type
  const getClientCounts = () => {
    const counts = {
      all: clients.length,
      'заказчик': clients.filter(c => c.client_type === 'заказчик' || c.client_type === 'оба').length,
      'получатель': clients.filter(c => c.client_type === 'получатель' || c.client_type === 'оба').length,
      'оба': clients.filter(c => c.client_type === 'оба').length
    };
    return counts;
  };

  const clientCounts = getClientCounts();

  // Apply filters
  let filteredClients = activeFilter === 'all'
    ? clients
    : clients.filter(client => {
        if (activeFilter === 'заказчик') {
          return client.client_type === 'заказчик' || client.client_type === 'оба';
        }
        if (activeFilter === 'получатель') {
          return client.client_type === 'получатель' || client.client_type === 'оба';
        }
        return client.client_type === activeFilter;
      });

  // Apply search
  filteredClients = searchClients(filteredClients, searchQuery);

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

  const filterOptions = [
    { key: 'all', label: 'Все', count: clientCounts.all },
    { key: 'заказчик', label: 'Заказчики', count: clientCounts['заказчик'] },
    { key: 'получатель', label: 'Получатели', count: clientCounts['получатель'] },
    { key: 'оба', label: 'Заказчик/Получатель', count: clientCounts['оба'] }
  ];

  const headerActions = (
    <>
      <Button variant="ghost" size="sm" className="p-2 lg:hidden" onClick={onAddClient}>
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

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Загрузка клиентов...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Ошибка загрузки клиентов</div>
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
        <PageHeader title="Клиенты" actions={headerActions} />
      </div>
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Клиенты</h1>
          <div className="flex items-center gap-2">
            {headerActions}
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative">
            <Input
              type="text"
              placeholder="Поиск по имени, телефону, email или адресу..."
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
              Найдено: {filteredClients.length} клиентов
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

      {/* Clients List - Mobile View */}
      <div className="lg:hidden pb-20">
        {filteredClients.length > 0 ? (
          filteredClients.map((client) => (
            <ClientItem
              key={client.id}
              client={client}
              onClick={onViewClient}
              searchQuery={searchQuery}
            />
          ))
        ) : (
          <EmptyState
            icon={<Search className="w-8 h-8 text-gray-400" />}
            title={
              searchQuery ? "По запросу ничего не найдено" : "Клиентов не найдено"
            }
            description={
              searchQuery
                ? `Попробуйте изменить поисковый запрос "${searchQuery}"`
                : "Попробуйте изменить фильтр или добавить нового клиента"
            }
          />
        )}
      </div>

      {/* Clients Table - Desktop View */}
      <div className="hidden lg:block">
        {filteredClients.length > 0 ? (
          <div className="border border-gray-200 rounded-lg mx-4 my-4">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-medium">
                Клиенты {activeFilter !== 'all' ? `(${CLIENT_TYPE_CONFIG[activeFilter as ClientType]?.label || activeFilter})` : ''} ({filteredClients.length})
              </h3>
              <Button onClick={onAddClient} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Новый клиент
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Имя</TableHead>
                  <TableHead>Телефон</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Тип</TableHead>
                  <TableHead>Адрес</TableHead>
                  <TableHead className="w-32">Создан</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClients.map((client) => (
                  <TableRow
                    key={client.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onViewClient?.(client.id)}
                  >
                    <TableCell>
                      <div className="font-medium">{client.name}</div>
                      {client.notes && (
                        <div className="text-sm text-gray-500 italic">{client.notes}</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{client.phone}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {client.email ? (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span>{client.email}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <ClientTypeBadge clientType={client.client_type} />
                    </TableCell>
                    <TableCell>
                      {client.address ? (
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {client.address}
                        </div>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(client.created_at).toLocaleDateString('ru-RU')}
                      </div>
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
              title="Клиентов не найдено"
              description="Попробуйте изменить фильтр или добавить нового клиента"
            />
          </div>
        )}
      </div>
    </div>
  );
}