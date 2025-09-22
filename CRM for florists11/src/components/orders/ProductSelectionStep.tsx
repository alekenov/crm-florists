import { Check } from "lucide-react";

interface Product {
  id: number;
  image: string;
  images?: string[];
  title: string;
  price: string;
  isAvailable: boolean;
  createdAt: Date;
  type: 'vitrina' | 'catalog';
  composition?: Array<{ name: string; count: string }>;
}

interface ProductSelectionStepProps {
  products: Product[];
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
}

export function ProductSelectionStep({ 
  products, 
  selectedProduct, 
  onSelectProduct 
}: ProductSelectionStepProps) {
  const availableProducts = products.filter(p => p.isAvailable);

  return (
    <div className="px-3">
      <div className="py-4">
        <h2>Выберите товар</h2>
        <p className="text-gray-600 mb-4">Выберите товар для заказа из доступных в каталоге</p>
      </div>

      <div className="space-y-0">
        {availableProducts.map((product) => (
          <div 
            key={product.id}
            className={`p-3 border-b border-gray-200 cursor-pointer transition-colors ${
              selectedProduct?.id === product.id 
                ? 'bg-purple-50 border-purple-200' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onSelectProduct(product)}
          >
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 bg-cover bg-center rounded-full flex-shrink-0"
                style={{ backgroundImage: `url('${product.images?.[0] || product.image}')` }}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-900">{product.title}</span>
                  <div className="px-2 py-0.5 rounded-full uppercase tracking-wide bg-white border border-emerald-500 text-emerald-500">
                    {product.type === 'vitrina' ? 'Витрина' : 'Каталог'}
                  </div>
                </div>
                <div className="text-gray-700">{product.price}</div>
                {product.composition && (
                  <div className="text-gray-600 mt-0.5">
                    {product.composition.slice(0, 2).map(item => item.name).join(', ')}
                    {product.composition.length > 2 && '...'}
                  </div>
                )}
              </div>
              {selectedProduct?.id === product.id && (
                <div className="w-5 h-5 rounded-full bg-purple-600 flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {availableProducts.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-gray-500 mb-1">Нет доступных товаров</div>
          <div className="text-gray-400">
            Добавьте товары в каталог и активируйте их
          </div>
        </div>
      )}
    </div>
  );
}