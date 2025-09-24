// React hooks for Orders API integration
import { useState, useEffect, useCallback } from 'react';
import { Order } from '../src/types';
import { SQLOrder } from '../types/sql-api';
import { ordersAPI, handleAPIError } from '../services/api-client';
import { adaptBackendOrderToOrder, adaptBackendOrdersToOrders, adaptOrderToBackendOrder } from '../adapters/dataAdapters';
import { toast } from 'sonner@2.0.3';

export interface UseOrdersState {
  orders: Order[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  pageSize: number;
}

export interface UseOrdersActions {
  loadOrders: () => Promise<void>;
  updateOrder: (id: string, updates: Partial<Order>) => Promise<void>;
  createOrder: (orderData: Partial<Order>) => Promise<Order>;
  deleteOrder: (id: string) => Promise<void>;
  updateStatus: (id: string, status: Order['status']) => Promise<void>;
  assignExecutor: (id: string, executorName: string | null) => Promise<void>;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  refreshOrders: () => Promise<void>;
}

export interface UseOrdersReturn extends UseOrdersState, UseOrdersActions {}

/**
 * Hook for managing orders list with real API integration
 */
export function useOrders(initialFilters: Record<string, any> = {}): UseOrdersReturn {
  const [state, setState] = useState<UseOrdersState>({
    orders: [],
    loading: false,
    error: null,
    total: 0,
    page: 1,
    pageSize: 20,
  });

  /**
   * Load orders from API
   */
  const loadOrders = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await ordersAPI.getOrders(
        state.page,
        state.pageSize,
        initialFilters
      );

      // Convert SQL orders to React orders
      const reactOrders = response.orders.map(sqlOrder =>
        adaptBackendOrderToOrder(sqlOrder)
      );

      setState(prev => ({
        ...prev,
        orders: reactOrders,
        total: response.total,
        loading: false,
      }));

    } catch (error) {
      const errorMessage = handleAPIError(error as Error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      toast.error('Ошибка загрузки заказов', {
        description: errorMessage,
      });
    }
  }, [state.page, state.pageSize, initialFilters]);

  /**
   * Update order
   */
  const updateOrder = useCallback(async (id: string, updates: Partial<Order>) => {
    try {
      // Convert React updates to SQL format
      const sqlUpdates = adaptOrderToBackendOrder(updates);

      // Make API call
      const updatedSQLOrder = await ordersAPI.updateOrder(parseInt(id), sqlUpdates);

      // Convert back to React format
      const updatedReactOrder = adaptBackendOrderToOrder(updatedSQLOrder);

      // Update local state
      setState(prev => ({
        ...prev,
        orders: prev.orders.map(order =>
          order.id === id ? updatedReactOrder : order
        ),
      }));

      toast.success('Заказ обновлен');

    } catch (error) {
      const errorMessage = handleAPIError(error as Error);
      toast.error('Ошибка обновления заказа', {
        description: errorMessage,
      });
      throw error;
    }
  }, []);

  /**
   * Create new order
   */
  const createOrder = useCallback(async (orderData: Partial<Order>): Promise<Order> => {
    try {
      // This is a simplified implementation
      // In reality, you'd need to handle the complex creation logic
      const sqlOrderData = adaptOrderToBackendOrder(orderData);
      const createdSQLOrder = await ordersAPI.createOrder(sqlOrderData);
      const createdReactOrder = adaptBackendOrderToOrder(createdSQLOrder);

      // Add to local state
      setState(prev => ({
        ...prev,
        orders: [createdReactOrder, ...prev.orders],
        total: prev.total + 1,
      }));

      toast.success('Заказ создан');
      return createdReactOrder;

    } catch (error) {
      const errorMessage = handleAPIError(error as Error);
      toast.error('Ошибка создания заказа', {
        description: errorMessage,
      });
      throw error;
    }
  }, []);

  /**
   * Delete order
   */
  const deleteOrder = useCallback(async (id: string) => {
    try {
      await ordersAPI.deleteOrder(parseInt(id));

      // Remove from local state
      setState(prev => ({
        ...prev,
        orders: prev.orders.filter(order => order.id !== id),
        total: prev.total - 1,
      }));

      toast.success('Заказ удален');

    } catch (error) {
      const errorMessage = handleAPIError(error as Error);
      toast.error('Ошибка удаления заказа', {
        description: errorMessage,
      });
      throw error;
    }
  }, []);

  /**
   * Update order status
   */
  const updateStatus = useCallback(async (id: string, status: Order['status']) => {
    await updateOrder(id, { status });
  }, [updateOrder]);

  /**
   * Assign executor (simplified - would need user lookup)
   */
  const assignExecutor = useCallback(async (id: string, executorName: string | null) => {
    try {
      // This is simplified - in reality you'd need to lookup user ID by name
      const executorId = executorName ? 1 : null; // Placeholder

      await ordersAPI.assignExecutor(parseInt(id), executorId);

      // Update local state
      setState(prev => ({
        ...prev,
        orders: prev.orders.map(order =>
          order.id === id
            ? {
                ...order,
                executor: executorName ? { florist: executorName } : undefined
              }
            : order
        ),
      }));

      toast.success(executorName ? 'Исполнитель назначен' : 'Исполнитель убран');

    } catch (error) {
      const errorMessage = handleAPIError(error as Error);
      toast.error('Ошибка назначения исполнителя', {
        description: errorMessage,
      });
      throw error;
    }
  }, []);

  /**
   * Pagination controls
   */
  const setPage = useCallback((page: number) => {
    setState(prev => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState(prev => ({ ...prev, pageSize, page: 1 }));
  }, []);

  /**
   * Refresh orders (alias for loadOrders)
   */
  const refreshOrders = useCallback(() => loadOrders(), [loadOrders]);

  // Load orders when page or pageSize changes
  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  return {
    ...state,
    loadOrders,
    updateOrder,
    createOrder,
    deleteOrder,
    updateStatus,
    assignExecutor,
    setPage,
    setPageSize,
    refreshOrders,
  };
}