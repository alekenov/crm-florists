import React from 'react';

interface LoadingFallbackProps {
  message?: string;
}

export function LoadingFallback({ message = 'Загрузка...' }: LoadingFallbackProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}