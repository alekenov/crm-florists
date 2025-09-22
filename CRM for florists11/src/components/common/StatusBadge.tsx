import React from 'react';

interface StatusBadgeProps {
  status: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'purple';
}

const statusVariants = {
  default: 'bg-gray-100 text-gray-600',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-yellow-100 text-yellow-700',
  error: 'bg-red-100 text-red-700',
  info: 'bg-blue-100 text-blue-700',
  purple: 'bg-purple-100 text-purple-700'
};

export function StatusBadge({ status, variant = 'default' }: StatusBadgeProps) {
  return (
    <div className={`inline-flex items-center px-2 py-0.5 rounded ${statusVariants[variant]}`}>
      {status}
    </div>
  );
}