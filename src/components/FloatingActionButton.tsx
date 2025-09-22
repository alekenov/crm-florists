import React from 'react';
import { Plus, ShoppingCart, Package, Users } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

interface FloatingActionButtonProps {
  activeTab: 'products' | 'orders' | 'inventory' | 'customers' | 'profile';
  onAddProduct?: () => void;
  onAddOrder?: () => void;
  onAddInventoryItem?: () => void;
  onAddCustomer?: () => void;
}

export function FloatingActionButton({
  activeTab,
  onAddProduct,
  onAddOrder,
  onAddInventoryItem,
  onAddCustomer
}: FloatingActionButtonProps) {

  // Определяем конфигурацию для каждой вкладки
  const getTabConfig = () => {
    switch (activeTab) {
      case 'products':
        return {
          icon: Plus,
          onClick: onAddProduct,
          color: 'bg-emerald-500 hover:bg-emerald-600',
          label: 'Добавить товар'
        };
      
      case 'orders':
        return {
          icon: ShoppingCart,
          onClick: onAddOrder,
          color: 'bg-blue-500 hover:bg-blue-600',
          label: 'Новый заказ'
        };
      
      case 'inventory':
        return {
          icon: Package,
          onClick: onAddInventoryItem,
          color: 'bg-purple-500 hover:bg-purple-600',
          label: 'Поставка'
        };
      
      case 'customers':
        return {
          icon: Users,
          onClick: onAddCustomer,
          color: 'bg-orange-500 hover:bg-orange-600',
          label: 'Добавить клиента'
        };
      
      case 'profile':
        return null;
      
      default:
        return null;
    }
  };

  const config = getTabConfig();
  
  // Если нет конфигурации для текущей вкладки, не показываем FAB
  if (!config || !config.onClick) {
    return null;
  }

  const Icon = config.icon;

  return (
    <div className="lg:hidden fixed bottom-20 right-4 z-50 max-w-md mx-auto">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        <Button
          size="lg"
          className={`w-14 h-14 rounded-full shadow-lg border-0 ${config.color} text-white transition-all duration-200`}
          onClick={config.onClick}
          aria-label={config.label}
        >
          <Icon className="w-6 h-6" />
        </Button>
      </motion.div>
    </div>
  );
}