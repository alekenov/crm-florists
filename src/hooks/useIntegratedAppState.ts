import { useState, useMemo } from 'react';
import { Screen } from '../types';
import { useUrlRouter } from './useUrlRouter';
import { useAPIData } from './useAPIData';
import { useAPIActions } from './useAPIActions';
import {
  adaptBackendClientsToCustomers,
  adaptBackendProductsToProducts,
  adaptBackendInventoryToInventoryItems,
  adaptBackendOrdersToOrders
} from '../adapters/dataAdapters';

export function useIntegratedAppState() {
  // New URL-based routing
  const urlRouter = useUrlRouter();

  // API data and actions
  const apiState = useAPIData();
  const apiActions = useAPIActions(apiState);

  // Screen navigation state with history tracking (now synced with URL router)
  const [navigationHistory, setNavigationHistory] = useState<Screen[]>([
    urlRouter.screen as Screen || 'main'
  ]);

  // Enhanced setCurrentScreen that tracks navigation history and updates URL
  const navigateToScreen = (screen: Screen, params?: any) => {
    setNavigationHistory(prev => [...prev, screen]);

    // Use new URL router for navigation
    switch (screen) {
      case 'product-detail':
        if (params?.productId) {
          urlRouter.navigate(urlRouter.buildUrl.productDetail(parseInt(params.productId)));
        }
        break;
      case 'product-edit':
        if (params?.productId) {
          urlRouter.navigate(urlRouter.buildUrl.productEdit(parseInt(params.productId)));
        }
        break;
      case 'selector':
        urlRouter.navigate(urlRouter.buildUrl.productAdd());
        break;
      case 'vitrina-form':
        urlRouter.navigate(urlRouter.buildUrl.productAddVitrina());
        break;
      case 'catalog-form':
        urlRouter.navigate(urlRouter.buildUrl.productAddCatalog());
        break;
      case 'order-detail':
        if (params?.orderId) {
          urlRouter.navigate(urlRouter.buildUrl.orderDetail(params.orderId));
        }
        break;
      case 'add-order':
        urlRouter.navigate(urlRouter.buildUrl.orderAdd());
        break;
      case 'inventory-item-detail':
        if (params?.inventoryItemId) {
          urlRouter.navigate(urlRouter.buildUrl.inventoryDetail(parseInt(params.inventoryItemId)));
        }
        break;
      case 'add-inventory-item':
        urlRouter.navigate(urlRouter.buildUrl.inventoryAdd());
        break;
      case 'inventory-audit':
        urlRouter.navigate(urlRouter.buildUrl.inventoryAudit());
        break;
      case 'customer-detail':
        if (params?.customerId) {
          urlRouter.navigate(urlRouter.buildUrl.customerDetail(parseInt(params.customerId)));
        }
        break;
      case 'add-customer':
        urlRouter.navigate(urlRouter.buildUrl.customerAdd());
        break;
      case 'dashboard':
        urlRouter.navigate(urlRouter.buildUrl.dashboard());
        break;
      default:
        urlRouter.navigate('/orders');
    }
  };

  // Go back to previous screen using URL router
  const goBack = () => {
    urlRouter.goBack();
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

  // Tab navigation helper
  const setActiveTab = (tab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile') => {
    switch (tab) {
      case 'orders':
        urlRouter.navigate(urlRouter.buildUrl.orders());
        break;
      case 'products':
        urlRouter.navigate(urlRouter.buildUrl.products());
        break;
      case 'inventory':
        urlRouter.navigate(urlRouter.buildUrl.inventory());
        break;
      case 'customers':
        urlRouter.navigate(urlRouter.buildUrl.customers());
        break;
      case 'profile':
        urlRouter.navigate(urlRouter.buildUrl.profile());
        break;
    }
  };


  // Extract selected IDs from URL parameters
  const selectedProductId = urlRouter.params.id ? parseInt(urlRouter.params.id) : null;
  const selectedOrderId = urlRouter.params.id || null;
  const selectedInventoryItemId = urlRouter.params.id ? parseInt(urlRouter.params.id) : null;
  const selectedCustomerId = urlRouter.params.id ? parseInt(urlRouter.params.id) : null;

  // Legacy setters that now use URL navigation
  const setSelectedProductId = (id: number | null) => {
    if (id) {
      urlRouter.navigate(urlRouter.buildUrl.productDetail(id));
    }
  };

  const setSelectedOrderId = (id: string | null) => {
    if (id) {
      urlRouter.navigate(urlRouter.buildUrl.orderDetail(id));
    }
  };

  const setSelectedInventoryItemId = (id: number | null) => {
    if (id) {
      urlRouter.navigate(urlRouter.buildUrl.inventoryDetail(id));
    }
  };

  const setSelectedCustomerId = (id: number | null) => {
    if (id) {
      urlRouter.navigate(urlRouter.buildUrl.customerDetail(id));
    }
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

    // Navigation state (now from URL router)
    currentScreen: urlRouter.screen as Screen,
    navigationHistory,
    activeTab: urlRouter.tab,
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

    // URL router methods for enhanced navigation
    navigate: urlRouter.navigate,
    buildUrl: urlRouter.buildUrl,
    currentRoute: urlRouter.currentRoute,

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