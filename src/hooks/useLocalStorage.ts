
import { useState, useEffect, useCallback } from 'react';

interface UseLocalStorageOptions<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  onError?: (error: Error) => void;
  sync?: boolean;
}

/**
 * Hook do bezpiecznego przechowywania i synchronizacji danych w localStorage
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options: UseLocalStorageOptions<T> = {}
) {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    onError,
    sync = false
  } = options;

  // Funkcja do pobierania wartości z localStorage
  const readValue = useCallback((): T => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? deserializer(item) : initialValue;
    } catch (error) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      if (onError) {
        onError(typedError);
      } else {
        console.error(`Error reading localStorage key "${key}":`, typedError);
      }
      return initialValue;
    }
  }, [key, initialValue, deserializer, onError]);

  // State do przechowywania wartości
  const [storedValue, setStoredValue] = useState<T>(() => readValue());

  // Funkcja do aktualizacji wartości w state i localStorage
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      // Pozwól na przekazanie funkcji (podobnie jak w useState)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // Zapisz do state
      setStoredValue(valueToStore);
      
      // Zapisz do localStorage
      window.localStorage.setItem(key, serializer(valueToStore));
      
      // Opcjonalnie rozgłoś zdarzenie dla innych kart/okien przeglądarki
      if (sync) {
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: serializer(valueToStore)
        }));
      }
    } catch (error) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      if (onError) {
        onError(typedError);
      } else {
        console.error(`Error setting localStorage key "${key}":`, typedError);
      }
    }
  }, [key, storedValue, serializer, onError, sync]);

  // Funkcja do usuwania klucza z localStorage
  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
      
      if (sync) {
        window.dispatchEvent(new StorageEvent('storage', {
          key,
          newValue: null
        }));
      }
    } catch (error) {
      const typedError = error instanceof Error ? error : new Error(String(error));
      if (onError) {
        onError(typedError);
      } else {
        console.error(`Error removing localStorage key "${key}":`, typedError);
      }
    }
  }, [key, initialValue, onError, sync]);

  // Synchronizacja między różnymi kartami/oknami przeglądarki
  useEffect(() => {
    if (!sync) return;
    
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key) return;
      
      try {
        const newValue = event.newValue
          ? deserializer(event.newValue)
          : initialValue;
        
        setStoredValue(newValue);
      } catch (error) {
        const typedError = error instanceof Error ? error : new Error(String(error));
        if (onError) {
          onError(typedError);
        } else {
          console.error(`Error synchronizing localStorage key "${key}":`, typedError);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, sync, deserializer, initialValue, onError]);

  return [storedValue, setValue, remove] as const;
}
