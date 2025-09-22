import { Product, Customer, Order, InventoryItem, OrderItem } from '../types';

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
}

export function useAppActions(state: AppState) {
  // Генерация уникальных ID
  const generateProductId = () => {
    const maxId = state.products.reduce((max, product) => Math.max(max, product.id), 0);
    return maxId + 1;
  };

  const generateCustomerId = () => {
    const maxId = state.customers.reduce((max, customer) => Math.max(max, customer.id), 0);
    return maxId + 1;
  };

  const generateOrderId = () => {
    const maxNum = state.orders.reduce((max, order) => {
      const num = parseInt(order.number.split('-')[1]);
      return Math.max(max, num);
    }, 0);
    return `ORD-${String(maxNum + 1).padStart(3, '0')}`;
  };

  const generateInventoryId = () => {
    const maxId = state.inventory.reduce((max, item) => Math.max(max, item.id), 0);
    return maxId + 1;
  };

  // Действия с товарами
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    try {
      const newProduct: Product = {
        ...productData,
        id: generateProductId(),
        createdAt: new Date()
      };
      
      state.setProducts(prev => [...prev, newProduct]);
      return { success: true, data: newProduct };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка добавления товара';
      state.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateProduct = async (id: number, updates: Partial<Product>) => {
    try {
      state.setProducts(prev => 
        prev.map(product => 
          product.id === id ? { ...product, ...updates } : product
        )
      );
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления товара';
      state.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const toggleProductAvailability = async (productId: number) => {
    try {
      state.setProducts(prev =>
        prev.map(product =>
          product.id === productId
            ? { ...product, isAvailable: !product.isAvailable }
            : product
        )
      );
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка изменения доступности товара';
      state.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      state.setProducts(prev => prev.filter(product => product.id !== productId));
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка удаления товара';
      state.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Действия с клиентами
  const addCustomer = async (customerData: Omit<Customer, 'id' | 'memberSince' | 'totalOrders' | 'totalSpent'>) => {
    try {
      const newCustomer: Customer = {
        ...customerData,
        id: generateCustomerId(),
        memberSince: new Date(),
        totalOrders: 0,
        totalSpent: 0
      };
      
      state.setCustomers(prev => [...prev, newCustomer]);
      return { success: true, data: newCustomer };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка добавления клиента';
      state.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateCustomer = async (id: number, updates: Partial<Customer>) => {
    try {
      state.setCustomers(prev => 
        prev.map(customer => 
          customer.id === id ? { ...customer, ...updates } : customer
        )
      );
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления клиента';
      state.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Действия с заказами
  const addOrder = async (orderData: Omit<Order, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'history'>) => {
    try {
      const orderId = generateOrderId();
      const orderNumber = `2024-${String(state.orders.length + 1).padStart(3, '0')}`;
      
      const newOrder: Order = {
        ...orderData,
        id: orderId,
        number: orderNumber,
        createdAt: new Date(),
        updatedAt: new Date(),
        history: [
          {
            date: new Date().toISOString(),
            description: 'Заказ создан',
            type: 'created'
          }
        ]
      };
      
      state.setOrders(prev => [...prev, newOrder]);
      
      // Обновляем статистику клиента
      if (orderData.recipient) {
        state.setCustomers(prev =>
          prev.map(customer =>
            customer.id === orderData.recipient.id
              ? {
                  ...customer,
                  totalOrders: customer.totalOrders + 1,
                  totalSpent: customer.totalSpent + orderData.payment.amount,
                  lastOrderDate: new Date()
                }
              : customer
          )
        );
      }
      
      return { success: true, data: newOrder };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка создания заказа';
      state.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    try {
      const statusDescriptions = {
        new: 'Новый заказ',
        paid: 'Оплачен',
        accepted: 'Принят в работу',
        assembled: 'Собран',
        'in-transit': 'В доставке',
        completed: 'Завершен'
      };

      state.setOrders(prev =>
        prev.map(order =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                updatedAt: new Date(),
                history: [
                  ...(order.history || []),
                  {
                    date: new Date().toISOString(),
                    description: statusDescriptions[newStatus],
                    type: newStatus as any
                  }
                ]
              }
            : order
        )
      );
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления статуса заказа';
      state.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Действия с инвентарем
  const addInventoryItem = async (itemData: Omit<InventoryItem, 'id' | 'lastDelivery'>) => {
    try {
      const newItem: InventoryItem = {
        ...itemData,
        id: generateInventoryId(),
        lastDelivery: new Date()
      };
      
      state.setInventory(prev => [...prev, newItem]);
      return { success: true, data: newItem };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка добавления товара в инвентарь';
      state.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateInventoryItem = async (id: number, updates: Partial<InventoryItem>) => {
    try {
      state.setInventory(prev => 
        prev.map(item => 
          item.id === id ? { ...item, ...updates } : item
        )
      );
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка обновления товара в инвентаре';
      state.setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    // Товары
    addProduct,
    updateProduct,
    toggleProductAvailability,
    deleteProduct,
    
    // Клиенты
    addCustomer,
    updateCustomer,
    
    // Заказы
    addOrder,
    updateOrderStatus,
    
    // Инвентарь
    addInventoryItem,
    updateInventoryItem
  };
}