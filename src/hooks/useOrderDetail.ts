// React hook for single order detail with real API integration
import { useState, useEffect, useCallback } from 'react';
import { Order } from '../src/types';
import { ordersAPI, handleAPIError } from '../services/api-client';
import { DataAdapters } from '../adapters/data-adapters';
import { toast } from 'sonner@2.0.3';

export interface UseOrderDetailState {
  order: Order | null;
  loading: boolean;
  error: string | null;
  isEditing: boolean;
  editData: Partial<Order>;
}

export interface UseOrderDetailActions {
  loadOrder: () => Promise<void>;
  updateOrder: (updates: Partial<Order>) => Promise<void>;
  startEditing: () => void;
  cancelEditing: () => void;
  saveChanges: () => Promise<void>;
  updateEditData: (updates: Partial<Order>) => void;
  updateStatus: (status: Order['status']) => Promise<void>;
  assignExecutor: (executorName: string | null) => Promise<void>;
  addComment: (comment: string) => Promise<void>;
  refreshOrder: () => Promise<void>;
}

export interface UseOrderDetailReturn extends UseOrderDetailState, UseOrderDetailActions {}

/**
 * Hook for managing single order detail with editing capabilities
 */
export function useOrderDetail(orderId: string): UseOrderDetailReturn {
  const [state, setState] = useState<UseOrderDetailState>({
    order: null,
    loading: false,
    error: null,
    isEditing: false,
    editData: {},
  });

  /**
   * Load order from API
   */
  const loadOrder = useCallback(async () => {
    if (!orderId) return;

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const sqlOrder = await ordersAPI.getOrder(parseInt(orderId));
      const reactOrder = DataAdapters.sqlOrderToReactOrder(sqlOrder);

      setState(prev => ({
        ...prev,
        order: reactOrder,
        loading: false,
        editData: {
          deliveryAddress: reactOrder.deliveryAddress,
          deliveryDate: reactOrder.deliveryDate,
          deliveryTime: reactOrder.deliveryTime,
          comment: reactOrder.comment,
        },
      }));

    } catch (error) {
      const errorMessage = handleAPIError(error as Error);
      setState(prev => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));

      toast.error('Ошибка загрузки заказа', {
        description: errorMessage,
      });
    }
  }, [orderId]);

  /**
   * Update order
   */
  const updateOrder = useCallback(async (updates: Partial<Order>) => {
    if (!state.order) return;

    setState(prev => ({ ...prev, loading: true }));

    try {
      // Convert React updates to SQL format
      const sqlUpdates = DataAdapters.reactOrderToSQLUpdate(updates);

      // Make API call
      const updatedSQLOrder = await ordersAPI.updateOrder(parseInt(orderId), sqlUpdates);

      // Convert back to React format
      const updatedReactOrder = DataAdapters.sqlOrderToReactOrder(updatedSQLOrder);

      setState(prev => ({
        ...prev,
        order: updatedReactOrder,
        loading: false,
        isEditing: false,
      }));

      toast.success('Заказ обновлен');

    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      const errorMessage = handleAPIError(error as Error);
      toast.error('Ошибка обновления заказа', {
        description: errorMessage,
      });
      throw error;
    }
  }, [orderId, state.order]);

  /**
   * Start editing mode
   */
  const startEditing = useCallback(() => {
    if (!state.order) return;

    setState(prev => ({
      ...prev,
      isEditing: true,
      editData: {
        deliveryAddress: state.order!.deliveryAddress,
        deliveryDate: state.order!.deliveryDate,
        deliveryTime: state.order!.deliveryTime,
        comment: state.order!.comment,
      },
    }));
  }, [state.order]);

  /**
   * Cancel editing mode
   */
  const cancelEditing = useCallback(() => {
    setState(prev => ({
      ...prev,
      isEditing: false,
      editData: prev.order ? {
        deliveryAddress: prev.order.deliveryAddress,
        deliveryDate: prev.order.deliveryDate,
        deliveryTime: prev.order.deliveryTime,
        comment: prev.order.comment,
      } : {},
    }));
  }, []);

  /**
   * Save editing changes
   */
  const saveChanges = useCallback(async () => {
    // Basic validation
    if (state.editData.deliveryAddress && state.editData.deliveryAddress.trim().length < 5) {
      toast.error('Адрес доставки должен содержать минимум 5 символов');
      return;
    }

    await updateOrder(state.editData);
  }, [state.editData, updateOrder]);

  /**
   * Update edit data
   */
  const updateEditData = useCallback((updates: Partial<Order>) => {
    setState(prev => ({
      ...prev,
      editData: { ...prev.editData, ...updates },
    }));
  }, []);

  /**
   * Update order status
   */
  const updateStatus = useCallback(async (status: Order['status']) => {
    if (!state.order) return;

    // Validate status transitions (same logic as original)
    const validTransitions: Record<Order['status'], Order['status'][]> = {
      'new': ['paid'],
      'paid': ['accepted'],
      'accepted': ['assembled'],
      'assembled': ['in-transit'],
      'in-transit': ['completed'],
      'completed': [],
    };

    if (!validTransitions[state.order.status].includes(status)) {
      toast.error(`Невозможно изменить статус с "${state.order.status}" на "${status}"`);
      return;
    }

    await updateOrder({ status });
    toast.success(`Статус изменен на "${status}"`);
  }, [state.order, updateOrder]);

  /**
   * Assign executor
   */
  const assignExecutor = useCallback(async (executorName: string | null) => {
    try {
      // This is simplified - in reality you'd need to lookup user ID by name
      const executorId = executorName ? 1 : null; // Placeholder

      await ordersAPI.assignExecutor(parseInt(orderId), executorId);

      setState(prev => ({
        ...prev,
        order: prev.order ? {
          ...prev.order,
          executor: executorName ? { florist: executorName } : undefined
        } : null,
      }));

      const message = executorName
        ? `Исполнитель назначен: ${executorName}`
        : 'Исполнитель убран';
      toast.success(message);

    } catch (error) {
      const errorMessage = handleAPIError(error as Error);
      toast.error('Ошибка назначения исполнителя', {
        description: errorMessage,
      });
      throw error;
    }
  }, [orderId]);

  /**
   * Add comment to order
   */
  const addComment = useCallback(async (comment: string) => {
    if (!state.order) return;

    try {
      await ordersAPI.addComment(parseInt(orderId), comment);

      // Update local state with new comment
      const updatedOrder = {
        ...state.order,
        comment: state.order.comment ? `${state.order.comment}\n${comment}` : comment,
        updatedAt: new Date(),
      };

      setState(prev => ({ ...prev, order: updatedOrder }));
      toast.success('Комментарий добавлен');

    } catch (error) {
      const errorMessage = handleAPIError(error as Error);
      toast.error('Ошибка добавления комментария', {
        description: errorMessage,
      });
      throw error;
    }
  }, [orderId, state.order]);

  /**
   * Refresh order (alias for loadOrder)
   */
  const refreshOrder = useCallback(() => loadOrder(), [loadOrder]);

  // Load order when orderId changes
  useEffect(() => {
    if (orderId) {
      loadOrder();
    }
  }, [orderId, loadOrder]);

  return {
    ...state,
    loadOrder,
    updateOrder,
    startEditing,
    cancelEditing,
    saveChanges,
    updateEditData,
    updateStatus,
    assignExecutor,
    addComment,
    refreshOrder,
  };
}