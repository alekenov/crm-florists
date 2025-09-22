import { useState } from "react";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { ProductSelectionStep } from "./ProductSelectionStep";
import { DeliveryStep } from "./DeliveryStep";
import { FinalStep } from "./FinalStep";

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

interface OrderData {
  selectedProduct: Product | null;
  deliveryType: 'delivery' | 'pickup';
  deliveryAddress: string;
  deliveryDate: 'today' | 'tomorrow';
  deliveryTime: string;
  recipientName: string;
  recipientPhone: string;
  senderName: string;
  senderPhone: string;
  postcard: string;
  comment: string;
}

interface AddOrderProps {
  products: Product[];
  onClose: () => void;
  onCreateOrder: (orderData: OrderData) => void;
}

export function AddOrder({ products, onClose, onCreateOrder }: AddOrderProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState<OrderData>({
    selectedProduct: null,
    deliveryType: 'delivery',
    deliveryAddress: '',
    deliveryDate: 'today',
    deliveryTime: '120-150',
    recipientName: '',
    recipientPhone: '',
    senderName: '',
    senderPhone: '',
    postcard: '',
    comment: ''
  });

  const updateOrderData = (updates: Partial<OrderData>) => {
    setOrderData(prev => {
      const newData = { ...prev, ...updates };
      
      // Если меняется тип доставки, очищаем ненужные поля
      if (updates.deliveryType === 'pickup') {
        newData.deliveryAddress = '';
        newData.recipientName = '';
        newData.recipientPhone = '';
      }
      
      return newData;
    });
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCreate = () => {
    onCreateOrder(orderData);
    onClose();
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return orderData.selectedProduct !== null;
      case 2:
        const hasBasicInfo = orderData.deliveryType && orderData.deliveryDate && 
                            orderData.deliveryTime && orderData.senderName && orderData.senderPhone;
        
        if (orderData.deliveryType === 'delivery') {
          return hasBasicInfo && orderData.deliveryAddress && 
                 orderData.recipientName && orderData.recipientPhone;
        }
        
        return hasBasicInfo;
      case 3:
        return true;
      default:
        return false;
    }
  };

  const isFormValid = () => {
    const hasProduct = orderData.selectedProduct !== null;
    const hasBasicInfo = orderData.deliveryType && orderData.deliveryDate && 
                        orderData.deliveryTime && orderData.senderName && orderData.senderPhone;
    
    if (orderData.deliveryType === 'delivery') {
      return hasProduct && hasBasicInfo && orderData.deliveryAddress && 
             orderData.recipientName && orderData.recipientPhone;
    }
    
    return hasProduct && hasBasicInfo;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <ProductSelectionStep
            products={products}
            selectedProduct={orderData.selectedProduct}
            onSelectProduct={(product) => updateOrderData({ selectedProduct: product })}
          />
        );
      case 2:
        return (
          <DeliveryStep
            orderData={orderData}
            onUpdateData={updateOrderData}
          />
        );
      case 3:
        return (
          <FinalStep
            orderData={orderData}
            onUpdateData={updateOrderData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Layout */}
      <div className="lg:hidden max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="bg-white h-14 flex items-center border-b border-gray-200">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onClose}
            className="p-2 ml-3"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <h1 className="text-gray-900 ml-3">
            Новый заказ
          </h1>
          <div className="ml-auto mr-3">
            <div className="text-gray-500">
              {currentStep} из 3
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-3 py-2 bg-gray-50">
          <div className="flex space-x-1">
            {[1, 2, 3].map((step) => (
              <div
                key={step}
                className={`flex-1 h-1.5 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-purple-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="pb-20">
          {renderStepContent()}
        </div>

        {/* Bottom Actions */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 p-3">
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button 
                variant="outline"
                onClick={handlePrevious}
                className="flex-1 h-12 border-gray-300 text-gray-900"
              >
                Назад
              </Button>
            )}
            
            {currentStep < 3 ? (
              <Button 
                onClick={handleNext}
                disabled={!isStepValid()}
                className="flex-1 h-12"
              >
                <span className="mr-1">Далее</span>
                <ArrowRight className="w-3 h-3" />
              </Button>
            ) : (
              <Button 
                onClick={handleCreate}
                disabled={!isFormValid()}
                className="flex-1 h-12"
              >
                Создать заказ
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        {/* Header */}
        <div className="border-b border-gray-200 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="p-2"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
              <div>
                <h1>Создание заказа</h1>
                <p className="text-gray-600 mt-1">
                  Заполните информацию для создания нового заказа
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onClose}>
                Отменить
              </Button>
              <Button 
                onClick={handleCreate}
                disabled={!isFormValid()}
                className="ml-2"
              >
                Создать заказ
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="p-6">
          <div className="max-w-4xl mx-auto">
            {renderStepContent()}
          </div>
        </div>
      </div>
    </div>
  );
}