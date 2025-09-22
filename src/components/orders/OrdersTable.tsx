import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Plus } from "lucide-react";
import { Order } from "../../src/types";
import { getTimeAgo } from "../../src/utils/date";
import { OrderStatusBadge } from "./OrderStatusBadge";

interface OrdersTableProps {
  orders: Order[];
  onViewOrder?: (orderId: string) => void;
  onAddOrder?: () => void;
  activeFilter: string;
}

const STATUS_CONFIG = {
  new: { label: 'Новый' },
  paid: { label: 'Оплачен' },
  accepted: { label: 'Принят' },
  assembled: { label: 'Собран' },
  'in-transit': { label: 'В пути' },
  completed: { label: 'Завершен' }
};

export function OrdersTable({ orders, onViewOrder, onAddOrder, activeFilter }: OrdersTableProps) {
  return (
    <div className="hidden lg:block">
      {orders.length > 0 ? (
        <div className="border border-gray-200 rounded-lg mx-4 my-4">
          <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
            <h3>
              Заказы {activeFilter !== 'all' ? `(${STATUS_CONFIG[activeFilter as keyof typeof STATUS_CONFIG]?.label || activeFilter})` : ''} ({orders.length})
            </h3>
            <Button onClick={onAddOrder} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Новый заказ
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-32">Номер</TableHead>
                <TableHead className="w-24">Товары</TableHead>
                <TableHead className="w-24">Статус</TableHead>
                <TableHead>Получатель</TableHead>
                <TableHead className="w-48">Доставка</TableHead>
                <TableHead className="w-32">Создан</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => {
                const allProductImages = [
                  ...(order.mainProduct?.image ? [{ image: order.mainProduct.image, id: order.mainProduct.id }] : []),
                  ...(order.additionalItems?.map(item => ({
                    image: item.productImage,
                    id: item.productId
                  })).filter(item => item.image) || [])
                ];
                const visibleImages = allProductImages.slice(0, 2);
                const extraCount = allProductImages.length > 2 ? allProductImages.length - 2 : 0;

                return (
                  <TableRow 
                    key={order.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => onViewOrder?.(order.id)}
                  >
                    <TableCell>
                      <div>
                        {order.number}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {visibleImages.map((product, index) => (
                          <div
                            key={`${product.id}-${index}`}
                            className="w-8 h-8 rounded-full border-2 border-white bg-cover bg-center"
                            style={{ 
                              backgroundImage: `url('${product.image}')`,
                              marginLeft: index > 0 ? '-4px' : '0'
                            }}
                          />
                        ))}
                        {extraCount > 0 && (
                          <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center ml-1">
                            <span className="text-gray-600 text-xs">{extraCount}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>{order.recipient?.name || 'Без имени'}</div>
                        <div className="text-gray-600">{order.recipient?.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div>
                          {order.deliveryAddress || 'Адрес не указан'}
                        </div>
                        <div className="text-gray-600">
                          {order.deliveryDate === 'today' ? 'Сегодня' :
                           order.deliveryDate === 'tomorrow' ? 'Завтра' :
                           order.deliveryDate ? (order.deliveryDate instanceof Date ?
                             order.deliveryDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) :
                             'Дата указана') : 'Дата не указана'}, {order.deliveryTimeRange || 'Время не указано'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-gray-600">{getTimeAgo(order.createdAt)}</div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : null}
    </div>
  );
}