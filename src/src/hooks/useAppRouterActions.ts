import { useAppActions } from './useAppActions';
import { Screen, Product, Customer, Order, InventoryItem } from '../types';
import { APIActions } from '../hooks/useAPIActions';

interface AppRouterState {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  inventory: InventoryItem[];
  apiActions: APIActions;
  setCurrentScreen: (screen: Screen) => void;
  goBack?: () => void;
  setActiveTab: (tab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile') => void;
  setSelectedProductId: (id: number | null) => void;
  setSelectedOrderId: (id: string | null) => void;
  setSelectedInventoryItemId: (id: number | null) => void;
  setSelectedCustomerId: (id: number | null) => void;
  refetchProducts: () => void;
  refetchCustomers: () => void;
  refetchOrders: () => void;
  refetchInventory: () => void;
}

export function useAppRouterActions(state: AppRouterState) {
  const dataActions = useAppActions(state);

  // Navigation actions
  const handleAddProduct = () => {
    state.setCurrentScreen('selector');
  };

  const handleSelectVitrina = () => {
    state.setCurrentScreen('vitrina-form');
  };

  const handleSelectCatalog = () => {
    state.setCurrentScreen('catalog-form');
  };

  const handleCloseToList = () => {
    if (state.goBack) {
      state.goBack();
    } else {
      state.setCurrentScreen('products');
    }
  };

  const handleViewProduct = (productId: number) => {
    state.setSelectedProductId(productId);
    state.setCurrentScreen('product-detail');
  };

  const handleEditProduct = (productId: number) => {
    state.setSelectedProductId(productId);
    state.setCurrentScreen('product-edit');
  };

  const handleNavigateToDashboard = () => {
    state.setCurrentScreen('dashboard');
  };

  // Order actions
  const handleAddOrder = () => {
    state.setCurrentScreen('add-order');
  };

  const handleViewOrder = (orderId: string) => {
    state.setCurrentScreen('order-detail', { orderId });
  };

  const handleEditOrder = (orderId: string) => {
    // Можно добавить экран редактирования заказа
    console.log('Edit order:', orderId);
  };

  const handleDeleteOrder = (orderId: string) => {
    // Удаление заказа
    state.setOrders(prev => prev.filter(order => order.id !== orderId));
    state.navigateBack();
  };

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    await dataActions.updateOrderStatus(orderId, newStatus);
  };

  const handleOrderStatusChange = async (orderId: string, newStatus: Order['status']) => {
    await dataActions.updateOrderStatus(orderId, newStatus);
  };

  // Customer actions
  const handleAddCustomer = () => {
    state.setCurrentScreen('add-customer');
  };

  const handleViewCustomer = (customerId: number) => {
    state.setSelectedCustomerId(customerId);
    state.setCurrentScreen('customer-detail');
  };

  // Inventory actions
  const handleAddInventoryItem = () => {
    state.setCurrentScreen('add-inventory-item');
  };

  const handleViewInventoryItem = (itemId: number) => {
    state.setSelectedInventoryItemId(itemId);
    state.setCurrentScreen('inventory-item-detail');
  };

  const handleStartInventoryAudit = () => {
    state.setCurrentScreen('inventory-audit');
  };

  // Product creation handlers
  const handleCreateProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const result = await dataActions.addProduct(productData);
    if (result.success) {
      state.setCurrentScreen('main');
      state.setActiveTab('products');
      state.refetchProducts();
    }
    return result;
  };

  // Customer creation handler
  const handleCreateCustomer = async (customerData: Omit<Customer, 'id' | 'memberSince' | 'totalOrders' | 'totalSpent'>) => {
    const result = await dataActions.addCustomer(customerData);
    if (result.success) {
      state.setCurrentScreen('main');
      state.setActiveTab('customers');
      state.refetchCustomers();
    }
    return result;
  };

  // Order creation handler
  const handleCreateOrder = async (orderData: Omit<Order, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'history'>) => {
    const result = await dataActions.addOrder(orderData);
    if (result.success) {
      state.setCurrentScreen('main');
      state.setActiveTab('orders');
      state.refetchOrders();
    }
    return result;
  };

  return {
    // Navigation
    handleAddProduct,
    handleSelectVitrina,
    handleSelectCatalog,
    handleCloseToList,
    handleViewProduct,
    handleEditProduct,
    handleNavigateToDashboard,

    // Orders
    handleAddOrder,
    handleViewOrder,
    handleEditOrder,
    handleDeleteOrder,
    handleUpdateOrderStatus,
    handleOrderStatusChange,
    handleCreateOrder,

    // Customers
    handleAddCustomer,
    handleViewCustomer,
    handleCreateCustomer,

    // Inventory
    handleAddInventoryItem,
    handleViewInventoryItem,
    handleStartInventoryAudit,

    // Products
    handleCreateProduct,

    // Data actions
    updateProduct: dataActions.updateProduct,
    updateCustomer: dataActions.updateCustomer,
    toggleProductStatus: dataActions.toggleProductAvailability,
  };
}