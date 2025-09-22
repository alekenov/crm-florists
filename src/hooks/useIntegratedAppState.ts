import { useState, useMemo } from 'react';
import { Screen } from '../src/types';
import { urlManager, AppURLParams } from '../src/utils/url';
import { useAPIData } from './useAPIData';
import { useAPIActions } from './useAPIActions';
import {
  adaptBackendClientsToCustomers,
  adaptBackendProductsToProducts,
  adaptBackendInventoryToInventoryItems,
  adaptBackendOrdersToOrders
} from '../adapters/dataAdapters';

export function useIntegratedAppState() {
  // API data and actions
  const apiState = useAPIData();
  const apiActions = useAPIActions(apiState);

  // Initialize state from URL parameters
  const urlParams = typeof window !== 'undefined' ? urlManager.getParams() : {};

  // Screen navigation state with history tracking
  const [currentScreen, setCurrentScreen] = useState<Screen>(
    (urlParams.screen as Screen) || 'main'
  );
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>([
    (urlParams.screen as Screen) || 'main'
  ]);
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'inventory' | 'customers' | 'profile'>(
    (urlParams.tab as any) || 'orders'
  );
  const [selectedProductId, setSelectedProductId] = useState<number | null>(
    urlParams.productId ? parseInt(urlParams.productId) : null
  );
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(
    urlParams.orderId || null
  );
  const [selectedInventoryItemId, setSelectedInventoryItemId] = useState<number | null>(
    urlParams.inventoryItemId ? parseInt(urlParams.inventoryItemId) : null
  );
  const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(
    urlParams.customerId ? parseInt(urlParams.customerId) : null
  );

  // Enhanced setCurrentScreen that tracks navigation history and updates URL
  const navigateToScreen = (screen: Screen, params?: Partial<AppURLParams>) => {
    setNavigationHistory(prev => [...prev, screen]);
    setCurrentScreen(screen);
    urlManager.navigateToScreen(screen, params);
  };

  // Go back to previous screen
  const goBack = () => {
    if (navigationHistory.length > 1) {
      const previousScreen = navigationHistory[navigationHistory.length - 2];
      setNavigationHistory(prev => prev.slice(0, -1));
      setCurrentScreen(previousScreen);
      urlManager.navigateToScreen(previousScreen);
    }
  };

  // Convert backend data to frontend format using adapters
  const adaptedData = useMemo(() => {
    return {
      customers: adaptBackendClientsToCustomers(apiState.clients),
      products: adaptBackendProductsToProducts(apiState.products),
      inventory: adaptBackendInventoryToInventoryItems(apiState.inventory),
      orders: adaptBackendOrdersToOrders(apiState.orders)
    };
  }, [apiState.clients, apiState.products, apiState.inventory, apiState.orders]);

  // Navigation helper methods
  const updateURL = (params: Partial<AppURLParams>) => {
    urlManager.setParams(params, true);
  };

  // Combined state object
  return {
    // Adapted data for compatibility with existing components
    customers: adaptedData.customers,
    products: adaptedData.products,
    inventory: adaptedData.inventory,
    orders: adaptedData.orders,

    // Raw API data (for components that need backend format)
    rawData: {
      clients: apiState.clients,
      products: apiState.products,
      inventory: apiState.inventory,
      orders: apiState.orders,
      dashboardStats: apiState.dashboardStats
    },

    // Loading and error states
    loading: apiState.loading,
    error: apiState.error,

    // Individual loading states
    clientsLoading: apiState.clientsLoading,
    productsLoading: apiState.productsLoading,
    inventoryLoading: apiState.inventoryLoading,
    ordersLoading: apiState.ordersLoading,

    // Individual error states
    clientsError: apiState.clientsError,
    productsError: apiState.productsError,
    inventoryError: apiState.inventoryError,
    ordersError: apiState.ordersError,

    // Navigation state
    currentScreen,
    navigationHistory,
    activeTab,
    selectedProductId,
    selectedOrderId,
    selectedInventoryItemId,
    selectedCustomerId,

    // Navigation methods
    setCurrentScreen: navigateToScreen,
    setActiveTab,
    setSelectedProductId,
    setSelectedOrderId,
    setSelectedInventoryItemId,
    setSelectedCustomerId,
    goBack,
    updateURL,

    // API refresh methods
    refetchAll: apiState.refetchAll,
    refetchClients: apiState.refetchClients,
    refetchProducts: apiState.refetchProducts,
    refetchInventory: apiState.refetchInventory,
    refetchOrders: apiState.refetchOrders,
    refetchStats: apiState.refetchStats,

    // API action methods
    apiActions,

    // Dashboard stats
    dashboardStats: apiState.dashboardStats
  };
}