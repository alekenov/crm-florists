// Hook for Profile API integration
import { useState, useEffect, useCallback } from 'react';
import { User } from '../types/api';
import { apiClient, APIError } from '../api/client';

interface FloristProfile {
  id: number;
  name: string;
  phone: string;
  position: 'director' | 'manager' | 'seller' | 'courier';
  bio?: string;
}

interface ShopInfo {
  name: string;
  address: string;
  phone: string;
  workingHours: string;
  description?: string;
}

interface Colleague {
  id: number;
  name: string;
  phone: string;
  position: 'director' | 'manager' | 'seller' | 'courier';
  isActive: boolean;
  joinedDate: Date;
}

interface UseProfileResult {
  profile: FloristProfile | null;
  shop: ShopInfo | null;
  colleagues: Colleague[];
  loading: boolean;
  error: string | null;
  updateProfile: (data: Partial<FloristProfile>) => Promise<void>;
  updateShop: (data: Partial<ShopInfo>) => Promise<void>;
  refetch: () => Promise<void>;
}

// Convert backend User to frontend FloristProfile
const convertUserToProfile = (user: User): FloristProfile => ({
  id: user.id || 0,
  name: user.name,
  phone: user.phone || '',
  position: user.position as 'director' | 'manager' | 'seller' | 'courier',
  bio: user.bio
});

// Convert backend User to frontend Colleague
const convertUserToColleague = (user: User): Colleague => ({
  id: user.id || 0,
  name: user.name,
  phone: user.phone || '',
  position: user.position as 'director' | 'manager' | 'seller' | 'courier',
  isActive: user.isActive || true,
  joinedDate: user.joinedDate ? new Date(user.joinedDate) : new Date()
});

export function useProfile(): UseProfileResult {
  const [profile, setProfile] = useState<FloristProfile | null>(null);
  const [shop, setShop] = useState<ShopInfo | null>(null);
  const [colleagues, setColleagues] = useState<Colleague[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch profile, shop, and colleagues in parallel
      const [profileData, shopData, colleaguesData] = await Promise.all([
        apiClient.getProfile(),
        apiClient.getShop(),
        apiClient.getColleagues()
      ]);

      setProfile(convertUserToProfile(profileData));
      setShop(shopData);
      setColleagues(colleaguesData.map(convertUserToColleague));
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка загрузки профиля';
      setError(errorMessage);
      console.error('Error fetching profile data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (data: Partial<FloristProfile>): Promise<void> => {
    try {
      setError(null);

      // Convert frontend data to backend format
      const backendData = {
        name: data.name,
        phone: data.phone,
        position: data.position,
        bio: data.bio
      };

      const updatedUser = await apiClient.updateProfile(backendData);
      setProfile(convertUserToProfile(updatedUser));
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка обновления профиля';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateShop = useCallback(async (data: Partial<ShopInfo>): Promise<void> => {
    try {
      setError(null);
      const updatedShop = await apiClient.updateShop(data);
      setShop(updatedShop);
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка обновления информации о магазине';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    profile,
    shop,
    colleagues,
    loading,
    error,
    updateProfile,
    updateShop,
    refetch: fetchData,
  };
}