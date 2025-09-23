import { useState, useEffect, useCallback } from 'react';
import { ApiOrder } from '../types/api';
import { Order } from '../src/types';
import { apiClient } from '../api/client';
import { adaptBackendOrdersToOrders } from '../adapters/dataAdapters';

interface UseApiOrderDetailState {
  order: Order | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOrderDetailReturn extends UseApiOrderDetailState {
  refetch: () => Promise<void>;
}

export function useApiOrderDetail(orderId: string | number | null): UseApiOrderDetailReturn {
  const [state, setState] = useState<UseApiOrderDetailState>({
    order: null,
    loading: false,
    error: null
  });

  const fetchOrder = useCallback(async () => {
    if (!orderId) {
      setState({ order: null, loading: false, error: null });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const numericId = typeof orderId === 'string' ? parseInt(orderId) : orderId;
      const rawOrder = await apiClient.getOrder(numericId);

      // Adapt the raw order data to frontend format
      const adaptedOrder = adaptBackendOrdersToOrders([rawOrder])[0];

      setState({
        order: adaptedOrder,
        loading: false,
        error: null
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка загрузки заказа';
      setState({
        order: null,
        loading: false,
        error: errorMessage
      });
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return {
    ...state,
    refetch: fetchOrder
  };
}