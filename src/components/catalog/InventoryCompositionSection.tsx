import React, { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, X, Calculator } from "lucide-react";
import { useProductComposition, ProductCompositionItem } from '../../hooks/useProductComposition';
import { Inventory } from '../../api/types';

interface InventoryCompositionSectionProps {
  productId?: number;
}

export function InventoryCompositionSection({ productId }: InventoryCompositionSectionProps) {
  const {
    composition,
    availableInventory,
    loading,
    error,
    addComposition,
    removeComposition,
    totalCost
  } = useProductComposition(productId);

  const [selectedInventoryId, setSelectedInventoryId] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<string>('');

  const handleAddItem = async () => {
    if (!selectedInventoryId || !quantity || parseFloat(quantity) <= 0) {
      return;
    }

    try {
      await addComposition(selectedInventoryId, parseFloat(quantity));
      setSelectedInventoryId(null);
      setQuantity('');
    } catch (err) {
      console.error('Error adding composition item:', err);
    }
  };

  const handleRemoveItem = async (compositionId: number) => {
    try {
      await removeComposition(compositionId);
    } catch (err) {
      console.error('Error removing composition item:', err);
    }
  };

  const getSelectedInventory = () => {
    return availableInventory.find(inv => inv.id === selectedInventoryId);
  };

  if (!productId) {
    return (
      <div className="space-y-6 lg:col-span-1">
        <div className="text-gray-500 text-center py-8">
          Сохраните товар, чтобы добавить состав
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6 lg:col-span-1">
        <div className="text-gray-500 text-center py-8">
          Загрузка состава...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:col-span-1">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-gray-900 lg:text-gray-900">Состав букета</h3>
          {totalCost > 0 && (
            <div className="flex items-center gap-1 text-sm text-gray-600 bg-green-50 px-2 py-1 rounded">
              <Calculator className="w-4 h-4" />
              {Math.round(totalCost)}₸
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        {/* Existing composition */}
        {composition.length > 0 && (
          <div className="space-y-3 mb-4">
            {composition.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg lg:p-2">
                <div className="flex-1">
                  <span className="text-gray-900 lg:text-gray-900">
                    {item.inventory?.name || 'Неизвестный материал'}
                  </span>
                  <div className="text-gray-500 text-sm">
                    {item.quantity_needed} {item.inventory?.unit}
                    {item.inventory?.price_per_unit && (
                      <span className="ml-2">
                        • {Math.round(item.inventory.price_per_unit * item.quantity_needed)}₸
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400">
                    Остаток: {item.inventory?.quantity} {item.inventory?.unit}
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors lg:p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add new composition item */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Материал со склада
              </label>
              <select
                value={selectedInventoryId || ''}
                onChange={(e) => setSelectedInventoryId(e.target.value ? parseInt(e.target.value) : null)}
                className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Выберите материал</option>
                {availableInventory
                  .filter(inv => !composition.some(comp => comp.inventory_id === inv.id))
                  .map((inv) => (
                    <option key={inv.id} value={inv.id}>
                      {inv.name} ({inv.quantity} {inv.unit})
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Количество{getSelectedInventory()?.unit && ` (${getSelectedInventory()?.unit})`}
              </label>
              <Input
                type="number"
                step="0.1"
                min="0"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Кол-во"
                className="w-full"
              />
            </div>
          </div>

          {selectedInventoryId && getSelectedInventory()?.price_per_unit && quantity && (
            <div className="text-sm text-gray-600 bg-blue-50 p-2 rounded">
              Стоимость: {Math.round(getSelectedInventory()!.price_per_unit! * parseFloat(quantity))}₸
            </div>
          )}

          <Button
            onClick={handleAddItem}
            disabled={!selectedInventoryId || !quantity || parseFloat(quantity) <= 0}
            variant="outline"
            className="w-full h-12 text-gray-900 border-gray-200 lg:h-10"
          >
            <Plus className="w-5 h-5 mr-2 lg:w-4 lg:h-4" />
            Добавить материал
          </Button>
        </div>

        {composition.length === 0 && (
          <div className="text-center text-gray-500 py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="text-sm">Состав не указан</div>
            <div className="text-xs text-gray-400 mt-1">
              Добавьте материалы со склада для расчёта себестоимости
            </div>
          </div>
        )}
      </div>
    </div>
  );
}