import React from 'react';
import { useUrlRouter } from '../hooks/useUrlRouter';

// 🌸 URL Debugger - показывает текущее состояние роутинга
// Используется только в режиме разработки для отладки

interface URLDebuggerProps {
  show?: boolean;
}

export function URLDebugger({ show = false }: URLDebuggerProps) {
  const { currentRoute, navigate, buildUrl } = useUrlRouter();

  if (!show) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black bg-opacity-90 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="space-y-2">
        <div>
          <strong>🔗 URL Debug:</strong>
        </div>

        <div>
          <strong>Path:</strong> {window.location.pathname}
        </div>

        <div>
          <strong>Route Path:</strong> {currentRoute.path}
        </div>

        <div>
          <strong>Screen:</strong> {currentRoute.screen}
        </div>

        <div>
          <strong>Tab:</strong> {currentRoute.tab}
        </div>

        {currentRoute.params && Object.keys(currentRoute.params).length > 0 && (
          <div>
            <strong>Params:</strong> {JSON.stringify(currentRoute.params)}
          </div>
        )}

        <div className="border-t border-gray-600 pt-2 mt-2">
          <div className="space-y-1">
            <button
              onClick={() => navigate(buildUrl.products())}
              className="block w-full text-left text-blue-300 hover:text-blue-100"
            >
              → /products
            </button>
            <button
              onClick={() => navigate(buildUrl.productDetail(1))}
              className="block w-full text-left text-blue-300 hover:text-blue-100"
            >
              → /products/1
            </button>
            <button
              onClick={() => navigate(buildUrl.orders())}
              className="block w-full text-left text-blue-300 hover:text-blue-100"
            >
              → /orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Хук для включения URL debugger в режиме разработки
export function useURLDebugger() {
  const [showDebugger, setShowDebugger] = React.useState(false);

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + Shift + U для включения/выключения URL debugger
      if (event.ctrlKey && event.shiftKey && event.key === 'U') {
        event.preventDefault();
        setShowDebugger(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { showDebugger, setShowDebugger };
}