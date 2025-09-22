import { Input } from "../ui/input";

interface BasicInfoSectionProps {
  title: string;
  price: string;
  duration: string;
  discount: string;
  onTitleChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  onDurationChange: (value: string) => void;
  onDiscountChange: (value: string) => void;
}

export function BasicInfoSection({
  title,
  price,
  duration,
  discount,
  onTitleChange,
  onPriceChange,
  onDurationChange,
  onDiscountChange
}: BasicInfoSectionProps) {
  return (
    <div className="space-y-6">
      {/* Название товара */}
      <div>
        <label className="hidden lg:block text-gray-700 mb-2">
          Название товара
        </label>
        <Input 
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Название товара"
          className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
        />
      </div>

      {/* Стоимость и скидка */}
      <div className="space-y-4 lg:space-y-4">
        <div className="flex space-x-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-x-0">
          <div className="flex-1">
            <label className="hidden lg:block text-gray-700 mb-2">
              Стоимость
            </label>
            <Input 
              value={price}
              onChange={(e) => onPriceChange(e.target.value)}
              placeholder="Стоимость, ₸"
              className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
            />
          </div>
          <div className="w-32 lg:w-full">
            <label className="hidden lg:block text-gray-700 mb-2">
              Скидка
            </label>
            <div className="flex items-end space-x-2 lg:space-x-0">
              <Input 
                value={discount}
                onChange={(e) => onDiscountChange(e.target.value)}
                placeholder="Скидка, %"
                className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Время изготовления */}
      <div>
        <label className="hidden lg:block text-gray-700 mb-2">
          Время изготовления
        </label>
        <div className="flex items-end space-x-3 lg:space-x-2">
          <Input 
            value={duration}
            onChange={(e) => onDurationChange(e.target.value)}
            placeholder="Время изготовления"
            className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
          />
          <span className="text-gray-900 pb-3 min-w-[40px] lg:pb-0 lg:text-gray-600">
            мин
          </span>
        </div>
      </div>
    </div>
  );
}