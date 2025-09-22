import React from "react";
import { AppLayout } from "./AppLayout";
import { Toaster } from "./ui/sonner";
import { Product } from "../src/types";

interface MainTabViewProps {
  products: Product[];
  activeTab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile';
  onActiveTabChange: (tab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile') => void;
  onAddProduct: () => void;
  onViewProduct: (id: number) => void;
  onToggleProduct: (id: number) => void;
  onNavigateToDashboard: () => void;
  onViewOrder?: (orderId: string) => void;
  onStatusChange?: (orderId: string, newStatus: 'new' | 'paid' | 'accepted' | 'assembled' | 'in-transit' | 'completed') => void;
  onAddOrder?: () => void;
  onAddInventoryItem?: () => void;
  onViewInventoryItem?: (itemId: number) => void;
  onStartInventoryAudit?: () => void;
  onAddCustomer?: () => void;

  ProductsListComponent: React.ComponentType<{
    products: Product[];
    onAddProduct: () => void;
    onViewProduct: (id: number) => void;
    onToggleProduct: (id: number) => void;
  }>;
  OrdersComponent: React.ComponentType<{
    onViewOrder?: (orderId: string) => void;
    onStatusChange?: (orderId: string, newStatus: 'new' | 'paid' | 'accepted' | 'assembled' | 'in-transit' | 'completed') => void;
    onAddOrder?: () => void;
  }>;
  InventoryComponent: React.ComponentType<{
    onAddItem?: () => void;
    onViewItem?: (itemId: number) => void;
    onStartAudit?: () => void;
  }>;
  CustomersComponent: React.ComponentType<any>;
  ProfileComponent: React.ComponentType<any>;
}

export function MainTabView({ 
  products, 
  activeTab,
  onActiveTabChange,
  onAddProduct, 
  onViewProduct, 
  onToggleProduct,
  onNavigateToDashboard,
  onViewOrder,
  onStatusChange,
  onAddOrder,
  onAddInventoryItem,
  onViewInventoryItem,
  onStartInventoryAudit,
  onAddCustomer,

  ProductsListComponent,
  OrdersComponent,
  InventoryComponent,
  CustomersComponent,
  ProfileComponent
}: MainTabViewProps) {

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
        {activeTab === 'orders' ? (
          <OrdersComponent 
            onViewOrder={onViewOrder}
            onStatusChange={onStatusChange}
            onAddOrder={onAddOrder}
          />
        ) : activeTab === 'products' ? (
          <ProductsListComponent
            products={products}
            onAddProduct={onAddProduct}
            onViewProduct={onViewProduct}
            onToggleProduct={onToggleProduct}
          />
        ) : activeTab === 'inventory' ? (
          <InventoryComponent
            onAddItem={onAddInventoryItem}
            onViewItem={onViewInventoryItem}
            onStartAudit={onStartInventoryAudit}
          />
        ) : activeTab === 'customers' ? (
          <CustomersComponent />
        ) : (
          <ProfileComponent />
        )}
      </AppLayout>
      <Toaster position="top-center" />
    </>
  );
}