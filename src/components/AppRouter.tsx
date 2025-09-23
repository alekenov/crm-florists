// Core imports
import { Screen } from "../types";
import { useIntegratedAppState } from "../hooks/useIntegratedAppState";
import { useAppRouterActions } from "../src/hooks/useAppRouterActions";

// Component imports  
import { AppWrapper } from "./AppWrapper";
import { ProductTypeSelector } from "./ProductTypeSelector";
import { AddProductForm } from "./AddProductForm";
import { AddCatalogForm } from "./AddCatalogForm";
import { ProductDetail } from "./ProductDetail";
import { EditCatalogForm } from "./EditCatalogForm";
import { OrdersWithAPI } from "./orders/OrdersWithAPI";
import { Dashboard } from "./Dashboard";
import { MainTabView } from "./MainTabView";
import { OrderDetail } from "./orders/OrderDetail";
import { AddOrder } from "./orders/AddOrder";
import { Inventory } from "./Inventory";
import { InventoryItemDetail } from "./InventoryItemDetail";
import { InventoryAudit } from "./InventoryAudit";
import { AddInventoryItem } from "./AddInventoryItem";
import { Customers } from "./Customers";
import { CustomerDetail } from "./customers/CustomerDetail";
import { AddCustomer } from "./AddCustomer";
import { Profile } from "./Profile";
import { ProductsList } from "./products/ProductsList";

export function AppRouter() {
  // Use centralized state and actions
  const state = useIntegratedAppState();
  
  // Check if data is loading or has errors
  if (state.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  if (state.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
            <p>Ошибка загрузки: {state.error}</p>
          </div>
          <button 
            onClick={state.refetchAll}
            className="px-4 py-2 bg-primary text-white rounded-lg"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }
  
  const actions = useAppRouterActions(state);

  // Function to determine active tab based on current screen
  const getActiveTabForScreen = (screen: Screen): 'orders' | 'products' | 'inventory' | 'customers' | 'profile' => {
    switch (screen) {
      case 'product-detail':
      case 'vitrina-form':
      case 'catalog-form':
      case 'edit-catalog':
      case 'product-edit':
      case 'selector':
        return 'products';
      case 'order-detail':
      case 'add-order':
        return 'orders';
      case 'add-inventory-item':
      case 'inventory-item-detail':
      case 'inventory-audit':
        return 'inventory';
      case 'customer-detail':
      case 'add-customer':
        return 'customers';
      case 'dashboard':
        return 'profile';
      default:
        return state.activeTab;
    }
  };

  const currentActiveTab = getActiveTabForScreen(state.currentScreen);

  // Enhanced tab change handler that navigates back to main screen
  const handleTabChange = (tab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile') => {
    // If we're not on the main screen, navigate back to main first
    if (state.currentScreen !== 'main') {
      state.setCurrentScreen('main');
    }
    // Set the active tab
    state.setActiveTab(tab);
  };

  // Common wrapper props
  const wrapperProps = {
    activeTab: currentActiveTab,
    onActiveTabChange: handleTabChange,
    onAddProduct: actions.handleAddProduct,
    onAddOrder: actions.handleAddOrder,
    onAddInventoryItem: actions.handleAddInventoryItem,
    onAddCustomer: actions.handleAddCustomer
  };

  switch (state.currentScreen) {
    case 'selector':
      return (
        <AppWrapper {...wrapperProps}>
          <ProductTypeSelector 
            onClose={actions.handleCloseToList}
            onSelectVitrina={actions.handleSelectVitrina}
            onSelectCatalog={actions.handleSelectCatalog}
          />
        </AppWrapper>
      );

    case 'vitrina-form':
      return (
        <AppWrapper {...wrapperProps}>
          <AddProductForm 
            onClose={actions.handleCloseToList}
            onCreateProduct={actions.handleCreateProduct}
          />
        </AppWrapper>
      );

    case 'catalog-form':
      return (
        <AppWrapper {...wrapperProps}>
          <AddCatalogForm 
            onClose={actions.handleCloseToList}
            onCreateProduct={actions.handleCreateProduct}
          />
        </AppWrapper>
      );

    case 'product-detail':
      return (
        <AppWrapper {...wrapperProps}>
          <ProductDetail
            productId={state.selectedProductId}
            products={state.products}
            onClose={actions.handleCloseToList}
            onUpdateProduct={state.apiActions.updateProduct}
            onEditProduct={actions.handleEditProduct}
            onRefreshProducts={state.refetchProducts}
          />
        </AppWrapper>
      );

    case 'edit-catalog':
    case 'product-edit':
      return (
        <AppWrapper {...wrapperProps}>
          <EditCatalogForm
            productId={state.selectedProductId}
            products={state.products}
            onClose={actions.handleCloseToList}
            onUpdateProduct={state.apiActions.updateProduct}
          />
        </AppWrapper>
      );

    case 'dashboard':
      return (
        <AppWrapper {...wrapperProps}>
          <Dashboard onNavigateBack={actions.handleCloseToList} />
        </AppWrapper>
      );

    case 'order-detail':
      return (
        <AppWrapper {...wrapperProps}>
          <OrderDetail
            orderId={state.selectedOrderId || ''}
            onClose={actions.handleCloseToList}
            onEdit={actions.handleEditOrder}
            onDelete={actions.handleDeleteOrder}
            onUpdateStatus={actions.handleUpdateOrderStatus}
          />
        </AppWrapper>
      );

    case 'add-order':
      return (
        <AppWrapper {...wrapperProps}>
          <AddOrder
            products={state.products}
            onClose={actions.handleCloseToList}
            onCreateOrder={actions.handleCreateOrder}
          />
        </AppWrapper>
      );

    case 'add-inventory-item':
      return (
        <AppWrapper {...wrapperProps}>
          <AddInventoryItem
            onClose={actions.handleCloseToList}
            onProcessSupply={(items) => {
              console.log('Supply processed with items:', items);
            }}
          />
        </AppWrapper>
      );

    case 'inventory-item-detail':
      return (
        <AppWrapper {...wrapperProps}>
          <InventoryItemDetail
            itemId={state.selectedInventoryItemId || 0}
            onClose={actions.handleCloseToList}
            onUpdateItem={(itemId, updates) => {
              console.log('Update inventory item:', itemId, updates);
            }}
          />
        </AppWrapper>
      );

    case 'inventory-audit':
      return (
        <AppWrapper {...wrapperProps}>
          <InventoryAudit
            onClose={actions.handleCloseToList}
            onSaveAudit={(auditResults) => {
              console.log('Audit results saved:', auditResults);
            }}
          />
        </AppWrapper>
      );

    case 'customer-detail':
      return (
        <AppWrapper {...wrapperProps}>
          <CustomerDetail
            customerId={state.selectedCustomerId || 0}
            customers={state.customers}
            onClose={actions.handleCloseToList}
            onUpdateCustomer={actions.updateCustomer}
            onViewOrder={actions.handleViewOrder}
          />
        </AppWrapper>
      );

    case 'add-customer':
      return (
        <AppWrapper {...wrapperProps}>
          <AddCustomer
            onClose={actions.handleCloseToList}
            onCreateCustomer={actions.handleCreateCustomer}
          />
        </AppWrapper>
      );

    default:
      return (
        <MainTabView
          products={state.products || []}
          activeTab={state.activeTab}
          onActiveTabChange={handleTabChange}
          onAddProduct={actions.handleAddProduct}
          onViewProduct={actions.handleViewProduct}
          onToggleProduct={actions.toggleProductStatus}
          onNavigateToDashboard={actions.handleNavigateToDashboard}
          onViewOrder={actions.handleViewOrder}
          onStatusChange={actions.handleOrderStatusChange}
          onAddOrder={actions.handleAddOrder}
          onAddInventoryItem={actions.handleAddInventoryItem}
          onViewInventoryItem={actions.handleViewInventoryItem}
          onStartInventoryAudit={actions.handleStartInventoryAudit}
          onAddCustomer={actions.handleAddCustomer}
          ProductsListComponent={ProductsList}
          OrdersComponent={(props: any) => (
            <OrdersWithAPI
              {...props}
              onViewOrder={actions.handleViewOrder}
              onAddOrder={actions.handleAddOrder}
            />
          )}
          InventoryComponent={(props: any) => (
            <Inventory
              {...props}
              inventory={state.inventory || []}
            />
          )}
          CustomersComponent={(props: any) => (
            <Customers 
              {...props} 
              onViewCustomer={actions.handleViewCustomer} 
              onAddCustomer={actions.handleAddCustomer} 
              customers={state.customers || []} 
            />
          )}
          ProfileComponent={(props: any) => <Profile {...props} showHeader={false} />}
        />
      );
  }
}