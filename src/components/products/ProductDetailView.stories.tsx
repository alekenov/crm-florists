import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { ProductDetailView } from './ProductDetailView';
import { Product, InventoryItem } from '../../src/types';

// Mock data
const mockProduct: Product = {
  id: 1,
  title: 'Букет роз "Романтика"',
  name: 'Букет роз "Романтика"',
  price: '15000 ₸',
  image: 'https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=800',
  images: [
    'https://images.unsplash.com/photo-1606041011872-596597976b25?w=800',
    'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=800',
    'https://images.unsplash.com/photo-1574684891174-df6b02ab38c9?w=800'
  ],
  isAvailable: true,
  createdAt: new Date('2024-01-15T10:30:00'),
  type: 'catalog',
  category: 'Букеты',
  description: 'Романтичный букет из красных роз премиум качества. Идеально подходит для особых моментов и выражения глубоких чувств. Каждая роза тщательно отобрана нашими флористами.',
  preparationTime: 30,
  productionTime: '30 минут',
  width: '25 см',
  height: '40 см',
  colors: ['Красный', 'Зеленый'],
  ingredients: ['Розы красные', 'Гипсофила', 'Зелень', 'Упаковка', 'Лента']
};

const mockProductMinimal: Product = {
  id: 2,
  title: 'Простой букет',
  name: 'Простой букет',
  price: '5000 ₸',
  image: 'https://images.unsplash.com/photo-1496062031456-07b8f162a322?w=400',
  images: [],
  isAvailable: false,
  createdAt: new Date('2024-01-20T14:15:00'),
  type: 'custom'
};

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
    name: 'Гипсофила',
    quantity: 15,
    unit: 'пучок',
    price: '300 ₸',
    category: 'flowers',
    lastDelivery: new Date('2024-01-18'),
    image: 'https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=400',
    minQuantity: 5,
    pricePerUnit: 300,
    createdAt: new Date('2024-01-01'),
    status: 'normal'
  },
  {
    id: 3,
    name: 'Зелень',
    quantity: 3,
    unit: 'пучок',
    price: '200 ₸',
    category: 'greenery',
    lastDelivery: new Date('2024-01-15'),
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    minQuantity: 5,
    pricePerUnit: 200,
    createdAt: new Date('2024-01-01'),
    status: 'low'
  },
  {
    id: 4,
    name: 'Упаковка',
    quantity: 0,
    unit: 'шт',
    price: '150 ₸',
    category: 'accessories',
    lastDelivery: new Date('2024-01-10'),
    image: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=400',
    minQuantity: 10,
    pricePerUnit: 150,
    createdAt: new Date('2024-01-01'),
    status: 'normal'
  }
];

const meta: Meta<typeof ProductDetailView> = {
  title: 'Products/ProductDetailView',
  component: ProductDetailView,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Detailed product view with editing capabilities, image gallery, inventory integration, and comprehensive product information display.'
      }
    }
  },
  argTypes: {
    product: {
      description: 'Product data to display'
    },
    inventoryItems: {
      description: 'Related inventory items for stock status'
    },
    isEditing: {
      description: 'Whether the component is in edit mode',
      control: 'boolean'
    }
  }
};

export default meta;
type Story = StoryObj<typeof ProductDetailView>;

// View mode (default)
export const ViewMode: Story = {
  args: {
    product: mockProduct,
    inventoryItems: mockInventoryItems,
    isEditing: false,
    onBack: action('onBack'),
    onEdit: action('onEdit'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
    onDuplicate: action('onDuplicate'),
    onDelete: action('onDelete'),
    onToggle: action('onToggle')
  }
};

// Edit mode
export const EditMode: Story = {
  args: {
    product: mockProduct,
    inventoryItems: mockInventoryItems,
    isEditing: true,
    onBack: action('onBack'),
    onEdit: action('onEdit'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
    onDuplicate: action('onDuplicate'),
    onDelete: action('onDelete'),
    onToggle: action('onToggle')
  }
};

// Minimal product data
export const MinimalProduct: Story = {
  args: {
    product: mockProductMinimal,
    inventoryItems: [],
    isEditing: false,
    onBack: action('onBack'),
    onEdit: action('onEdit'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
    onDuplicate: action('onDuplicate'),
    onDelete: action('onDelete'),
    onToggle: action('onToggle')
  },
  parameters: {
    docs: {
      description: {
        story: 'Product with minimal data to test edge cases and empty states.'
      }
    }
  }
};

// Product with low stock
export const LowStock: Story = {
  args: {
    product: mockProduct,
    inventoryItems: mockInventoryItems.map(item => ({
      ...item,
      quantity: Math.min(item.quantity, 2),
      status: 'low' as const
    })),
    isEditing: false,
    onBack: action('onBack'),
    onEdit: action('onEdit'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
    onDuplicate: action('onDuplicate'),
    onDelete: action('onDelete'),
    onToggle: action('onToggle')
  },
  parameters: {
    docs: {
      description: {
        story: 'Product with low stock levels to test inventory warnings and status indicators.'
      }
    }
  }
};

// Product out of stock
export const OutOfStock: Story = {
  args: {
    product: mockProduct,
    inventoryItems: mockInventoryItems.map(item => ({
      ...item,
      quantity: 0,
      status: 'normal' as const
    })),
    isEditing: false,
    onBack: action('onBack'),
    onEdit: action('onEdit'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
    onDuplicate: action('onDuplicate'),
    onDelete: action('onDelete'),
    onToggle: action('onToggle')
  },
  parameters: {
    docs: {
      description: {
        story: 'Product with out of stock inventory to test critical status indicators.'
      }
    }
  }
};

// Product without inventory mapping
export const NoInventoryMapping: Story = {
  args: {
    product: {
      ...mockProduct,
      ingredients: ['Exotic Flowers', 'Rare Materials']
    },
    inventoryItems: mockInventoryItems,
    isEditing: false,
    onBack: action('onBack'),
    onEdit: action('onEdit'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
    onDuplicate: action('onDuplicate'),
    onDelete: action('onDelete'),
    onToggle: action('onToggle')
  },
  parameters: {
    docs: {
      description: {
        story: 'Product with ingredients that don\'t match any inventory items.'
      }
    }
  }
};

// Custom product type
export const CustomProduct: Story = {
  args: {
    product: {
      ...mockProduct,
      type: 'custom',
      title: 'Индивидуальная композиция',
      description: 'Уникальная композиция, созданная по индивидуальному заказу клиента',
      price: 'от 8000 ₸'
    },
    inventoryItems: mockInventoryItems,
    isEditing: false,
    onBack: action('onBack'),
    onEdit: action('onEdit'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
    onDuplicate: action('onDuplicate'),
    onDelete: action('onDelete'),
    onToggle: action('onToggle')
  },
  parameters: {
    docs: {
      description: {
        story: 'Custom product type with flexible pricing and individual characteristics.'
      }
    }
  }
};

// Mobile view
export const Mobile: Story = {
  args: {
    product: mockProduct,
    inventoryItems: mockInventoryItems,
    isEditing: false,
    onBack: action('onBack'),
    onEdit: action('onEdit'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
    onDuplicate: action('onDuplicate'),
    onDelete: action('onDelete'),
    onToggle: action('onToggle')
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile view of the product detail page with touch-optimized interactions.'
      }
    }
  }
};

// Mobile edit mode
export const MobileEdit: Story = {
  args: {
    product: mockProduct,
    inventoryItems: mockInventoryItems,
    isEditing: true,
    onBack: action('onBack'),
    onEdit: action('onEdit'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
    onDuplicate: action('onDuplicate'),
    onDelete: action('onDelete'),
    onToggle: action('onToggle')
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile edit mode with optimized form layouts and interactions.'
      }
    }
  }
};

// Tablet view
export const Tablet: Story = {
  args: {
    product: mockProduct,
    inventoryItems: mockInventoryItems,
    isEditing: false,
    onBack: action('onBack'),
    onEdit: action('onEdit'),
    onSave: action('onSave'),
    onCancel: action('onCancel'),
    onDuplicate: action('onDuplicate'),
    onDelete: action('onDelete'),
    onToggle: action('onToggle')
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