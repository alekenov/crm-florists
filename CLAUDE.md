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

## Project Structure and Backend Integration

### Repository Architecture
The project is split into two separate repositories:
- **Frontend**: `CRM for florists10/` (React + TypeScript)
- **Backend**: `../Leken/` (FastAPI + Python)

This separation is intentional for:
- Clean technology boundaries
- Independent deployment cycles
- Separate CI/CD pipelines
- Team scalability

### Local Development Setup

#### Quick Start
```bash
# Method 1: Using dev script
chmod +x dev.sh
./dev.sh start

# Method 2: Docker Compose
docker-compose up

# Method 3: Manual (two terminals)
# Terminal 1 - Backend:
cd ../Leken && python3 -m fastapi dev main_sqlmodel.py --port 8011
# Terminal 2 - Frontend:
npm run dev
```

#### Development Scripts
- `dev.sh start` - Start both frontend and backend
- `dev.sh stop` - Stop all services
- `dev.sh logs [backend|frontend]` - View logs
- `dev.sh test` - Run tests for both services

### API Contract
Backend API is expected at `http://localhost:8011` with SQLModel-based endpoints.
Key API response includes `delivery_time_range` field for order time management.

### Recent Fixes
- **Delivery Time Saving**: Fixed `delivery_time_range` field persistence
- **Date Parsing**: Added DD.MM.YYYY format support for Russian dates
- **API Methods**: Changed from `partialUpdate` to `update` for order modifications

### Backend Repository
Located at: https://github.com/alekenov/leken-auth-system
Main API file: `crm_api.py`
Database: SQLModel with PostgreSQL