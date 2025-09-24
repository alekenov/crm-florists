import { TrendingUp, ShoppingBag, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useOrders } from "../../hooks/useApiOrders";
import { useMemo } from "react";

interface CustomerStatsProps {
  customerId: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0
  }).format(amount).replace('KZT', '₸');
}

export function CustomerStats({ customerId }: CustomerStatsProps) {
  // Fetch orders for this customer from API
  const { orders: customerOrders = [], loading: ordersLoading } = useOrders(
    customerId ? { client_id: customerId } : undefined
  );

  // Calculate statistics from real orders
  const stats = useMemo(() => {
    const totalOrders = customerOrders.length;
    const totalSpent = customerOrders.reduce((sum, order) => sum + (order.totalPrice || 0), 0);
    const averageCheck = totalOrders > 0 ? Math.round(totalSpent / totalOrders) : 0;

    return {
      totalOrders,
      totalSpent,
      averageCheck
    };
  }, [customerOrders]);

  // Format order count text
  const getOrderCountText = (count: number) => {
    if (count === 1) return 'заказ';
    if (count < 5) return 'заказа';
    return 'заказов';
  };

  if (ordersLoading) {
    return (
      <div className="p-4 border-b border-gray-100">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mx-auto mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-16 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Stats */}
      <div className="lg:hidden p-4 border-b border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-gray-900">{stats.totalOrders}</div>
            <div className="text-gray-500">
              {getOrderCountText(stats.totalOrders)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-900">{formatCurrency(stats.totalSpent)}</div>
            <div className="text-gray-500">потрачено</div>
          </div>
          <div className="text-center">
            <div className="text-gray-900">
              {stats.averageCheck}₸
            </div>
            <div className="text-gray-500">средний чек</div>
          </div>
        </div>
      </div>

      {/* Desktop Stats Card */}
      <Card className="hidden lg:block">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Статистика
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="text-gray-600">Заказов</div>
                  <div className="text-gray-900">{stats.totalOrders}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Receipt className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="text-gray-600">Потрачено</div>
                  <div className="text-gray-900">{formatCurrency(stats.totalSpent)}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="text-gray-600">Средний чек</div>
                  <div className="text-gray-900">
                    {stats.averageCheck}₸
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}