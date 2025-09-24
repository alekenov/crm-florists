// API сервисы для работы с backend
import { apiClient } from './client';
import {
  Client, ClientCreate, ClientUpdate, ClientFilters,
  Product, ProductCreate, ProductUpdate, ProductFilters,
  Inventory, InventoryCreate, InventoryUpdate, InventoryFilters,
  Order, OrderCreate, OrderUpdate, OrderFilters, OrderStatusUpdate,
  User, UserCreate, UserLogin, Token,
  DashboardStats
} from './types';

// ============== CLIENT SERVICES ==============
export const clientService = {
  async getAll(filters?: ClientFilters): Promise<Client[]> {
    const params = new URLSearchParams();
    if (filters?.skip) params.set('skip', filters.skip.toString());
    if (filters?.limit) params.set('limit', filters.limit.toString());
    if (filters?.search) params.set('search', filters.search);
    if (filters?.client_type) params.set('client_type', filters.client_type);

    const queryString = params.toString();
    return apiClient.get<Client[]>(`/api/clients${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: number): Promise<Client> {
    return apiClient.get<Client>(`/api/clients/${id}`);
  },

  async create(data: ClientCreate): Promise<Client> {
    return apiClient.post<Client>('/api/clients', data);
  },

  async update(id: number, data: ClientUpdate): Promise<Client> {
    return apiClient.put<Client>(`/api/clients/${id}`, data);
  },

  async partialUpdate(id: number, data: ClientUpdate): Promise<Client> {
    return apiClient.patch<Client>(`/api/clients/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/clients/${id}`);
  }
};

// ============== PRODUCT SERVICES ==============
export const productService = {
  async getAll(filters?: ProductFilters): Promise<Product[]> {
    const params = new URLSearchParams();
    if (filters?.skip) params.set('skip', filters.skip.toString());
    if (filters?.limit) params.set('limit', filters.limit.toString());
    if (filters?.category) params.set('category', filters.category);
    if (filters?.search) params.set('search', filters.search);

    const queryString = params.toString();
    return apiClient.get<Product[]>(`/api/products${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: number): Promise<Product> {
    return apiClient.get<Product>(`/api/products/${id}`);
  },

  async create(data: ProductCreate): Promise<Product> {
    return apiClient.post<Product>('/api/products', data);
  },

  async update(id: number, data: ProductUpdate): Promise<Product> {
    // Convert arrays to JSON strings for backend compatibility
    const processedData = { ...data };

    // Convert colors array to JSON string
    if (Array.isArray(processedData.colors)) {
      processedData.colors = JSON.stringify(processedData.colors);
    }

    // Convert images array to JSON string
    if (Array.isArray(processedData.images)) {
      processedData.images = JSON.stringify(processedData.images);
    }

    // Convert composition array to JSON string if present
    if (Array.isArray(processedData.composition)) {
      processedData.composition = JSON.stringify(processedData.composition);
    }

    return apiClient.put<Product>(`/api/products/${id}`, processedData);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/products/${id}`);
  }
};

// ============== INVENTORY SERVICES ==============
export const inventoryService = {
  async getAll(filters?: InventoryFilters): Promise<Inventory[]> {
    const params = new URLSearchParams();
    if (filters?.skip) params.set('skip', filters.skip.toString());
    if (filters?.limit) params.set('limit', filters.limit.toString());
    if (filters?.low_stock_only) params.set('low_stock_only', 'true');
    if (filters?.unit) params.set('unit', filters.unit);
    if (filters?.search) params.set('search', filters.search);

    const queryString = params.toString();
    return apiClient.get<Inventory[]>(`/api/inventory${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: number): Promise<Inventory> {
    return apiClient.get<Inventory>(`/api/inventory/${id}`);
  },

  async create(data: InventoryCreate): Promise<Inventory> {
    return apiClient.post<Inventory>('/api/inventory', data);
  },

  async update(id: number, data: InventoryUpdate): Promise<Inventory> {
    return apiClient.put<Inventory>(`/api/inventory/${id}`, data);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/inventory/${id}`);
  }
};

// ============== ORDER SERVICES ==============
export const orderService = {
  async getAll(filters?: OrderFilters): Promise<Order[]> {
    const params = new URLSearchParams();
    if (filters?.skip) params.set('skip', filters.skip.toString());
    if (filters?.limit) params.set('limit', filters.limit.toString());
    if (filters?.status) params.set('status', filters.status);
    if (filters?.client_id) params.set('client_id', filters.client_id.toString());
    if (filters?.executor_id) params.set('executor_id', filters.executor_id.toString());
    if (filters?.date_from) params.set('date_from', filters.date_from);
    if (filters?.date_to) params.set('date_to', filters.date_to);

    const queryString = params.toString();
    const response = await apiClient.get<any>(`/api/orders${queryString ? `?${queryString}` : ''}`);
    // Handle paginated response from SQLModel backend
    return response.items || response || [];
  },

  async getById(id: number): Promise<Order> {
    return apiClient.get<Order>(`/api/orders/${id}`);
  },

  async create(data: OrderCreate): Promise<Order> {
    return apiClient.post<Order>('/api/orders', data);
  },

  async update(id: number, data: OrderUpdate): Promise<Order> {
    return apiClient.patch<Order>(`/api/orders/${id}`, data);
  },

  async partialUpdate(id: number, data: OrderUpdate): Promise<Order> {
    return apiClient.patch<Order>(`/api/orders/${id}`, data);
  },

  async updateStatus(id: number, status: OrderStatusUpdate): Promise<Order> {
    return apiClient.put<Order>(`/api/orders/${id}/status`, status);
  },

  async delete(id: number): Promise<void> {
    await apiClient.delete(`/api/orders/${id}`);
  }
};

// ============== USER SERVICES ==============
export const userService = {
  async getAll(): Promise<User[]> {
    return apiClient.get<User[]>('/api/users');
  },

  async getCurrentUser(): Promise<User> {
    return apiClient.get<User>('/me');
  },

  async register(data: UserCreate): Promise<User> {
    return apiClient.post<User>('/register', data);
  },

  async login(data: UserLogin): Promise<Token> {
    return apiClient.post<Token>('/login', data);
  }
};

// ============== STATISTICS SERVICES ==============
export const statsService = {
  async getDashboard(): Promise<DashboardStats> {
    return apiClient.get<DashboardStats>('/api/stats/dashboard');
  },

  async getSummary(): Promise<any> {
    return apiClient.get('/stats/summary');
  }
};

// ============== PRODUCT COMPOSITION SERVICES ==============
export const productCompositionService = {
  async getComposition(productId: number): Promise<any[]> {
    return apiClient.get<any[]>(`/api/products/${productId}/composition`);
  },

  async addComposition(productId: number, inventoryId: number, quantityNeeded: number): Promise<any> {
    const url = `/api/products/${productId}/composition?inventory_id=${inventoryId}&quantity_needed=${quantityNeeded}`;
    return apiClient.post<any>(url);
  },

  async updateComposition(productId: number, compositionId: number, quantityNeeded: number): Promise<any> {
    const url = `/api/products/${productId}/composition/${compositionId}?quantity_needed=${quantityNeeded}`;
    return apiClient.put<any>(url);
  },

  async deleteComposition(productId: number, compositionId: number): Promise<void> {
    await apiClient.delete(`/api/products/${productId}/composition/${compositionId}`);
  }
};

// ============== INITIALIZATION SERVICES ==============
export const initService = {
  async initializeSampleData(): Promise<any> {
    return apiClient.post('/api/initialize-sample-clients');
  }
};

// ============== INVENTORY AUDIT SERVICES ==============
export const inventoryAuditService = {
  async startAudit(): Promise<any> {
    return apiClient.post<any>('/api/inventory/audit/start');
  },

  async getCurrentAudit(): Promise<any> {
    return apiClient.get<any>('/api/inventory/audit/current');
  },

  async saveAuditItems(auditId: number, items: any[]): Promise<any> {
    return apiClient.post<any>(`/api/inventory/audit/${auditId}/items`, items);
  },

  async completeAudit(auditId: number): Promise<any> {
    return apiClient.post<any>(`/api/inventory/audit/${auditId}/complete`);
  }
};

// ============== INVENTORY TRANSACTION SERVICES ==============
export const inventoryTransactionService = {
  async getTransactions(inventoryId: number): Promise<any[]> {
    return apiClient.get<any[]>(`/api/inventory/${inventoryId}/transactions`);
  },

  async writeOff(inventoryId: number, quantity: number, comment: string): Promise<any> {
    return apiClient.post<any>(`/api/inventory/${inventoryId}/write-off`, { quantity, comment });
  }
};

// Export all services
export {
  clientService as clients,
  productService as products,
  inventoryService as inventory,
  orderService as orders,
  userService as users,
  statsService as stats,
  initService as init,
  productCompositionService as productComposition,
  inventoryAuditService as inventoryAudit
};