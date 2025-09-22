import { useState, useRef, useEffect, useMemo } from "react";
import { Input } from "./ui/input";
import { Check } from "lucide-react";

// Популярные названия цветков для автокомплита
const popularFlowers = [
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

interface FlowerNameInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  existingFlowers?: string[]; // цветки из текущих товаров
}

export function FlowerNameInput({ 
  value, 
  onChange, 
  placeholder = "Название цветка",
  className = "",
  existingFlowers = []
}: FlowerNameInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Комбинируем популярные цветы с существующими, убираем дубликаты
  // Ставим существующие цветки в начало для приоритета  
  const allOptions = useMemo(() => 
    [...new Set([...existingFlowers, ...popularFlowers])], 
    [existingFlowers]
  );

  useEffect(() => {
    if (value.trim()) {
      const filtered = allOptions.filter(flower =>
        flower.toLowerCase().includes(value.toLowerCase())
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

  const handleSelectOption = (option: string) => {
    onChange(option);
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
          {!value.trim() && (
            <div className="px-4 py-2 bg-gray-50 border-b border-gray-100">
              <span className="text-xs text-gray-500 font-medium">💡 Популярные варианты</span>
            </div>
          )}
          
          {filteredOptions.slice(0, 10).map((option, index) => {
            const isExisting = existingFlowers.includes(option);
            
            return (
              <button
                key={index}
                type="button"
                onClick={() => handleSelectOption(option)}
                className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-center justify-between group touch-manipulation"
              >
                <span className="text-gray-900">{option}</span>
                <div className="flex items-center space-x-2">
                  {value.toLowerCase() === option.toLowerCase() && (
                    <Check className="w-4 h-4 text-purple-600" />
                  )}
                  {isExisting && value.toLowerCase() !== option.toLowerCase() && (
                    <span className="text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-full">
                      Уже в составе
                    </span>
                  )}
                </div>
              </button>
            );
          })}
          
          {/* Опция для добавления нового названия */}
          {value.trim() && !allOptions.some(opt => opt.toLowerCase() === value.toLowerCase()) && (
            <button
              type="button"
              onClick={() => handleSelectOption(value)}
              className="w-full px-4 py-3 text-left bg-purple-50 hover:bg-purple-100 transition-colors border-t border-purple-100 touch-manipulation"
            >
              <span className="text-purple-700 font-medium">+ Добавить "{value}"</span>
              <span className="text-xs text-purple-600 block mt-1">Новое название цветка</span>
            </button>
          )}

          {filteredOptions.length === 0 && value.trim() && (
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
          
          {filteredOptions.length === 0 && !value.trim() && (
            <div className="px-4 py-8 text-center text-gray-400">
              <p className="text-sm">Начните вводить название цветка</p>
              <p className="text-xs mt-1">или выберите из популярных вариантов</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}