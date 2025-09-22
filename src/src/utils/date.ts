/**
 * Date utility functions
 */

export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
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

export function formatDate(date: Date | null | undefined): string {
  if (!date) {
    return 'Неизвестно';
  }

  const now = new Date();
  const diffInMonths = (now.getFullYear() - date.getFullYear()) * 12 + now.getMonth() - date.getMonth();

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