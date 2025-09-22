import { useAppActions } from './useAppActions';
import { Screen, Product, Customer, Order, InventoryItem } from '../types';

interface AppRouterState {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  inventory: InventoryItem[];
  setProducts: (products: Product[] | ((prev: Product[]) => Product[])) => void;
  setCustomers: (customers: Customer[] | ((prev: Customer[]) => Customer[])) => void;
  setOrders: (orders: Order[] | ((prev: Order[]) => Order[])) => void;
  setInventory: (inventory: InventoryItem[] | ((prev: InventoryItem[]) => InventoryItem[])) => void;
  setError: (error: string | null) => void;
  setCurrentScreen: (screen: Screen) => void;
  navigateToScreen: (screen: Screen, params?: any) => void;
  navigateBack: () => void;
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
    state.navigateToScreen('selector');
  };

  const handleSelectVitrina = () => {
    state.navigateToScreen('vitrina-form');
  };

  const handleSelectCatalog = () => {
    state.navigateToScreen('catalog-form');
  };

  const handleCloseToList = () => {
    state.navigateBack();
  };

  const handleViewProduct = (productId: number) => {
    state.navigateToScreen('product-detail', productId);
  };

  const handleEditProduct = (productId: number) => {
    state.navigateToScreen('product-edit', productId);
  };

  const handleNavigateToDashboard = () => {
    state.navigateToScreen('dashboard');
  };

  // Order actions
  const handleAddOrder = () => {
    state.navigateToScreen('add-order');
  };

  const handleViewOrder = (orderId: string) => {
    state.navigateToScreen('order-detail', orderId);
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
    state.navigateToScreen('add-customer');
  };

  const handleViewCustomer = (customerId: number) => {
    state.navigateToScreen('customer-detail', customerId);
  };

  // Inventory actions
  const handleAddInventoryItem = () => {
    state.navigateToScreen('add-inventory-item');
  };

  const handleViewInventoryItem = (itemId: number) => {
    state.navigateToScreen('inventory-item-detail', itemId);
  };

  const handleStartInventoryAudit = () => {
    state.navigateToScreen('inventory-audit');
  };

  // Product creation handlers
  const handleCreateProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const result = await dataActions.addProduct(productData);
    if (result.success) {
      state.navigateToScreen('main');
      state.setActiveTab('products');
      state.refetchProducts();
    }
    return result;
  };

  // Customer creation handler
  const handleCreateCustomer = async (customerData: Omit<Customer, 'id' | 'memberSince' | 'totalOrders' | 'totalSpent'>) => {
    const result = await dataActions.addCustomer(customerData);
    if (result.success) {
      state.navigateToScreen('main');
      state.setActiveTab('customers');
      state.refetchCustomers();
    }
    return result;
  };

  // Order creation handler
  const handleCreateOrder = async (orderData: Omit<Order, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'history'>) => {
    const result = await dataActions.addOrder(orderData);
    if (result.success) {
      state.navigateToScreen('main');
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