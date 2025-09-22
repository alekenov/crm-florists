/**
 * Date utility functions
 */

export function getTimeAgo(date: Date | undefined | null): string {
  if (!date) {
    return 'Нет данных';
  }

  // Ensure date is a valid Date object
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'Неверная дата';
  }

  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} ${diffInDays === 1 ? 'день' : diffInDays < 5 ? 'дня' : 'дней'} назад`;
  } else if (diffInHours > 0) {
    return `${diffInHours} ${diffInHours === 1 ? 'час' : diffInHours < 5 ? 'часа' : 'часов'} назад`;
  } else {
    return 'Только что';
  }
}

export function formatDate(date: Date | undefined | null): string {
  if (!date) {
    return 'Нет данных';
  }

  // Ensure date is a valid Date object
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'Неверная дата';
  }

  const now = new Date();
  const diffInMonths = (now.getFullYear() - dateObj.getFullYear()) * 12 + now.getMonth() - dateObj.getMonth();
  
  if (diffInMonths === 0) {
    return 'Этот месяц';
  } else if (diffInMonths === 1) {
    return '1 месяц назад';
  } else if (diffInMonths < 12) {
    return `${diffInMonths} мес. назад`;
  } else {
    const years = Math.floor(diffInMonths / 12);
    return `${years} ${years === 1 ? 'год' : 'года'} назад`;
  }
}

export function formatOrderDate(date: Date): string {
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Функции для работы с датами доставки
export function formatDeliveryDate(deliveryDate: string): string {
  if (deliveryDate === 'today') {
    return 'Сегодня';
  }
  if (deliveryDate === 'tomorrow') {
    return 'Завтра';
  }
  
  // Если это конкретная дата в формате YYYY-MM-DD
  const date = new Date(deliveryDate);
  if (isNaN(date.getTime())) {
    return deliveryDate; // Возвращаем исходную строку если не удается распарсить
  }
  
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // Проверяем, не является ли выбранная дата сегодня или завтра
  if (isSameDay(date, today)) {
    return 'Сегодня';
  }
  if (isSameDay(date, tomorrow)) {
    return 'Завтра';
  }
  
  // Форматируем дату
  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    weekday: 'short'
  });
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function getTomorrowString(): string {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

export function formatDateForInput(date: string): string {
  if (date === 'today') {
    return getTodayString();
  }
  if (date === 'tomorrow') {
    return getTomorrowString();
  }
  return date;
}