// Адаптеры для преобразования данных между frontend и backend типами
import {
  Client as BackendClient,
  Product as BackendProduct,
  Inventory as BackendInventory,
  Order as BackendOrder
} from '../api/types';

// Импортируем типы frontend (из существующих типов)
import { Product, Customer, Order, InventoryItem, OrderHistoryItem } from '../types';

// ============== CLIENT/CUSTOMER ADAPTERS ==============
export function adaptBackendClientToCustomer(backendClient: BackendClient): Customer {
  // Map client_type to status
  let status: 'active' | 'vip' | 'inactive' = 'active';
  if (backendClient.client_type === 'vip') {
    status = 'vip';
  } else if (backendClient.client_type === 'inactive') {
    status = 'inactive';
  }

  return {
    id: backendClient.id,
    name: backendClient.name || `Клиент ${backendClient.phone}`,
    phone: backendClient.phone,
    email: backendClient.email,
    address: backendClient.address,
    status: status,
    notes: backendClient.notes,
    memberSince: new Date(backendClient.created_at),
    totalOrders: 0, // Will be calculated separately or from backend
    totalSpent: 0,   // Will be calculated separately or from backend
    lastOrderDate: new Date() // Will be calculated separately or from backend
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
  // Parse JSON strings for arrays
  let parsedImages = [];
  let parsedColors = [];
  let parsedComposition = [];

  try {
    if (backendProduct.images) {
      parsedImages = JSON.parse(backendProduct.images);
    }
  } catch (e) {
    parsedImages = [];
  }

  try {
    if (backendProduct.colors) {
      parsedColors = JSON.parse(backendProduct.colors);
    }
  } catch (e) {
    parsedColors = ["#4ecdc4"];
  }

  try {
    if (backendProduct.composition) {
      parsedComposition = JSON.parse(backendProduct.composition);
    }
  } catch (e) {
    parsedComposition = [];
  }

  return {
    id: backendProduct.id,
    title: backendProduct.name,
    price: backendProduct.price.toString(),
    image: backendProduct.image_url || parsedImages[0] || "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400",
    images: parsedImages,
    isAvailable: backendProduct.is_available !== false,
    createdAt: new Date(backendProduct.created_at),
    type: (backendProduct.type || "catalog") as "catalog" | "vitrina",

    // Map category to appropriate fields
    description: backendProduct.description || undefined,
    preparationTime: backendProduct.preparation_time || undefined,
    preparation_time: backendProduct.preparation_time || undefined, // Add both formats for compatibility

    // New fields
    discount: backendProduct.discount?.toString() || undefined,
    composition: parsedComposition,
    productionTime: backendProduct.production_time || undefined,
    production_time: backendProduct.production_time || undefined, // Add both formats for compatibility

    // Size fields
    width: backendProduct.width || "30",
    height: backendProduct.height || "40",
    colors: parsedColors.length > 0 ? parsedColors : ["#4ecdc4"],
    catalogWidth: backendProduct.width || "25",
    catalogHeight: backendProduct.height || "35",
    ingredients: [],
    expiryDate: backendProduct.expiry_date ? new Date(backendProduct.expiry_date) : undefined
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

// Helper function to generate order history based on status and creation date
function generateOrderHistory(order: BackendOrder): OrderHistoryItem[] {
  const history: OrderHistoryItem[] = [];
  const createdAt = new Date(order.created_at);

  // Add order creation event
  history.push({
    date: createdAt.toISOString(),
    description: 'Заказ был создан в системе',
    type: 'created'
  });

  // Based on status, add relevant history events
  const status = order.status?.toLowerCase();
  const baseTime = createdAt.getTime();

  if (status !== 'новый') {
    // Add payment event (5-30 minutes after creation)
    const paymentTime = new Date(baseTime + (5 + Math.random() * 25) * 60 * 1000);
    history.push({
      date: paymentTime.toISOString(),
      description: 'Заказ был оплачен',
      type: 'paid'
    });
  }

  if (['в работе', 'собран', 'собранный', 'готов', 'доставлен', 'выполнен'].includes(status || '')) {
    // Add assignment event (1-6 hours after creation)
    const assignmentTime = new Date(baseTime + (1 + Math.random() * 5) * 60 * 60 * 1000);
    history.push({
      date: assignmentTime.toISOString(),
      description: `Заказ принят в работу${order.executor ? ` флористом ${order.executor.name || order.executor.username}` : ''}`,
      type: 'assigned'
    });
  }

  if (['собран', 'собранный', 'готов', 'доставлен', 'выполнен', 'в доставке'].includes(status || '')) {
    // Add assembly event (2-8 hours after creation)
    const assemblyTime = new Date(baseTime + (2 + Math.random() * 6) * 60 * 60 * 1000);
    history.push({
      date: assemblyTime.toISOString(),
      description: 'Заказ собран и готов к доставке',
      type: 'assembled'
    });
  }

  if (['в доставке'].includes(status || '')) {
    // Add delivery start event
    const deliveryTime = new Date(baseTime + (4 + Math.random() * 4) * 60 * 60 * 1000);
    history.push({
      date: deliveryTime.toISOString(),
      description: `Заказ передан курьеру${order.courier ? ` ${order.courier.name || order.courier.username}` : ''}`,
      type: 'delivery'
    });
  }

  if (['доставлен', 'выполнен'].includes(status || '')) {
    // Add completion event
    const completionTime = new Date(baseTime + (6 + Math.random() * 6) * 60 * 60 * 1000);
    history.push({
      date: completionTime.toISOString(),
      description: 'Заказ успешно доставлен',
      type: 'completed'
    });
  }

  return history.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Helper function to format delivery date in Russian
function formatDeliveryDate(date?: string | Date): string {
  if (!date) return 'Не указана';

  const deliveryDate = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dayAfterTomorrow = new Date(today);
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

  // Reset time for comparison
  today.setHours(0, 0, 0, 0);
  tomorrow.setHours(0, 0, 0, 0);
  dayAfterTomorrow.setHours(0, 0, 0, 0);
  const compareDate = new Date(deliveryDate);
  compareDate.setHours(0, 0, 0, 0);

  if (compareDate.getTime() === today.getTime()) {
    return 'Сегодня';
  } else if (compareDate.getTime() === tomorrow.getTime()) {
    return 'Завтра';
  } else if (compareDate.getTime() === dayAfterTomorrow.getTime()) {
    return 'Послезавтра';
  } else {
    // Format as DD.MM.YYYY
    const day = compareDate.getDate().toString().padStart(2, '0');
    const month = (compareDate.getMonth() + 1).toString().padStart(2, '0');
    const year = compareDate.getFullYear();
    return `${day}.${month}.${year}`;
  }
}

// Helper function to extract city from address
function extractCityFromAddress(address?: string): string | null {
  if (!address) return null;

  // Common Kazakhstan cities
  const cities = ['Алматы', 'Астана', 'Нур-Султан', 'Шымкент', 'Караганда', 'Актобе', 'Тараз', 'Павлодар', 'Усть-Каменогорск', 'Семей'];

  for (const city of cities) {
    if (address.includes(city)) {
      return city;
    }
  }

  // If address ends with a city name after comma
  const parts = address.split(',');
  if (parts.length > 1) {
    const lastPart = parts[parts.length - 1].trim();
    if (lastPart && !lastPart.includes('кв.') && !lastPart.includes('д.') && !lastPart.includes('офис')) {
      return lastPart;
    }
  }

  return null;
}

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

    deliveryDate: formatDeliveryDate(backendOrder.delivery_date),
    deliveryAddress: backendOrder.delivery_address,
    deliveryCity: extractCityFromAddress(backendOrder.delivery_address) || 'Алматы',
    deliveryTime: backendOrder.delivery_time || undefined,
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

    // Generate order history based on status and data
    history: generateOrderHistory(backendOrder),

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