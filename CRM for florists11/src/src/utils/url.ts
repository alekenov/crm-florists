// URL utilities for managing application state through URL parameters

export interface AppURLParams {
  screen?: string;
  tab?: string;
  filter?: string;
  deliveryFilter?: string;
  search?: string;
  date?: string;
  productId?: string;
  orderId?: string;
  customerId?: string;
  inventoryItemId?: string;
}

export class URLManager {
  private static instance: URLManager;
  
  private constructor() {}
  
  static getInstance(): URLManager {
    if (!URLManager.instance) {
      URLManager.instance = new URLManager();
    }
    return URLManager.instance;
  }

  // Get current URL parameters
  getParams(): AppURLParams {
    if (typeof window === 'undefined') {
      return {};
    }

    const urlParams = new URLSearchParams(window.location.search);
    const params: AppURLParams = {};
    
    const screen = urlParams.get('screen');
    if (screen) params.screen = screen;
    
    const tab = urlParams.get('tab');
    if (tab) params.tab = tab;
    
    const filter = urlParams.get('filter');
    if (filter) params.filter = filter;
    
    const deliveryFilter = urlParams.get('deliveryFilter');
    if (deliveryFilter) params.deliveryFilter = deliveryFilter;
    
    const search = urlParams.get('search');
    if (search) params.search = search;
    
    const date = urlParams.get('date');
    if (date) params.date = date;
    
    const productId = urlParams.get('productId');
    if (productId) params.productId = productId;
    
    const orderId = urlParams.get('orderId');
    if (orderId) params.orderId = orderId;
    
    const customerId = urlParams.get('customerId');
    if (customerId) params.customerId = customerId;
    
    const inventoryItemId = urlParams.get('inventoryItemId');
    if (inventoryItemId) params.inventoryItemId = inventoryItemId;
    
    return params;
  }

  // Update URL parameters
  updateParams(params: Partial<AppURLParams>, replace: boolean = false): void {
    if (typeof window === 'undefined') {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    
    // Update or remove parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined || value === '') {
        urlParams.delete(key);
      } else {
        urlParams.set(key, value.toString());
      }
    });
    
    const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
    
    if (replace) {
      window.history.replaceState({}, '', newUrl);
    } else {
      window.history.pushState({}, '', newUrl);
    }
  }

  // Clear all parameters
  clearParams(): void {
    if (typeof window === 'undefined') {
      return;
    }
    window.history.replaceState({}, '', window.location.pathname);
  }

  // Navigate to a specific screen with parameters
  navigateToScreen(screen: string, params?: Partial<AppURLParams>): void {
    this.updateParams({ screen, ...params });
  }

  // Navigate back by removing screen parameter
  navigateBack(): void {
    this.updateParams({ 
      screen: null, 
      productId: null, 
      orderId: null, 
      customerId: null, 
      inventoryItemId: null 
    }, true);
  }

  // Helper methods for specific filters
  setProductsFilter(filter: 'vitrina' | 'catalog'): void {
    this.updateParams({ tab: 'products', filter }, true);
  }

  setOrdersFilter(filter: string, deliveryFilter?: string): void {
    this.updateParams({ 
      tab: 'orders', 
      filter: filter === 'all' ? null : filter,
      deliveryFilter: deliveryFilter === 'all' ? null : deliveryFilter
    }, true);
  }

  setOrdersSearch(search: string): void {
    this.updateParams({ search: search || null }, true);
  }

  setOrdersDate(date: string): void {
    this.updateParams({ date: date || null }, true);
  }

  setProductsSearch(search: string): void {
    this.updateParams({ search: search || null }, true);
  }

  setActiveTab(tab: string): void {
    this.updateParams({ tab }, true);
  }

  // Get filter-specific URLs for sharing
  getFilterURL(params: Partial<AppURLParams>): string {
    if (typeof window === 'undefined') {
      return '';
    }
    
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        urlParams.set(key, value.toString());
      }
    });
    return `${window.location.origin}${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`;
  }
}

// Export singleton instance
export const urlManager = URLManager.getInstance();

// Hook for React components to use URL parameters
export function useURLParams(): [AppURLParams, (params: Partial<AppURLParams>, replace?: boolean) => void] {
  const getParams = () => urlManager.getParams();
  const updateParams = (params: Partial<AppURLParams>, replace: boolean = false) => {
    urlManager.updateParams(params, replace);
  };
  
  return [getParams(), updateParams];
}

// Helper to parse date from URL
export function parseDateFromURL(dateString?: string): Date | undefined {
  if (!dateString) return undefined;
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? undefined : date;
  } catch {
    return undefined;
  }
}

// Helper to format date for URL
export function formatDateForURL(date: Date): string {
  return date.toISOString().split('T')[0]; // YYYY-MM-DD format
}