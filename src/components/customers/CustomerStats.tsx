import { TrendingUp, ShoppingBag, Receipt } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Customer {
  totalOrders: number;
  totalSpent: number;
}

interface CustomerStatsProps {
  customer: Customer;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0
  }).format(amount).replace('KZT', '₸');
}

export function CustomerStats({ customer }: CustomerStatsProps) {
  return (
    <>
      {/* Mobile Stats */}
      <div className="lg:hidden p-4 border-b border-gray-100">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-gray-900">{customer.totalOrders}</div>
            <div className="text-gray-500">
              {customer.totalOrders === 1 ? 'заказ' : customer.totalOrders < 5 ? 'заказа' : 'заказов'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-gray-900">{formatCurrency(customer.totalSpent)}</div>
            <div className="text-gray-500">потрачено</div>
          </div>
          <div className="text-center">
            <div className="text-gray-900">
              {Math.round(customer.totalSpent / customer.totalOrders)}₸
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
                  <div className="text-gray-900">{customer.totalOrders}</div>
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
                  <div className="text-gray-900">{formatCurrency(customer.totalSpent)}</div>
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
                    {Math.round(customer.totalSpent / customer.totalOrders)}₸
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