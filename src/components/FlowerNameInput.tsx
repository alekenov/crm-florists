import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "./ui/input";
import { Check } from "lucide-react";
import { Inventory } from "../api/types";

// Fallback список популярных цветов на случай если API недоступен
const fallbackFlowers = [
  "Розы",
  "Тюльпаны",
  "Пионы",
  "Хризантемы",
  "Лилии",
  "Ирисы",
  "Гвоздики",
  "Фрезии",
  "Альстромерии",
  "Герберы",
  "Орхидеи",
  "Эустомы",
  "Каллы",
  "Левкои",
  "Зелень",
  "Эвкалипт",
  "Гипсофила",
  "Статица",
  "Ранункулюсы",
  "Астры"
];

interface FlowerOption {
  name: string;
  quantity?: number;
  price?: number;
  fromInventory?: boolean;
}

interface FlowerNameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  existingFlowers?: string[]; // цветки из текущих товаров
  inventory?: Inventory[]; // данные со склада
  loading?: boolean;
}

export function FlowerNameInput({
  value,
  onChange,
  placeholder = "Название цветка",
  className = "",
  existingFlowers = [],
  inventory = [],
  loading = false
}: FlowerNameInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<FlowerOption[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Преобразуем данные инвентаря в опции для выбора
  const allOptions = useMemo(() => {
    const options: FlowerOption[] = [];

    // Добавляем цветы из инвентаря с количеством и ценой
    if (inventory && inventory.length > 0) {
      inventory.forEach(item => {
        options.push({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          fromInventory: true
        });
      });
    }

    // Добавляем существующие цветы из товаров (если их нет в инвентаре)
    existingFlowers.forEach(flower => {
      if (!options.some(opt => opt.name.toLowerCase() === flower.toLowerCase())) {
        options.push({ name: flower, fromInventory: false });
      }
    });

    // Если инвентарь пустой, используем fallback список
    if (inventory.length === 0 && !loading) {
      fallbackFlowers.forEach(flower => {
        if (!options.some(opt => opt.name.toLowerCase() === flower.toLowerCase())) {
          options.push({ name: flower, fromInventory: false });
        }
      });
    }

    return options;
  }, [existingFlowers, inventory, loading]);

  useEffect(() => {
    if (value.trim()) {
      const filtered = allOptions.filter(option =>
        option.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(allOptions);
    }
  }, [value, allOptions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    setIsOpen(true);
  };

  const handleSelectOption = (optionName: string) => {
    onChange(optionName);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsOpen(true);
  };

  const handleInputBlur = (e: React.FocusEvent) => {
    // Задержка чтобы успел обработаться клик по опции
    setTimeout(() => {
      if (!dropdownRef.current?.contains(e.relatedTarget as Node)) {
        setIsOpen(false);
      }
    }, 150);
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        value={value}
        onChange={handleInputChange}
        onFocus={handleInputFocus}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className={className}
      />

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
        >
          {loading && (
            <div className="px-4 py-3 text-center text-gray-500">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary mx-auto"></div>
              <span className="text-xs mt-2 block">Загрузка цветов со склада...</span>
            </div>
          )}

          {!loading && !value.trim() && (
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-xs text-gray-500 font-medium">
                {inventory.length > 0 ? '📦 Цветы со склада' : '💡 Популярные варианты'}
              </span>
            </div>
          )}

          {!loading && filteredOptions.slice(0, 10).map((option, index) => {
            const isExisting = existingFlowers.includes(option.name);

            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectOption(option.name)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group touch-manipulation"
              >
                <div className="flex-1">
                  <span className="text-gray-900">{option.name}</span>
                  {option.fromInventory && (
                    <div className="flex items-center gap-3 mt-1">
                      {option.quantity !== undefined && (
                        <span className="text-xs text-gray-500">
                          На складе: {option.quantity} шт
                        </span>
                      )}
                      {option.price !== undefined && (
                        <span className="text-xs text-gray-500">
                          Цена: {option.price} ₸
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {value.toLowerCase() === option.name.toLowerCase() && (
                    <Check className="w-4 h-4 text-purple-600" />
                  )}
                  {isExisting && value.toLowerCase() !== option.name.toLowerCase() && (
                    <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                      Уже в составе
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Опция для добавления нового названия */}
          {!loading && value.trim() && !allOptions.some(opt => opt.name.toLowerCase() === value.toLowerCase()) && (
            <button
              type="button"
              onClick={() => handleSelectOption(value)}
              className="w-full px-4 py-3 text-left bg-purple-50 hover:bg-purple-100 transition-colors border-t border-purple-100 touch-manipulation"
            >
              <span className="text-purple-700 font-medium">+ Добавить "{value}"</span>
              <span className="text-xs text-purple-600 block mt-1">Новое название цветка</span>
            </button>
          )}

          {!loading && filteredOptions.length === 0 && value.trim() && (
            <div className="px-4 py-3 text-gray-500 text-center">
              <p className="text-sm">Не найдено подходящих вариантов</p>
              <button
                type="button"
                onClick={() => handleSelectOption(value)}
                className="text-purple-600 hover:text-purple-700 font-medium mt-2 text-sm"
              >
                + Добавить "{value}" как новый цветок
              </button>
            </div>
          )}

          {!loading && filteredOptions.length === 0 && !value.trim() && (
            <div className="px-4 py-8 text-center text-gray-400">
              <p className="text-sm">Начните вводить название цветка</p>
              <p className="text-xs mt-1">
                {inventory.length > 0 ? 'или выберите из цветов на складе' : 'или выберите из популярных вариантов'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}