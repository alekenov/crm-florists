import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Phone, Calendar, TrendingUp, Edit3, User, ShoppingBag, Receipt, Clock, Edit } from "lucide-react";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { Badge } from "./ui/badge";
import { formatDate, formatOrderDate } from '../utils/date';
import { useClientDetail } from "../hooks/useDetailData";
import { adaptBackendClientToCustomer } from "../adapters/dataAdapters";
import { useIntegratedAppState } from "../hooks/useIntegratedAppState";
import { toast } from "sonner";
import { useOrders } from "../hooks/useApiOrders";
import { Order as ApiOrder } from "../types";

interface Customer {
  id: number;
  name?: string;
  phone: string;
  memberSince: Date;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: Date;
  status: 'active' | 'vip' | 'inactive';
  notes?: string;
}

interface CustomerDetailProps {
  customerId: number | null;
  onClose: () => void;
  onUpdateCustomer?: (customer: Customer) => void;
  onViewOrder?: (orderId: string) => void;
  onRefreshCustomers?: () => void;
}



function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0
  }).format(amount).replace('KZT', '₸');
}


export function CustomerDetail({ customerId, onClose, onUpdateCustomer, onViewOrder, onRefreshCustomers }: CustomerDetailProps) {
  // Fetch individual client data
  const { data: backendClient, loading, error, refetch } = useClientDetail(customerId);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [notes, setNotes] = useState('');
  const [editedName, setEditedName] = useState('');
  const [editedPhone, setEditedPhone] = useState('');

  // State and actions
  const { apiActions } = useIntegratedAppState();

  // Fetch orders for this customer
  const orderParams = customerId ? { client_id: Number(customerId) } : undefined;
  console.log('CustomerDetail: Fetching orders with params:', orderParams, 'customerId:', customerId);
  const { orders: customerOrders = [], loading: ordersLoading } = useOrders(orderParams);

  // Convert backend client to frontend format using useMemo to prevent re-renders
  const customer = useMemo(() => {
    return backendClient ? adaptBackendClientToCustomer(backendClient) : null;
  }, [backendClient]);

  // Initialize fields when customer is loaded
  useEffect(() => {
    if (customer) {
      setNotes(customer.notes || '');
      setEditedName(customer.name || '');
      setEditedPhone(customer.phone || '');
    }
  }, [customer?.id, customer?.notes, customer?.name, customer?.phone]);

  // Handle loading state
  if (loading || ordersLoading) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">{loading ? 'Загрузка клиента...' : 'Загрузка заказов...'}</p>
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2 text-red-600">Ошибка загрузки</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={onClose} className="px-4 py-2 bg-primary text-white rounded-lg">
            Вернуться к клиентам
          </Button>
        </div>
      </div>
    );
  }

  // Handle customer not found
  if (!customer) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="mb-2">Клиент не найден</h2>
          <p className="text-gray-600 mb-4">Клиент с ID {customerId} не существует</p>
          <Button onClick={onClose} className="px-4 py-2 bg-primary text-white rounded-lg">
            Вернуться к клиентам
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = {
    active: { label: 'Активный', color: 'border-green-500 text-green-500' },
    vip: { label: 'VIP', color: 'border-gray-600 text-gray-600' },
    inactive: { label: 'Неактивный', color: 'border-gray-400 text-gray-400' }
  };

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

  const handleSaveNotes = async () => {
    if (customer) {
      try {
        const customerIdNum = typeof customerId === 'string' ? parseInt(customerId) : customerId;

        // Update client notes through API
        await apiActions.updateClient(customerIdNum!, { notes });

        setIsEditingNotes(false);

        // Refresh this specific client and the clients list
        await refetch();
        await onRefreshCustomers?.();

        toast.success('Заметки обновлены');
      } catch (error) {
        console.error('Error updating client notes:', error);
        toast.error('Ошибка при обновлении заметок');
      }
    }
  };

  const handleCancelNotes = () => {
    setNotes(customer.notes || '');
    setIsEditingNotes(false);
  };

  const handleSaveCustomer = async () => {
    if (customer) {
      try {
        const customerIdNum = typeof customerId === 'string' ? parseInt(customerId) : customerId;

        // Update client through API
        await apiActions.updateClient(customerIdNum!, {
          name: editedName.trim() || null,
          phone: editedPhone.trim()
        });

        setIsEditingCustomer(false);

        // Refresh this specific client and the clients list
        await refetch();
        await onRefreshCustomers?.();

        toast.success('Данные клиента обновлены');
      } catch (error) {
        console.error('Error updating client:', error);
        toast.error('Ошибка при обновлении данных клиента');
      }
    }
  };

  const handleCancelCustomer = () => {
    setEditedName(customer?.name || '');
    setEditedPhone(customer?.phone || '');
    setIsEditingCustomer(false);
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            className="p-2 mr-3"
            onClick={onClose}
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </Button>
          <h1 className="text-gray-900">Клиент</h1>
        </div>
        <Button
          size="sm"
          onClick={() => setIsEditingCustomer(true)}
          className="flex items-center gap-1 px-3"
        >
          <Edit className="w-4 h-4" />
          Править
        </Button>
      </div>

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {customer.name && customer.name.trim() ? customer.name : `Клиент ${customer.phone.slice(-4)}`}
              </h1>
              <p className="text-gray-600 mt-1">Карточка клиента и история заказов</p>
            </div>
          </div>
          <Button
            onClick={() => setIsEditingCustomer(true)}
            className="flex items-center gap-2"
          >
            <Edit className="w-4 h-4" />
            Редактировать
          </Button>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Customer Info & Stats */}
            <div className="xl:col-span-1 space-y-6">
              {/* Customer Info Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Информация о клиенте
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isEditingCustomer ? (
                    <>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Имя клиента
                          </label>
                          <Input
                            value={editedName}
                            onChange={(e) => setEditedName(e.target.value)}
                            placeholder="Введите имя клиента"
                            className="w-full"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Телефон
                          </label>
                          <Input
                            value={editedPhone}
                            onChange={(e) => setEditedPhone(e.target.value)}
                            placeholder="Введите номер телефона"
                            className="w-full"
                            type="tel"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button
                          onClick={handleSaveCustomer}
                          className="flex-1"
                        >
                          Сохранить
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleCancelCustomer}
                          className="flex-1"
                        >
                          Отмена
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-lg font-medium truncate ${
                            customer.name && customer.name.trim() ? 'text-gray-900' : 'text-gray-600 italic'
                          }`}>
                            {customer.name && customer.name.trim() ? customer.name : `Клиент ${customer.phone.slice(-4)}`}
                          </h3>
                        </div>
                        <Badge variant="secondary" className={`flex-shrink-0 ${
                          customer.status === 'vip' ? 'bg-purple-100 text-purple-700' :
                          customer.status === 'active' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {statusConfig[customer.status].label}
                        </Badge>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center text-gray-600">
                          <Phone className="w-4 h-4 mr-3" />
                          <span>{customer.phone}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-3" />
                          <span>Клиент с {formatDate(customer.memberSince)}</span>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Stats Card */}
              <Card>
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
                          <div className="text-sm text-gray-600">Заказов</div>
                          <div className="font-semibold text-gray-900">{customer.totalOrders}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <Receipt className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Потрачено</div>
                          <div className="font-semibold text-gray-900">{formatCurrency(customer.totalSpent)}</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Средний чек</div>
                          <div className="font-semibold text-gray-900">
                            {Math.round(customer.totalSpent / customer.totalOrders)}₸
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notes Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Заметки</CardTitle>
                    {!isEditingNotes && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-2"
                        onClick={() => setIsEditingNotes(true)}
                      >
                        <Edit3 className="w-4 h-4 text-gray-500" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {isEditingNotes ? (
                    <div className="space-y-3">
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Добавьте заметку о клиенте..."
                        className="min-h-[100px] resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          onClick={handleSaveNotes}
                          className="flex-1"
                        >
                          Сохранить
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleCancelNotes}
                          className="flex-1"
                        >
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-gray-600 min-h-[60px] flex items-center">
                      {customer.notes || (
                        <span className="text-gray-400 italic">Нажмите для добавления заметки...</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Order History */}
            <div className="xl:col-span-2">
              <Card>
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
                                  <div className="font-medium">#{order.number}</div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm text-gray-600">
                                    {formatOrderDate(orderDate)}
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div className="text-sm">
                                    {orderItems.length === 0 ? (
                                      order.mainProduct?.title || 'Товар'
                                    ) : orderItems.length === 1 ? (
                                      orderItems[0].product?.name || orderItems[0].productName || 'Товар'
                                    ) : (
                                      `${orderItems[0].product?.name || orderItems[0].productName || 'Товар'}${orderItems.length > 1 ? ` +${orderItems.length - 1}` : ''}`
                                    )}
                                  </div>
                                  {orderItems.length > 1 && (
                                    <div className="text-xs text-gray-400">
                                      {orderItems.length} позиций в заказе
                                    </div>
                                  )}
                                </TableCell>
                                <TableCell>
                                  <div className="font-medium">{formatCurrency(totalAmount)}</div>
                                </TableCell>
                                <TableCell>
                                  <Badge
                                    variant="secondary"
                                    className={`text-xs ${statusConfig.color}`}
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
                      <h4 className="text-lg font-medium text-gray-900 mb-2">Нет заказов</h4>
                      <p className="text-gray-500">Заказы этого клиента появятся здесь</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden pb-6">
        {/* Customer Info */}
        <div className="p-4 border-b border-gray-100">
          {isEditingCustomer ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя клиента
                </label>
                <Input
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  placeholder="Введите имя клиента"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <Input
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                  placeholder="Введите номер телефона"
                  className="w-full"
                  type="tel"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveCustomer}
                  className="flex-1"
                  size="sm"
                >
                  Сохранить
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelCustomer}
                  className="flex-1"
                  size="sm"
                >
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <h2 className={`truncate ${customer.name && customer.name.trim() ? 'text-gray-900' : 'text-gray-600 italic'}`}>
                    {customer.name && customer.name.trim() ? customer.name : `Клиент ${customer.phone.slice(-4)}`}
                  </h2>
                </div>
                <div className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-600 flex-shrink-0">
                  {statusConfig[customer.status].label}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>{customer.phone}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Клиент с {formatDate(customer.memberSince)}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Stats */}
        <div className="p-4 border-b border-gray-100">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-gray-900">{customer.totalOrders}</div>
              <div className="text-sm text-gray-500">
                {customer.totalOrders === 1 ? 'заказ' : customer.totalOrders < 5 ? 'заказа' : 'заказов'}
              </div>
            </div>
            <div className="text-center">
              <div className="text-gray-900">{formatCurrency(customer.totalSpent)}</div>
              <div className="text-sm text-gray-500">потрачен��</div>
            </div>
            <div className="text-center">
              <div className="text-gray-900">
                {Math.round(customer.totalSpent / customer.totalOrders)}₸
              </div>
              <div className="text-sm text-gray-500">средний чек</div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-gray-900">Заметки</h3>
            {!isEditingNotes && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="p-1"
                onClick={() => setIsEditingNotes(true)}
              >
                <Edit3 className="w-4 h-4 text-gray-500" />
              </Button>
            )}
          </div>

          {isEditingNotes ? (
            <div className="space-y-3">
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Добавьте заметку о клиенте..."
                className="min-h-[80px] resize-none"
                autoFocus
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleSaveNotes}
                  className="bg-gray-800 hover:bg-gray-900"
                >
                  Сохранить
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={handleCancelNotes}
                >
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-gray-600">
              {customer.notes || (
                <span className="text-gray-400 italic">Нажмите для добавления заметки...</span>
              )}
            </div>
          )}
        </div>

        {/* Order History */}
        <div className="p-4">
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
                        <div className={`px-2 py-0.5 rounded text-xs ${statusConfig.color}`}>
                          {statusConfig.label}
                        </div>
                      </div>
                      <span className="text-gray-900">{formatCurrency(totalAmount)}</span>
                    </div>

                    <div className="text-sm text-gray-600 mb-1">
                      {formatOrderDate(orderDate)}
                    </div>

                    <div className="text-sm text-gray-500">
                      {orderItems.length === 0 ? (
                        order.mainProduct?.title || 'Товар'
                      ) : orderItems.length === 1 ? (
                        orderItems[0].product?.name || orderItems[0].productName || 'Товар'
                      ) : (
                        `${orderItems[0].product?.name || orderItems[0].productName || 'Товар'}${orderItems.length > 1 ? ` +${orderItems.length - 1}` : ''}`
                      )}
                    </div>

                    {orderItems.length > 1 && (
                      <div className="text-xs text-gray-400 mt-1">
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
              <p className="text-sm text-gray-500">Заказы этого клиента появятся здесь</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}