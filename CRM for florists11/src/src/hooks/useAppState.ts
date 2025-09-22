import { useState } from 'react';
import { Screen, Product, Customer, Order, InventoryItem } from '../types';
import { useLocalStorage } from './useLocalStorage';
import { useUrlRouter } from './useUrlRouter';
import { mockProducts, mockCustomers, mockOrders, mockInventoryItems } from '../data/mockData';

export function useAppState() {
  // URL-based routing
  const { currentRoute, navigate, goBack, buildUrl, tab, screen, params } = useUrlRouter();
  
  // Локальное хранилище данных
  const [products, setProducts] = useLocalStorage<Product[]>('flower_shop_products', mockProducts);
  const [customers, setCustomers] = useLocalStorage<Customer[]>('flower_shop_customers', mockCustomers);
  const [orders, setOrders] = useLocalStorage<Order[]>('flower_shop_orders', mockOrders);
  const [inventory, setInventory] = useLocalStorage<InventoryItem[]>('flower_shop_inventory', mockInventoryItems);
  
  // Состояние загрузки (для совместимости с существующим кодом)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Извлекаем ID из URL параметров
  const selectedProductId = params.id ? parseInt(params.id) : null;
  const selectedOrderId = params.id || null;
  const selectedInventoryItemId = params.id ? parseInt(params.id) : null;
  const selectedCustomerId = params.id ? parseInt(params.id) : null;

  // Navigation functions using URL router
  const navigateToScreen = (screenName: string, id?: string | number) => {
    switch (screenName) {
      case 'product-detail':
        navigate(buildUrl.productDetail(id as number));
        break;
      case 'product-edit':
        navigate(buildUrl.productEdit(id as number));
        break;
      case 'selector':
        navigate(buildUrl.productAdd());
        break;
      case 'vitrina-form':
        navigate(buildUrl.productAddVitrina());
        break;
      case 'catalog-form':
        navigate(buildUrl.productAddCatalog());
        break;
      case 'order-detail':
        navigate(buildUrl.orderDetail(id as string));
        break;
      case 'add-order':
        navigate(buildUrl.orderAdd());
        break;
      case 'inventory-item-detail':
        navigate(buildUrl.inventoryDetail(id as number));
        break;
      case 'add-inventory-item':
        navigate(buildUrl.inventoryAdd());
        break;
      case 'inventory-audit':
        navigate(buildUrl.inventoryAudit());
        break;
      case 'customer-detail':
        navigate(buildUrl.customerDetail(id as number));
        break;
      case 'add-customer':
        navigate(buildUrl.customerAdd());
        break;
      case 'dashboard':
        navigate(buildUrl.dashboard());
        break;
      default:
        navigate('/orders');
    }
  };

  // Navigate back using browser history
  const navigateBack = () => {
    goBack();
  };

  // Tab navigation
  const setActiveTabWithURL = (newTab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile') => {
    switch (newTab) {
      case 'orders':
        navigate(buildUrl.orders());
        break;
      case 'products':
        navigate(buildUrl.products());
        break;
      case 'inventory':
        navigate(buildUrl.inventory());
        break;
      case 'customers':
        navigate(buildUrl.customers());
        break;
      case 'profile':
        navigate(buildUrl.profile());
        break;
    }
  };

  // Функции обновления данных (для совместимости)
  const refetchProducts = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500); // Имитация загрузки
  };

  const refetchCustomers = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const refetchOrders = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const refetchInventory = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const refetchAll = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return {
    // State (now from URL router)
    currentScreen: screen,
    activeTab: tab,
    selectedProductId,
    selectedOrderId,
    selectedInventoryItemId,
    selectedCustomerId,
    
    // Data
    customers,
    products,
    orders,
    inventory,
    loading,
    error,
    
    // Data setters
    setProducts,
    setCustomers,
    setOrders,
    setInventory,
    setError,
    
    // Enhanced Navigation with URL support
    navigateToScreen,
    navigateBack,
    
    // Tab management
    setActiveTab: setActiveTabWithURL,
    
    // Legacy setters (kept for compatibility but will use URL now)
    setCurrentScreen: (screen: Screen) => navigateToScreen(screen),
    setSelectedProductId: (id: number | null) => {
      if (id) navigateToScreen('product-detail', id);
    },
    setSelectedOrderId: (id: string | null) => {
      if (id) navigateToScreen('order-detail', id);
    },
    setSelectedInventoryItemId: (id: number | null) => {
      if (id) navigateToScreen('inventory-item-detail', id);
    },
    setSelectedCustomerId: (id: number | null) => {
      if (id) navigateToScreen('customer-detail', id);
    },
    
    // Data refresh functions
    refetchProducts,
    refetchCustomers,
    refetchOrders,
    refetchInventory,
    refetchAll,
    
    // URL utilities
    navigate,
    buildUrl,
    currentRoute,
  };
}