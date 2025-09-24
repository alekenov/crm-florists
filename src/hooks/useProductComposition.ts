import { useState, useEffect } from 'react';
import { productComposition } from '../api/services';
import { inventory } from '../api/services';
import { Inventory } from '../api/types';

export interface ProductCompositionItem {
  id: number;
  product_id: number;
  inventory_id: number;
  quantity_needed: number;
  inventory: {
    id: number;
    name: string;
    unit: string;
    price_per_unit: number;
    quantity: number;
  } | null;
}

export function useProductComposition(productId?: number) {
  const [composition, setComposition] = useState<ProductCompositionItem[]>([]);
  const [availableInventory, setAvailableInventory] = useState<Inventory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load composition and available inventory
  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load both composition and inventory in parallel
        const [compositionData, inventoryData] = await Promise.all([
          productComposition.getComposition(productId),
          inventory.getAll({ limit: 1000 })
        ]);

        setComposition(compositionData || []);
        setAvailableInventory(inventoryData || []);
      } catch (err) {
        console.error('Error loading product composition:', err);
        setError('Ошибка загрузки состава товара');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [productId]);

  // Add item to composition
  const addComposition = async (inventoryId: number, quantityNeeded: number) => {
    if (!productId) return;

    try {
      setError(null);
      const newItem = await productComposition.addComposition(productId, inventoryId, quantityNeeded);

      // Reload composition to get updated data
      const updatedComposition = await productComposition.getComposition(productId);
      setComposition(updatedComposition || []);
    } catch (err) {
      console.error('Error adding composition item:', err);
      setError('Ошибка добавления компонента');
      throw err;
    }
  };

  // Update composition item quantity
  const updateComposition = async (compositionId: number, quantityNeeded: number) => {
    if (!productId) return;

    try {
      setError(null);
      await productComposition.updateComposition(productId, compositionId, quantityNeeded);

      // Reload composition
      const updatedComposition = await productComposition.getComposition(productId);
      setComposition(updatedComposition || []);
    } catch (err) {
      console.error('Error updating composition item:', err);
      setError('Ошибка обновления компонента');
      throw err;
    }
  };

  // Remove item from composition
  const removeComposition = async (compositionId: number) => {
    if (!productId) return;

    try {
      setError(null);
      await productComposition.deleteComposition(productId, compositionId);

      // Remove from local state
      setComposition(prev => prev.filter(item => item.id !== compositionId));
    } catch (err) {
      console.error('Error removing composition item:', err);
      setError('Ошибка удаления компонента');
      throw err;
    }
  };

  // Calculate total cost of composition
  const totalCost = composition.reduce((sum, item) => {
    if (item.inventory?.price_per_unit) {
      return sum + (item.inventory.price_per_unit * item.quantity_needed);
    }
    return sum;
  }, 0);

  return {
    composition,
    availableInventory,
    loading,
    error,
    addComposition,
    updateComposition,
    removeComposition,
    totalCost
  };
}