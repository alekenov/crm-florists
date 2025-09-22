// Hook for Inventory API integration  
import { useState, useEffect, useCallback } from 'react';
import { 
  ApiInventoryItem, 
  InventoryQueryParams,
  CreateInventoryRequest 
} from '../types/api';
import { apiClient, APIError } from '../api/client';

interface UseInventoryResult {
  inventory: ApiInventoryItem[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createInventoryItem: (data: CreateInventoryRequest) => Promise<ApiInventoryItem>;
  getLowStockItems: () => Promise<ApiInventoryItem[]>;
}

export function useInventory(params?: InventoryQueryParams): UseInventoryResult {
  const [inventory, setInventory] = useState<ApiInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getInventory(params);
      setInventory(response.inventory);
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Ошибка загрузки инвентаря';
      setError(errorMessage);
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createInventoryItem = useCallback(async (data: CreateInventoryRequest): Promise<ApiInventoryItem> => {
    try {
      setError(null);
      const newItem = await apiClient.createInventoryItem(data);
      setInventory(prev => [newItem, ...prev]);
      return newItem;
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Ошибка создания позиции инвентаря';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const getLowStockItems = useCallback(async (): Promise<ApiInventoryItem[]> => {
    try {
      setError(null);
      const response = await apiClient.getLowStockItems();
      return response.inventory;
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Ошибка загрузки позиций с низким остатком';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchInventory();
  }, [fetchInventory]);

  return {
    inventory,
    loading,
    error,
    refetch: fetchInventory,
    createInventoryItem,
    getLowStockItems,
  };
}

// Hook for single inventory item
export function useInventoryItem(id: number) {
  const [item, setItem] = useState<ApiInventoryItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItem = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const itemData = await apiClient.getInventoryItem(id);
      setItem(itemData);
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Ошибка загрузки позиции инвентаря';
      setError(errorMessage);
      console.error('Error fetching inventory item:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchItem();
  }, [fetchItem]);

  return {
    item,
    loading,
    error,
    refetch: fetchItem,
  };
}