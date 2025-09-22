/**
 * Production time constants
 */

export const productionTimeOptions = [
  { id: 'short', label: 'До 7 дней' },
  { id: 'medium', label: 'От 5 до 10' },
  { id: 'long', label: 'От 10 дней и более' }
];

export const getProductionTimeLabel = (time: string) => {
  const option = productionTimeOptions.find(opt => opt.id === time);
  return option?.label || time;
};