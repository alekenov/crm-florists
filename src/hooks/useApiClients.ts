// Hook for Clients API integration
import { useState, useEffect, useCallback } from 'react';
import {
  Client,
  ClientsQueryParams,
  CreateClientRequest,
  UpdateClientRequest
} from '../types/api';
import { apiClient, APIError } from '../api/client';

interface UseClientsResult {
  clients: Client[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createClient: (data: CreateClientRequest) => Promise<Client>;
  updateClient: (id: number, data: UpdateClientRequest) => Promise<Client>;
  searchClients: (query: string) => Promise<Client[]>;
}

export function useClients(params?: ClientsQueryParams): UseClientsResult {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getClients(params);
      setClients(response.clients);
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка загрузки клиентов';
      setError(errorMessage);
      console.error('Error fetching clients:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createClient = useCallback(async (data: CreateClientRequest): Promise<Client> => {
    try {
      setError(null);
      const newClient = await apiClient.createClient(data);
      setClients(prev => [newClient, ...prev]);
      return newClient;
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка создания клиента';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const updateClient = useCallback(async (id: number, data: UpdateClientRequest): Promise<Client> => {
    try {
      setError(null);
      const updatedClient = await apiClient.updateClient(id, data);
      setClients(prev =>
        prev.map(client =>
          client.id === id ? updatedClient : client
        )
      );
      return updatedClient;
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка обновления клиента';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const searchClients = useCallback(async (query: string): Promise<Client[]> => {
    try {
      setError(null);
      const response = await apiClient.searchClients(query);
      return response.clients;
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка поиска клиентов';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
    createClient,
    updateClient,
    searchClients,
  };
}

// Hook for single client
export function useClient(id: number) {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClient = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const clientData = await apiClient.getClient(id);
      setClient(clientData);
    } catch (err) {
      const errorMessage = err instanceof APIError
        ? err.message
        : 'Ошибка загрузки клиента';
      setError(errorMessage);
      console.error('Error fetching client:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchClient();
  }, [fetchClient]);

  return {
    client,
    loading,
    error,
    refetch: fetchClient,
  };
}