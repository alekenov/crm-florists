// Hook for Orders API integration
import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ApiOrder,
  OrderStatus,
  OrdersQueryParams,
  CreateOrderRequest,
  UpdateOrderRequest
} from '../types/api';
import { Order } from '../types';
import { apiClient, APIError } from '../api/client';
import { adaptBackendOrdersToOrders } from '../adapters/dataAdapters';

interface UseOrdersResult {
  orders: Order[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createOrder: (data: CreateOrderRequest) => Promise<Order>;
  updateOrder: (id: number, data: UpdateOrderRequest) => Promise<Order>;
  updateOrderStatus: (id: number, status: OrderStatus) => Promise<Order>;
  deleteOrder: (id: number) => Promise<void>;
  assignFlorist: (orderId: number, floristId: number | null) => Promise<Order>;
  assignCourier: (orderId: number, courierId: number | null) => Promise<Order>;
}

export function useOrders(params?: OrdersQueryParams): UseOrdersResult {
  const [rawOrders, setRawOrders] = useState<ApiOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert raw API orders to frontend orders using useMemo to prevent infinite rerenders
  const orders = useMemo(() => adaptBackendOrdersToOrders(rawOrders), [rawOrders]);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getOrders(params);
      // Backend returns orders directly as array, not wrapped in { items: [...] }
      const orders = Array.isArray(response) ? response : response.items || [];
      setRawOrders(orders);
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка загрузки заказов';
      setError(errorMessage);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [
    params?.client_id,
    params?.status,
    params?.executor_id,
    params?.date_from,
    params?.date_to,
    params?.skip,
    params?.limit
  ]);

  const createOrder = useCallback(async (data: CreateOrderRequest): Promise<Order> => {
    try {
      setError(null);
      const newOrder = await apiClient.createOrder(data);
      setRawOrders(prev => [newOrder, ...prev]);
      return adaptBackendOrdersToOrders([newOrder])[0];
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка создания заказа';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateOrder = useCallback(async (id: number, data: UpdateOrderRequest): Promise<Order> => {
    try {
      setError(null);
      const updatedOrder = await apiClient.updateOrder(id, data);
      setRawOrders(prev =>
        prev.map(order =>
          order.id === id ? updatedOrder : order
        )
      );
      return adaptBackendOrdersToOrders([updatedOrder])[0];
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка обновления заказа';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateOrderStatus = useCallback(async (id: number, status: OrderStatus): Promise<Order> => {
    try {
      setError(null);
      const updatedOrder = await apiClient.updateOrderStatus(id, status);
      setRawOrders(prev =>
        prev.map(order =>
          order.id === id ? updatedOrder : order
        )
      );
      return adaptBackendOrdersToOrders([updatedOrder])[0];
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
      setRawOrders(prev => prev.filter(order => order.id !== id));
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка удаления заказа';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const assignFlorist = useCallback(async (orderId: number, floristId: number | null): Promise<Order> => {
    try {
      setError(null);
      const updatedOrder = await apiClient.assignFlorist(orderId, floristId);
      setRawOrders(prev =>
        prev.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );
      return adaptBackendOrdersToOrders([updatedOrder])[0];
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка назначения флориста';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const assignCourier = useCallback(async (orderId: number, courierId: number | null): Promise<Order> => {
    try {
      setError(null);
      const updatedOrder = await apiClient.assignCourier(orderId, courierId);
      setRawOrders(prev =>
        prev.map(order =>
          order.id === orderId ? updatedOrder : order
        )
      );
      return adaptBackendOrdersToOrders([updatedOrder])[0];
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
  const [rawOrder, setRawOrder] = useState<ApiOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert raw API order to frontend order using useMemo to prevent infinite rerenders
  const order = useMemo(() => {
    if (!rawOrder) return null;
    console.log('🔄 Converting single raw order to frontend order:', rawOrder);
    const adaptedOrder = adaptBackendOrdersToOrders([rawOrder])[0];
    console.log('✅ Adapted single order:', adaptedOrder);
    console.log('📋 Main product:', adaptedOrder.mainProduct);
    return adaptedOrder;
  }, [rawOrder]);

  const fetchOrder = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching single order with id:', id);
      const orderData = await apiClient.getOrder(id);
      console.log('📥 Raw single order response:', orderData);
      console.log('📋 Order items:', orderData.order_items);
      setRawOrder(orderData);
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