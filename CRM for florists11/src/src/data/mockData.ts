// Моковые данные для приложения цветочного магазина
import { Product, Customer, Order, InventoryItem } from '../types';

export const mockProducts: Product[] = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400",
    title: "Букет из красных роз",
    price: "2500",
    isAvailable: true,
    createdAt: new Date("2024-01-15"),
    type: "vitrina",
    width: "30",
    height: "40"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400",
    title: "Букет весенних тюльпанов",
    price: "1800",
    isAvailable: true,
    createdAt: new Date("2024-01-16"),
    type: "catalog",
    video: "https://example.com/video.mp4",
    duration: "2-3 часа",
    colors: ["#ff6b6b", "#4ecdc4", "#45b7d1"],
    productionTime: "2-3 часа",
    catalogWidth: "25",
    catalogHeight: "35",
    ingredients: [
      {
        inventoryItemId: 1,
        name: "Тюльпаны красные",
        quantity: 15,
        unit: "шт",
        costPerUnit: 120
      },
      {
        inventoryItemId: 2,
        name: "Упаковочная бумага",
        quantity: 1,
        unit: "лист",
        costPerUnit: 50
      }
    ]
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=400",
    title: "Композиция с пионами",
    price: "3200",
    isAvailable: false,
    createdAt: new Date("2024-01-17"),
    type: "catalog",
    colors: ["#ff69b4", "#fff", "#90ee90"],
    productionTime: "4-5 часов",
    catalogWidth: "35",
    catalogHeight: "30"
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 1,
    name: "Анна Смирнова",
    phone: "+7 (999) 123-45-67",
    memberSince: new Date("2023-06-15"),
    totalOrders: 12,
    totalSpent: 28500,
    lastOrderDate: new Date("2024-01-10"),
    status: "vip",
    notes: "Предпочитает розы и пионы"
  },
  {
    id: 2,
    phone: "+7 (999) 876-54-32",
    memberSince: new Date("2023-12-01"),
    totalOrders: 3,
    totalSpent: 7200,
    lastOrderDate: new Date("2024-01-05"),
    status: "active"
  },
  {
    id: 3,
    name: "Михаил Петров",
    phone: "+7 (999) 555-33-22",
    memberSince: new Date("2023-03-10"),
    totalOrders: 25,
    totalSpent: 65000,
    lastOrderDate: new Date("2024-01-12"),
    status: "vip",
    notes: "Постоянный клиент, заказывает для офиса"
  }
];

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    number: "2024-001",
    status: "new",
    createdAt: new Date("2024-01-15T10:30:00"),
    updatedAt: new Date("2024-01-15T10:30:00"),
    mainProduct: mockProducts[0],
    recipient: mockCustomers[0],
    sender: mockCustomers[0],
    deliveryType: "delivery",
    deliveryAddress: "ул. Пушкина, д. 10, кв. 5",
    deliveryCity: "Москва",
    deliveryDate: "today",
    deliveryTime: "14:00-16:00",
    postcard: "С Днем Рождения!",
    anonymous: false,
    payment: {
      amount: 2500,
      status: "unpaid"
    },
    history: [
      {
        date: "2024-01-15T10:30:00",
        description: "Заказ создан",
        type: "created"
      }
    ]
  },
  {
    id: "ORD-002",
    number: "2024-002",
    status: "accepted",
    createdAt: new Date("2024-01-14T15:20:00"),
    updatedAt: new Date("2024-01-14T16:00:00"),
    mainProduct: mockProducts[1],
    recipient: mockCustomers[1],
    sender: mockCustomers[1],
    deliveryType: "pickup",
    deliveryCity: "Москва",
    deliveryDate: "tomorrow",
    anonymous: false,
    payment: {
      amount: 1800,
      status: "paid",
      method: "card"
    },
    executor: {
      florist: "Елена Иванова"
    },
    history: [
      {
        date: "2024-01-14T15:20:00",
        description: "Заказ создан",
        type: "created"
      },
      {
        date: "2024-01-14T15:25:00",
        description: "Оплата получена",
        type: "paid"
      },
      {
        date: "2024-01-14T16:00:00",
        description: "Заказ принят в работу",
        type: "accepted"
      }
    ]
  }
];

export const mockInventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: "Розы красные",
    category: "flowers",
    price: "150",
    unit: "шт",
    quantity: 48,
    lastDelivery: new Date("2024-01-10"),
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=200"
  },
  {
    id: 2,
    name: "Тюльпаны красные",
    category: "flowers",
    price: "120",
    unit: "шт",
    quantity: 32,
    lastDelivery: new Date("2024-01-12"),
    image: "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=200"
  },
  {
    id: 3,
    name: "Эвкалипт",
    category: "greenery",
    price: "80",
    unit: "ветка",
    quantity: 15,
    lastDelivery: new Date("2024-01-08"),
    image: "https://images.unsplash.com/photo-1542984384-5f50ed1af2a7?w=200"
  },
  {
    id: 4,
    name: "Упаковочная бумага",
    category: "accessories",
    price: "50",
    unit: "лист",
    quantity: 25,
    lastDelivery: new Date("2024-01-05"),
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=200"
  }
];