/**
 * URL management utilities for app navigation and state
 */

export interface AppURLParams {
  screen?: string;
  productId?: string;
  customerId?: string;
  orderId?: string;
  inventoryItemId?: string;
  tab?: string;
  filter?: string;
  search?: string;
  date?: string;
}

class URLManager {
  private baseURL = window.location.origin + window.location.pathname;

  // Get current URL parameters
  getParams(): AppURLParams {
    const url = new URL(window.location.href);
    const params: AppURLParams = {};

    for (const [key, value] of url.searchParams.entries()) {
      if (value) {
        params[key as keyof AppURLParams] = value;
      }
    }

    return params;
  }

  // Set URL parameters
  setParams(params: Partial<AppURLParams>, replace = false): void {
    const url = new URL(window.location.href);

    // Update or add parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      } else {
        url.searchParams.delete(key);
      }
    });

    // Update the URL without page reload
    const method = replace ? 'replaceState' : 'pushState';
    window.history[method]({}, '', url.toString());
  }

  // Navigate to a specific screen
  navigateToScreen(screen: string, params?: Partial<AppURLParams>): void {
    this.setParams({
      screen,
      ...params
    });
  }

  // Navigate back
  navigateBack(): void {
    window.history.back();
  }

  // Clear all parameters
  clearParams(): void {
    window.history.replaceState({}, '', this.baseURL);
  }

  // Orders-specific URL management
  setOrdersFilter(filter: string): void {
    this.setParams({ filter }, true);
  }

  setOrdersSearch(search: string): void {
    this.setParams({ search }, true);
  }

  setOrdersDate(date: string): void {
    this.setParams({ date }, true);
  }

  // Products-specific URL management
  setProductsFilter(filter: string): void {
    this.setParams({ filter }, true);
  }

  setProductsSearch(search: string): void {
    this.setParams({ search }, true);
  }

  // Customers-specific URL management
  setCustomersFilter(filter: string): void {
    this.setParams({ filter }, true);
  }

  setCustomersSearch(search: string): void {
    this.setParams({ search }, true);
  }

  // Inventory-specific URL management
  setInventoryFilter(filter: string): void {
    this.setParams({ filter }, true);
  }

  setInventorySearch(search: string): void {
    this.setParams({ search }, true);
  }
}

// Create singleton instance
export const urlManager = new URLManager();

// Date URL utilities
export function parseDateFromURL(dateString?: string): Date | undefined {
  if (!dateString) return undefined;

  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  } catch {
    return undefined;
  }
}

export function formatDateForURL(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}

// Screen navigation helpers
export function getScreenFromURL(): string {
  const params = urlManager.getParams();
  return params.screen || 'main';
}

export function getActiveTabFromURL(): string {
  const params = urlManager.getParams();
  return params.tab || 'orders';
}

// Initialize URL state on app load
export function initializeURLState() {
  // This will be called when the app starts to sync initial state with URL
  const params = urlManager.getParams();

  // Return initial state from URL
  return {
    screen: params.screen || 'main',
    activeTab: (params.tab as any) || 'orders',
    selectedProductId: params.productId ? parseInt(params.productId) : null,
    selectedCustomerId: params.customerId ? parseInt(params.customerId) : null,
    selectedOrderId: params.orderId || null,
    selectedInventoryItemId: params.inventoryItemId ? parseInt(params.inventoryItemId) : null,
  };
}