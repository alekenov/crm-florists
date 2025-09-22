/**
 * Currency utility functions
 */

export function formatCurrency(amount: number | string): string {
  // Если получена строка, парсим её
  const numAmount = typeof amount === 'string' ? 
    parseFloat(amount.replace(/[^\d,.-]/g, '').replace(',', '.')) : amount;
  
  // Если не удалось распарсить, возвращаем исходную строку
  if (isNaN(numAmount)) {
    return typeof amount === 'string' ? amount : '0 ₸';
  }
  
  return new Intl.NumberFormat('ru-KZ', {
    style: 'currency',
    currency: 'KZT',
    minimumFractionDigits: 0
  }).format(numAmount).replace('KZT', '₸');
}