import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { CustomerInfo } from "./CustomerInfo";
import { CustomerStats } from "./CustomerStats";
import { CustomerNotes } from "./CustomerNotes";
import { OrderHistory } from "./OrderHistory";
import { apiClient } from "../../api/client";
import { useIntegratedAppState } from "../../hooks/useIntegratedAppState";
import { toast } from "sonner";

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
  customerId: number;
  customers: Customer[];
  onClose: () => void;
  onUpdateCustomer?: (customer: Customer) => void;
  onViewOrder?: (orderId: string) => void;
}

export function CustomerDetail({
  customerId,
  customers: propCustomers,
  onClose,
  onUpdateCustomer,
  onViewOrder
}: CustomerDetailProps) {
  const { customers: stateCustomers, refetchCustomers } = useIntegratedAppState();

  // Use reactive state customers if available, fallback to prop customers
  const customers = stateCustomers && stateCustomers.length > 0 ? stateCustomers : propCustomers;
  const customer = customers.find(c => c.id === customerId);

  const handleUpdateCustomerInfo = async (updates: { name?: string; phone?: string }) => {
    try {
      await apiClient.updateClient(customerId, updates);
      toast.success('Данные клиента обновлены');

      // Refresh customers data
      if (refetchCustomers) {
        await refetchCustomers();
      }

      // Also call the parent callback if provided
      if (onUpdateCustomer && customer) {
        onUpdateCustomer({ ...customer, ...updates });
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      toast.error('Ошибка при обновлении данных клиента');
    }
  };

  if (!customer) {
    return (
      <div className="bg-white min-h-screen max-w-md mx-auto flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-gray-900 mb-2">Клиент не найден</h2>
          <Button onClick={onClose} variant="outline">
            Вернуться к списку
          </Button>
        </div>
      </div>
    );
  }

  const handleUpdateNotes = async (notes: string) => {
    try {
      await apiClient.updateClient(customerId, { notes });
      toast.success('Заметки обновлены');

      // Refresh customers data
      if (refetchCustomers) {
        await refetchCustomers();
      }

      // Also call the parent callback if provided
      if (onUpdateCustomer && customer) {
        onUpdateCustomer({ ...customer, notes });
      }
    } catch (error) {
      console.error('Error updating customer notes:', error);
      toast.error('Ошибка при обновлении заметок');
    }
  };

  return (
    <div className="bg-white min-h-screen">
      {/* Mobile Header */}
      <div className="flex items-center p-4 border-b border-gray-100 lg:hidden">
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

      {/* Desktop Header */}
      <div className="hidden lg:block border-b border-gray-200 p-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="p-2">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1>
              {customer.name && customer.name.trim() ? customer.name : `Клиент ${customer.phone.slice(-4)}`}
            </h1>
            <p className="text-gray-600 mt-1">Карточка клиента и история заказов</p>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block p-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Left Column - Customer Info & Stats */}
            <div className="xl:col-span-1 space-y-6">
              <CustomerInfo customer={customer} onUpdateCustomer={handleUpdateCustomerInfo} />
              <CustomerStats customerId={customerId} />
              <CustomerNotes
                customer={customer}
                onUpdateNotes={handleUpdateNotes}
              />
            </div>

            {/* Right Column - Order History */}
            <div className="xl:col-span-2">
              <OrderHistory 
                customerId={customerId}
                onViewOrder={onViewOrder}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden pb-6">
        <CustomerInfo customer={customer} onUpdateCustomer={handleUpdateCustomerInfo} />
        <CustomerStats customerId={customerId} />
        <CustomerNotes
          customer={customer}
          onUpdateNotes={handleUpdateNotes}
        />
        <div className="p-4">
          <OrderHistory 
            customerId={customerId}
            onViewOrder={onViewOrder}
          />
        </div>
      </div>
    </div>
  );
}