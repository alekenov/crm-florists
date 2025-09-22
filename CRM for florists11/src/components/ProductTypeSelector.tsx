import { Button } from "./ui/button";
import { X, Store, Package } from "lucide-react";

interface ProductTypeSelectorProps {
  onClose: () => void;
  onSelectVitrina: () => void;
  onSelectCatalog: () => void;
}

export function ProductTypeSelector({ onClose, onSelectVitrina, onSelectCatalog }: ProductTypeSelectorProps) {
  return (
    <div className="bg-gray-50 min-h-screen lg:bg-white">
      <div className="max-w-md mx-auto bg-white min-h-screen lg:max-w-none lg:mx-0 lg:bg-transparent">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
          <h1 className="text-gray-900">Выберите тип товара</h1>
          <button 
            className="p-2 hover:bg-gray-100 rounded" 
            onClick={onClose}
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Выберите тип товара</h1>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 lg:p-8 lg:max-w-2xl lg:mx-auto">
          {/* Vitrina Option */}
          <button
            onClick={onSelectVitrina}
            className="w-full p-4 bg-white border border-gray-200 rounded hover:border-gray-300 transition-colors text-left lg:p-6 lg:rounded-lg lg:shadow-sm lg:hover:shadow-md"
          >
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 lg:w-12 lg:h-12">
                <Store className="w-5 h-5 text-gray-600 lg:w-6 lg:h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1 lg:text-lg lg:font-medium">Витрина</h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  Готовый товар с фотографией и ценой
                </p>
              </div>
            </div>
          </button>

          {/* Catalog Option */}
          <button
            onClick={onSelectCatalog}
            className="w-full p-4 bg-white border border-gray-200 rounded hover:border-gray-300 transition-colors text-left lg:p-6 lg:rounded-lg lg:shadow-sm lg:hover:shadow-md"
          >
            <div className="flex items-start gap-3 lg:gap-4">
              <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 lg:w-12 lg:h-12">
                <Package className="w-5 h-5 text-gray-600 lg:w-6 lg:h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-gray-900 mb-1 lg:text-lg lg:font-medium">Каталог</h3>
                <p className="text-gray-600 text-sm lg:text-base">
                  Подробное описание с характеристиками
                </p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}