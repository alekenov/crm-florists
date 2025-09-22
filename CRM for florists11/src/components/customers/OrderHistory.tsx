import { Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";

// Mock orders data
const mockOrders = [
  {
    id: '1', number: '40421', date: new Date(2024, 8, 2), total: 25000, status: 'delivered',
    items: [
      { name: 'Букет роз "Страсть"', quantity: 1, price: 18000 },
      { name: 'Упаковка премиум', quantity: 1, price: 3000 }
    ]
  },
  {
    id: '2', number: '40412', date: new Date(2024, 7, 25), total: 15000, status: 'delivered',
    items: [{ name: 'Букет роз красных', quantity: 25, price: 600 }]
  }
];

interface Order {
  id: string;
  number: string;
  date: Date;
  total: number;
  status: 'pending' | 'confirmed' | 'in_progress' | 'ready' | 'delivered' | 'cancelled';
  items: Array<{ name: string; quantity: number; price: number; }>;
}

interface OrderHistoryProps {
  customerId: number;
  onViewOrder?: (orderId: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0
  }).format(amount).replace('KZT', '₸');
}

function formatOrderDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function OrderHistory({ customerId, onViewOrder }: OrderHistoryProps) {
  // Get customer orders (would be API call in real app)
  const customerOrders = mockOrders;

  const orderStatusConfig = {
    pending: { label: 'Ожидает', color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: 'Подтвержден', color: 'bg-blue-100 text-blue-700' },
    in_progress: { label: 'В работе', color: 'bg-orange-100 text-orange-700' },
    ready: { label: 'Готов', color: 'bg-green-100 text-green-700' },
    delivered: { label: 'Доставлен', color: 'bg-gray-100 text-gray-700' },
    cancelled: { label: 'Отменен', color: 'bg-red-100 text-red-700' }
  };

  return (
    <>
      {/* Mobile Order History */}
      <div className="lg:hidden">
        <div className="mb-3">
          <h3 className="text-gray-900">История заказов</h3>
        </div>

        {customerOrders.length > 0 ? (
          <div className="space-y-3">
            {customerOrders.map((order) => (
              <div 
                key={order.id}
                className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => onViewOrder?.(order.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">#{order.number}</span>
                    <div className={`px-2 py-0.5 rounded ${orderStatusConfig[order.status].color}`}>
                      {orderStatusConfig[order.status].label}
                    </div>
                  </div>
                  <span className="text-gray-900">{formatCurrency(order.total)}</span>
                </div>
                
                <div className="text-gray-600 mb-1">
                  {formatOrderDate(order.date)}
                </div>
                
                <div className="text-gray-500">
                  {order.items.length === 1 ? (
                    order.items[0].name
                  ) : (
                    `${order.items[0].name}${order.items.length > 1 ? ` +${order.items.length - 1}` : ''}`
                  )}
                </div>
                
                {order.items.length > 1 && (
                  <div className="text-gray-400 mt-1">
                    {order.items.length} позиций в заказе
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-gray-400" />
            </div>
            <h4 className="text-gray-900 mb-1">Нет заказов</h4>
            <p className="text-gray-500">Заказы этого клиента появятся здесь</p>
          </div>
        )}
      </div>

      {/* Desktop Order History Card */}
      <Card className="hidden lg:block">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            История заказов
            <Badge variant="secondary" className="ml-2">
              {customerOrders.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {customerOrders.length > 0 ? (
            <div className="border rounded-lg">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Номер заказа</TableHead>
                    <TableHead className="w-32">Дата</TableHead>
                    <TableHead>Товары</TableHead>
                    <TableHead className="w-32">Сумма</TableHead>
                    <TableHead className="w-32">Статус</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customerOrders.map((order) => (
                    <TableRow 
                      key={order.id}
                      className="cursor-pointer hover:bg-gray-50"
                      onClick={() => onViewOrder?.(order.id)}
                    >
                      <TableCell>
                        <div>#{order.number}</div>
                      </TableCell>
                      <TableCell>
                        <div className="text-gray-600">
                          {formatOrderDate(order.date)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          {order.items.length === 1 ? (
                            order.items[0].name
                          ) : (
                            `${order.items[0].name}${order.items.length > 1 ? ` +${order.items.length - 1}` : ''}`
                          )}
                        </div>
                        {order.items.length > 1 && (
                          <div className="text-gray-400">
                            {order.items.length} позиций в заказе
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div>{formatCurrency(order.total)}</div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={orderStatusConfig[order.status].color}
                        >
                          {orderStatusConfig[order.status].label}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-gray-900 mb-2">Нет заказов</h4>
              <p className="text-gray-500">Заказы этого клиента появятся здесь</p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}