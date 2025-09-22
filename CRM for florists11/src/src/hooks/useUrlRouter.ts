import { useState, useEffect, useCallback } from 'react';

// 🌸 URL-based routing для цветочного магазина
// Синхронизирует состояние приложения с browser URL

export type RouteParams = {
  [key: string]: string | undefined;
};

export interface Route {
  path: string;
  tab: 'orders' | 'products' | 'inventory' | 'customers' | 'profile';
  screen: string;
  params?: RouteParams;
}

// Получить базовый URL для роутинга (может быть вложенный в среде разработки)
const getBasePath = (): string => {
  // В среде разработки Figma Make может использовать вложенные пути
  const pathname = window.location.pathname;
  
  // Если это системная страница - игнорируем
  if (pathname.includes('.html') || pathname.includes('preview')) {
    return '';
  }
  
  return '';
};

// Карта маршрутов приложения
const ROUTES = {
  // Main tab routes
  '/': { tab: 'orders', screen: 'main' },
  '/orders': { tab: 'orders', screen: 'main' },
  '/products': { tab: 'products', screen: 'main' },
  '/inventory': { tab: 'inventory', screen: 'main' },
  '/customers': { tab: 'customers', screen: 'main' },
  '/profile': { tab: 'profile', screen: 'main' },
  
  // Product routes
  '/products/add': { tab: 'products', screen: 'selector' },
  '/products/add/vitrina': { tab: 'products', screen: 'vitrina-form' },
  '/products/add/catalog': { tab: 'products', screen: 'catalog-form' },
  '/products/:id': { tab: 'products', screen: 'product-detail' },
  '/products/:id/edit': { tab: 'products', screen: 'product-edit' },
  
  // Order routes
  '/orders/add': { tab: 'orders', screen: 'add-order' },
  '/orders/:id': { tab: 'orders', screen: 'order-detail' },
  
  // Inventory routes
  '/inventory/add': { tab: 'inventory', screen: 'add-inventory-item' },
  '/inventory/:id': { tab: 'inventory', screen: 'inventory-item-detail' },
  '/inventory/audit': { tab: 'inventory', screen: 'inventory-audit' },
  
  // Customer routes
  '/customers/add': { tab: 'customers', screen: 'add-customer' },
  '/customers/:id': { tab: 'customers', screen: 'customer-detail' },
  
  // Profile routes
  '/dashboard': { tab: 'profile', screen: 'dashboard' },
} as const;

// Парсинг URL в Route объект (moved outside component)
const parseUrl = (pathname: string): Route => {
  // Удаляем trailing slash
  const cleanPath = pathname.replace(/\/$/, '') || '/';
  
  // Специальные случаи для среды разработки Figma Make
  if (cleanPath.includes('preview_page.html') || 
      cleanPath.includes('.html') || 
      cleanPath.startsWith('/figma/') ||
      cleanPath === '/index.html') {
    // Для системных страниц используем главную страницу без предупреждения
    return {
      path: '/orders',
      tab: 'orders',
      screen: 'main',
    };
  }
  
  // Ищем точное совпадение
  if (ROUTES[cleanPath as keyof typeof ROUTES]) {
    return {
      path: cleanPath,
      ...ROUTES[cleanPath as keyof typeof ROUTES],
    };
  }
  
  // Ищем параметризованное совпадение
  for (const [routePath, routeConfig] of Object.entries(ROUTES)) {
    const params = matchRoute(routePath, cleanPath);
    if (params) {
      return {
        path: cleanPath,
        ...routeConfig,
        params,
      };
    }
  }
  
  // Fallback на главную страницу только для неизвестных app маршрутов
  if (cleanPath.startsWith('/')) {
    console.warn(`App route not found: ${pathname}, redirecting to /orders`);
  }
  
  return {
    path: '/orders',
    tab: 'orders',
    screen: 'main',
  };
};

// Сопоставление параметризованных маршрутов (moved outside component)
const matchRoute = (routePath: string, actualPath: string): RouteParams | null => {
  const routeParts = routePath.split('/');
  const actualParts = actualPath.split('/');
  
  if (routeParts.length !== actualParts.length) {
    return null;
  }
  
  const params: RouteParams = {};
  
  for (let i = 0; i < routeParts.length; i++) {
    const routePart = routeParts[i];
    const actualPart = actualParts[i];
    
    if (routePart.startsWith(':')) {
      // Параметр маршрута
      const paramName = routePart.slice(1);
      params[paramName] = actualPart;
    } else if (routePart !== actualPart) {
      // Части не совпадают
      return null;
    }
  }
  
  return params;
};

export function useUrlRouter() {
  const [currentRoute, setCurrentRoute] = useState<Route>(() => {
    // Safe initialization with error handling
    try {
      return parseUrl(window.location.pathname);
    } catch (error) {
      console.warn('URL parsing error, falling back to default route:', error);
      return {
        path: '/orders',
        tab: 'orders',
        screen: 'main',
      };
    }
  });


  // Слушатель изменений URL
  useEffect(() => {
    const handlePopState = () => {
      try {
        setCurrentRoute(parseUrl(window.location.pathname));
      } catch (error) {
        console.warn('URL parsing error on navigation:', error);
        setCurrentRoute({
          path: '/orders',
          tab: 'orders',
          screen: 'main',
        });
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Навигация к новому маршруту
  const navigate = useCallback((path: string, replace = false) => {
    const newRoute = parseUrl(path);
    
    if (replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }
    
    setCurrentRoute(newRoute);
  }, []);

  // Навигация назад
  const goBack = useCallback(() => {
    window.history.back();
  }, []);

  // Хелперы для построения URL
  const buildUrl = {
    // Products
    products: () => '/products',
    productDetail: (id: number) => `/products/${id}`,
    productEdit: (id: number) => `/products/${id}/edit`,
    productAdd: () => '/products/add',
    productAddVitrina: () => '/products/add/vitrina',
    productAddCatalog: () => '/products/add/catalog',
    
    // Orders
    orders: () => '/orders',
    orderDetail: (id: string) => `/orders/${id}`,
    orderAdd: () => '/orders/add',
    
    // Inventory
    inventory: () => '/inventory',
    inventoryDetail: (id: number) => `/inventory/${id}`,
    inventoryAdd: () => '/inventory/add',
    inventoryAudit: () => '/inventory/audit',
    
    // Customers
    customers: () => '/customers',
    customerDetail: (id: number) => `/customers/${id}`,
    customerAdd: () => '/customers/add',
    
    // Profile
    profile: () => '/profile',
    dashboard: () => '/dashboard',
  };

  return {
    currentRoute,
    navigate,
    goBack,
    buildUrl,
    // Для обратной совместимости
    tab: currentRoute.tab,
    screen: currentRoute.screen,
    params: currentRoute.params || {},
  };
}