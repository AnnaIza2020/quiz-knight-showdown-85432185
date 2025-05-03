
import React, { useMemo } from 'react';
import { useGameContext } from '@/context/GameContext';
import { deepEqual } from '@/utils/utils';

/**
 * Hook do efektywnego wybierania danych z GameContext
 * Zwraca zmemoizowany wynik selektora, który jest przeliczany tylko wtedy,
 * gdy zależności z kontekstu faktycznie się zmieniły
 */
export function useMemoizedSelector<T>(
  selector: (state: ReturnType<typeof useGameContext>) => T, 
  deps?: any[]
) {
  const gameContext = useGameContext();
  
  return useMemo(() => {
    return selector(gameContext);
  // Jeśli dostarczono niestandardowe zależności, użyj ich
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps || [gameContext]);
}

/**
 * Wersja z głębokim porównaniem - bardziej intensywna obliczeniowo, ale pozwala
 * uniknąć niepotrzebnych renderów przy złożonych obiektach
 */
export function useMemoizedSelectorDeep<T>(
  selector: (state: ReturnType<typeof useGameContext>) => T
) {
  const gameContext = useGameContext();
  const previousResultRef = React.useRef<T | undefined>();
  
  const result = selector(gameContext);
  
  return useMemo(() => {
    // Dokonaj głębokiego porównania z poprzednim wynikiem
    if (previousResultRef.current && deepEqual(result, previousResultRef.current)) {
      return previousResultRef.current;
    }
    
    previousResultRef.current = result;
    return result;
  }, [result]);
}
