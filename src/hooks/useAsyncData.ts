
import { useState, useEffect, useCallback, useRef } from 'react';

interface Cache<T> {
  [key: string]: {
    data: T;
    timestamp: number;
  };
}

interface UseAsyncDataOptions<T> {
  initialData?: T;
  cacheKey?: string;
  cacheDuration?: number; // w ms, domyślnie 5 minut
  retryCount?: number;
  retryDelay?: number; // w ms, domyślnie 2000
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: Error | null;
  timestamp: number | null;
};

// Prosty cache w pamięci
const globalCache: Cache<any> = {};

export function useAsyncData<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncDataOptions<T> = {}
) {
  const {
    initialData = null,
    cacheKey,
    cacheDuration = 5 * 60 * 1000, // 5 minut
    retryCount = 0,
    retryDelay = 2000,
    onSuccess,
    onError,
  } = options;

  const [state, setState] = useState<AsyncState<T>>({
    data: initialData,
    loading: false,
    error: null,
    timestamp: null,
  });

  const currentRetryCount = useRef(0);
  const isMounted = useRef(true);

  // Funkcja do zapisu danych w cache
  const setCache = useCallback(
    (data: T) => {
      if (cacheKey) {
        globalCache[cacheKey] = {
          data,
          timestamp: Date.now(),
        };
      }
    },
    [cacheKey]
  );

  // Funkcja do pobrania danych z cache
  const getFromCache = useCallback(() => {
    if (!cacheKey) return null;

    const cachedData = globalCache[cacheKey];
    if (!cachedData) return null;

    // Sprawdź czy dane w cache nie są przedawnione
    const isExpired = Date.now() - cachedData.timestamp > cacheDuration;
    if (isExpired) {
      delete globalCache[cacheKey];
      return null;
    }

    return cachedData.data as T;
  }, [cacheKey, cacheDuration]);

  // Funkcja do pobierania danych
  const fetchData = useCallback(async (retryAttempt = 0) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    
    try {
      // Sprawdź najpierw w cache
      const cachedData = getFromCache();
      if (cachedData) {
        setState({
          data: cachedData,
          loading: false,
          error: null,
          timestamp: globalCache[cacheKey!].timestamp,
        });
        onSuccess?.(cachedData);
        return;
      }

      // Pobierz dane, jeśli nie ma ich w cache
      const data = await asyncFn();
      
      if (isMounted.current) {
        setState({
          data,
          loading: false,
          error: null,
          timestamp: Date.now(),
        });
        
        // Zapisz w cache, jeśli podano klucz
        setCache(data);
        onSuccess?.(data);
      }
    } catch (error) {
      if (isMounted.current) {
        console.error("Error fetching data:", error);
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error : new Error(String(error)),
        }));
        
        // Spróbuj ponownie, jeśli nie przekroczyliśmy limitu prób
        if (retryAttempt < retryCount) {
          setTimeout(() => {
            fetchData(retryAttempt + 1);
          }, retryDelay);
        } else {
          onError?.(error instanceof Error ? error : new Error(String(error)));
        }
      }
    }
  }, [asyncFn, getFromCache, onError, onSuccess, retryCount, retryDelay, setCache]);

  // Funkcja do manualnego odświeżenia danych
  const refresh = useCallback(() => {
    currentRetryCount.current = 0;
    fetchData();
  }, [fetchData]);

  // Funkcja do czyszczenia cache
  const clearCache = useCallback(() => {
    if (cacheKey && globalCache[cacheKey]) {
      delete globalCache[cacheKey];
    }
  }, [cacheKey]);

  useEffect(() => {
    fetchData();
    
    return () => {
      isMounted.current = false;
    };
  }, [fetchData]);

  return {
    ...state,
    refresh,
    clearCache,
    isStale: cacheKey && state.timestamp 
      ? Date.now() - state.timestamp > cacheDuration / 2 
      : false,
  };
}
