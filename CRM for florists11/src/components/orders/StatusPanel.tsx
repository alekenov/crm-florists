import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Order } from '../../src/types';
import { Button } from '../ui/button';
import { OrderHistory } from './OrderHistory';

interface StatusPanelProps {
  order: Order;
  onStatusChange?: (status: string) => void;
  onResponsibleChange?: (person: string) => void;
  onCourierChange?: (courier: string) => void;
}

export function StatusPanel({ 
  order, 
  onStatusChange,
  onResponsibleChange,
  onCourierChange 
}: StatusPanelProps) {
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isResponsibleDropdownOpen, setIsResponsibleDropdownOpen] = useState(false);
  const [isCourierDropdownOpen, setIsCourierDropdownOpen] = useState(false);

  const statusOptions = [
    { value: 'new', label: 'Новый', color: 'bg-gray-100 text-gray-700' },
    { value: 'paid', label: 'Оплачен', color: 'bg-blue-100 text-blue-700' },
    { value: 'accepted', label: 'Принят', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'assembled', label: 'Собран', color: 'bg-orange-100 text-orange-700' },
    { value: 'in-transit', label: 'В пути', color: 'bg-purple-100 text-purple-700' },
    { value: 'completed', label: 'Завершен', color: 'bg-green-100 text-green-700' }
  ];

  const floristOptions = ['Не назначен', 'Амина М', 'Сергей К', 'Елена П', 'Дария С'];
  const courierOptions = ['Не назначен', 'Алексей В', 'Марат Т', 'Данияр К'];

  const currentStatus = statusOptions.find(s => s.value === order.status);

  const handleStatusChange = (newStatus: string) => {
    onStatusChange?.(newStatus);
    setIsStatusDropdownOpen(false);
  };

  const handleResponsibleChange = (person: string) => {
    onResponsibleChange?.(person);
    setIsResponsibleDropdownOpen(false);
  };

  const handleCourierChange = (courier: string) => {
    onCourierChange?.(courier);
    setIsCourierDropdownOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Status Management */}
      <div>
        <h3 className="mb-4">Управление заказом</h3>
        
        <div className="space-y-4">
          {/* Status Dropdown */}
          <div className="relative">
            <label className="block text-sm mb-2">Статус заказа</label>
            <div className="relative dropdown-container">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
              >
                <span className={`px-2 py-1 rounded text-sm ${currentStatus?.color || 'bg-gray-100 text-gray-700'}`}>
                  {currentStatus?.label || order.status}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              {isStatusDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => handleStatusChange(status.value)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <span className={`px-2 py-1 rounded text-sm ${status.color}`}>
                        {status.label}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Responsible Person Dropdown */}
          <div className="relative">
            <label className="block text-sm mb-2">Ответственный флорист</label>
            <div className="relative dropdown-container">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setIsResponsibleDropdownOpen(!isResponsibleDropdownOpen)}
              >
                <span>{order.executor?.florist || 'Не назначен'}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              {isResponsibleDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {floristOptions.map((person) => (
                    <button
                      key={person}
                      onClick={() => handleResponsibleChange(person)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {person}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Courier Dropdown */}
          <div className="relative">
            <label className="block text-sm mb-2">Курьер</label>
            <div className="relative dropdown-container">
              <Button
                variant="outline"
                className="w-full justify-between"
                onClick={() => setIsCourierDropdownOpen(!isCourierDropdownOpen)}
              >
                <span>{order.executor?.courier || 'Не назначен'}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>
              {isCourierDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {courierOptions.map((courier) => (
                    <button
                      key={courier}
                      onClick={() => handleCourierChange(courier)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                    >
                      {courier}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order History */}
      {order.history && order.history.length > 0 && (
        <OrderHistory history={order.history} />
      )}
    </div>
  );
}