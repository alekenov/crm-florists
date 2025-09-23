// Типы данных для интеграции с FastAPI backend

// ============== CLIENT TYPES ==============
export interface Client {
  id: number;
  name?: string;
  phone: string;
  email?: string;
  address?: string;
  client_type: 'заказчик' | 'получатель' | 'оба';
  notes?: string;
  created_at: string;
}

export interface ClientCreate {
  name?: string;
  phone: string;
  email?: string;
  address?: string;
  client_type: 'заказчик' | 'получатель' | 'оба';
  notes?: string;
}

export interface ClientUpdate {
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
  client_type?: 'заказчик' | 'получатель' | 'оба';
  notes?: string;
}

// ============== PRODUCT TYPES ==============
export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  category: 'букет' | 'композиция' | 'горшечный';
  preparation_time?: number;
  image_url?: string;
  created_at: string;
}

export interface ProductCreate {
  name: string;
  description?: string;
  price: number;
  category: 'букет' | 'композиция' | 'горшечный';
  preparation_time?: number;
  image_url?: string;
}

export interface ProductUpdate {
  name?: string;
  description?: string;
  price?: number;
  category?: 'букет' | 'композиция' | 'горшечный';
  preparation_time?: number;
  image_url?: string;
}

// ============== INVENTORY TYPES ==============
export interface Inventory {
  id: number;
  name: string;
  quantity: number;
  unit: 'шт' | 'м' | 'кг';
  min_quantity?: number;
  price_per_unit?: number;
  created_at: string;
}

export interface InventoryCreate {
  name: string;
  quantity: number;
  unit: 'шт' | 'м' | 'кг';
  min_quantity?: number;
  price_per_unit?: number;
}

export interface InventoryUpdate {
  name?: string;
  quantity?: number;
  unit?: 'шт' | 'м' | 'кг';
  min_quantity?: number;
  price_per_unit?: number;
}

// ============== ORDER TYPES ==============
export interface OrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product?: Product;
}

export interface OrderItemCreate {
  product_id: number;
  quantity: number;
  price?: number;
}

export interface Order {
  id: number;
  client_id: number;
  recipient_id: number;
  executor_id?: number;
  courier_id?: number;
  status: 'новый' | 'в работе' | 'готов' | 'доставлен';
  delivery_date: string;
  delivery_address: string;
  delivery_time_range?: string;
  total_price?: number;
  comment?: string;
  notes?: string;
  created_at: string;
  client?: Client;
  recipient?: Client;
  executor?: User;
  courier?: User;
  order_items?: OrderItem[];
}

export interface OrderCreate {
  client_id: number;
  recipient_id: number;
  executor_id?: number;
  courier_id?: number;
  delivery_date: string;
  delivery_address: string;
  comment?: string;
  items: OrderItemCreate[];
}

export interface OrderUpdate {
  recipient_id?: number;
  executor_id?: number;
  courier_id?: number;
  status?: 'новый' | 'в работе' | 'готов' | 'доставлен';
  delivery_date?: string;
  delivery_address?: string;
  delivery_time_range?: string;
  comment?: string;
  notes?: string;
}

export interface OrderStatusUpdate {
  new_status: OrderStatus;
}

// ============== USER TYPES ==============
export interface User {
  id: number;
  username: string;
  email: string;
  city?: string;
  position?: string;
  address?: string;
  phone?: string;
  created_at: string;
}

export interface UserCreate {
  username: string;
  email: string;
  password: string;
  city?: string;
  position?: string;
  address?: string;
  phone?: string;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface Token {
  access_token: string;
  token_type: string;
}

// ============== STATISTICS TYPES ==============
export interface DashboardStats {
  total_clients: number;
  total_products: number;
  total_orders: number;
  today_orders: number;
  low_stock_items: number;
  monthly_revenue: number;
  orders_by_status: Record<string, number>;
}

// ============== PAGINATION TYPES ==============
export interface PaginatedResponse<T> {
  items?: T[];
  total?: number;
  page?: number;
  page_size?: number;
  has_more?: boolean;
}

// ============== SEARCH FILTERS ==============
export interface ClientFilters {
  skip?: number;
  limit?: number;
  search?: string;
  client_type?: 'заказчик' | 'получатель' | 'оба';
}

export interface ProductFilters {
  skip?: number;
  limit?: number;
  category?: 'букет' | 'композиция' | 'горшечный';
  search?: string;
}

export interface InventoryFilters {
  skip?: number;
  limit?: number;
  low_stock_only?: boolean;
  unit?: 'шт' | 'м' | 'кг';
  search?: string;
}

export interface OrderFilters {
  skip?: number;
  limit?: number;
  status?: 'новый' | 'в работе' | 'готов' | 'доставлен';
  client_id?: number;
  executor_id?: number;
  date_from?: string;
  date_to?: string;
}