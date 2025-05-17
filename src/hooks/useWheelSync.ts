
import { useState, useCallback, useEffect } from 'react';
import { useSubscription } from './useSubscription';
import { toast } from 'sonner';

interface WheelSyncOptions {
  onCategorySelected?: (category: string) => void;
  onSpinStart?: () => void;
  onSpinComplete?: () => void;
  onReset?: () => void;
}

/**
 * Hook for synchronizing fortune wheel state across multiple components
 */
export const useWheelSync = (options?: WheelSyncOptions) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { broadcast, subscribe } = useSubscription(
    'wheel_events',
    'sync',
    useCallback((payload) => {
      switch (payload.type) {
        case 'wheel_spin':
          setIsSpinning(true);
          if (options?.onSpinStart) options.onSpinStart();
          break;
          
        case 'wheel_stop':
          setIsSpinning(false);
          if (options?.onSpinComplete) options.onSpinComplete();
          break;
          
        case 'category_selected':
          setSelectedCategory(payload.category);
          if (options?.onCategorySelected) options.onCategorySelected(payload.category);
          break;
          
        case 'wheel_reset':
          setSelectedCategory(null);
          if (options?.onReset) options.onReset();
          break;
          
        default:
          break;
      }
    }, [options])
  );
  
  // Initialize subscription when component mounts
  useEffect(() => {
    return () => {
      subscribe(false); // Clean up subscription
    };
  }, [subscribe]);
  
  // Trigger a wheel spin
  const triggerSpin = useCallback(() => {
    if (isSpinning) {
      toast.info('Koło już się kręci');
      return;
    }
    
    setIsSpinning(true);
    broadcast({ 
      type: 'wheel_spin',
      timestamp: Date.now()
    });
    
    if (options?.onSpinStart) options.onSpinStart();
  }, [isSpinning, broadcast, options]);
  
  // Complete a wheel spin with a selected category
  const completeSpin = useCallback((category: string) => {
    setIsSpinning(false);
    setSelectedCategory(category);
    
    broadcast({
      type: 'wheel_stop',
      timestamp: Date.now()
    });
    
    broadcast({
      type: 'category_selected',
      category,
      timestamp: Date.now()
    });
    
    if (options?.onCategorySelected) options.onCategorySelected(category);
    if (options?.onSpinComplete) options.onSpinComplete();
  }, [broadcast, options]);
  
  // Reset the wheel
  const resetWheel = useCallback(() => {
    setSelectedCategory(null);
    
    broadcast({
      type: 'wheel_reset',
      timestamp: Date.now()
    });
    
    if (options?.onReset) options.onReset();
  }, [broadcast, options]);
  
  return {
    isSpinning,
    selectedCategory,
    triggerSpin,
    completeSpin,
    resetWheel
  };
};
