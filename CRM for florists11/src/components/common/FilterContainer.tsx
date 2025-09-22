import { ReactNode } from 'react';

interface FilterContainerProps {
  children: ReactNode;
}

/**
 * Унифицированный контейнер для фильтров
 * Обеспечивает консистентные отступы и стили на всех страницах
 */
export function FilterContainer({ children }: FilterContainerProps) {
  return (
    <div className="p-4 border-b border-gray-100 overflow-x-auto lg:px-6">
      <div className="min-w-max">
        {children}
      </div>
    </div>
  );
}