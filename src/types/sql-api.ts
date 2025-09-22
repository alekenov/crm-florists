// TypeScript types that match our SQLModel FastAPI backend
// These types represent the exact structure returned by the API

export interface SQLClient {
  id: number;
  name: string | null;
  phone: string;
  email: string | null;
  address: string | null;
  client_type: "заказчик" | "получатель" | "оба";
  notes: string | null;
  created_at: string; // ISO datetime string
}

export interface SQLUser {
  id: number;
  username: string;
  email: string;
  city: string | null;
  position: string | null;
}

export interface SQLProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  preparation_time: number | null;
  image_url: string | null;
  created_at: string; // ISO datetime string
}

export interface SQLOrderItem {
  id: number;
  product_id: number;
  quantity: number;
  price: number;
  product: SQLProduct;
}

export interface SQLOrderHistory {
  id: number;
  action: string;
  old_status?: string;
  new_status?: string;
  changed_by: SQLUser;
  timestamp: string; // ISO datetime string
  comment?: string;
}

export interface SQLOrder {
  id: number;
  client_id: number;
  recipient_id: number;
  executor_id: number | null;
  status: "новый" | "оплаченный" | "принятый" | "собранный" | "в_пути" | "доставленный" | "отмененный";
  delivery_date: string; // ISO datetime string
  delivery_address: string;
  delivery_time_range?: string | null;
  comment: string | null;
  notes?: string | null;
  total_price: number | null;
  created_at: string; // ISO datetime string
  updated_at?: string; // ISO datetime string

  // Joined relations from API
  client: SQLClient;
  recipient: SQLClient;
  executor: SQLUser | null;
  order_items: SQLOrderItem[];
  history?: SQLOrderHistory[];
}

// API Request/Response types
export interface SQLOrderListResponse {
  orders: SQLOrder[];
  total: number;
  page: number;
  page_size: number;
}

export interface SQLOrderUpdateRequest {
  status?: SQLOrder['status'];
  executor_id?: number | null;
  delivery_address?: string;
  delivery_date?: string; // ISO datetime string
  delivery_time_range?: string;
  comment?: string;
  notes?: string;
}

// Status mapping between English (frontend) and Russian (backend)
export const STATUS_MAPPING = {
  // Frontend -> Backend
  toSQL: {
    'new': 'новый',
    'paid': 'оплаченный',
    'accepted': 'принятый',
    'assembled': 'собранный',
    'in-transit': 'в_пути',
    'completed': 'доставленный'
  },
  // Backend -> Frontend
  toReact: {
    'новый': 'new',
    'оплаченный': 'paid',
    'принятый': 'accepted',
    'собранный': 'assembled',
    'в_пути': 'in-transit',
    'доставленный': 'completed',
    'отмененный': 'completed' // Map cancelled to completed for now
  }
} as const;

export type SQLStatus = keyof typeof STATUS_MAPPING.toReact;
export type ReactStatus = keyof typeof STATUS_MAPPING.toSQL;