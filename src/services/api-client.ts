// FastAPI HTTP client for SQLModel backend integration
import { SQLOrder, SQLOrderListResponse, SQLOrderUpdateRequest } from '../types/sql-api';

export interface APIConfig {
  baseUrl: string;
  timeout: number;
  retries: number;
}

export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    public data?: any
  ) {
    super(`HTTP ${status}: ${statusText}`);
    this.name = 'APIError';
  }
}

export class FastAPIClient {
  private config: APIConfig;

  constructor(config?: Partial<APIConfig>) {
    this.config = {
      baseUrl: 'http://localhost:8011/api',
      timeout: 10000,
      retries: 3,
      ...config,
    };
  }

  /**
   * Make HTTP request with retry logic and error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.config.baseUrl}${endpoint}`;

    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      ...options,
    };

    let lastError: Error;

    // Retry logic
    for (let attempt = 1; attempt <= this.config.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

        const response = await fetch(url, {
          ...defaultOptions,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            errorData = await response.text();
          }

          throw new APIError(response.status, response.statusText, errorData);
        }

        const data = await response.json();
        return data;

      } catch (error) {
        lastError = error as Error;

        // Don't retry on client errors (4xx) or last attempt
        if (error instanceof APIError && error.status >= 400 && error.status < 500) {
          throw error;
        }

        if (attempt === this.config.retries) {
          throw lastError;
        }

        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 500));
      }
    }

    throw lastError!;
  }

  /**
   * GET request
   */
  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    let url = endpoint;

    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString());
        }
      });
      url += `?${searchParams.toString()}`;
    }

    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PATCH request (for updates)
   */
  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint: string): Promise<void> {
    await this.request<void>(endpoint, { method: 'DELETE' });
  }
}

/**
 * Orders API service using FastAPI client
 */
export class OrdersAPIService {
  private client: FastAPIClient;

  constructor(config?: Partial<APIConfig>) {
    this.client = new FastAPIClient(config);
  }

  /**
   * Get all orders with pagination and filters
   */
  async getOrders(
    page: number = 1,
    pageSize: number = 20,
    filters: Record<string, any> = {}
  ): Promise<SQLOrderListResponse> {
    return this.client.get<SQLOrderListResponse>('/orders', {
      page,
      page_size: pageSize,
      ...filters,
    });
  }

  /**
   * Get single order by ID
   */
  async getOrder(id: number): Promise<SQLOrder> {
    return this.client.get<SQLOrder>(`/orders/${id}`);
  }

  /**
   * Update order
   */
  async updateOrder(id: number, updates: SQLOrderUpdateRequest): Promise<SQLOrder> {
    return this.client.patch<SQLOrder>(`/orders/${id}`, updates);
  }

  /**
   * Create new order
   */
  async createOrder(orderData: Partial<SQLOrder>): Promise<SQLOrder> {
    return this.client.post<SQLOrder>('/orders', orderData);
  }

  /**
   * Delete order
   */
  async deleteOrder(id: number): Promise<void> {
    return this.client.delete(`/orders/${id}`);
  }

  /**
   * Get order history
   */
  async getOrderHistory(id: number): Promise<any[]> {
    return this.client.get<any[]>(`/orders/${id}/history`);
  }

  /**
   * Add comment to order
   */
  async addComment(id: number, comment: string): Promise<any> {
    return this.client.post<any>(`/orders/${id}/comments`, { comment });
  }

  /**
   * Update order status
   */
  async updateStatus(id: number, status: string): Promise<SQLOrder> {
    return this.updateOrder(id, { status } as SQLOrderUpdateRequest);
  }

  /**
   * Assign executor to order
   */
  async assignExecutor(id: number, executorId: number | null): Promise<SQLOrder> {
    return this.updateOrder(id, { executor_id: executorId });
  }
}

// Global API client instance
export const apiClient = new FastAPIClient();
export const ordersAPI = new OrdersAPIService();

// Error handler utility
export const handleAPIError = (error: Error): string => {
  if (error instanceof APIError) {
    switch (error.status) {
      case 422:
        return 'Проверьте введенные данные';
      case 404:
        return 'Заказ не найден';
      case 500:
        return 'Ошибка сервера. Попробуйте позже';
      default:
        return 'Произошла ошибка при выполнении запроса';
    }
  }

  if (error.name === 'AbortError') {
    return 'Превышено время ожидания ответа';
  }

  return 'Что-то пошло не так. Проверьте соединение с интернетом';
};