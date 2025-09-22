// Hook for Users API integration (флористы и курьеры)
import { useState, useEffect, useCallback } from 'react';
import { 
  User, 
  UsersQueryParams 
} from '../types/api';
import { apiClient, APIError } from '../api/client';

interface UseUsersResult {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useUsers(params?: UsersQueryParams): UseUsersResult {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getUsers(params);
      setUsers(response.users);
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Ошибка загрузки пользователей';
      setError(errorMessage);
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
}

// Hook for florists
export function useFlorists(city?: string): UseUsersResult {
  return useUsers({ position: 'Флорист', city });
}

// Hook for couriers  
export function useCouriers(city?: string): UseUsersResult {
  return useUsers({ position: 'Курьер', city });
}

// Hook for single user
export function useUser(id: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const userData = await apiClient.getUser(id);
      setUser(userData);
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Ошибка загрузки пользователя';
      setError(errorMessage);
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return {
    user,
    loading,
    error,
    refetch: fetchUser,
  };
}