// API Types - Backend integration types matching FastAPI schema

// Order statuses from backend
export type OrderStatus = 'новый' | 'в работе' | 'готов' | 'доставлен';

// Client types from backend
export type ClientType = 'заказчик' | 'получатель' | 'оба';

// Product categories from backend
export type ProductCategory = 'букет' | 'композиция' | 'горшечный';

// Inventory units from backend
export type InventoryUnit = 'шт' | 'м' | 'кг';

// User positions from backend
export type UserPosition = 'Флорист' | 'Курьер';

// Client entity (заменяет Customer)
export interface Client {
  id: number;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  client_type: ClientType;
  notes?: string;
  created_at: string;
}

// User entity (флористы и курьеры)
export interface User {
  id: number;
  username: string;
  email: string;
  city: string;
  position: UserPosition;
  phone?: string;
  address?: string;
  created_at: string;
}

// Product entity
export interface ApiProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: ProductCategory;
  preparation_time?: number;
  image_url?: string;
  created_at: string;
}

// Order item
export interface ApiOrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: ApiProduct;
}

// Order entity
export interface ApiOrder {
  id: number;
  client_id: number;
  recipient_id: number;
  executor_id?: number;
  courier_id?: number;
  status: OrderStatus;
  delivery_date: string;
  delivery_address: string;
  delivery_time_range?: string;
  total_price: number;
  comment?: string;
  notes?: string;
  created_at: string;
  client: Client;
  recipient: Client;
  executor?: User;
  courier?: User;
  order_items: ApiOrderItem[];
}

// Inventory item
export interface ApiInventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: InventoryUnit;
  min_quantity: number;
  price_per_unit: number;
  created_at: string;
}

// Dashboard stats
export interface DashboardStats {
  total_clients: number;
  total_products: number;
  total_orders: number;
  today_orders: number;
  low_stock_items: number;
  monthly_revenue: number;
  orders_by_status: Record<OrderStatus, number>;
}

// API response wrappers
export interface ApiResponse<T> {
  [key: string]: T[];
  total: number;
  page: number;
  page_size: number;
  has_more: boolean;
}

export interface OrdersResponse extends ApiResponse<ApiOrder> {
  orders: ApiOrder[];
}

export interface ClientsResponse extends ApiResponse<Client> {
  clients: Client[];
}

export interface ProductsResponse extends ApiResponse<ApiProduct> {
  products: ApiProduct[];
}

export interface InventoryResponse extends ApiResponse<ApiInventoryItem> {
  inventory: ApiInventoryItem[];
}

export interface UsersResponse extends ApiResponse<User> {
  users: User[];
}

// Request types for creating/updating entities
export interface CreateOrderRequest {
  client_id: number;
  recipient_id: number;
  executor_id?: number;
  courier_id?: number;
  delivery_date: string;
  delivery_address: string;
  delivery_time_range?: string;
  comment?: string;
  items: {
    product_id: number;
    quantity: number;
    price: number;
  }[];
}

export interface UpdateOrderRequest {
  executor_id?: number;
  courier_id?: number;
  delivery_address?: string;
  delivery_time_range?: string;
  comment?: string;
  notes?: string;
}

export interface CreateClientRequest {
  name: string;
  phone: string;
  email?: string;
  address?: string;
  client_type: ClientType;
  notes?: string;
}

export interface UpdateClientRequest {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  notes?: string;
}

export interface CreateProductRequest {
  name: string;
  description?: string;
  price: number;
  category: ProductCategory;
  preparation_time?: number;
  image_url?: string;
}

export interface CreateInventoryRequest {
  name: string;
  quantity: number;
  unit: InventoryUnit;
  min_quantity: number;
  price_per_unit: number;
}

// Query parameter types
export interface OrdersQueryParams {
  limit?: number;
  skip?: number;
  status?: OrderStatus;
  client_id?: number;
  executor_id?: number;
  date_from?: string;
  date_to?: string;
}

export interface ClientsQueryParams {
  limit?: number;
  skip?: number;
  search?: string;
  client_type?: ClientType;
}

export interface ProductsQueryParams {
  limit?: number;
  skip?: number;
  category?: ProductCategory;
  search?: string;
}

export interface InventoryQueryParams {
  limit?: number;
  skip?: number;
  low_stock_only?: boolean;
  unit?: InventoryUnit;
  search?: string;
}

export interface UsersQueryParams {
  position?: UserPosition;
  city?: string;
}