// Hook for Orders API integration
import { useState, useEffect, useCallback } from 'react';
import {
  ApiOrder,
  OrderStatus,
  OrdersQueryParams,
  CreateOrderRequest,
  UpdateOrderRequest
} from '../types/api';
import { apiClient, APIError } from '../api/client';

interface UseOrdersResult {
  orders: ApiOrder[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createOrder: (data: CreateOrderRequest) => Promise<ApiOrder>;
  updateOrder: (id: number, data: UpdateOrderRequest) => Promise<ApiOrder>;
  updateOrderStatus: (id: number, status: OrderStatus) => Promise<ApiOrder>;
  deleteOrder: (id: number) => Promise<void>;
  assignFlorist: (orderId: number, floristId: number | null) => Promise<ApiOrder>;
  assignCourier: (orderId: number, courierId: number | null) => Promise<ApiOrder>;
}

export function useOrders(params?: OrdersQueryParams): UseOrdersResult {
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getOrders(params);
      setOrders(response.orders);
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка загрузки заказов';
      setError(errorMessage);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createOrder = useCallback(async (data: CreateOrderRequest): Promise<ApiOrder> => {
    try {
      setError(null);
      const newOrder = await apiClient.createOrder(data);
      setOrders(prev => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка создания заказа';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateOrder = useCallback(async (id: number, data: UpdateOrderRequest): Promise<ApiOrder> => {
    try {
      setError(null);
      const updatedOrder = await apiClient.updateOrder(id, data);
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? updatedOrder : order
        )
      );
      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка обновления заказа';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: number, status: OrderStatus): Promise<ApiOrder> => {
    try {
      setError(null);
      const updatedOrder = await apiClient.updateOrderStatus(id, status);
      setOrders(prev =>
        prev.map(order =>
          order.id === id ? updatedOrder : order
        )
      );
      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка обновления статуса заказа';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const deleteOrder = useCallback(async (id: number): Promise<void> => {
    try {
      setError(null);
      await apiClient.deleteOrder(id);
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка удаления заказа';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const assignFlorist = useCallback(async (orderId: number, floristId: number | null): Promise<ApiOrder> => {
    try {
      setError(null);
      const updatedOrder = await apiClient.assignFlorist(orderId, floristId);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );
      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка назначения флориста';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const assignCourier = useCallback(async (orderId: number, courierId: number | null): Promise<ApiOrder> => {
    try {
      setError(null);
      const updatedOrder = await apiClient.assignCourier(orderId, courierId);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );
      return updatedOrder;
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка назначения курьера';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return {
    orders,
    loading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
    assignFlorist,
    assignCourier,
  };
}

// Hook for single order
export function useOrder(id: number) {
  const [order, setOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const orderData = await apiClient.getOrder(id);
      setOrder(orderData);
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка загрузки заказа';
      setError(errorMessage);
      console.error('Error fetching order:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    order,
    loading,
    error,
    refetch: fetchOrder,
  };
}