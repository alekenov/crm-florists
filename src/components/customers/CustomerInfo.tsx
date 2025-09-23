import { useState } from "react";
import { Phone, Calendar, User, Edit, Save, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { formatDate } from '../../src/utils/date';

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

interface CustomerInfoProps {
  customer: Customer;
  onUpdateCustomer?: (updates: { name?: string; phone?: string }) => void;
}

// Using central formatDate function from utils

export function CustomerInfo({ customer, onUpdateCustomer }: CustomerInfoProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(customer.name || '');
  const [editedPhone, setEditedPhone] = useState(customer.phone || '');

  const handleSave = () => {
    if (onUpdateCustomer) {
      onUpdateCustomer({
        name: editedName.trim(),
        phone: editedPhone.trim()
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(customer.name || '');
    setEditedPhone(customer.phone || '');
    setIsEditing(false);
  };
  const statusConfig = {
    active: { label: 'Активный', color: 'border-green-500 text-green-500' },
    vip: { label: 'VIP', color: 'border-gray-600 text-gray-600' },
    inactive: { label: 'Неактивный', color: 'border-gray-400 text-gray-400' }
  };

  const displayName = customer.name && customer.name.trim() 
    ? customer.name 
    : `Клиент ${customer.phone.slice(-4)}`;

  return (
    <>
      {/* Mobile Info */}
      <div className="lg:hidden p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h2 className={`truncate ${
              customer.name && customer.name.trim() ? 'text-gray-900' : 'text-gray-600 italic'
            }`}>
              {displayName}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 flex-shrink-0">
              {statusConfig[customer.status].label}
            </div>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="p-1"
              >
                <Edit className="w-4 h-4" />
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="p-1 text-green-600 hover:text-green-700"
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="p-1 text-gray-600 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {isEditing ? (
          <div className="space-y-3">
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
        ) : (
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
        )}
      </div>

      {/* Desktop Card */}
      <Card className="hidden lg:block">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Информация о клиенте
            </div>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1"
              >
                <Edit className="w-4 h-4" />
                Править
              </Button>
            ) : (
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className="flex items-center gap-1 text-green-600 hover:text-green-700"
                >
                  <Save className="w-4 h-4" />
                  Сохранить
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  className="flex items-center gap-1 text-gray-600 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                  Отменить
                </Button>
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
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
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className={`truncate ${
                    customer.name && customer.name.trim() ? 'text-gray-900' : 'text-gray-600 italic'
                  }`}>
                    {displayName}
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
    </>
  );
}