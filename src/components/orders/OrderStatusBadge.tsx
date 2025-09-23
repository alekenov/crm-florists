import { OrderStatus } from "../../types/api";
import { StatusBadge } from "../common/StatusBadge";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const STATUS_CONFIG = {
  'новый': { label: 'Новый', border: 'border-red-500', text: 'text-red-500' },
  'в работе': { label: 'В работе', border: 'border-purple-500', text: 'text-purple-500' },
  'готов': { label: 'Готов', border: 'border-orange-500', text: 'text-orange-500' },
  'доставлен': { label: 'Доставлен', border: 'border-gray-500', text: 'text-gray-500' }
};

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  const variantMap = {
    'новый': 'error' as const,         // Красный - требует внимания
    'в работе': 'purple' as const,     // Фиолетовый - принят в работу
    'готов': 'warning' as const,       // Желтый - готов к отправке
    'доставлен': 'default' as const    // Серый - архив
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