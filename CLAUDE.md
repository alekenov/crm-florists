# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CRM application for florists built with React, TypeScript, and Vite. Designed from a Figma mockup to provide inventory management, order tracking, customer relationship management, and product catalog functionality.

## Development Commands

```bash
npm install       # Install dependencies
npm run dev       # Start development server on port 3000
npm run build     # Build for production (outputs to /build)
```

## Architecture

### Core Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Vite with SWC
- **UI Components**: Custom design system built on Radix UI primitives and shadcn/ui patterns
- **State Management**: React hooks with centralized state in `useIntegratedAppState`
- **API Integration**: FastAPI backend expected at `http://localhost:8011`

### Key Architectural Patterns

#### 1. Screen Navigation System
The app uses a custom screen-based navigation managed through:
- `AppRouter` component orchestrates all screen transitions
- `useIntegratedAppState` hook centralizes navigation state
- URL parameters sync with app state via `urlManager` utility
- Screen types defined in `src/types/index.ts`

#### 2. Data Flow Architecture
- **API Layer**: `src/api/` contains client, services, and type definitions
- **Data Adapters**: `src/adapters/` transforms backend data to frontend models
- **State Hooks**: `src/hooks/` provides API data fetching and actions
- **Components**: Consume data through centralized hooks

#### 3. Component Organization
```
src/components/
├── ui/           # Reusable UI primitives (buttons, forms, etc.)
├── common/       # Shared components across features
├── orders/       # Order management components
├── products/     # Product catalog components
├── customers/    # Customer management components
└── [feature]/    # Other feature-specific components
```

#### 4. Tab-Based Main Navigation
The main screen uses `MainTabView` with bottom navigation for:
- Orders (Заказы)
- Products (Витрина)
- Inventory (Склад)
- Customers (Клиенты)
- Profile (Профиль)

Each tab maintains its own state and can navigate to detail screens.

## Important Implementation Details

### API Integration
The app expects a FastAPI backend with endpoints for:
- `/api/clients` - Customer management
- `/api/products` - Product catalog
- `/api/inventory` - Inventory tracking
- `/api/orders` - Order processing
- `/api/stats` - Dashboard statistics

### Type System
Frontend uses adapted types separate from backend:
- Frontend types: `src/types/index.ts`
- Backend types: `src/api/types.ts`
- Adapters handle transformation between them

### Error Boundaries
The app implements error boundaries at the root level to catch and display errors gracefully.

### Mobile-First Design
Components are designed for mobile devices with responsive layouts and touch-friendly interactions.

## Russian Language Context

The application uses Russian language throughout the UI. Key terms:
- Заказы = Orders
- Витрина = Products/Showcase
- Склад = Inventory/Warehouse
- Клиенты = Customers
- Профиль = Profile