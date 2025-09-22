import { useCallback } from 'react';
import {
  Client, ClientCreate, ClientUpdate,
  Product, ProductCreate, ProductUpdate,
  Inventory, InventoryCreate, InventoryUpdate,
  Order, OrderCreate, OrderUpdate, OrderStatusUpdate
} from '../api/types';
import {
  clients, products, inventory, orders
} from '../api/services';
import { APIState } from './useAPIData';

export interface APIActions {
  // Client actions
  createClient: (data: ClientCreate) => Promise<Client>;
  updateClient: (id: number, data: ClientUpdate) => Promise<Client>;
  deleteClient: (id: number) => Promise<void>;

  // Product actions
  createProduct: (data: ProductCreate) => Promise<Product>;
  updateProduct: (id: number, data: ProductUpdate) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;

  // Inventory actions
  createInventoryItem: (data: InventoryCreate) => Promise<Inventory>;
  updateInventoryItem: (id: number, data: InventoryUpdate) => Promise<Inventory>;
  deleteInventoryItem: (id: number) => Promise<void>;

  // Order actions
  createOrder: (data: OrderCreate) => Promise<Order>;
  updateOrder: (id: number, data: OrderUpdate) => Promise<Order>;
  updateOrderStatus: (id: number, status: string) => Promise<Order>;
  deleteOrder: (id: number) => Promise<void>;
}

export function useAPIActions(apiState: APIState): APIActions {
  // Client actions
  const createClient = useCallback(async (data: ClientCreate): Promise<Client> => {
    try {
      const newClient = await clients.create(data);
      await apiState.refetchClients();
      return newClient;
    } catch (error) {
      console.error('Error creating client:', error);
      throw error;
    }
  }, [apiState]);

  const updateClient = useCallback(async (id: number, data: ClientUpdate): Promise<Client> => {
    try {
      const updatedClient = await clients.update(id, data);
      await apiState.refetchClients();
      return updatedClient;
    } catch (error) {
      console.error('Error updating client:', error);
      throw error;
    }
  }, [apiState]);

  const deleteClient = useCallback(async (id: number): Promise<void> => {
    try {
      await clients.delete(id);
      await apiState.refetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  }, [apiState]);

  // Product actions
  const createProduct = useCallback(async (data: ProductCreate): Promise<Product> => {
    try {
      const newProduct = await products.create(data);
      await apiState.refetchProducts();
      return newProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }, [apiState]);

  const updateProduct = useCallback(async (id: number, data: ProductUpdate): Promise<Product> => {
    try {
      const updatedProduct = await products.update(id, data);
      await apiState.refetchProducts();
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }, [apiState]);

  const deleteProduct = useCallback(async (id: number): Promise<void> => {
    try {
      await products.delete(id);
      await apiState.refetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }, [apiState]);

  // Inventory actions
  const createInventoryItem = useCallback(async (data: InventoryCreate): Promise<Inventory> => {
    try {
      const newItem = await inventory.create(data);
      await apiState.refetchInventory();
      return newItem;
    } catch (error) {
      console.error('Error creating inventory item:', error);
      throw error;
    }
  }, [apiState]);

  const updateInventoryItem = useCallback(async (id: number, data: InventoryUpdate): Promise<Inventory> => {
    try {
      const updatedItem = await inventory.update(id, data);
      await apiState.refetchInventory();
      return updatedItem;
    } catch (error) {
      console.error('Error updating inventory item:', error);
      throw error;
    }
  }, [apiState]);

  const deleteInventoryItem = useCallback(async (id: number): Promise<void> => {
    try {
      await inventory.delete(id);
      await apiState.refetchInventory();
    } catch (error) {
      console.error('Error deleting inventory item:', error);
      throw error;
    }
  }, [apiState]);

  // Order actions
  const createOrder = useCallback(async (data: OrderCreate): Promise<Order> => {
    try {
      const newOrder = await orders.create(data);
      await apiState.refetchOrders();
      await apiState.refetchStats(); // Update dashboard stats
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }, [apiState]);

  const updateOrder = useCallback(async (id: number, data: OrderUpdate): Promise<Order> => {
    try {
      const updatedOrder = await orders.update(id, data);
      await apiState.refetchOrders();
      await apiState.refetchStats(); // Update dashboard stats
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }, [apiState]);

  const updateOrderStatus = useCallback(async (id: number, status: string): Promise<Order> => {
    try {
      // Map English status to Russian for backend
      const statusMap: { [key: string]: 'новый' | 'в работе' | 'готов' | 'доставлен' } = {
        'new': 'новый',
        'paid': 'в работе',
        'accepted': 'в работе',
        'assembled': 'готов',
        'in-transit': 'доставлен',
        'completed': 'доставлен'
      };

      const russianStatus = statusMap[status] || 'новый';

      const statusUpdate: OrderStatusUpdate = {
        status: russianStatus
      };
      const updatedOrder = await orders.updateStatus(id, statusUpdate);
      await apiState.refetchOrders();
      await apiState.refetchStats(); // Update dashboard stats
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }, [apiState]);

  const deleteOrder = useCallback(async (id: number): Promise<void> => {
    try {
      await orders.delete(id);
      await apiState.refetchOrders();
      await apiState.refetchStats(); // Update dashboard stats
    } catch (error) {
      console.error('Error deleting order:', error);
      throw error;
    }
  }, [apiState]);

  return {
    // Client actions
    createClient,
    updateClient,
    deleteClient,

    // Product actions
    createProduct,
    updateProduct,
    deleteProduct,

    // Inventory actions
    createInventoryItem,
    updateInventoryItem,
    deleteInventoryItem,

    // Order actions
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder
  };
}