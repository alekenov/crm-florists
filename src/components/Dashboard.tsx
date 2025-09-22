import { Button } from "./ui/button";
import { ArrowLeft, BarChart3, TrendingUp, Package, Users } from "lucide-react";

interface DashboardProps {
  onNavigateBack: () => void;
}

export function Dashboard({ onNavigateBack }: DashboardProps) {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-md mx-auto bg-white min-h-screen">
        {/* Header */}
        <div className="flex items-center p-4 border-b border-gray-100">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onNavigateBack}
            className="p-2 mr-3"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </Button>
          <h1 className="text-gray-900">Дашборд</h1>
        </div>

        {/* Stats Cards */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Заказы</p>
                  <p className="text-gray-900">42</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-xl">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Прибыль</p>
                  <p className="text-gray-900">125K</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Клиенты</p>
                <p className="text-gray-900">156</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Аналитика</p>
                <p className="text-base text-gray-700">Статистика продаж</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="flex flex-col items-center justify-center py-20 px-6">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-gray-900 mb-2">Дашборд в разработке</h3>
          <p className="text-gray-500 text-center">
            Здесь будет детальная аналитика и статистика вашего бизнеса
          </p>
        </div>

        {/* Bottom Navigation */}
        <div className="border-t border-gray-200 bg-white">
          <div className="flex">
            <button
              onClick={onNavigateBack}
              className="flex-1 py-4 px-4 text-center text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Заказы
            </button>
            <button
              className="flex-1 py-4 px-4 text-center text-primary-foreground bg-primary"
            >
              Дашборд
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}