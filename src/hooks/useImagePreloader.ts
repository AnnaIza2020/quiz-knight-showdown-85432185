
import { useState, useEffect } from 'react';

interface PreloadOptions {
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
  onError?: (failed: string[]) => void;
  threshold?: number; // ile obrazów ma być załadowanych równocześnie
}

/**
 * Hook do wstępnego ładowania obrazów
 */
export function useImagePreloader(
  imageSources: string[],
  options: PreloadOptions = {}
) {
  const {
    onComplete,
    onProgress,
    onError,
    threshold = 5 // domyślnie ładuj 5 obrazów jednocześnie
  } = options;

  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<string[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!imageSources.length) {
      setIsComplete(true);
      onComplete?.();
      return;
    }

    const sources = [...imageSources]; // kopia tablicy by jej nie modyfikować
    let active = 0; // aktywne wczytywania
    let completed = 0; // zakończone wczytywania (sukcesem lub błędem)
    const failedImages: string[] = []; // lista obrazów, których nie udało się wczytać
    const loadedImages: Record<string, boolean> = {}; // załadowane obrazy

    const updateProgress = () => {
      const progressPercentage = Math.floor((completed / imageSources.length) * 100);
      setProgress(progressPercentage);
      onProgress?.(progressPercentage);
    };

    const checkCompletion = () => {
      if (completed === imageSources.length) {
        setIsComplete(true);
        onComplete?.();
        
        // Jeśli są błędy, wywołaj callback
        if (failedImages.length > 0) {
          onError?.(failedImages);
        }
      } else {
        // Załaduj więcej obrazów jeśli są dostępne
        loadNextImages();
      }
    };

    const loadImage = (src: string) => {
      active++;
      const image = new Image();
      
      image.onload = () => {
        active--;
        completed++;
        loadedImages[src] = true;
        updateProgress();
        checkCompletion();
      };
      
      image.onerror = () => {
        active--;
        completed++;
        failedImages.push(src);
        loadedImages[src] = false;
        setErrors(prev => [...prev, src]);
        updateProgress();
        checkCompletion();
      };
      
      image.src = src;
    };

    const loadNextImages = () => {
      // Ładuj obrazy do limitu threshold
      while (sources.length > 0 && active < threshold) {
        const src = sources.shift();
        if (src) {
          loadImage(src);
        }
      }
    };

    loadNextImages();

    // Aktualizuj stan loaded po każdym załadowanym obrazie
    const updateInterval = setInterval(() => {
      setLoaded({...loadedImages});
    }, 100);

    return () => {
      clearInterval(updateInterval);
    };
  }, [imageSources, threshold, onComplete, onProgress, onError]);

  return {
    progress,
    isComplete,
    loaded,
    errors
  };
}
