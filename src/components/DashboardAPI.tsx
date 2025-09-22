// Dashboard component adapted for Backend API integration
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import {
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  Truck,
  DollarSign
} from "lucide-react";

// Import API hooks and types
import { useDashboardStats } from "../hooks/useApiStats";
import { OrderStatus } from "../types/api";

// Common components
function EmptyState({ icon, title, description }: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-center mb-4">{description}</p>
    </div>
  );
}

function PageHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-100">
      <div>
        <h1 className="text-gray-900">{title}</h1>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  description?: string;
}

function StatCard({ title, value, icon, trend, description }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
        </CardTitle>
        <div className="h-4 w-4 text-muted-foreground">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '+' : ''}{trend.value}% от прошлого месяца
          </p>
        )}
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Status colors for charts
const STATUS_COLORS = {
  'новый': '#ef4444',      // red-500
  'в работе': '#8b5cf6',   // violet-500
  'готов': '#f59e0b',      // amber-500
  'доставлен': '#10b981'   // emerald-500
};

// Status labels for display
const STATUS_LABELS = {
  'новый': 'Новые',
  'в работе': 'В работе',
  'готов': 'Готовые',
  'доставлен': 'Доставленные'
};

export function DashboardAPI() {
  const { stats, loading, error, refetch } = useDashboardStats();

  if (loading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Загрузка статистики...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 mb-4">Ошибка загрузки статистики</div>
          <div className="text-gray-500 mb-4">{error}</div>
          <button
            onClick={refetch}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white min-h-screen">
        <EmptyState
          icon={<BarChart className="w-8 h-8 text-gray-400" />}
          title="Статистика недоступна"
          description="Не удалось загрузить данные дашборда"
        />
      </div>
    );
  }

  // Prepare chart data
  const orderStatusData = Object.entries(stats.orders_by_status).map(([status, count]) => ({
    name: STATUS_LABELS[status as OrderStatus] || status,
    value: count,
    color: STATUS_COLORS[status as OrderStatus] || '#6b7280'
  }));

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'KZT',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="bg-white min-h-screen">
      <div className="lg:hidden">
        <PageHeader title="Дашборд" />
      </div>
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-900">Дашборд</h1>
        </div>
      </div>

      <div className="p-4 lg:p-6 space-y-6">
        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Всего заказов"
            value={stats.total_orders}
            icon={<ShoppingBag className="h-4 w-4" />}
            description="За все время"
          />

          <StatCard
            title="Заказы сегодня"
            value={stats.today_orders}
            icon={<Calendar className="h-4 w-4" />}
            description="Новые заказы за сегодня"
          />

          <StatCard
            title="Клиенты"
            value={stats.total_clients}
            icon={<Users className="h-4 w-4" />}
            description="Зарегистрированных клиентов"
          />

          <StatCard
            title="Товары"
            value={stats.total_products}
            icon={<Package className="h-4 w-4" />}
            description="В каталоге"
          />
        </div>

        {/* Revenue and Low Stock */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="Выручка за месяц"
            value={formatCurrency(stats.monthly_revenue)}
            icon={<DollarSign className="h-4 w-4" />}
            description="Доходы текущего месяца"
          />

          <StatCard
            title="Товары на исходе"
            value={stats.low_stock_items}
            icon={<AlertTriangle className="h-4 w-4" />}
            description="Требуют пополнения"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Orders by Status Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Статусы заказов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={orderStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legend */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                {orderStatusData.map((entry, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-600">
                      {entry.name}: {entry.value}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Status Breakdown Bar Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Распределение заказов</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={orderStatusData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884d8">
                      {orderStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-900">Требуют внимания</h4>
                  <p className="text-red-800 text-sm">
                    {stats.orders_by_status['новый'] || 0} новых заказов ожидают обработки
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-amber-200 bg-amber-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-900">В работе</h4>
                  <p className="text-amber-800 text-sm">
                    {stats.orders_by_status['в работе'] || 0} заказов в процессе изготовления
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-green-200 bg-green-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-900">Готовы к доставке</h4>
                  <p className="text-green-800 text-sm">
                    {stats.orders_by_status['готов'] || 0} заказов готовы к отправке
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Inventory Alert */}
        {stats.low_stock_items > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-900">Низкий остаток товаров</h4>
                  <p className="text-orange-800 text-sm">
                    {stats.low_stock_items} позиций требуют пополнения склада
                  </p>
                  <button className="mt-2 text-orange-700 hover:text-orange-900 text-sm underline">
                    Перейти к инвентарю →
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}