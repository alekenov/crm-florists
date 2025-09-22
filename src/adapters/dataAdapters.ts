// Адаптеры для преобразования данных между frontend и backend типами
import {
  Client as BackendClient,
  Product as BackendProduct,
  Inventory as BackendInventory,
  Order as BackendOrder
} from '../api/types';

// Импортируем типы frontend (из существующих типов)
import { Product, Customer, Order, InventoryItem } from '../types';

// ============== CLIENT/CUSTOMER ADAPTERS ==============
export function adaptBackendClientToCustomer(backendClient: BackendClient): Customer {
  return {
    id: backendClient.id,
    name: backendClient.name || `Клиент ${backendClient.phone}`,
    phone: backendClient.phone,
    email: backendClient.email,
    address: backendClient.address,
    // Mapping client_type to customer type
    type: backendClient.client_type,
    notes: backendClient.notes,
    createdAt: new Date(backendClient.created_at),
    ordersCount: 0, // Will be calculated separately
    totalSpent: 0,   // Will be calculated separately
    lastOrderDate: undefined // Will be calculated separately
  };
}

export function adaptCustomerToBackendClient(customer: Partial<Customer>): any {
  return {
    name: customer.name,
    phone: customer.phone,
    email: customer.email || undefined,
    address: customer.address || undefined,
    client_type: customer.type || 'заказчик',
    notes: customer.notes
  };
}

// ============== PRODUCT ADAPTERS ==============
export function adaptBackendProductToProduct(backendProduct: BackendProduct): Product {
  return {
    id: backendProduct.id,
    title: backendProduct.name,
    price: backendProduct.price.toString(),
    image: backendProduct.image_url || "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400",
    isAvailable: true,
    createdAt: new Date(backendProduct.created_at),
    type: "catalog", // Default type

    // Map category to appropriate fields
    description: backendProduct.description || undefined,
    preparationTime: backendProduct.preparation_time || undefined,

    // Default values for existing frontend fields
    width: "30",
    height: "40",
    colors: ["#4ecdc4"],
    productionTime: backendProduct.preparation_time ? `${backendProduct.preparation_time} мин` : "2-3 часа",
    catalogWidth: "25",
    catalogHeight: "35",
    ingredients: []
  };
}

export function adaptProductToBackendProduct(product: Partial<Product>): any {
  return {
    name: product.title,
    description: product.description || undefined,
    price: parseFloat(product.price || "0"),
    category: product.category || 'букет',
    preparation_time: product.preparationTime || undefined,
    image_url: product.image
  };
}

// ============== INVENTORY ADAPTERS ==============
export function adaptBackendInventoryToInventoryItem(backendInventory: BackendInventory): InventoryItem {
  return {
    id: backendInventory.id,
    name: backendInventory.name,
    quantity: backendInventory.quantity,
    unit: backendInventory.unit,

    // Map to expected frontend fields
    price: `${backendInventory.price_per_unit} ₸`,
    category: mapInventoryCategory(backendInventory.name),
    lastDelivery: new Date(backendInventory.created_at),
    image: getInventoryImage(backendInventory.name),

    // Additional fields for compatibility
    minQuantity: backendInventory.min_quantity || undefined,
    pricePerUnit: backendInventory.price_per_unit || undefined,
    createdAt: new Date(backendInventory.created_at),
    supplier: "Основной поставщик",
    lastRestocked: new Date(backendInventory.created_at),
    expiryDate: null,
    location: "Склад А",
    status: (backendInventory.min_quantity && backendInventory.quantity <= backendInventory.min_quantity) ? 'low' : 'normal'
  };
}

// Helper function to map inventory names to categories
function mapInventoryCategory(name: string): "flowers" | "greenery" | "accessories" {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('роз') || lowercaseName.includes('тюльпан') || lowercaseName.includes('лил') ||
      lowercaseName.includes('хризантем') || lowercaseName.includes('гипсофил')) {
    return 'flowers';
  }
  if (lowercaseName.includes('эвкалипт') || lowercaseName.includes('зелен')) {
    return 'greenery';
  }
  return 'accessories';
}

// Helper function to get default images for inventory items
function getInventoryImage(name: string): string {
  const lowercaseName = name.toLowerCase();
  if (lowercaseName.includes('роз')) {
    return "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=100&h=100&fit=crop";
  }
  if (lowercaseName.includes('тюльпан')) {
    return "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?w=100&h=100&fit=crop";
  }
  if (lowercaseName.includes('лил')) {
    return "https://images.unsplash.com/photo-1565011523534-747a8601f1a4?w=100&h=100&fit=crop";
  }
  if (lowercaseName.includes('эвкалипт')) {
    return "https://images.unsplash.com/photo-1586744687037-b4f9c5d1fcd8?w=100&h=100&fit=crop";
  }
  if (lowercaseName.includes('хризантем')) {
    return "https://images.unsplash.com/photo-1572731973537-34afe46c4bc6?w=100&h=100&fit=crop";
  }
  if (lowercaseName.includes('лент')) {
    return "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=100&h=100&fit=crop";
  }
  if (lowercaseName.includes('гипсофил')) {
    return "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop";
  }
  // Default image for unknown items
  return "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=100&h=100&fit=crop";
}

export function adaptInventoryItemToBackendInventory(item: Partial<InventoryItem>): any {
  return {
    name: item.name,
    quantity: item.quantity,
    unit: item.unit || 'шт',
    min_quantity: item.minQuantity || undefined,
    price_per_unit: item.pricePerUnit || undefined
  };
}

// ============== ORDER ADAPTERS ==============
function mapOrderStatus(backendStatus: string): "new" | "paid" | "assembled" | "completed" | "accepted" | "in-transit" {
  const statusMap: { [key: string]: "new" | "paid" | "assembled" | "completed" | "accepted" | "in-transit" } = {
    'новый': 'new',
    'оплачен': 'paid',
    'в работе': 'accepted',
    'в сборке': 'assembled',
    'собран': 'assembled',
    'собранный': 'assembled',
    'готов': 'assembled',
    'выполнен': 'completed',
    'доставлен': 'completed',
    'принят': 'accepted',
    'в доставке': 'in-transit'
  };
  return statusMap[backendStatus?.toLowerCase()] || 'new';
}

export function adaptBackendOrderToOrder(backendOrder: BackendOrder): Order {
  return {
    id: backendOrder.id.toString(),
    number: `ORD-${backendOrder.id.toString().padStart(6, '0')}`,
    customerId: backendOrder.client_id,
    recipientId: backendOrder.recipient_id,
    executorId: backendOrder.executor_id,

    // Map status
    status: mapOrderStatus(backendOrder.status),

    deliveryDate: "today" as const,
    deliveryAddress: backendOrder.delivery_address,
    deliveryTimeRange: backendOrder.delivery_time_range || 'В течение дня',

    totalPrice: backendOrder.total_price || 0,
    comment: backendOrder.comment,
    notes: backendOrder.notes,
    createdAt: new Date(backendOrder.created_at),

    // Map related entities
    customer: backendOrder.client ? adaptBackendClientToCustomer(backendOrder.client) : undefined,
    recipient: backendOrder.recipient ? adaptBackendClientToCustomer(backendOrder.recipient) : undefined,
    sender: backendOrder.client ? adaptBackendClientToCustomer(backendOrder.client) : undefined,
    executor: backendOrder.executor,
    courier: backendOrder.courier,

    // Map order items
    items: backendOrder.order_items?.map(item => ({
      id: item.id,
      productId: item.product_id,
      quantity: item.quantity,
      price: item.price,
      product: item.product ? adaptBackendProductToProduct(item.product) : undefined
    })) || [],

    // Create mainProduct from first item for compatibility
    mainProduct: backendOrder.order_items?.[0]?.product ?
      adaptBackendProductToProduct(backendOrder.order_items[0].product) : undefined,

    // Additional items (all except first)
    additionalItems: backendOrder.order_items?.slice(1).map(item => ({
      productId: item.product_id,
      productTitle: item.product?.name || 'Товар',
      productImage: item.product?.image_url || "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400",
      quantity: item.quantity,
      unitPrice: item.price
    })) || [],

    // Payment and delivery information
    payment: {
      amount: backendOrder.total_price || 0,
      status: 'pending',
      method: 'cash'
    },

    // Default values for existing frontend fields
    priority: 'normal',
    paymentStatus: 'pending',
    paymentMethod: 'cash'
  };
}

export function adaptOrderToBackendOrder(order: Partial<Order>): any {
  // Convert deliveryDate string to ISO string
  let deliveryDateISO: string | undefined;
  if (order.deliveryDate === "today") {
    deliveryDateISO = new Date().toISOString();
  } else if (order.deliveryDate === "tomorrow") {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    deliveryDateISO = tomorrow.toISOString();
  }

  return {
    client_id: order.customerId,
    recipient_id: order.recipientId,
    executor_id: order.executorId,
    delivery_date: deliveryDateISO,
    delivery_address: order.deliveryAddress,
    delivery_time_range: order.deliveryTimeRange || order.deliveryTime,
    comment: order.comment,
    notes: order.notes,
    items: order.items?.map(item => ({
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price || item.unitPrice || 0
    })) || []
  };
}

// ============== BULK ADAPTERS ==============
export function adaptBackendClientsToCustomers(backendClients: BackendClient[]): Customer[] {
  return backendClients.map(adaptBackendClientToCustomer);
}

export function adaptBackendProductsToProducts(backendProducts: BackendProduct[]): Product[] {
  return backendProducts.map(adaptBackendProductToProduct);
}

export function adaptBackendInventoryToInventoryItems(backendInventory: BackendInventory[]): InventoryItem[] {
  return backendInventory.map(adaptBackendInventoryToInventoryItem);
}

export function adaptBackendOrdersToOrders(backendOrders: BackendOrder[]): Order[] {
  return backendOrders.map(adaptBackendOrderToOrder);
}