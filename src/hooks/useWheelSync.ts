
import { useState, useCallback, useEffect } from 'react';
import { useSubscription } from './useSubscription';

interface WheelSyncOptions {
  onCategorySelected?: (category: string) => void;
  onSpinStart?: () => void;
  onSpinEnd?: () => void;
}

export function useWheelSync(options: WheelSyncOptions = {}) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [wheelRotation, setWheelRotation] = useState(0);
  
  // Subscribe to wheel events from other components
  const { broadcast, subscribe } = useSubscription('wheel', 'spin', 
    (payload: unknown) => {
      const wheelPayload = payload as { action: string; category?: string };
      
      if (wheelPayload.action === 'start') {
        setIsSpinning(true);
        setSelectedCategory(null);
        if (options.onSpinStart) options.onSpinStart();
      } 
      else if (wheelPayload.action === 'end' && wheelPayload.category) {
        setSelectedCategory(wheelPayload.category);
        setIsSpinning(false);
        if (options.onCategorySelected) options.onCategorySelected(wheelPayload.category);
        if (options.onSpinEnd) options.onSpinEnd();
      }
    }, 
    { immediate: false }
  );
  
  // Method to trigger wheel spin
  const triggerSpin = useCallback(() => {
    setIsSpinning(true);
    setSelectedCategory(null);
    
    // Generate random rotation for wheel animation
    const minRotation = 2000;
    const randomRotation = Math.floor(Math.random() * 1000) + minRotation;
    setWheelRotation(prev => prev + randomRotation);
    
    if (options.onSpinStart) options.onSpinStart();
    
    // Broadcast spin start event
    broadcast({
      action: 'start',
      timestamp: Date.now()
    });
    
    // Wait for animation to complete then select random category
    setTimeout(() => {
      const categories = ["Język polskiego internetu", "Polska scena Twitcha", "Zagadki", "Memy i virale", "Historia internetu", "Gaming"];
      const randomIndex = Math.floor(Math.random() * categories.length);
      const selected = categories[randomIndex];
      
      setSelectedCategory(selected);
      setIsSpinning(false);
      
      if (options.onCategorySelected) options.onCategorySelected(selected);
      if (options.onSpinEnd) options.onSpinEnd();
      
      // Broadcast spin end event
      broadcast({
        action: 'end',
        category: selected,
        timestamp: Date.now()
      });
    }, 5000);
  }, [broadcast, options]);
  
  // Method to reset wheel state
  const resetWheel = useCallback(() => {
    setIsSpinning(false);
    setSelectedCategory(null);
  }, []);
  
  return {
    isSpinning,
    selectedCategory,
    wheelRotation,
    triggerSpin,
    resetWheel
  };
}
