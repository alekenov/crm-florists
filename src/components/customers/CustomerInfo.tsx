import { Phone, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
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
}

// Using central formatDate function from utils

export function CustomerInfo({ customer }: CustomerInfoProps) {
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
          <div className="px-2 py-0.5 rounded bg-gray-100 text-gray-600 flex-shrink-0">
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
      </div>

      {/* Desktop Card */}
      <Card className="hidden lg:block">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Информация о клиенте
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
        </CardContent>
      </Card>
    </>
  );
}