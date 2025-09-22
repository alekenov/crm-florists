# CRM for Florists

CRM system for florists with React frontend and FastAPI backend integration. Features order management, client tracking, inventory management, and florist/courier assignment functionality.

## Features

- 📱 **Responsive Design**: Mobile-first design that works on all devices
- 📦 **Order Management**: Create, edit, and track flower delivery orders
- 👥 **Client Management**: Manage customers with contact information and order history
- 🌸 **Product Catalog**: Catalog and custom product management
- 📊 **Inventory Tracking**: Track flower and material inventory with low stock alerts
- 👨‍🎨 **Staff Assignment**: Assign florists and couriers to orders
- 🔄 **Real-time Updates**: Live status updates and notifications
- 🎯 **Status Tracking**: Complete order lifecycle management

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **State Management**: Custom hooks with API integration
- **Notifications**: Sonner toast notifications
- **Icons**: Lucide React
- **Backend Ready**: FastAPI integration with typed APIs

## Running the Code

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the displayed localhost URL

## Project Structure

```
src/
├── components/          # React components
│   ├── orders/         # Order-related components
│   ├── customers/      # Customer management
│   ├── products/       # Product catalog
│   ├── ui/            # Reusable UI components
├── hooks/              # Custom React hooks
├── api/               # API client and types
├── adapters/          # Data transformation utilities
├── types/             # TypeScript type definitions
└── styles/            # CSS styles
```

## Backend Integration

This frontend is designed to work with a FastAPI backend. The API client is configured for:

- RESTful endpoints for CRUD operations
- Real-time data synchronization
- Error handling and validation
- Typed responses with TypeScript

## Original Design

Based on the Figma design: https://www.figma.com/design/BJJ10ufFUisTM9q02VW0Wy/CRM-for-florists
