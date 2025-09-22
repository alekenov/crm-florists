// Data adapters to convert between SQLModel API and React frontend types
import { SQLOrder, SQLClient, SQLProduct, SQLOrderItem, STATUS_MAPPING } from '../types/sql-api';
import { Order, Customer, Product, OrderItem } from '../types';

export class DataAdapters {

  /**
   * Convert SQLClient to React Customer
   */
  static sqlClientToCustomer(sqlClient: SQLClient): Customer {
    return {
      id: sqlClient.id,
      name: sqlClient.name || undefined,
      phone: sqlClient.phone,
      memberSince: new Date(sqlClient.created_at),
      totalOrders: 0, // Will be calculated on backend later
      totalSpent: 0, // Will be calculated on backend later
      lastOrderDate: undefined, // Will be calculated on backend later
      status: "active", // Default status
      notes: sqlClient.notes || undefined,
    };
  }

  /**
   * Convert SQLProduct to React Product (simplified for orders)
   */
  static sqlProductToReactProduct(sqlProduct: SQLProduct): Product {
    return {
      id: sqlProduct.id,
      image: sqlProduct.image_url || '/placeholder.jpg',
      images: sqlProduct.image_url ? [sqlProduct.image_url] : undefined,
      title: sqlProduct.name,
      price: sqlProduct.price.toString(),
      isAvailable: true, // Assume available if in API
      createdAt: new Date(sqlProduct.created_at),
      type: "catalog", // Default type
      productionTime: sqlProduct.preparation_time?.toString(),
    };
  }

  /**
   * Convert SQLOrderItem to React OrderItem
   */
  static sqlOrderItemToReactOrderItem(sqlOrderItem: SQLOrderItem): OrderItem {
    return {
      productId: sqlOrderItem.product_id,
      productTitle: sqlOrderItem.product.name,
      productImage: sqlOrderItem.product.image_url || '/placeholder.jpg',
      quantity: sqlOrderItem.quantity,
      unitPrice: sqlOrderItem.price,
      totalPrice: sqlOrderItem.quantity * sqlOrderItem.price,
    };
  }

  /**
   * Convert SQLOrder to React Order (main conversion)
   */
  static sqlOrderToReactOrder(sqlOrder: SQLOrder): Order {
    // Get the main product from the first order item
    const mainProductData = sqlOrder.order_items[0]?.product;
    const mainProduct = mainProductData
      ? this.sqlProductToReactProduct(mainProductData)
      : {
          id: 0,
          image: '/placeholder.jpg',
          title: 'Продукт не найден',
          price: '0',
          isAvailable: false,
          createdAt: new Date(),
          type: "catalog" as const,
        };

    // Convert additional items (skip first one since it's main product)
    const additionalItems = sqlOrder.order_items.slice(1).map(item =>
      this.sqlOrderItemToReactOrderItem(item)
    );

    // Convert delivery date from ISO string to "today"/"tomorrow"
    const deliveryDate = this.convertDeliveryDate(sqlOrder.delivery_date);

    return {
      id: sqlOrder.id.toString(),
      number: `ORD-${sqlOrder.id.toString().padStart(4, '0')}`,
      status: STATUS_MAPPING.toReact[sqlOrder.status] || 'new',
      createdAt: new Date(sqlOrder.created_at),
      updatedAt: new Date(sqlOrder.updated_at || sqlOrder.created_at),
      mainProduct,
      additionalItems: additionalItems.length > 0 ? additionalItems : undefined,
      recipient: this.sqlClientToCustomer(sqlOrder.recipient),
      sender: this.sqlClientToCustomer(sqlOrder.client),
      deliveryType: "delivery", // Default to delivery
      deliveryAddress: sqlOrder.delivery_address,
      deliveryCity: "Алматы", // Default city - TODO: extract from address
      deliveryDate,
      deliveryTime: sqlOrder.delivery_time_range || undefined,
      postcard: undefined, // Not in current SQL model
      comment: sqlOrder.comment || undefined,
      anonymous: false, // Default to false
      payment: {
        amount: sqlOrder.total_price || 0,
        status: sqlOrder.status === 'новый' ? 'unpaid' : 'paid',
        method: undefined, // Not in current SQL model
      },
      executor: sqlOrder.executor ? {
        florist: sqlOrder.executor.username,
        courier: undefined, // Not separated in current model
      } : undefined,
      photoBeforeDelivery: undefined, // Not in current SQL model
      history: sqlOrder.history?.map(h => ({
        date: h.timestamp,
        description: h.comment || h.action,
        type: this.mapHistoryType(h.action),
      })),
    };
  }

  /**
   * Convert React Order updates back to SQL format for API calls
   */
  static reactOrderToSQLUpdate(reactOrder: Partial<Order>): Partial<SQLOrder> {
    const sqlUpdate: any = {};

    if (reactOrder.status) {
      sqlUpdate.status = STATUS_MAPPING.toSQL[reactOrder.status];
    }

    if (reactOrder.deliveryAddress) {
      sqlUpdate.delivery_address = reactOrder.deliveryAddress;
    }

    if (reactOrder.deliveryDate) {
      sqlUpdate.delivery_date = this.convertReactDateToSQL(reactOrder.deliveryDate);
    }

    if (reactOrder.deliveryTime) {
      sqlUpdate.delivery_time_range = reactOrder.deliveryTime;
    }

    if (reactOrder.comment !== undefined) {
      sqlUpdate.comment = reactOrder.comment;
    }

    if (reactOrder.executor?.florist) {
      // Note: This would need to be handled differently
      // as we need to lookup user ID by username
      sqlUpdate.executor_id = 1; // Placeholder
    }

    return sqlUpdate;
  }

  /**
   * Helper: Convert ISO date string to "today"/"tomorrow"
   */
  private static convertDeliveryDate(isoDate: string): "today" | "tomorrow" {
    const orderDate = new Date(isoDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Simple comparison by date (ignoring time)
    const orderDateStr = orderDate.toDateString();
    const todayStr = today.toDateString();
    const tomorrowStr = tomorrow.toDateString();

    if (orderDateStr === todayStr) return "today";
    if (orderDateStr === tomorrowStr) return "tomorrow";

    // Default to tomorrow for future dates
    return "tomorrow";
  }

  /**
   * Helper: Convert React date to SQL datetime
   */
  private static convertReactDateToSQL(reactDate: "today" | "tomorrow"): string {
    const baseDate = new Date();

    if (reactDate === "tomorrow") {
      baseDate.setDate(baseDate.getDate() + 1);
    }

    // Set default delivery time to 12:00
    baseDate.setHours(12, 0, 0, 0);

    return baseDate.toISOString();
  }

  /**
   * Helper: Map SQL history action to React history type
   */
  private static mapHistoryType(action: string): 'created' | 'paid' | 'assigned' | 'assembled' | 'delivery' | 'completed' {
    const actionLower = action.toLowerCase();

    if (actionLower.includes('создан')) return 'created';
    if (actionLower.includes('оплач')) return 'paid';
    if (actionLower.includes('назначен')) return 'assigned';
    if (actionLower.includes('собран')) return 'assembled';
    if (actionLower.includes('доставк')) return 'delivery';
    if (actionLower.includes('завершен')) return 'completed';

    return 'created'; // Default fallback
  }
}