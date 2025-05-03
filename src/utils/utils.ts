// Istniejący kod
export const getRandomNeonColor = () => {
  const colors = [
    '#00ff00', // Zielony
    '#ff00ff', // Różowy
    '#00ffff', // Cyjanowy
    '#ff0000', // Czerwony
    '#ffff00', // Żółty
    '#0000ff', // Niebieski
    '#ff8800', // Pomarańczowy
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

// Nowe funkcje pomocnicze

/**
 * Głębokie porównanie obiektów
 */
export const deepEqual = (obj1: any, obj2: any): boolean => {
  if (obj1 === obj2) return true;
  
  if (
    typeof obj1 !== 'object' || 
    typeof obj2 !== 'object' || 
    obj1 === null || 
    obj2 === null
  ) {
    return obj1 === obj2;
  }
  
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  
  if (keys1.length !== keys2.length) return false;
  
  return keys1.every(key => 
    keys2.includes(key) && deepEqual(obj1[key], obj2[key])
  );
};

/**
 * Funkcja do throttling
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => ReturnType<T> | undefined) => {
  let lastCall = 0;
  return function(...args: Parameters<T>): ReturnType<T> | undefined {
    const now = Date.now();
    if (now - lastCall >= limit) {
      lastCall = now;
      return func(...args);
    }
    return undefined;
  };
};

/**
 * Funkcja do debounce
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout | null = null;
  
  return function(...args: Parameters<T>): void {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
};

/**
 * Funkcja do sprawdzania czy urządzenie jest mobilne
 */
export const isMobile = (): boolean => {
  return window.matchMedia('(max-width: 768px)').matches;
};

/**
 * Generowanie unikalnego ID
 */
export const generateUniqueId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

/**
 * Alias dla generateUniqueId, dla zachowania kompatybilności
 * z istniejącym kodem używającym generateUniqueToken
 */
export const generateUniqueToken = generateUniqueId;

/**
 * Formatowanie daty do przyjaznego formatu
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Asynchroniczne opóźnienie (sleep)
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Memoizacja funkcji z opcją porównania głębokiego
 * @param func Funkcja do memoizacji
 * @param equalityFn Funkcja porównująca (domyślnie Object.is)
 */
export function memoize<T extends (...args: any[]) => any>(
  func: T,
  equalityFn: (a: any, b: any) => boolean = Object.is
): (...args: Parameters<T>) => ReturnType<T> {
  let lastArgs: Parameters<T> | undefined;
  let lastResult: ReturnType<T>;
  
  return (...args: Parameters<T>): ReturnType<T> => {
    if (
      !lastArgs ||
      args.length !== lastArgs.length ||
      args.some((arg, index) => !equalityFn(arg, lastArgs![index]))
    ) {
      lastResult = func(...args);
      lastArgs = args;
    }
    return lastResult;
  };
}

/**
 * Funkcja do przetwarzania asynchronicznego z ratelimiting
 * @param asyncFunction Funkcja asynchroniczna do wywołania
 * @param interval Minimalny czas między wywołaniami w ms
 */
export function rateLimit<T extends (...args: any[]) => Promise<any>>(
  asyncFunction: T,
  interval: number
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  let lastInvokeTime = 0;
  
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const now = Date.now();
    const timeToWait = interval - (now - lastInvokeTime);
    
    if (timeToWait > 0) {
      await new Promise(resolve => setTimeout(resolve, timeToWait));
    }
    
    lastInvokeTime = Date.now();
    return await asyncFunction(...args);
  };
}
