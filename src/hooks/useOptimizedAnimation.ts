
import { useRef, useEffect } from 'react';

interface AnimationOptions {
  duration?: number;
  delay?: number;
  easing?: (t: number) => number;
}

/**
 * Hook do zoptymalizowanych animacji za pomocą requestAnimationFrame
 */
export function useOptimizedAnimation(
  callback: (progress: number) => void,
  options: AnimationOptions = {}
) {
  const {
    duration = 1000,
    delay = 0,
    easing = (t) => t, // liniowa funkcja domyślnie
  } = options;

  const animationRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isRunningRef = useRef<boolean>(false);

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp;
    }

    const elapsed = timestamp - startTimeRef.current;
    let progress = Math.min(elapsed / duration, 1);
    
    // Zastosuj funkcję easingu
    progress = easing(progress);
    
    // Wywołaj callback z aktualnym postępem animacji
    callback(progress);
    
    // Kontynuuj animację, jeśli nie jest zakończona
    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      isRunningRef.current = false;
    }
  };

  const start = () => {
    // Resetuj czas rozpoczęcia
    startTimeRef.current = null;
    
    // Upewnij się, że animacja nie jest już uruchomiona
    if (isRunningRef.current) {
      return;
    }
    
    isRunningRef.current = true;
    
    // Zastosuj opóźnienie jeśli zostało zdefiniowane
    if (delay > 0) {
      setTimeout(() => {
        animationRef.current = requestAnimationFrame(animate);
      }, delay);
    } else {
      animationRef.current = requestAnimationFrame(animate);
    }
  };

  const stop = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      isRunningRef.current = false;
    }
  };

  const reset = () => {
    stop();
    callback(0); // resetuj do stanu początkowego
  };

  // Czyszczenie przy odmontowaniu komponentu
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return {
    start,
    stop,
    reset,
    isRunning: isRunningRef.current
  };
}

// Eksport popularnych funkcji easing
export const easings = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => (--t) * t * t + 1,
  easeInOutCubic: (t: number) => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeInElastic: (t: number) => t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * (t - 1)) * Math.sin((t - 1.1) * 5 * Math.PI),
  easeOutElastic: (t: number) => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t - 0.1) * 5 * Math.PI) + 1,
};
