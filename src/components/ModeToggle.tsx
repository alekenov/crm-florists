// Component for switching between localStorage and API modes
import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Database, Cloud, AlertCircle, CheckCircle } from 'lucide-react';
import { useAppMode } from '../hooks/useAppMode';
import { toast } from "sonner";

export function ModeToggle() {
  const {
    mode,
    isAPIMode,
    isLocalStorageMode,
    switchToAPI,
    switchToLocalStorage,
    isAPIAvailable
  } = useAppMode();

  const handleSwitchToAPI = () => {
    const success = switchToAPI();
    if (success) {
      toast.success('Переключено на API режим');
      // Перезагружаем страницу для применения изменений
      setTimeout(() => window.location.reload(), 1000);
    } else {
      toast.error('API недоступно. Проверьте настройки.');
    }
  };

  const handleSwitchToLocalStorage = () => {
    switchToLocalStorage();
    toast.success('Переключено на автономный режим');
    // Перезагружаем страницу для применения изменений
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Режим приложения
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Mode Display */}
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            {isAPIMode ? (
              <Cloud className="w-4 h-4 text-blue-600" />
            ) : (
              <Database className="w-4 h-4 text-gray-600" />
            )}
            <span className="font-medium">
              {isAPIMode ? 'API режим' : 'Автономный режим'}
            </span>
          </div>
          <Badge variant={isAPIMode ? 'default' : 'secondary'}>
            {isAPIMode ? 'Активен' : 'Активен'}
          </Badge>
        </div>

        {/* Mode Descriptions */}
        <div className="space-y-3">
          <div className={`p-3 border rounded-lg ${isLocalStorageMode ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
            <div className="flex items-start gap-2 mb-2">
              <Database className="w-4 h-4 text-gray-600 mt-0.5" />
              <div>
                <h4 className="font-medium">Автономный режим</h4>
                <p className="text-sm text-gray-600">
                  Данные хранятся локально в браузере. Не требует подключения к серверу.
                </p>
              </div>
            </div>
            {isLocalStorageMode && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Текущий режим</span>
              </div>
            )}
          </div>

          <div className={`p-3 border rounded-lg ${isAPIMode ? 'border-primary bg-primary/5' : 'border-gray-200'}`}>
            <div className="flex items-start gap-2 mb-2">
              <Cloud className="w-4 h-4 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium">API режим</h4>
                <p className="text-sm text-gray-600">
                  Подключение к FastAPI серверу. Данные хранятся в базе данных.
                </p>
              </div>
            </div>
            {!isAPIAvailable() && (
              <div className="flex items-center gap-1 text-amber-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>API URL не настроен</span>
              </div>
            )}
            {isAPIMode && (
              <div className="flex items-center gap-1 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>Текущий режим</span>
              </div>
            )}
          </div>
        </div>

        {/* Switch Buttons */}
        <div className="space-y-2">
          {isLocalStorageMode && isAPIAvailable() && (
            <Button
              onClick={handleSwitchToAPI}
              className="w-full"
              variant="outline"
            >
              <Cloud className="w-4 h-4 mr-2" />
              Переключиться на API режим
            </Button>
          )}

          {isAPIMode && (
            <Button
              onClick={handleSwitchToLocalStorage}
              className="w-full"
              variant="outline"
            >
              <Database className="w-4 h-4 mr-2" />
              Переключиться на автономный режим
            </Button>
          )}

          {!isAPIAvailable() && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="text-amber-900 font-medium text-sm">API недоступно</h4>
                  <p className="text-amber-800 text-sm">
                    Для использования API режима добавьте переменную окружения REACT_APP_API_URL
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Environment Info */}
        <div className="text-xs text-gray-500 p-2 bg-gray-50 rounded">
          <div>API URL: {process.env.REACT_APP_API_URL || 'не настроен'}</div>
          <div>Режим: {mode}</div>
        </div>
      </CardContent>
    </Card>
  );
}