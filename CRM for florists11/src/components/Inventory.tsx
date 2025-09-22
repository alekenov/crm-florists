import { useState } from "react";
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
import { Plus, Search, Package, Clipboard, X } from "lucide-react";
// Temporary inline components to avoid import issues



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

interface InventoryItem {
  id: number;
  name: string;
  category: 'flowers' | 'greenery' | 'accessories';
  price: string; // за единицу
  unit: string; // штука, грамм, метр
  quantity: number; // текущий остаток
  lastDelivery: Date;
  image: string;
}

const mockInventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "Розы красные",
    category: 'flowers',
    price: "450 ₸",
    unit: "шт",
    quantity: 85,
    lastDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=100&h=100&fit=crop"
  },
  {
    id: 2,
    name: "Тюльпаны белые",
    category: 'flowers',
    price: "320 ₸",
    unit: "шт",
    quantity: 12,
    lastDelivery: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=100&h=100&fit=crop"
  },
  {
    id: 3,
    name: "Лилии розовые",
    category: 'flowers',
    price: "650 ₸",
    unit: "шт",
    quantity: 24,
    lastDelivery: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    image: "https://images.unsplash.com/photo-1565011523534-747a8601f1a4?w=100&h=100&fit=crop"
  },
  {
    id: 4,
    name: "Эвкалипт",
    category: 'greenery',
    price: "180 ₸",
    unit: "ветка",
    quantity: 45,
    lastDelivery: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    image: "https://images.unsplash.com/photo-1586744687037-b4f9c5d1fcd8?w=100&h=100&fit=crop"
  },
  {
    id: 5,
    name: "Хризантемы желтые",
    category: 'flowers',
    price: "280 ₸",
    unit: "шт",
    quantity: 8,
    lastDelivery: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    image: "https://images.unsplash.com/photo-1572731973537-34afe46c4bc6?w=100&h=100&fit=crop"
  },
  {
    id: 6,
    name: "Лента атласная",
    category: 'accessories',
    price: "25 ₸",
    unit: "метр",
    quantity: 150,
    lastDelivery: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop"
  },
  {
    id: 7,
    name: "Гипсофила",
    category: 'flowers',
    price: "120 ₸",
    unit: "ветка",
    quantity: 3,
    lastDelivery: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop"
  }
];

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) {
    return 'Сегодня';
  } else if (diffInDays === 1) {
    return 'Вчера';
  } else if (diffInDays > 0) {
    return `${diffInDays} дн. назад`;
  } else {
    // Future date
    const futureDays = Math.abs(diffInDays);
    if (futureDays === 1) {
      return 'Завтра';
    } else {
      return `Через ${futureDays} дн.`;
    }
  }
}

interface InventoryItemProps extends InventoryItem {
  onEdit: (id: number) => void;
  searchQuery?: string;
}

function InventoryItemComponent({ 
  id, 
  name, 
  category, 
  price, 
  unit, 
  quantity, 
  lastDelivery, 
  image,
  onEdit,
  searchQuery
}: InventoryItemProps) {
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
      onClick={() => onEdit(id)}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center space-x-4">
          <div 
            className="w-20 h-24 bg-cover bg-center rounded-lg relative overflow-hidden flex-shrink-0"
            style={{ backgroundImage: `url('${image}')` }}
          />
          <div>
            <div className="mb-1">
              <span className="text-gray-900">{highlightMatch(name, searchQuery)}</span>
            </div>
            <div className="text-gray-700">
              {highlightMatch(price, searchQuery)} / {unit}
            </div>
            <div className="text-gray-600 text-sm">
              Поставка: {getTimeAgo(lastDelivery)}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-gray-900">
            {quantity} {unit}
          </div>
        </div>
      </div>
    </div>
  );
}

interface InventoryProps {
  onAddItem?: () => void;
  onViewItem?: (itemId: number) => void;
  onStartAudit?: () => void;
}

export function Inventory({ onAddItem, onViewItem, onStartAudit }: InventoryProps) {
  const [filter, setFilter] = useState<'all' | 'flowers' | 'greenery' | 'accessories'>('all');
  const [items] = useState<InventoryItem[]>(mockInventoryItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Функция поиска товаров на складе
  const searchItems = (items: InventoryItem[], query: string) => {
    if (!query.trim()) return items;
    
    const lowerQuery = query.toLowerCase().trim();
    
    return items.filter(item => {
      return item.name.toLowerCase().includes(lowerQuery) ||
             item.price.toLowerCase().includes(lowerQuery) ||
             item.unit.toLowerCase().includes(lowerQuery);
    });
  };

  // Подсчитываем количество товаров по категориям
  const getItemCounts = () => {
    const counts = {
      all: items.length,
      flowers: items.filter(item => item.category === 'flowers').length,
      greenery: items.filter(item => item.category === 'greenery').length,
      accessories: items.filter(item => item.category === 'accessories').length
    };
    return counts;
  };

  const itemCounts = getItemCounts();

  let filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.category === filter;
  });

  // Применяем поиск
  filteredItems = searchItems(filteredItems, searchQuery);

  const handleEditItem = (id: number) => {
    if (onViewItem) {
      onViewItem(id);
    }
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

  const filterOptions = [
    { key: 'all', label: 'Все', count: itemCounts.all },
    { key: 'flowers', label: 'Цветы', count: itemCounts.flowers },
    { key: 'greenery', label: 'Зелень', count: itemCounts.greenery },
    { key: 'accessories', label: 'Аксессуары', count: itemCounts.accessories }
  ];

  const headerActions = (
    <>
      <Button variant="ghost" size="sm" className="p-2 lg:hidden" onClick={onStartAudit}>
        <Clipboard className="w-5 h-5 text-gray-600" />
      </Button>
      <Button variant="ghost" size="sm" className="p-2 lg:hidden" onClick={onAddItem}>
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

  return (
    <div className="bg-white min-h-screen">
      <div className="lg:hidden">
        <PageHeader title="Склад" actions={headerActions} />
      </div>
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <h1>Склад</h1>
          <div className="flex items-center gap-2">

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
      </div>

      {/* Search Bar */}
      {isSearchOpen && (
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="relative">
            <Input
              type="text"
              placeholder="Поиск по названию, цене или единице измерения..."
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
              Найдено: {filteredItems.length} позиций
            </div>
          )}
        </div>
      )}

      {/* Filter Tabs */}
      <FilterContainer>
        <FilterTabs 
          tabs={filterOptions} 
          activeTab={filter} 
          onTabChange={(tab) => setFilter(tab as any)} 
        />
      </FilterContainer>

      {/* Items List - Mobile View */}
      <div className="lg:hidden">
        {filteredItems.length > 0 ? (
          <div className="pb-20">
            {filteredItems.map((item) => (
              <InventoryItemComponent 
                key={item.id}
                {...item}
                onEdit={handleEditItem}
                searchQuery={searchQuery}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={searchQuery ? <Search className="w-8 h-8 text-gray-400" /> : <Package className="w-8 h-8 text-gray-400" />}
            title={searchQuery ? "По запросу ничего не найдено" : "Нет товаров на складе"}
            description={
              searchQuery 
                ? `Попробуйте изменить поисковый запрос "${searchQuery}"`
                : "Добавьте цветы и материалы для отслеживания остатков"
            }
          />
        )}
      </div>

      {/* Items Table - Desktop View */}
      <div className="hidden lg:block">
        {filteredItems.length > 0 ? (
          <div className="border border-gray-200 rounded-lg mx-4 my-4">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-medium">
                Позиции на складе ({filteredItems.length})
              </h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={onStartAudit}>
                  <Clipboard className="w-4 h-4 mr-2" />
                  Инвентаризация
                </Button>
                <Button onClick={onAddItem} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить позицию
                </Button>
              </div>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Фото</TableHead>
                  <TableHead>Название</TableHead>
                  <TableHead className="w-32">Категория</TableHead>
                  <TableHead className="w-32">Цена/ед</TableHead>
                  <TableHead className="w-32">Остаток</TableHead>
                  <TableHead className="w-32">Последняя поставка</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => (
                  <TableRow 
                    key={item.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => handleEditItem(item.id)}
                  >
                    <TableCell>
                      <div 
                        className="w-12 h-12 bg-cover bg-center rounded-lg"
                        style={{ backgroundImage: `url('${item.image}')` }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{item.name}</div>
                    </TableCell>
                    <TableCell>
                      <div className={`px-2 py-1 rounded text-xs inline-block ${
                        item.category === 'flowers' ? 'bg-pink-100 text-pink-700' :
                        item.category === 'greenery' ? 'bg-green-100 text-green-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {item.category === 'flowers' ? 'Цветы' :
                         item.category === 'greenery' ? 'Зелень' : 'Аксессуары'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>{item.price}</div>
                    </TableCell>
                    <TableCell>
                      <div className={`${item.quantity < 10 ? 'text-red-600 font-medium' : 'text-gray-900'}`}>
                        {item.quantity} {item.unit}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600">
                        {new Date(item.lastDelivery).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'short'
                        })}
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
              icon={searchQuery ? <Search className="w-8 h-8 text-gray-400" /> : <Package className="w-8 h-8 text-gray-400" />}
              title={searchQuery ? "По запросу ничего не найдено" : "Нет товаров на складе"}
              description={
                searchQuery 
                  ? `Попробуйте изменить поисковый запрос "${searchQuery}"`
                  : "Добавьте цветы и материалы для отслеживания остатков"
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}