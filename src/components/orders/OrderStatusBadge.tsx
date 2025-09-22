import { Order } from "../../types";
import { StatusBadge } from "../common/StatusBadge";

interface OrderStatusBadgeProps {
  status: Order['status'];
}

const STATUS_CONFIG = {
  new: { label: 'Новый', border: 'border-red-500', text: 'text-red-500' },
  paid: { label: 'Оплачен', border: 'border-blue-500', text: 'text-blue-500' },
  accepted: { label: 'Принят', border: 'border-purple-500', text: 'text-purple-500' },
  assembled: { label: 'Собран', border: 'border-orange-500', text: 'text-orange-500' },
  'in-transit': { label: 'В пути', border: 'border-green-500', text: 'text-green-500' },
  completed: { label: 'Завершен', border: 'border-gray-500', text: 'text-gray-500' }
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const variantMap = {
    new: 'error' as const,         // Красный - требует внимания
    paid: 'info' as const,         // Синий - оплачен
    accepted: 'purple' as const,   // Фиолетовый - принят в работу
    assembled: 'warning' as const, // Желтый - готов к отправке
    'in-transit': 'success' as const, // Зеленый - доставляется
    completed: 'default' as const  // Серый - архив
  };

  // Fallback если статус не найден
  if (!config) {
    return (
      <StatusBadge
        status={status || 'unknown'}
        variant="default"
      />
    );
  }

  return (
    <StatusBadge
      status={config.label}
      variant={variantMap[status]}
    />
  );
}