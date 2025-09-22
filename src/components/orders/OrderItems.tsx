import React from 'react';
import { Camera } from 'lucide-react';
import { Product, OrderItem as OrderItemType } from '../../types';
import { Button } from '../ui/button';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface OrderItemsProps {
  mainProduct: Product;
  additionalItems?: OrderItemType[];
  onPhotoAdd?: () => void;
  onNotifyReplacement?: () => void;
}

export function OrderItems({ 
  mainProduct, 
  additionalItems = [], 
  onPhotoAdd,
  onNotifyReplacement 
}: OrderItemsProps) {
  return (
    <div>
      <h3 className="mb-4">Состав заказа</h3>
      
      <div className="space-y-4">
        {/* Main Product Card */}
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-start gap-4">
            <div className="w-24 h-32 rounded-lg overflow-hidden flex-shrink-0">
              <ImageWithFallback
                src={mainProduct.image}
                alt={mainProduct.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="mb-2">{mainProduct.title}</h4>
              {mainProduct.composition && (
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {mainProduct.composition.map(comp => `${comp.name} — ${comp.count} шт`).join(', ')}
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                {onPhotoAdd && (
                  <Button variant="outline" size="sm" onClick={onPhotoAdd}>
                    <Camera className="w-4 h-4 mr-2" />
                    Добавить фото
                  </Button>
                )}
                {onNotifyReplacement && (
                  <Button variant="outline" size="sm" onClick={onNotifyReplacement}>
                    Оповестить о замене
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Additional Items */}
        {additionalItems.map((item, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                <ImageWithFallback
                  src={item.productImage}
                  alt={item.productTitle}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4>{item.productTitle}</h4>
                <p className="text-sm text-gray-600">
                  {item.quantity} шт × {(item.unitPrice || 0).toLocaleString()} ₸
                </p>
                <p className="text-sm">
                  Итого: {(item.totalPrice || (item.unitPrice || 0) * item.quantity).toLocaleString()} ₸
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}