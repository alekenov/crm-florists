import svgPaths from "../imports/svg-v3feqeu9gq";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  X,
  Camera,
  Video,
  ChevronDown,
  Plus,
  ChevronUp,
  Trash2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { ImageUploader } from "./ImageUploader";
import { FlowerNameInput } from "./FlowerNameInput";
import { ColorPicker } from "./common/ColorPicker";
import { useInventoryList } from "../hooks/useInventoryList";
import { useProductComposition } from "../hooks/useProductComposition";

interface Product {
  id: number;
  image: string; // главное изображение для обратной совместимости
  images?: string[]; // массив всех изображений
  title: string;
  price: string;
  isAvailable: boolean;
  createdAt: Date;
  type: "vitrina" | "catalog";
  // Витрина поля
  width?: string;
  height?: string;
  // Каталог поля
  video?: string;
  duration?: string;
  discount?: string;
  composition?: Array<{ name: string; count: string }>;
  colors?: string[];
  catalogWidth?: string;
  catalogHeight?: string;
  productionTime?: string;
}

interface EditCatalogFormProps {
  productId: number | null;
  products: Product[];
  onClose: () => void;
  onUpdateProduct: (id: number, data: Partial<Product>) => Promise<Product>;
}

function CameraIcon() {
  return (
    <svg
      className="w-10 h-10"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 28 23"
    >
      <path d={svgPaths.p19c7a800} fill="#C8C0D3" />
    </svg>
  );
}

function VideoIcon() {
  return (
    <svg
      className="w-8 h-8"
      fill="none"
      preserveAspectRatio="none"
      viewBox="0 0 28 23"
    >
      <g>
        <path d={svgPaths.p3b7dbb00} fill="#C8C0D3" />
        <path d={svgPaths.p22574980} fill="#C8C0D3" />
      </g>
    </svg>
  );
}

const bouquetColors = [
  { id: "pink", name: "Розовый", color: "#ec4899" },
  { id: "blue", name: "Синий", color: "#3b82f6" },
  { id: "red", name: "Красный", color: "#ef4444" },
  { id: "yellow", name: "Желтый", color: "#f59e0b" },
  { id: "green", name: "Зеленый", color: "#10b981" },
  { id: "purple", name: "Фиолетовый", color: "#8b5cf6" },
  { id: "white", name: "Белый", color: "#ffffff" },
  {
    id: "mix",
    name: "Микс",
    color:
      "linear-gradient(45deg, #ec4899 0%, #3b82f6 25%, #f59e0b 50%, #10b981 75%, #8b5cf6 100%)",
  },
];



export function EditCatalogForm({
  productId,
  products,
  onClose,
  onUpdateProduct,
}: EditCatalogFormProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [showCharacteristics, setShowCharacteristics] =
    useState(true);
  const [selectedColors, setSelectedColors] = useState<
    string[]
  >([]);
  const [selectedDuration, setSelectedDuration] =
    useState<string>("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [discount, setDiscount] = useState("");
  const [composition, setComposition] = useState<
    Array<{ name: string; count: string }>
  >([]);
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [newFlowerName, setNewFlowerName] = useState("");
  const [newFlowerCount, setNewFlowerCount] = useState("");
  const [images, setImages] = useState<string[]>([]);

  // Загружаем список цветов со склада
  const { inventory, loading: inventoryLoading, error: inventoryError } = useInventoryList();

  // Загружаем состав через новый API
  const { composition: apiComposition, loading: compositionLoading, addComposition, removeComposition } = useProductComposition(product?.id);

  useEffect(() => {
    if (productId) {
      const foundProduct = products.find(
        (p) => p.id === productId,
      );
      if (foundProduct) {
        setProduct(foundProduct);
        setTitle(foundProduct.name || foundProduct.title);  // Support both name and title
        setPrice(foundProduct.price.toString().replace(" ₸", ""));
        // Convert preparation_time to string if it's a number
        const prepTime = foundProduct.preparation_time || foundProduct.duration;
        setDuration(prepTime ? prepTime.toString() : "");  // Backend uses preparation_time
        setDiscount(foundProduct.discount || "");
        setComposition(foundProduct.composition || []);  // Загружаем старое поле состава
        setSelectedColors(foundProduct.colors || []);
        // Ensure width and height are strings
        setWidth(foundProduct.width ? foundProduct.width.toString() : "");
        setHeight(foundProduct.height ? foundProduct.height.toString() : "");
        setSelectedDuration(foundProduct.production_time || "");
        setImages(foundProduct.images || [foundProduct.image]);
      }
    }
  }, [productId, products]);

  // Объединяем API состав со старым составом
  useEffect(() => {
    if (apiComposition && apiComposition.length > 0) {
      const convertedFromApi = apiComposition.map(item => ({
        name: item.inventory?.name || 'Неизвестный материал',
        count: item.quantity_needed.toString()
      }));

      // Обновляем состав только если есть данные из API
      setComposition(prev => {
        // Сохраняем старые элементы которых нет в API
        const existingOldItems = prev.filter(oldItem =>
          !convertedFromApi.some(apiItem => apiItem.name === oldItem.name)
        );
        return [...convertedFromApi, ...existingOldItems];
      });
    }
  }, [apiComposition]);

  if (!product) {
    return null;
  }

  const handleColorChange = (colors: string[]) => {
    setSelectedColors(colors);
  };

  const handleAddFlower = async () => {
    if (newFlowerName.trim() && newFlowerCount.trim() && product?.id) {
      // Находим материал в inventory по имени (двусторонний поиск)
      const flowerName = newFlowerName.trim().toLowerCase();
      console.log('Searching for:', flowerName);
      console.log('Available inventory:', inventory.map(i => i.name));

      const foundInventoryItem = inventory.find(inv => {
        const invName = inv.name.toLowerCase();
        const firstWord = invName.split(' ')[0];

        // Проверяем разные варианты совпадения
        const exactMatch = invName.includes(flowerName) || flowerName.includes(invName);
        const firstWordMatch = firstWord.includes(flowerName) || flowerName.includes(firstWord);
        const rootMatch = firstWord.startsWith(flowerName) || flowerName.startsWith(firstWord);

        const matches = exactMatch || firstWordMatch || rootMatch;
        console.log(`Checking "${invName}" (first word: "${firstWord}") against "${flowerName}": ${matches}`);
        return matches;
      });

      console.log('Found inventory item:', foundInventoryItem);

      if (foundInventoryItem) {
        try {
          // Добавляем через API
          console.log('Adding composition:', foundInventoryItem.id, parseFloat(newFlowerCount.trim()));
          await addComposition(foundInventoryItem.id, parseFloat(newFlowerCount.trim()));
          setNewFlowerName("");
          setNewFlowerCount("");
        } catch (err) {
          console.error('Error adding flower:', err);
          // Если API не сработал, добавляем в локальное состояние как fallback
          setComposition((prev) => [
            ...prev,
            {
              name: newFlowerName.trim(),
              count: newFlowerCount.trim(),
            },
          ]);
          setNewFlowerName("");
          setNewFlowerCount("");
        }
      } else {
        // Если не нашли в inventory, добавляем как раньше
        setComposition((prev) => [
          ...prev,
          {
            name: newFlowerName.trim(),
            count: newFlowerCount.trim(),
          },
        ]);
        setNewFlowerName("");
        setNewFlowerCount("");
      }
    }
  };

  const handleRemoveFlower = async (index: number) => {
    const item = composition[index];

    // Попытаемся найти этот элемент в API composition и удалить через API
    const apiItem = apiComposition?.find(api => api.inventory?.name === item.name);

    if (apiItem && product?.id) {
      try {
        await removeComposition(apiItem.id);
      } catch (err) {
        console.error('Error removing flower:', err);
        // Если API не сработал, удаляем из локального состояния
        setComposition((prev) => prev.filter((_, i) => i !== index));
      }
    } else {
      // Удаляем из локального состояния
      setComposition((prev) => prev.filter((_, i) => i !== index));
    }
  };


  const handleSave = async () => {
    if (product) {
      const updateData = {
        name: title,  // Backend expects 'name', not 'title'
        price: parseFloat(price) || 0,
        preparation_time: duration ? parseFloat(duration) : undefined,  // Backend field name
        discount: discount ? parseFloat(discount) : undefined,
        composition: composition,  // Сохраняем состав для обратной совместимости
        colors: selectedColors,
        width,
        height,
        production_time: selectedDuration,  // Backend field name with underscore
        images: images,
        image_url: images[0] || product.image, // Backend expects 'image_url'
      };
      await onUpdateProduct(product.id, updateData);
      onClose();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen lg:bg-white">
      <div className="max-w-md mx-auto bg-white min-h-screen lg:max-w-none lg:mx-0 lg:bg-transparent">
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 lg:hidden">
          <h1 className="text-gray-900">
            Редактировать товар
          </h1>
          <button
            className="p-3 hover:bg-gray-100 rounded-full transition-colors touch-manipulation"
            onClick={onClose}
          >
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Редактировать товар каталога</h1>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Form Content */}
        <div className="space-y-6 lg:max-w-4xl lg:mx-auto lg:p-8 lg:space-y-8">
          {/* Media Section */}
          <div className="p-6 pb-4 lg:p-0">
            <div className="space-y-4 lg:space-y-6">
              <div className="lg:space-y-2">
                <label className="hidden lg:block text-base font-medium text-gray-700 mb-4">
                  Фотографии и видео
                </label>
                <ImageUploader 
                  images={images}
                  onImagesChange={setImages}
                  maxImages={8}
                />
              </div>
              <div className="bg-gray-50 rounded-lg h-16 flex items-center px-4 hover:bg-gray-100 transition-colors cursor-pointer touch-manipulation lg:h-12">
                <VideoIcon />
                <p className="text-gray-900 text-base ml-4 lg:text-sm">
                  Добавьте видео
                </p>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="px-6 space-y-6 lg:px-0 lg:grid lg:grid-cols-2 lg:gap-8 lg:space-y-0">
            <div className="space-y-6">
              {/* Название товара */}
              <div>
                <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">
                  Название товара
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Название товара"
                  className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
                />
              </div>

              {/* Стоимость и скидка */}
              <div className="space-y-4 lg:space-y-4">
                <div className="flex space-x-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-x-0">
                  <div className="flex-1">
                    <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">
                      Стоимость
                    </label>
                    <Input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="Стоимость, ₸"
                      className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
                    />
                  </div>
                  <div className="w-32 lg:w-full">
                    <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">
                      Скидка
                    </label>
                    <div className="flex items-end space-x-2 lg:space-x-0">
                      <Input
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                        placeholder="Скидка, %"
                        className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Время изготовления */}
              <div>
                <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">
                  Время изготовления
                </label>
                <div className="flex items-end space-x-3 lg:space-x-2">
                  <Input
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    placeholder="Время изготовления"
                    className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
                  />
                  <span className="text-gray-900 text-base pb-3 min-w-[40px] lg:pb-0 lg:text-sm lg:text-gray-600">
                    мин
                  </span>
                </div>
              </div>
            </div>

            {/* Bouquet Composition - в правой колонке на desktop */}
            <div className="space-y-6 lg:col-span-1">
              <div>
                <h3 className="text-gray-900 mb-4 lg:text-base lg:font-medium">Состав букета</h3>

                {/* Existing composition */}
                {composition.length > 0 && (
                  <div className="space-y-3 mb-4">
                    {composition.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg lg:p-2"
                      >
                        <div className="flex-1">
                          <span className="text-gray-900 lg:text-sm">
                            {item.name}
                          </span>
                          <span className="text-gray-500 ml-2 lg:text-sm">
                            — {item.count} шт
                          </span>
                        </div>
                        <button
                          onClick={() => handleRemoveFlower(index)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors touch-manipulation lg:p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex space-x-4 mb-4 lg:grid lg:grid-cols-3 lg:gap-2 lg:space-x-0">
                  <div className="flex-1 lg:col-span-2">
                    <FlowerNameInput
                      value={newFlowerName}
                      onChange={setNewFlowerName}
                      placeholder="Название цветка"
                      className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white lg:text-sm"
                      existingFlowers={composition.map(item => item.name)}
                      inventory={inventory}
                      loading={inventoryLoading}
                    />
                  </div>
                  <div className="w-20 lg:w-full lg:col-span-1">
                    <Input
                      value={newFlowerCount}
                      onChange={(e) =>
                        setNewFlowerCount(e.target.value)
                      }
                      placeholder="Кол-во"
                      className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 w-full touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white lg:text-sm"
                    />
                  </div>
                </div>
                <Button
                  onClick={handleAddFlower}
                  variant="outline"
                  className="w-full h-12 text-gray-900 border-gray-200 text-base touch-manipulation lg:h-10 lg:text-sm"
                >
                  <Plus className="w-5 h-5 mr-2 lg:w-4 lg:h-4" />
                  Добавить цветок
                </Button>
              </div>
            </div>
          </div>

          {/* Characteristics */}
          <div className="px-6 lg:px-0 lg:col-span-2">
            <button
              onClick={() =>
                setShowCharacteristics(!showCharacteristics)
              }
              className="flex items-center justify-between w-full py-3 touch-manipulation lg:hidden"
            >
              <h3 className="text-gray-900">
                Характеристики
              </h3>
              {showCharacteristics ? (
                <ChevronUp className="w-5 h-5 text-gray-400" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-400" />
              )}
            </button>
            
            <div className="hidden lg:block">
              <h3 className="text-base font-medium text-gray-900 mb-6">Характеристики</h3>
            </div>

            {(showCharacteristics || typeof window !== 'undefined') && (
              <div className={`space-y-5 mt-4 lg:mt-0 lg:space-y-6 ${showCharacteristics ? 'block' : 'hidden'} lg:block`}>
                <div className="space-y-4 lg:space-y-3">
                  <p className="text-sm text-gray-700 lg:font-medium">Цвета букета</p>
                  <ColorPicker
                    colors={bouquetColors}
                    selectedColors={selectedColors}
                    onChange={handleColorChange}
                    multiple={true}
                  />
                </div>

                <div className="flex space-x-4 lg:grid lg:grid-cols-2 lg:gap-4 lg:space-x-0">
                  <div>
                    <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">
                      Ширина
                    </label>
                    <Input
                      value={width}
                      onChange={(e) =>
                        setWidth(e.target.value)
                      }
                      placeholder="Ширина, см"
                      className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
                    />
                  </div>
                  <div>
                    <label className="hidden lg:block text-sm font-medium text-gray-700 mb-2">
                      Высота
                    </label>
                    <Input
                      value={height}
                      onChange={(e) =>
                        setHeight(e.target.value)
                      }
                      placeholder="Высота, см"
                      className="border-0 border-b border-gray-200 rounded-none px-0 pb-3 h-12 text-base placeholder:text-gray-500 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 flex-1 touch-manipulation lg:border lg:border-gray-200 lg:rounded-lg lg:px-3 lg:h-10 lg:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm text-gray-700 lg:font-medium">
                    Стойкость
                  </p>
                  <div className="flex flex-wrap gap-3 lg:gap-2">
                    {[
                      { id: "short", label: "До 7 дней" },
                      { id: "medium", label: "От 5 до 10" },
                      {
                        id: "long",
                        label: "От 10 дней и более",
                      },
                    ].map((durationOption) => (
                      <button
                        key={durationOption.id}
                        onClick={() =>
                          setSelectedDuration(durationOption.id)
                        }
                        className={`px-4 py-2.5 rounded text-sm transition-all duration-200 touch-manipulation min-h-[44px] lg:min-h-[36px] lg:px-3 lg:py-2 lg:text-xs ${
                          selectedDuration === durationOption.id
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {durationOption.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 pt-8 lg:px-0 lg:col-span-2 lg:flex lg:justify-end lg:gap-3">
            <div className="hidden lg:flex lg:gap-3">
              <Button variant="outline" onClick={onClose}>
                Отмена
              </Button>
              <Button onClick={handleSave}>
                Сохранить изменения
              </Button>
            </div>
            <div className="lg:hidden">
              <Button
                onClick={handleSave}
                className="w-full bg-gray-800 hover:bg-gray-900 text-white h-12 rounded-xl touch-manipulation"
              >
                Сохранить изменения
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}