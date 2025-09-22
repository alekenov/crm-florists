// Hook for Dashboard Statistics API integration
import { useState, useEffect, useCallback } from 'react';
import { DashboardStats } from '../types/api';
import { apiClient, APIError } from '../api/client';

interface UseStatsResult {
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useDashboardStats(): UseStatsResult {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const statsData = await apiClient.getDashboardStats();
      setStats(statsData);
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка загрузки статистики';
      setError(errorMessage);
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  };
}