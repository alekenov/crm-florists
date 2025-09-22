import { useState, useEffect, useCallback } from 'react';
import { clients, products, inventory, orders } from '../api/services';
import {
  Client, Product, Inventory, Order
} from '../api/types';

type EntityType = 'order' | 'client' | 'product' | 'inventory';

interface UseDetailDataOptions {
  entityType: EntityType;
  id: string | number | null;
  enabled?: boolean; // Whether to fetch data automatically
}

interface UseDetailDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDetailData<T = any>(
  options: UseDetailDataOptions
): UseDetailDataResult<T> {
  const { entityType, id, enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!id || !enabled) {
      setData(null);
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let result: any;
      const numericId = typeof id === 'string' ? parseInt(id, 10) : id;

      switch (entityType) {
        case 'order':
          result = await orders.getById(numericId);
          break;
        case 'client':
          result = await clients.getById(numericId);
          break;
        case 'product':
          result = await products.getById(numericId);
          break;
        case 'inventory':
          result = await inventory.getById(numericId);
          break;
        default:
          throw new Error(`Unknown entity type: ${entityType}`);
      }

      setData(result as T);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Failed to fetch ${entityType}`;
      setError(errorMessage);
      console.error(`Error fetching ${entityType} ${id}:`, err);
    } finally {
      setLoading(false);
    }
  }, [entityType, id, enabled]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    data,
    loading,
    error,
    refetch: fetchData
  };
}

// Typed convenience hooks for each entity type
export function useOrderDetail(id: string | number | null, enabled = true) {
  return useDetailData<Order>({
    entityType: 'order',
    id,
    enabled
  });
}

export function useClientDetail(id: string | number | null, enabled = true) {
  return useDetailData<Client>({
    entityType: 'client',
    id,
    enabled
  });
}

export function useProductDetail(id: string | number | null, enabled = true) {
  return useDetailData<Product>({
    entityType: 'product',
    id,
    enabled
  });
}

export function useInventoryDetail(id: string | number | null, enabled = true) {
  return useDetailData<Inventory>({
    entityType: 'inventory',
    id,
    enabled
  });
}