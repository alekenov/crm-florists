import { useState, useEffect } from 'react';
import { inventoryService } from '../api/services';
import { Inventory } from '../api/types';

interface UseInventoryListResult {
  inventory: Inventory[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useInventoryList(): UseInventoryListResult {
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await inventoryService.getAll();
      setInventory(data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
      setError('Не удалось загрузить данные со склада');
      // Fallback to empty array instead of crashing
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  return {
    inventory,
    loading,
    error,
    refetch: fetchInventory
  };
}