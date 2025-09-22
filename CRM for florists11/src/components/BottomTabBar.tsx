import { Package, ClipboardList, Warehouse, Users, User } from "lucide-react";

interface BottomTabBarProps {
  activeTab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile';
  onActiveTabChange: (tab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile') => void;
}

export function BottomTabBar({ activeTab, onActiveTabChange }: BottomTabBarProps) {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-md bg-white border-t border-gray-200 z-50">
      <div className="flex">
        <button
          onClick={() => onActiveTabChange('orders')}
          className={`flex-1 py-2 flex flex-col items-center justify-center transition-colors ${
            activeTab === 'orders'
              ? 'text-gray-900 bg-gray-100'
              : 'text-gray-500'
          }`}
        >
          <ClipboardList className="w-5 h-5 mb-1" />
          <span className="text-xs">Заказы</span>
        </button>
        <button
          onClick={() => onActiveTabChange('products')}
          className={`flex-1 py-2 flex flex-col items-center justify-center transition-colors ${
            activeTab === 'products'
              ? 'text-gray-900 bg-gray-100'
              : 'text-gray-500'
          }`}
        >
          <Package className="w-5 h-5 mb-1" />
          <span className="text-xs">Товары</span>
        </button>
        <button
          onClick={() => onActiveTabChange('inventory')}
          className={`flex-1 py-2 flex flex-col items-center justify-center transition-colors ${
            activeTab === 'inventory'
              ? 'text-gray-900 bg-gray-100'
              : 'text-gray-500'
          }`}
        >
          <Warehouse className="w-5 h-5 mb-1" />
          <span className="text-xs">Склад</span>
        </button>
        <button
          onClick={() => onActiveTabChange('customers')}
          className={`flex-1 py-2 flex flex-col items-center justify-center transition-colors ${
            activeTab === 'customers'
              ? 'text-gray-900 bg-gray-100'
              : 'text-gray-500'
          }`}
        >
          <Users className="w-5 h-5 mb-1" />
          <span className="text-xs">Клиенты</span>
        </button>
        <button
          onClick={() => onActiveTabChange('profile')}
          className={`flex-1 py-2 flex flex-col items-center justify-center transition-colors ${
            activeTab === 'profile'
              ? 'text-gray-900 bg-gray-100'
              : 'text-gray-500'
          }`}
        >
          <User className="w-5 h-5 mb-1" />
          <span className="text-xs">Профиль</span>
        </button>
      </div>
    </div>
  );
}