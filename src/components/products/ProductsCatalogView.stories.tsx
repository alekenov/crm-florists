import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ProductsCatalogView } from './ProductsCatalogView';
import { Product, InventoryItem } from '../../src/types';

// Mock data
const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Букет роз "Романтика"',
    name: 'Букет роз "Романтика"',
    price: '15000 ₸',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400',
    images: [
      'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400',
      'https://images.unsplash.com/photo-1606041011872-596597976b25?w=400'
    ],
    isAvailable: true,
    createdAt: new Date('2024-01-15'),
    type: 'catalog',
    category: 'Букеты',
    description: 'Романтичный букет из красных роз',
    preparationTime: 30,
    productionTime: '30 минут',
    width: '25 см',
    height: '40 см',
    colors: ['Красный'],
    ingredients: ['Розы', 'Зелень', 'Упаковка']
  },
  {
    id: 2,
    title: 'Композиция "Весенняя свежесть"',
    name: 'Композиция "Весенняя свежесть"',
    price: '12000 ₸',
    image: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=400',
    images: [],
    isAvailable: true,
    createdAt: new Date('2024-01-10'),
    type: 'catalog',
    category: 'Композиции',
    description: 'Нежная весенняя композиция',
    preparationTime: 45,
    productionTime: '45 минут',
    width: '30 см',
    height: '25 см',
    colors: ['Белый', 'Розовый', 'Желтый'],
    ingredients: ['Тюльпаны', 'Гипсофила', 'Корзина']
  },
  {
    id: 3,
    title: 'Индивидуальный букет',
    name: 'Индивидуальный букет',
    price: 'от 8000 ₸',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    images: [],
    isAvailable: false,
    createdAt: new Date('2024-01-05'),
    type: 'custom',
    category: 'Букеты',
    description: 'Букет по индивидуальному заказу',
    preparationTime: 60,
    productionTime: '1 час',
    colors: ['Смешанный'],
    ingredients: []
  },
  {
    id: 4,
    title: 'Корзина с хризантемами',
    name: 'Корзина с хризантемами',
    price: '9500 ₸',
    image: 'https://images.unsplash.com/photo-1574684891174-df6b02ab38c9?w=400',
    images: [],
    isAvailable: true,
    createdAt: new Date('2024-01-20'),
    type: 'vitrina',
    category: 'Корзины',
    description: 'Яркая корзина с хризантемами',
    preparationTime: 40,
    productionTime: '40 минут',
    width: '35 см',
    height: '30 см',
    colors: ['Желтый', 'Оранжевый'],
    ingredients: ['Хризантемы', 'Корзина', 'Зелень']
  },
  {
    id: 5,
    title: 'Букет без фото',
    name: 'Букет без фото',
    price: '7000 ₸',
    image: '',
    images: [],
    isAvailable: false,
    createdAt: new Date('2024-01-25'),
    type: 'catalog',
    category: 'Букеты',
    description: 'Пример товара без изображения',
    ingredients: ['Гвоздики']
  }
];

const mockInventoryItems: InventoryItem[] = [
  {
    id: 1,
    name: 'Розы красные',
    quantity: 50,
    unit: 'шт',
    price: '500 ₸',
    category: 'flowers',
    lastDelivery: new Date('2024-01-20'),
    image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
    minQuantity: 10,
    pricePerUnit: 500,
    createdAt: new Date('2024-01-01'),
    status: 'normal'
  },
  {
    id: 2,
    name: 'Тюльпаны',
    quantity: 5,
    unit: 'шт',
    price: '300 ₸',
    category: 'flowers',
    lastDelivery: new Date('2024-01-18'),
    image: 'https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=400',
    minQuantity: 10,
    pricePerUnit: 300,
    createdAt: new Date('2024-01-01'),
    status: 'low'
  },
  {
    id: 3,
    name: 'Зелень',
    quantity: 0,
    unit: 'пучок',
    price: '200 ₸',
    category: 'greenery',
    lastDelivery: new Date('2024-01-15'),
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    minQuantity: 5,
    pricePerUnit: 200,
    createdAt: new Date('2024-01-01'),
    status: 'normal'
  }
];

const meta: Meta<typeof ProductsCatalogView> = {
  title: 'Products/ProductsCatalogView',
  component: ProductsCatalogView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Comprehensive products catalog view with grid/list modes, advanced filtering, search, and inventory integration.'
      }
    }
  },
  argTypes: {
    products: {
      description: 'Array of products to display'
    },
    inventoryItems: {
      description: 'Array of inventory items for stock status calculation'
    }
  }
};

export default meta;
type Story = StoryObj<typeof ProductsCatalogView>;

// Default story
export const Default: Story = {
  args: {
    products: mockProducts,
    inventoryItems: mockInventoryItems,
    onAddProduct: action('onAddProduct'),
    onViewProduct: action('onViewProduct'),
    onEditProduct: action('onEditProduct'),
    onDuplicateProduct: action('onDuplicateProduct'),
    onDeleteProduct: action('onDeleteProduct'),
    onToggleProduct: action('onToggleProduct'),
    onBulkToggle: action('onBulkToggle'),
    onBulkDelete: action('onBulkDelete')
  }
};

// Empty state
export const EmptyState: Story = {
  args: {
    products: [],
    inventoryItems: [],
    onAddProduct: action('onAddProduct'),
    onViewProduct: action('onViewProduct'),
    onEditProduct: action('onEditProduct'),
    onDuplicateProduct: action('onDuplicateProduct'),
    onDeleteProduct: action('onDeleteProduct'),
    onToggleProduct: action('onToggleProduct')
  }
};

// Only vitrina products
export const VitrinaOnly: Story = {
  args: {
    products: mockProducts.filter(p => p.type === 'vitrina'),
    inventoryItems: mockInventoryItems,
    onAddProduct: action('onAddProduct'),
    onViewProduct: action('onViewProduct'),
    onEditProduct: action('onEditProduct'),
    onDuplicateProduct: action('onDuplicateProduct'),
    onDeleteProduct: action('onDeleteProduct'),
    onToggleProduct: action('onToggleProduct')
  }
};

// Only catalog products
export const CatalogOnly: Story = {
  args: {
    products: mockProducts.filter(p => p.type === 'catalog'),
    inventoryItems: mockInventoryItems,
    onAddProduct: action('onAddProduct'),
    onViewProduct: action('onViewProduct'),
    onEditProduct: action('onEditProduct'),
    onDuplicateProduct: action('onDuplicateProduct'),
    onDeleteProduct: action('onDeleteProduct'),
    onToggleProduct: action('onToggleProduct')
  }
};

// With search query (simulated via URL params)
export const WithSearch: Story = {
  args: {
    products: mockProducts,
    inventoryItems: mockInventoryItems,
    onAddProduct: action('onAddProduct'),
    onViewProduct: action('onViewProduct'),
    onEditProduct: action('onEditProduct'),
    onDuplicateProduct: action('onDuplicateProduct'),
    onDeleteProduct: action('onDeleteProduct'),
    onToggleProduct: action('onToggleProduct')
  },
  parameters: {
    docs: {
      description: {
        story: 'Catalog view with search functionality enabled. In this example, you can test the search feature.'
      }
    }
  }
};

// Many products for testing performance
export const ManyProducts: Story = {
  args: {
    products: Array.from({ length: 50 }, (_, i) => ({
      ...mockProducts[i % mockProducts.length],
      id: i + 1,
      title: `${mockProducts[i % mockProducts.length].title} ${i + 1}`,
      name: `${mockProducts[i % mockProducts.length].title} ${i + 1}`
    })),
    inventoryItems: mockInventoryItems,
    onAddProduct: action('onAddProduct'),
    onViewProduct: action('onViewProduct'),
    onEditProduct: action('onEditProduct'),
    onDuplicateProduct: action('onDuplicateProduct'),
    onDeleteProduct: action('onDeleteProduct'),
    onToggleProduct: action('onToggleProduct')
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing with many products to verify performance and UI behavior with large datasets.'
      }
    }
  }
};

// Low inventory scenario
export const LowInventory: Story = {
  args: {
    products: mockProducts,
    inventoryItems: mockInventoryItems.map(item => ({
      ...item,
      quantity: item.quantity > 0 ? Math.min(item.quantity, 2) : 0,
      status: item.quantity > 0 ? 'low' as const : 'normal' as const
    })),
    onAddProduct: action('onAddProduct'),
    onViewProduct: action('onViewProduct'),
    onEditProduct: action('onEditProduct'),
    onDuplicateProduct: action('onDuplicateProduct'),
    onDeleteProduct: action('onDeleteProduct'),
    onToggleProduct: action('onToggleProduct')
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario with low inventory levels to test stock status indicators and warnings.'
      }
    }
  }
};

// Mobile viewport
export const Mobile: Story = {
  args: {
    products: mockProducts,
    inventoryItems: mockInventoryItems,
    onAddProduct: action('onAddProduct'),
    onViewProduct: action('onViewProduct'),
    onEditProduct: action('onEditProduct'),
    onDuplicateProduct: action('onDuplicateProduct'),
    onDeleteProduct: action('onDeleteProduct'),
    onToggleProduct: action('onToggleProduct')
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile view of the products catalog with touch-friendly interactions.'
      }
    }
  }
};

// Tablet viewport
export const Tablet: Story = {
  args: {
    products: mockProducts,
    inventoryItems: mockInventoryItems,
    onAddProduct: action('onAddProduct'),
    onViewProduct: action('onViewProduct'),
    onEditProduct: action('onEditProduct'),
    onDuplicateProduct: action('onDuplicateProduct'),
    onDeleteProduct: action('onDeleteProduct'),
    onToggleProduct: action('onToggleProduct')
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Tablet view showing the responsive design adaptations.'
      }
    }
  }
};