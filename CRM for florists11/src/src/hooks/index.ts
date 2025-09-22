// 🌸 Цветочный магазин - React хуки для автономного приложения
// Все данные сохраняются в localStorage

export { useAppState } from './useAppState';
export { useAppActions } from './useAppActions';
export { useAppRouterActions } from './useAppRouterActions';
export { useLocalStorage } from './useLocalStorage';
export { useUrlRouter } from './useUrlRouter';

// Supabase хуки удалены - используйте соответствующие App хуки:
// useSupabaseData -> useAppState
// useSupabaseActions -> useAppActions

// URL routing добавлен:
// useUrlRouter - управляет URL навигацией и browser history