import React from "react";
import { BottomTabBar } from "./BottomTabBar";
import { FloatingActionButton } from "./FloatingActionButton";
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset
} from "./ui/sidebar";
import { Package, ClipboardList, Warehouse, Users, User } from "lucide-react";

interface AppLayoutProps {
  children: React.ReactNode;
  activeTab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile';
  onActiveTabChange: (tab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile') => void;
  showTabBar?: boolean;
  // FAB props
  onAddProduct?: () => void;
  onAddOrder?: () => void;
  onAddInventoryItem?: () => void;
  onAddCustomer?: () => void;
  // Right panel props
  rightPanel?: React.ReactNode;
  showRightPanel?: boolean;
}

export function AppLayout({ 
  children, 
  activeTab, 
  onActiveTabChange, 
  showTabBar = true,
  onAddProduct,
  onAddOrder,
  onAddInventoryItem,
  onAddCustomer,
  rightPanel,
  showRightPanel = false
}: AppLayoutProps) {
  const sidebarItems = [
    { 
      key: 'orders' as const, 
      label: 'Заказы', 
      icon: ClipboardList 
    },
    { 
      key: 'products' as const, 
      label: 'Товары', 
      icon: Package 
    },
    { 
      key: 'inventory' as const, 
      label: 'Склад', 
      icon: Warehouse 
    },
    { 
      key: 'customers' as const, 
      label: 'Клиенты', 
      icon: Users 
    },
    { 
      key: 'profile' as const, 
      label: 'Профиль', 
      icon: User 
    }
  ];

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden bg-gray-50 min-h-screen">
        <div className="max-w-md mx-auto bg-white min-h-screen relative">
          {/* Main Content */}
          <div className={showTabBar ? "pb-16" : ""}>
            {children}
          </div>

          {/* Floating Action Button - Mobile Only */}
          <FloatingActionButton
            activeTab={activeTab}
            onAddProduct={onAddProduct}
            onAddOrder={onAddOrder}
            onAddInventoryItem={onAddInventoryItem}
            onAddCustomer={onAddCustomer}
          />

          {/* Bottom Tab Bar */}
          {showTabBar && (
            <BottomTabBar 
              activeTab={activeTab} 
              onActiveTabChange={onActiveTabChange} 
            />
          )}
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            {/* Desktop Sidebar */}
            <Sidebar className="border-r">
              <SidebarHeader className="border-b p-4">
                <h2 className="text-lg font-semibold">Цветочный магазин</h2>
              </SidebarHeader>
              <SidebarContent>
                <SidebarMenu>
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <SidebarMenuItem key={item.key}>
                        <SidebarMenuButton
                          onClick={() => onActiveTabChange(item.key)}
                          isActive={activeTab === item.key}
                          className="w-full"
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>

            {/* Main Content Area */}
            <SidebarInset className="flex-1 flex">
              {/* Content */}
              <div className={`flex-1 ${showRightPanel ? 'lg:w-3/5' : 'w-full'} transition-all duration-300`}>
                {children}
              </div>

              {/* Right Panel */}
              {showRightPanel && rightPanel && (
                <div className="w-2/5 border-l bg-white transition-all duration-300">
                  {rightPanel}
                </div>
              )}
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </>
  );
}