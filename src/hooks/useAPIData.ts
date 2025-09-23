import { useState, useEffect, useCallback } from 'react';
import {
  Client, Product, Inventory, Order, DashboardStats
} from '../api/types';
import {
  clients, products, inventory, orders, stats
} from '../api/services';
import { apiClient } from '../api/client';

export interface APIState {
  // Data
  clients: Client[];
  customers: any[]; // Данные customers с новой структурой (прямая интеграция)
  products: Product[];
  inventory: Inventory[];
  orders: Order[];
  dashboardStats?: DashboardStats;

  // Loading states
  loading: boolean;
  clientsLoading: boolean;
  customersLoading: boolean;
  productsLoading: boolean;
  inventoryLoading: boolean;
  ordersLoading: boolean;

  // Error states
  error: string | null;
  clientsError: string | null;
  customersError: string | null;
  productsError: string | null;
  inventoryError: string | null;
  ordersError: string | null;

  // Methods
  refetchAll: () => Promise<void>;
  refetchClients: () => Promise<void>;
  refetchCustomers: () => Promise<void>;
  refetchProducts: () => Promise<void>;
  refetchInventory: () => Promise<void>;
  refetchOrders: () => Promise<void>;
  refetchStats: () => Promise<void>;
}

export function useAPIData(): APIState {
  // Data states
  const [clients_data, setClients] = useState<Client[]>([]);
  const [customers_data, setCustomers] = useState<any[]>([]);
  const [products_data, setProducts] = useState<Product[]>([]);
  const [inventory_data, setInventory] = useState<Inventory[]>([]);
  const [orders_data, setOrders] = useState<Order[]>([]);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>();

  // Loading states
  const [loading, setLoading] = useState(true);
  const [clientsLoading, setClientsLoading] = useState(false);
  const [customersLoading, setCustomersLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(false);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Error states
  const [error, setError] = useState<string | null>(null);
  const [clientsError, setClientsError] = useState<string | null>(null);
  const [customersError, setCustomersError] = useState<string | null>(null);
  const [productsError, setProductsError] = useState<string | null>(null);
  const [inventoryError, setInventoryError] = useState<string | null>(null);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Fetch functions
  const refetchClients = useCallback(async () => {
    setClientsLoading(true);
    setClientsError(null);
    try {
      const data = await clients.getAll({ limit: 1000 });
      setClients(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch clients';
      setClientsError(errorMessage);
      console.error('Error fetching clients:', err);
    } finally {
      setClientsLoading(false);
    }
  }, []);

  const refetchCustomers = useCallback(async () => {
    setCustomersLoading(true);
    setCustomersError(null);
    try {
      const data = await apiClient.getCustomers();
      // Преобразуем даты из строк в Date объекты
      const processedData = data.map((customer: any) => ({
        ...customer,
        memberSince: customer.memberSince ? new Date(customer.memberSince) : new Date(),
        lastOrderDate: customer.lastOrderDate ? new Date(customer.lastOrderDate) : null
      }));
      setCustomers(processedData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch customers';
      setCustomersError(errorMessage);
      console.error('Error fetching customers:', err);
    } finally {
      setCustomersLoading(false);
    }
  }, []);

  const refetchProducts = useCallback(async () => {
    setProductsLoading(true);
    setProductsError(null);
    try {
      const data = await products.getAll({ limit: 1000 });
      setProducts(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch products';
      setProductsError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  const refetchInventory = useCallback(async () => {
    setInventoryLoading(true);
    setInventoryError(null);
    try {
      const data = await inventory.getAll({ limit: 1000 });
      setInventory(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch inventory';
      setInventoryError(errorMessage);
      console.error('Error fetching inventory:', err);
    } finally {
      setInventoryLoading(false);
    }
  }, []);

  const refetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const data = await orders.getAll({ limit: 1000 });
      setOrders(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch orders';
      setOrdersError(errorMessage);
      console.error('Error fetching orders:', err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const refetchStats = useCallback(async () => {
    try {
      const data = await stats.getDashboard();
      setDashboardStats(data);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    }
  }, []);

  const refetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        refetchClients(),
        refetchCustomers(),
        refetchProducts(),
        refetchInventory(),
        refetchOrders(),
        refetchStats()
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Error fetching all data:', err);
    } finally {
      setLoading(false);
    }
  }, [refetchClients, refetchCustomers, refetchProducts, refetchInventory, refetchOrders, refetchStats]);

  // Initial data load
  useEffect(() => {
    refetchAll();
  }, [refetchAll]);

  return {
    // Data
    clients: clients_data,
    customers: customers_data,
    products: products_data,
    inventory: inventory_data,
    orders: orders_data,
    dashboardStats,

    // Loading states
    loading,
    clientsLoading,
    customersLoading,
    productsLoading,
    inventoryLoading,
    ordersLoading,

    // Error states
    error,
    clientsError,
    customersError,
    productsError,
    inventoryError,
    ordersError,

    // Methods
    refetchAll,
    refetchClients,
    refetchCustomers,
    refetchProducts,
    refetchInventory,
    refetchOrders,
    refetchStats
  };
}