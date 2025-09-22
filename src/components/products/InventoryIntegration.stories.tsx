import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { InventoryIntegration } from './InventoryIntegration';
import { Product, InventoryItem } from '../../src/types';

// Mock data
const mockProducts: Product[] = [
  {
    id: 1,
    title: 'Букет роз "Романтика"',
    name: 'Букет роз "Романтика"',
    price: '15000 ₸',
    image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=400',
    images: [],
    isAvailable: true,
    createdAt: new Date('2024-01-15'),
    type: 'catalog',
    category: 'Букеты',
    description: 'Романтичный букет из красных роз',
    ingredients: ['Розы красные', 'Зелень', 'Упаковка']
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
    ingredients: ['Тюльпаны', 'Гипсофила', 'Корзина']
  },
  {
    id: 3,
    title: 'Букет без привязки',
    name: 'Букет без привязки',
    price: '8000 ₸',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    images: [],
    isAvailable: true,
    createdAt: new Date('2024-01-05'),
    type: 'catalog',
    category: 'Букеты',
    description: 'Букет без указания состава',
    ingredients: []
  },
  {
    id: 4,
    title: 'Корзина с хризантемами',
    name: 'Корзина с хризантемами',
    price: '9500 ₸',
    image: 'https://images.unsplash.com/photo-1574684891174-df6b02ab38c9?w=400',
    images: [],
    isAvailable: false,
    createdAt: new Date('2024-01-20'),
    type: 'catalog',
    category: 'Корзины',
    description: 'Яркая корзина с хризантемами',
    ingredients: ['Хризантемы', 'Корзина', 'Зелень']
  },
  {
    id: 5,
    title: 'Букет с редкими материалами',
    name: 'Букет с редкими материалами',
    price: '25000 ₸',
    image: 'https://images.unsplash.com/photo-1520763185298-1b434c919102?w=400',
    images: [],
    isAvailable: true,
    createdAt: new Date('2024-01-12'),
    type: 'custom',
    category: 'Букеты',
    description: 'Эксклюзивный букет с редкими цветами',
    ingredients: ['Орхидеи', 'Экзотическая зелень', 'Дизайнерская упаковка']
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
    name: 'Гипсофила',
    quantity: 15,
    unit: 'пучок',
    price: '250 ₸',
    category: 'flowers',
    lastDelivery: new Date('2024-01-17'),
    image: 'https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=400',
    minQuantity: 5,
    pricePerUnit: 250,
    createdAt: new Date('2024-01-01'),
    status: 'normal'
  },
  {
    id: 4,
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
  },
  {
    id: 5,
    name: 'Упаковка',
    quantity: 8,
    unit: 'шт',
    price: '150 ₸',
    category: 'accessories',
    lastDelivery: new Date('2024-01-10'),
    image: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=400',
    minQuantity: 10,
    pricePerUnit: 150,
    createdAt: new Date('2024-01-01'),
    status: 'low'
  },
  {
    id: 6,
    name: 'Корзина',
    quantity: 12,
    unit: 'шт',
    price: '800 ₸',
    category: 'accessories',
    lastDelivery: new Date('2024-01-12'),
    image: 'https://images.unsplash.com/photo-1574684891174-df6b02ab38c9?w=400',
    minQuantity: 3,
    pricePerUnit: 800,
    createdAt: new Date('2024-01-01'),
    status: 'normal'
  },
  {
    id: 7,
    name: 'Хризантемы',
    quantity: 0,
    unit: 'шт',
    price: '400 ₸',
    category: 'flowers',
    lastDelivery: new Date('2024-01-08'),
    image: 'https://images.unsplash.com/photo-1574684891174-df6b02ab38c9?w=400',
    minQuantity: 15,
    pricePerUnit: 400,
    createdAt: new Date('2024-01-01'),
    status: 'normal'
  }
];

// Scenarios with different inventory levels
const goodInventoryItems: InventoryItem[] = mockInventoryItems.map(item => ({
  ...item,
  quantity: Math.max(item.minQuantity || 10, 20),
  status: 'normal' as const
}));

const criticalInventoryItems: InventoryItem[] = mockInventoryItems.map(item => ({
  ...item,
  quantity: 0,
  status: 'normal' as const
}));

const mixedInventoryItems: InventoryItem[] = mockInventoryItems.map((item, index) => ({
  ...item,
  quantity: index % 3 === 0 ? 0 : index % 3 === 1 ? 2 : 20,
  status: index % 3 === 1 ? 'low' as const : 'normal' as const
}));

const meta: Meta<typeof InventoryIntegration> = {
  title: 'Products/InventoryIntegration',
  component: InventoryIntegration,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Inventory integration component that shows product availability based on inventory levels, provides alerts for stock issues, and manages inventory-product relationships.'
      }
    }
  },
  argTypes: {
    products: {
      description: 'Array of products to analyze'
    },
    inventoryItems: {
      description: 'Array of inventory items for stock calculation'
    }
  }
};

export default meta;
type Story = StoryObj<typeof InventoryIntegration>;

// Default with mixed status
export const Default: Story = {
  args: {
    products: mockProducts,
    inventoryItems: mockInventoryItems,
    onUpdateProduct: action('onUpdateProduct'),
    onViewInventoryItem: action('onViewInventoryItem'),
    onAddInventoryItem: action('onAddInventoryItem'),
    onUpdateInventoryItem: action('onUpdateInventoryItem')
  }
};

// All products available
export const AllAvailable: Story = {
  args: {
    products: mockProducts,
    inventoryItems: goodInventoryItems,
    onUpdateProduct: action('onUpdateProduct'),
    onViewInventoryItem: action('onViewInventoryItem'),
    onAddInventoryItem: action('onAddInventoryItem'),
    onUpdateInventoryItem: action('onUpdateInventoryItem')
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario where all products have sufficient inventory and are available.'
      }
    }
  }
};

// Critical inventory situation
export const CriticalInventory: Story = {
  args: {
    products: mockProducts,
    inventoryItems: criticalInventoryItems,
    onUpdateProduct: action('onUpdateProduct'),
    onViewInventoryItem: action('onViewInventoryItem'),
    onAddInventoryItem: action('onAddInventoryItem'),
    onUpdateInventoryItem: action('onUpdateInventoryItem')
  },
  parameters: {
    docs: {
      description: {
        story: 'Critical scenario where most inventory items are out of stock, testing alert systems and critical status indicators.'
      }
    }
  }
};

// Mixed inventory levels
export const MixedInventory: Story = {
  args: {
    products: mockProducts,
    inventoryItems: mixedInventoryItems,
    onUpdateProduct: action('onUpdateProduct'),
    onViewInventoryItem: action('onViewInventoryItem'),
    onAddInventoryItem: action('onAddInventoryItem'),
    onUpdateInventoryItem: action('onUpdateInventoryItem')
  },
  parameters: {
    docs: {
      description: {
        story: 'Realistic scenario with mixed inventory levels - some good, some low, some out of stock.'
      }
    }
  }
};

// Empty inventory
export const EmptyInventory: Story = {
  args: {
    products: mockProducts,
    inventoryItems: [],
    onUpdateProduct: action('onUpdateProduct'),
    onViewInventoryItem: action('onViewInventoryItem'),
    onAddInventoryItem: action('onAddInventoryItem'),
    onUpdateInventoryItem: action('onUpdateInventoryItem')
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario with no inventory items, testing empty states and no-mapping scenarios.'
      }
    }
  }
};

// No products
export const NoProducts: Story = {
  args: {
    products: [],
    inventoryItems: mockInventoryItems,
    onUpdateProduct: action('onUpdateProduct'),
    onViewInventoryItem: action('onViewInventoryItem'),
    onAddInventoryItem: action('onAddInventoryItem'),
    onUpdateInventoryItem: action('onUpdateInventoryItem')
  },
  parameters: {
    docs: {
      description: {
        story: 'Scenario with no products to analyze, testing empty product states.'
      }
    }
  }
};

// Products without ingredients
export const ProductsWithoutIngredients: Story = {
  args: {
    products: mockProducts.map(product => ({
      ...product,
      ingredients: []
    })),
    inventoryItems: mockInventoryItems,
    onUpdateProduct: action('onUpdateProduct'),
    onViewInventoryItem: action('onViewInventoryItem'),
    onAddInventoryItem: action('onAddInventoryItem'),
    onUpdateInventoryItem: action('onUpdateInventoryItem')
  },
  parameters: {
    docs: {
      description: {
        story: 'Products without ingredient mapping, testing no-inventory-mapping scenarios.'
      }
    }
  }
};

// Large dataset for performance testing
export const LargeDataset: Story = {
  args: {
    products: Array.from({ length: 100 }, (_, i) => ({
      ...mockProducts[i % mockProducts.length],
      id: i + 1,
      title: `${mockProducts[i % mockProducts.length].title} ${i + 1}`,
      name: `${mockProducts[i % mockProducts.length].title} ${i + 1}`
    })),
    inventoryItems: Array.from({ length: 50 }, (_, i) => ({
      ...mockInventoryItems[i % mockInventoryItems.length],
      id: i + 1,
      name: `${mockInventoryItems[i % mockInventoryItems.length].name} ${i + 1}`
    })),
    onUpdateProduct: action('onUpdateProduct'),
    onViewInventoryItem: action('onViewInventoryItem'),
    onAddInventoryItem: action('onAddInventoryItem'),
    onUpdateInventoryItem: action('onUpdateInventoryItem')
  },
  parameters: {
    docs: {
      description: {
        story: 'Large dataset for testing performance and UI behavior with many products and inventory items.'
      }
    }
  }
};

// Single category focus
export const SingleCategory: Story = {
  args: {
    products: mockProducts.filter(product => product.category === 'Букеты'),
    inventoryItems: mockInventoryItems.filter(item => item.category === 'flowers'),
    onUpdateProduct: action('onUpdateProduct'),
    onViewInventoryItem: action('onViewInventoryItem'),
    onAddInventoryItem: action('onAddInventoryItem'),
    onUpdateInventoryItem: action('onUpdateInventoryItem')
  },
  parameters: {
    docs: {
      description: {
        story: 'Focus on a single category to test filtering and category-specific behavior.'
      }
    }
  }
};

// Mobile view
export const Mobile: Story = {
  args: {
    products: mockProducts,
    inventoryItems: mockInventoryItems,
    onUpdateProduct: action('onUpdateProduct'),
    onViewInventoryItem: action('onViewInventoryItem'),
    onAddInventoryItem: action('onAddInventoryItem'),
    onUpdateInventoryItem: action('onUpdateInventoryItem')
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile view of the inventory integration with touch-optimized interactions.'
      }
    }
  }
};

// Tablet view
export const Tablet: Story = {
  args: {
    products: mockProducts,
    inventoryItems: mockInventoryItems,
    onUpdateProduct: action('onUpdateProduct'),
    onViewInventoryItem: action('onViewInventoryItem'),
    onAddInventoryItem: action('onAddInventoryItem'),
    onUpdateInventoryItem: action('onUpdateInventoryItem')
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Tablet view showing responsive design adaptations for medium screens.'
      }
    }
  }
};