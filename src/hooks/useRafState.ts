
import { useState, useCallback } from 'react';

/**
 * Hook do aktualizacji stanu zsynchronizowanego z requestAnimationFrame
 * Zapobiega "jankiness" w animacjach, zapewniając, że aktualizacje stanu
 * są zsynchronizowane z cyklem renderowania przeglądarki
 */
export function useRafState<T>(initialState: T) {
  const [state, setState] = useState<T>(initialState);
  
  const rafStateUpdate = useCallback((value: T | ((prevState: T) => T)) => {
    requestAnimationFrame(() => {
      setState(value);
    });
  }, []);
  
  return [state, rafStateUpdate] as const;
}
