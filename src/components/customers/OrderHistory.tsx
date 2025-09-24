import { Clock, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { useOrders } from "../../hooks/useApiOrders";
import { Order as ApiOrder } from "../../types";

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
  // Fetch orders for this customer from API
  const { orders: customerOrders = [], loading: ordersLoading } = useOrders(
    customerId ? { client_id: customerId } : undefined
  );

  const orderStatusConfig = {
    new: { label: 'Новый', color: 'bg-blue-100 text-blue-700' },
    pending: { label: 'Ожидает', color: 'bg-yellow-100 text-yellow-700' },
    confirmed: { label: 'Подтвержден', color: 'bg-blue-100 text-blue-700' },
    in_progress: { label: 'В работе', color: 'bg-orange-100 text-orange-700' },
    ready: { label: 'Готов', color: 'bg-green-100 text-green-700' },
    delivered: { label: 'Доставлен', color: 'bg-gray-100 text-gray-700' },
    cancelled: { label: 'Отменен', color: 'bg-red-100 text-red-700' },
    completed: { label: 'Выполнен', color: 'bg-green-100 text-green-700' }
  };

  // Show loading state while fetching orders
  if (ordersLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
        <p className="text-gray-600">Загрузка заказов...</p>
      </div>
    );
  }

  return (
    <>
      {/* Mobile Order History */}
      <div className="lg:hidden">
        <div className="mb-3">
          <h3 className="text-gray-900">История заказов</h3>
        </div>

        {customerOrders.length > 0 ? (
          <div className="space-y-3">
            {customerOrders.map((order: ApiOrder) => {
              const orderItems = order.items || [];
              const totalAmount = order.totalPrice || 0;
              const orderDate = order.createdAt || new Date();
              const status = order.status?.toLowerCase() || 'new';
              const statusConfig = orderStatusConfig[status] || orderStatusConfig.new;

              return (
                <div
                  key={order.id}
                  className="p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => onViewOrder?.(order.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-900">#{order.number}</span>
                      <div className={`px-2 py-0.5 rounded ${statusConfig.color}`}>
                        {statusConfig.label}
                      </div>
                    </div>
                    <span className="text-gray-900">{formatCurrency(totalAmount)}</span>
                  </div>

                  <div className="text-gray-600 mb-1">
                    {formatOrderDate(orderDate)}
                  </div>

                  <div className="text-gray-500">
                    {orderItems.length === 0 ? (
                      order.mainProduct?.title || 'Товар'
                    ) : orderItems.length === 1 ? (
                      orderItems[0].product?.name || orderItems[0].productName || 'Товар'
                    ) : (
                      `${orderItems[0].product?.name || orderItems[0].productName || 'Товар'}${orderItems.length > 1 ? ` +${orderItems.length - 1}` : ''}`
                    )}
                  </div>

                  {orderItems.length > 1 && (
                    <div className="text-gray-400 mt-1">
                      {orderItems.length} позиций в заказе
                    </div>
                  )}
                </div>
              );
            })}
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
                  {customerOrders.map((order: ApiOrder) => {
                    const orderItems = order.items || [];
                    const totalAmount = order.totalPrice || 0;
                    const orderDate = order.createdAt || new Date();
                    const status = order.status?.toLowerCase() || 'new';
                    const statusConfig = orderStatusConfig[status] || orderStatusConfig.new;

                    return (
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
                            {formatOrderDate(orderDate)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            {orderItems.length === 0 ? (
                              order.mainProduct?.title || 'Товар'
                            ) : orderItems.length === 1 ? (
                              orderItems[0].product?.name || orderItems[0].productName || 'Товар'
                            ) : (
                              `${orderItems[0].product?.name || orderItems[0].productName || 'Товар'}${orderItems.length > 1 ? ` +${orderItems.length - 1}` : ''}`
                            )}
                          </div>
                          {orderItems.length > 1 && (
                            <div className="text-gray-400">
                              {orderItems.length} позиций в заказе
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div>{formatCurrency(totalAmount)}</div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={statusConfig.color}
                          >
                            {statusConfig.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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