// Hook for Products API integration  
import { useState, useEffect, useCallback } from 'react';
import { 
  ApiProduct, 
  ProductsQueryParams,
  CreateProductRequest 
} from '../types/api';
import { apiClient, APIError } from '../api/client';

interface UseProductsResult {
  products: ApiProduct[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createProduct: (data: CreateProductRequest) => Promise<ApiProduct>;
  searchProducts: (query: string) => Promise<ApiProduct[]>;
}

export function useProducts(params?: ProductsQueryParams): UseProductsResult {
  const [products, setProducts] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getProducts(params);
      setProducts(response.products);
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Ошибка загрузки товаров';
      setError(errorMessage);
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const createProduct = useCallback(async (data: CreateProductRequest): Promise<ApiProduct> => {
    try {
      setError(null);
      const newProduct = await apiClient.createProduct(data);
      setProducts(prev => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Ошибка создания товара';
      setError(errorMessage);
      throw err;
    }
  }, []);

  const searchProducts = useCallback(async (query: string): Promise<ApiProduct[]> => {
    try {
      setError(null);
      const response = await apiClient.searchProducts(query);
      return response.products;
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Ошибка поиска товаров';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    refetch: fetchProducts,
    createProduct,
    searchProducts,
  };
}

// Hook for single product
export function useProduct(id: number) {
  const [product, setProduct] = useState<ApiProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError(null);
      const productData = await apiClient.getProduct(id);
      setProduct(productData);
    } catch (err) {
      const errorMessage = err instanceof APIError 
        ? err.message 
        : 'Ошибка загрузки товара';
      setError(errorMessage);
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return {
    product,
    loading,
    error,
    refetch: fetchProduct,
  };
}