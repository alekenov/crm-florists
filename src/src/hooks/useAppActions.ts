import { Product, Customer, Order, InventoryItem } from '../types';

interface AppState {
  products: Product[];
  customers: Customer[];
  orders: Order[];
  inventory: InventoryItem[];
  setProducts: (products: Product[] | ((prev: Product[]) => Product[])) => void;
  setCustomers: (customers: Customer[] | ((prev: Customer[]) => Customer[])) => void;
  setOrders: (orders: Order[] | ((prev: Order[]) => Order[])) => void;
  setInventory: (inventory: InventoryItem[] | ((prev: InventoryItem[]) => InventoryItem[])) => void;
  setError: (error: string | null) => void;
  refetchProducts: () => void;
  refetchCustomers: () => void;
  refetchOrders: () => void;
  refetchInventory: () => void;
}

export function useAppActions(state: AppState) {
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      // В реальном приложении здесь будет API вызов
      const newProduct: Product = {
        ...productData,
        id: Date.now(), // Временный ID
        createdAt: new Date()
      };

      state.setProducts(prev => [...prev, newProduct]);
      state.refetchProducts();

      return { success: true, data: newProduct };
    } catch (error) {
      console.error('Error adding product:', error);
      state.setError('Ошибка при добавлении товара');
      return { success: false, error };
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    try {
      // В реальном приложении здесь будет API вызов
      state.setProducts(prev =>
        prev.map(product =>
          product.id === id ? { ...product, ...updates } : product
        )
      );
      state.refetchProducts();

      return { success: true };
    } catch (error) {
      console.error('Error updating product:', error);
      state.setError('Ошибка при обновлении товара');
      return { success: false, error };
    }
  };

  const toggleProductAvailability = async (id: number) => {
    try {
      const product = state.products.find(p => p.id === id);
      if (!product) throw new Error('Product not found');

      await updateProduct(id, { isAvailable: !product.isAvailable });
      return { success: true };
    } catch (error) {
      console.error('Error toggling product availability:', error);
      state.setError('Ошибка при изменении доступности товара');
      return { success: false, error };
    }
  };

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'memberSince' | 'totalOrders' | 'totalSpent'>) => {
    try {
      // В реальном приложении здесь будет API вызов
      const newCustomer: Customer = {
        ...customerData,
        id: Date.now(), // Временный ID
        memberSince: new Date(),
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: new Date()
      };

      state.setCustomers(prev => [...prev, newCustomer]);
      state.refetchCustomers();

      return { success: true, data: newCustomer };
    } catch (error) {
      console.error('Error adding customer:', error);
      state.setError('Ошибка при добавлении клиента');
      return { success: false, error };
    }
  };

  const updateCustomer = async (id: number, updates: Partial<Customer>) => {
    try {
      // В реальном приложении здесь будет API вызов
      state.setCustomers(prev =>
        prev.map(customer =>
          customer.id === id ? { ...customer, ...updates } : customer
        )
      );
      state.refetchCustomers();

      return { success: true };
    } catch (error) {
      console.error('Error updating customer:', error);
      state.setError('Ошибка при обновлении клиента');
      return { success: false, error };
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'history'>) => {
    try {
      // В реальном приложении здесь будет API вызов
      const newOrder: Order = {
        ...orderData,
        id: Date.now().toString(), // Временный ID
        number: `ORD-${Date.now()}`, // Временный номер
        createdAt: new Date(),
        updatedAt: new Date(),
        history: [{
          status: orderData.status,
          timestamp: new Date(),
          comment: 'Заказ создан'
        }]
      };

      state.setOrders(prev => [...prev, newOrder]);
      state.refetchOrders();

      return { success: true, data: newOrder };
    } catch (error) {
      console.error('Error adding order:', error);
      state.setError('Ошибка при создании заказа');
      return { success: false, error };
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Используем реальный API вызов через apiActions
      console.log('updateOrderStatus called with:', { orderId, newStatus, type: typeof orderId });
      const orderIdNumber = parseInt(orderId, 10);
      console.log('Parsed orderIdNumber:', orderIdNumber);

      if (isNaN(orderIdNumber)) {
        throw new Error(`Invalid order ID: ${orderId}`);
      }

      await state.apiActions.updateOrderStatus(orderIdNumber, newStatus);

      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error };
    }
  };

  return {
    addProduct,
    updateProduct,
    toggleProductAvailability,
    addCustomer,
    updateCustomer,
    addOrder,
    updateOrderStatus
  };
}