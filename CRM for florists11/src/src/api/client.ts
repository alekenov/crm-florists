// API Client for FastAPI backend integration
import {
  ApiOrder,
  Client,
  ApiProduct,
  ApiInventoryItem,
  User,
  DashboardStats,
  OrdersResponse,
  ClientsResponse,
  ProductsResponse,
  InventoryResponse,
  UsersResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  CreateClientRequest,
  UpdateClientRequest,
  CreateProductRequest,
  CreateInventoryRequest,
  OrdersQueryParams,
  ClientsQueryParams,
  ProductsQueryParams,
  InventoryQueryParams,
  UsersQueryParams,
  OrderStatus
} from '../types/api';

// Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8011';

interface RequestOptions extends RequestInit {
  params?: Record<string, any>;
}

class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

class APIClient {
  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { params, ...fetchOptions } = options;
    
    let url = `${API_BASE_URL}${endpoint}`;
    
    // Add query parameters
    if (params && Object.keys(params).length > 0) {
      const validParams = Object.entries(params)
        .filter(([_, value]) => value !== undefined && value !== null && value !== '')
        .reduce((acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        }, {} as Record<string, string>);
      
      if (Object.keys(validParams).length > 0) {
        const searchParams = new URLSearchParams(validParams);
        url += `?${searchParams.toString()}`;
      }
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    });

    if (!response.ok) {
      let errorMessage = response.statusText;
      
      try {
        const errorData = await response.json();
        if (errorData.detail) {
          if (Array.isArray(errorData.detail)) {
            // Validation errors
            errorMessage = errorData.detail
              .map((err: any) => `${err.loc?.join('.')}: ${err.msg}`)
              .join(', ');
          } else {
            errorMessage = errorData.detail;
          }
        }
      } catch {
        // If we can't parse error JSON, use status text
      }

      throw new APIError(
        response.status,
        response.statusText,
        `HTTP ${response.status}: ${errorMessage}`
      );
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  // Orders API
  async getOrders(params?: OrdersQueryParams): Promise<OrdersResponse> {
    return this.request('/api/orders', { params });
  }

  async getOrder(id: number): Promise<ApiOrder> {
    return this.request(`/api/orders/${id}`);
  }

  async createOrder(data: CreateOrderRequest): Promise<ApiOrder> {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateOrder(id: number, data: UpdateOrderRequest): Promise<ApiOrder> {
    return this.request(`/api/orders/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async updateOrderStatus(id: number, status: OrderStatus): Promise<ApiOrder> {
    return this.request(`/api/orders/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async deleteOrder(id: number): Promise<void> {
    return this.request(`/api/orders/${id}`, {
      method: 'DELETE',
    });
  }

  // Clients API
  async getClients(params?: ClientsQueryParams): Promise<ClientsResponse> {
    return this.request('/api/clients', { params });
  }

  async getClient(id: number): Promise<Client> {
    return this.request(`/api/clients/${id}`);
  }

  async createClient(data: CreateClientRequest): Promise<Client> {
    return this.request('/api/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClient(id: number, data: UpdateClientRequest): Promise<Client> {
    return this.request(`/api/clients/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // Products API
  async getProducts(params?: ProductsQueryParams): Promise<ProductsResponse> {
    return this.request('/api/products', { params });
  }

  async getProduct(id: number): Promise<ApiProduct> {
    return this.request(`/api/products/${id}`);
  }

  async createProduct(data: CreateProductRequest): Promise<ApiProduct> {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Inventory API
  async getInventory(params?: InventoryQueryParams): Promise<InventoryResponse> {
    return this.request('/api/inventory', { params });
  }

  async getInventoryItem(id: number): Promise<ApiInventoryItem> {
    return this.request(`/api/inventory/${id}`);
  }

  async createInventoryItem(data: CreateInventoryRequest): Promise<ApiInventoryItem> {
    return this.request('/api/inventory', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Users API
  async getUsers(params?: UsersQueryParams): Promise<UsersResponse> {
    return this.request('/api/users', { params });
  }

  async getUser(id: number): Promise<User> {
    return this.request(`/api/users/${id}`);
  }

  async getFlorists(city?: string): Promise<UsersResponse> {
    return this.getUsers({ position: 'Флорист', city });
  }

  async getCouriers(city?: string): Promise<UsersResponse> {
    return this.getUsers({ position: 'Курьер', city });
  }

  // Statistics API
  async getDashboardStats(): Promise<DashboardStats> {
    return this.request('/api/stats/dashboard');
  }

  // Helper methods for common operations
  async assignFlorist(orderId: number, floristId: number | null): Promise<ApiOrder> {
    return this.updateOrder(orderId, { executor_id: floristId });
  }

  async assignCourier(orderId: number, courierId: number | null): Promise<ApiOrder> {
    return this.updateOrder(orderId, { courier_id: courierId });
  }

  async searchClients(query: string): Promise<ClientsResponse> {
    return this.getClients({ search: query });
  }

  async searchProducts(query: string): Promise<ProductsResponse> {
    return this.getProducts({ search: query });
  }

  async getLowStockItems(): Promise<InventoryResponse> {
    return this.getInventory({ low_stock_only: true });
  }
}

// Export singleton instance
export const apiClient = new APIClient();

// Export error type for error handling
export { APIError };

// Status mappers for backward compatibility
export const mapBackendStatusToFrontend = (backendStatus: OrderStatus): string => {
  const statusMap: Record<OrderStatus, string> = {
    'новый': 'new',
    'в работе': 'accepted',
    'готов': 'assembled',
    'доставлен': 'completed'
  };
  return statusMap[backendStatus] || backendStatus;
};

export const mapFrontendStatusToBackend = (frontendStatus: string): OrderStatus => {
  const statusMap: Record<string, OrderStatus> = {
    'new': 'новый',
    'paid': 'новый', // Map paid to новый for backend
    'accepted': 'в работе',
    'assembled': 'готов',
    'in-transit': 'готов', // Map in-transit to готов for backend  
    'completed': 'доставлен'
  };
  return statusMap[frontendStatus] || 'новый';
};