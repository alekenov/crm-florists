// Frontend типы для React компонентов
import { User } from '../api/types';

export type Screen =
  | "customers"
  | "products"
  | "inventory"
  | "orders"
  | "analytics"
  | "product-selector"
  | "add-catalog"
  | "add-custom"
  | "catalog"
  | "custom"
  | "product-detail"
  | "vitrina-form"
  | "catalog-form"
  | "edit-catalog"
  | "product-edit"
  | "selector"
  | "order-detail"
  | "add-order"
  | "add-inventory-item"
  | "inventory-item-detail"
  | "inventory-audit"
  | "customer-detail"
  | "add-customer"
  | "dashboard";

export interface Customer {
  id: number;
  name?: string;
  phone: string;
  email?: string;
  address?: string;
  type?: string;
  notes?: string;
  memberSince?: Date;
  totalOrders?: number;
  totalSpent?: number;
  lastOrderDate?: Date;
  status?: string;
  createdAt?: Date;
  ordersCount?: number;
}

export interface Product {
  id: number;
  title: string;
  name?: string;
  price: string;
  image: string;
  images?: string[];
  isAvailable: boolean;
  createdAt: Date;
  type: "catalog" | "custom";
  category?: string;
  description?: string;
  preparationTime?: number;
  productionTime?: string;
  width?: string;
  height?: string;
  colors?: string[];
  catalogWidth?: string;
  catalogHeight?: string;
  ingredients?: string[];
}

export interface OrderItem {
  id?: number;
  productId: number;
  productTitle?: string;
  productImage?: string;
  quantity: number;
  unitPrice?: number;
  totalPrice?: number;
  price?: number;
  product?: Product;
}

export interface OrderHistoryItem {
  date: string;
  description: string;
  type: 'created' | 'paid' | 'assigned' | 'assembled' | 'delivery' | 'completed';
}

export interface Order {
  id: string;
  number: string;
  status: "new" | "paid" | "assembled" | "completed" | "accepted" | "in-transit";
  createdAt: Date;
  updatedAt?: Date;
  mainProduct?: Product;
  additionalItems?: OrderItem[];
  recipient?: Customer;
  sender?: Customer;
  deliveryType?: string;
  deliveryAddress?: string;
  deliveryCity?: string;
  deliveryDate?: "today" | "tomorrow";
  deliveryTime?: string;
  postcard?: string;
  comment?: string;
  anonymous?: boolean;
  payment?: {
    amount: number;
    status: string;
    method?: string;
  };
  executor?: User;
  courier?: User;
  photoBeforeDelivery?: string;
  history?: OrderHistoryItem[];

  // Additional fields for compatibility
  customerId?: number;
  recipientId?: number;
  executorId?: number;
  customer?: Customer;
  items?: OrderItem[];
  priority?: string;
  paymentStatus?: string;
  paymentMethod?: string;
  deliveryTimeRange?: string;
  totalPrice?: number;
  notes?: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  quantity: number;
  unit: string;
  price: string;
  category: "flowers" | "greenery" | "accessories";
  lastDelivery: Date;
  image: string;
  minQuantity?: number;
  pricePerUnit?: number;
  createdAt: Date;
  supplier?: string;
  lastRestocked?: Date;
  expiryDate?: Date | null;
  location?: string;
  status?: 'low' | 'normal';
}