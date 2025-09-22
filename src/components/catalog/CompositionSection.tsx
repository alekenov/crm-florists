import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Plus, X } from "lucide-react";
import { FlowerNameInput } from "../FlowerNameInput";

interface CompositionSectionProps {
  composition: Array<{ name: string; count: string }>;
  newFlowerName: string;
  newFlowerCount: string;
  onCompositionChange: (composition: Array<{ name: string; count: string }>) => void;
  onNewFlowerNameChange: (value: string) => void;
  onNewFlowerCountChange: (value: string) => void;
  onAddFlower: () => void;
}

export function CompositionSection({
  composition,
  newFlowerName,
  newFlowerCount,
  onCompositionChange,
  onNewFlowerNameChange,
  onNewFlowerCountChange,
  onAddFlower
}: CompositionSectionProps) {
  const handleRemoveFlower = (index: number) => {
    onCompositionChange(composition.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6 lg:col-span-1">
      <div>
        <h3 className="text-gray-900 mb-4 lg:text-gray-900">Состав букета</h3>
        
        {/* Existing composition */}
        {composition.length > 0 && (
          <div className="space-y-3 mb-4">
            {composition.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg lg:p-2">
                <div className="flex-1">
                  <span className="text-gray-900 lg:text-gray-900">{item.name}</span>
                  <span className="text-gray-500 ml-2 lg:text-gray-500">
                    — {item.count} шт
                  </span>
                </div>
                <button
                  onClick={() => handleRemoveFlower(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors lg:p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex space-x-4 mb-4 lg:grid lg:grid-cols-3 lg:gap-2 lg:space-x-0">
          <div className="flex-1 lg:col-span-2">
            <FlowerNameInput
              value={newFlowerName}
              onChange={onNewFlowerNameChange}
              placeholder="Название цветка"
              className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
              existingFlowers={composition.map(item => item.name)}
            />
          </div>
          <div className="w-20 lg:w-full lg:col-span-1">
            <Input 
              value={newFlowerCount}
              onChange={(e) => onNewFlowerCountChange(e.target.value)}
              placeholder="Кол-во"
              className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
            />
          </div>
        </div>
        <Button 
          onClick={onAddFlower}
          variant="outline" 
          className="w-full h-12 text-gray-900 border-gray-200 lg:h-10"
        >
          <Plus className="w-5 h-5 mr-2 lg:w-4 lg:h-4" />
          Добавить цветок
        </Button>
      </div>
    </div>
  );
}