
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseAsyncDataOptions<T> {
  initialData?: T;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  cacheKey?: string;
  cacheTTL?: number; // w milisekundach
  errorMessage?: string;
}

interface CachedData<T> {
  data: T;
  timestamp: number;
}

export function useAsyncData<T>(
  fetchFunction: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
) {
  const {
    initialData,
    onSuccess,
    onError,
    cacheKey,
    cacheTTL = 5 * 60 * 1000, // 5 minut domyślnie
    errorMessage = 'Nie udało się załadować danych'
  } = options;

  const [data, setData] = useState<T | undefined>(initialData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Funkcja do sprawdzania cache
  const getFromCache = useCallback(() => {
    if (!cacheKey) return null;
    
    try {
      const cachedItem = localStorage.getItem(`cache_${cacheKey}`);
      if (!cachedItem) return null;
      
      const { data, timestamp }: CachedData<T> = JSON.parse(cachedItem);
      const isExpired = Date.now() - timestamp > cacheTTL;
      
      if (isExpired) {
        localStorage.removeItem(`cache_${cacheKey}`);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading from cache:', error);
      return null;
    }
  }, [cacheKey, cacheTTL]);

  // Funkcja do zapisywania do cache
  const saveToCache = useCallback((data: T) => {
    if (!cacheKey) return;
    
    try {
      const cacheItem: CachedData<T> = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(`cache_${cacheKey}`, JSON.stringify(cacheItem));
    } catch (error) {
      console.error('Error saving to cache:', error);
    }
  }, [cacheKey]);

  // Funkcja do fetchowania danych
  const fetchData = useCallback(async (skipCache = false) => {
    setIsLoading(true);
    setError(null);
    
    // Sprawdź cache jeśli nie pomijamy
    if (!skipCache && cacheKey) {
      const cachedData = getFromCache();
      if (cachedData) {
        setData(cachedData);
        setIsLoading(false);
        onSuccess?.(cachedData);
        return;
      }
    }

    try {
      const result = await fetchFunction();
      setData(result);
      
      if (cacheKey) {
        saveToCache(result);
      }
      
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      
      // Pokaż toast z błędem
      toast.error(errorMessage, {
        description: error.message
      });
    } finally {
      setIsLoading(false);
    }
  }, [fetchFunction, cacheKey, getFromCache, saveToCache, onSuccess, onError, errorMessage]);

  // Ładowanie danych przy montowaniu komponentu
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Odśwież dane, opcjonalnie pomijając cache
  const refresh = useCallback((skipCache = false) => {
    return fetchData(skipCache);
  }, [fetchData]);

  return {
    data,
    isLoading,
    error,
    refresh
  };
}
