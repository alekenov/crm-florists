import React from 'react';
import { AppLayout } from './AppLayout';
import { Toaster } from './ui/sonner';

interface AppWrapperProps {
  activeTab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile';
  onActiveTabChange: (tab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile') => void;
  onAddProduct: () => void;
  onAddOrder: () => void;
  onAddInventoryItem: () => void;
  onAddCustomer: () => void;
  children: React.ReactNode;
}

export function AppWrapper({
  activeTab,
  onActiveTabChange,
  onAddProduct,
  onAddOrder,
  onAddInventoryItem,
  onAddCustomer,
  children
}: AppWrapperProps) {
  return (
    <>
      <AppLayout
        activeTab={activeTab}
        onActiveTabChange={onActiveTabChange}
        onAddProduct={onAddProduct}
        onAddOrder={onAddOrder}
        onAddInventoryItem={onAddInventoryItem}
        onAddCustomer={onAddCustomer}
      >
        {children}
      </AppLayout>
      <Toaster position="top-center" />
    </>
  );
}