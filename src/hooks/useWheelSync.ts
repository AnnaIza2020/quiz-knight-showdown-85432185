
import { useState, useCallback } from 'react';

interface WheelSyncOptions {
  onCategorySelected?: (category: string) => void;
  onSpinStart?: () => void;
  onSpinComplete?: () => void;
}

export const useWheelSync = (options: WheelSyncOptions = {}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { onCategorySelected, onSpinStart, onSpinComplete } = options;

  const triggerSpin = useCallback(() => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedCategory(null);
    
    if (onSpinStart) {
      onSpinStart();
    }
    
    // Simulate wheel spinning for 3 seconds
    setTimeout(() => {
      const categories = [
        "Język polskiego internetu",
        "Polska scena Twitcha", 
        "Zagadki",
        "Czy jesteś mądrzejszy od 8-klasisty",
        "Gry, które podbiły Polskę",
        "Technologie i internet w Polsce"
      ];
      
      const randomCategory = categories[Math.floor(Math.random() * categories.length)];
      setSelectedCategory(randomCategory);
      setIsSpinning(false);
      
      if (onCategorySelected) {
        onCategorySelected(randomCategory);
      }
      
      if (onSpinComplete) {
        onSpinComplete();
      }
    }, 3000);
  }, [isSpinning, onSpinStart, onCategorySelected, onSpinComplete]);

  const resetWheel = useCallback(() => {
    if (isSpinning) return;
    
    setSelectedCategory(null);
  }, [isSpinning]);

  return {
    isSpinning,
    selectedCategory,
    triggerSpin,
    resetWheel
  };
};
