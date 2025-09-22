import type { Meta, StoryObj } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { AddProductFlow } from './AddProductFlow';
import { InventoryItem } from '../../src/types';

// Mock inventory data
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
    quantity: 25,
    unit: 'шт',
    price: '300 ₸',
    category: 'flowers',
    lastDelivery: new Date('2024-01-18'),
    image: 'https://images.unsplash.com/photo-1524386416438-98b9b2d4b433?w=400',
    minQuantity: 10,
    pricePerUnit: 300,
    createdAt: new Date('2024-01-01'),
    status: 'normal'
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
    name: 'Зелень декоративная',
    quantity: 8,
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
    name: 'Упаковка прозрачная',
    quantity: 30,
    unit: 'шт',
    price: '150 ₸',
    category: 'accessories',
    lastDelivery: new Date('2024-01-10'),
    image: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=400',
    minQuantity: 10,
    pricePerUnit: 150,
    createdAt: new Date('2024-01-01'),
    status: 'normal'
  },
  {
    id: 6,
    name: 'Лента атласная',
    quantity: 5,
    unit: 'м',
    price: '100 ₸',
    category: 'accessories',
    lastDelivery: new Date('2024-01-05'),
    image: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=400',
    minQuantity: 10,
    pricePerUnit: 100,
    createdAt: new Date('2024-01-01'),
    status: 'low'
  },
  {
    id: 7,
    name: 'Корзина плетеная',
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
  }
];

const meta: Meta<typeof AddProductFlow> = {
  title: 'Products/AddProductFlow',
  component: AddProductFlow,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Multi-step flow for adding new products with type selection, basic information, details, images, and review steps.'
      }
    }
  },
  argTypes: {
    inventoryItems: {
      description: 'Available inventory items for ingredient suggestions'
    }
  }
};

export default meta;
type Story = StoryObj<typeof AddProductFlow>;

// Default flow
export const Default: Story = {
  args: {
    inventoryItems: mockInventoryItems,
    onSave: action('onSave'),
    onCancel: action('onCancel')
  }
};

// With rich inventory for suggestions
export const WithRichInventory: Story = {
  args: {
    inventoryItems: mockInventoryItems,
    onSave: action('onSave'),
    onCancel: action('onCancel')
  },
  parameters: {
    docs: {
      description: {
        story: 'Add product flow with a rich set of inventory items for ingredient suggestions.'
      }
    }
  }
};

// Empty inventory
export const EmptyInventory: Story = {
  args: {
    inventoryItems: [],
    onSave: action('onSave'),
    onCancel: action('onCancel')
  },
  parameters: {
    docs: {
      description: {
        story: 'Add product flow with no inventory items available for suggestions.'
      }
    }
  }
};

// Limited inventory
export const LimitedInventory: Story = {
  args: {
    inventoryItems: mockInventoryItems.slice(0, 3),
    onSave: action('onSave'),
    onCancel: action('onCancel')
  },
  parameters: {
    docs: {
      description: {
        story: 'Add product flow with limited inventory items for testing sparse data scenarios.'
      }
    }
  }
};

// Mobile view
export const Mobile: Story = {
  args: {
    inventoryItems: mockInventoryItems,
    onSave: action('onSave'),
    onCancel: action('onCancel')
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1'
    },
    docs: {
      description: {
        story: 'Mobile view of the add product flow with touch-optimized interactions and responsive layout.'
      }
    }
  }
};

// Tablet view
export const Tablet: Story = {
  args: {
    inventoryItems: mockInventoryItems,
    onSave: action('onSave'),
    onCancel: action('onCancel')
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet'
    },
    docs: {
      description: {
        story: 'Tablet view showing the responsive design adaptations for medium screen sizes.'
      }
    }
  }
};

// Testing validation errors
export const ValidationErrors: Story = {
  args: {
    inventoryItems: mockInventoryItems,
    onSave: action('onSave'),
    onCancel: action('onCancel')
  },
  parameters: {
    docs: {
      description: {
        story: 'Use this story to test form validation by trying to proceed without filling required fields.'
      }
    }
  }
};

// Performance test with many inventory items
export const ManyInventoryItems: Story = {
  args: {
    inventoryItems: Array.from({ length: 100 }, (_, i) => ({
      ...mockInventoryItems[i % mockInventoryItems.length],
      id: i + 1,
      name: `${mockInventoryItems[i % mockInventoryItems.length].name} ${i + 1}`
    })),
    onSave: action('onSave'),
    onCancel: action('onCancel')
  },
  parameters: {
    docs: {
      description: {
        story: 'Testing performance with a large number of inventory items for ingredient suggestions.'
      }
    }
  }
};

// Different inventory categories
export const CategorizedInventory: Story = {
  args: {
    inventoryItems: [
      ...mockInventoryItems.filter(item => item.category === 'flowers'),
      ...Array.from({ length: 10 }, (_, i) => ({
        id: 100 + i,
        name: `Дополнительный цветок ${i + 1}`,
        quantity: 20,
        unit: 'шт',
        price: '400 ₸',
        category: 'flowers' as const,
        lastDelivery: new Date('2024-01-15'),
        image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400',
        minQuantity: 5,
        pricePerUnit: 400,
        createdAt: new Date('2024-01-01'),
        status: 'normal' as const
      })),
      ...mockInventoryItems.filter(item => item.category === 'accessories'),
      ...Array.from({ length: 5 }, (_, i) => ({
        id: 200 + i,
        name: `Аксессуар ${i + 1}`,
        quantity: 15,
        unit: 'шт',
        price: '250 ₸',
        category: 'accessories' as const,
        lastDelivery: new Date('2024-01-10'),
        image: 'https://images.unsplash.com/photo-1606041011872-596597976b25?w=400',
        minQuantity: 3,
        pricePerUnit: 250,
        createdAt: new Date('2024-01-01'),
        status: 'normal' as const
      }))
    ],
    onSave: action('onSave'),
    onCancel: action('onCancel')
  },
  parameters: {
    docs: {
      description: {
        story: 'Rich inventory with multiple categories for comprehensive ingredient selection testing.'
      }
    }
  }
};