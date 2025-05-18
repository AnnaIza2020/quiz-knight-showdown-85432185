
import { useState, useCallback, useEffect, useRef } from 'react';
import { useSubscription } from './useSubscription';
import { toast } from 'sonner';

// Define the wheel event payload types
interface WheelEventBase {
  type: string;
  timestamp: number;
}

interface WheelSpinEvent extends WheelEventBase {
  type: 'wheel_spin';
}

interface WheelStopEvent extends WheelEventBase {
  type: 'wheel_stop';
}

interface WheelCategorySelectedEvent extends WheelEventBase {
  type: 'category_selected';
  category: string;
}

interface WheelResetEvent extends WheelEventBase {
  type: 'wheel_reset';
}

// Union type for all wheel events
type WheelEvent = WheelSpinEvent | WheelStopEvent | WheelCategorySelectedEvent | WheelResetEvent;

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
  const spinTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { broadcast, subscribe } = useSubscription<WheelEvent>(
    'wheel_events',
    'sync',
    useCallback((payload: WheelEvent) => {
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
    const unsubscribeFunc = subscribe();
    
    return () => {
      if (typeof unsubscribeFunc === 'function') {
        unsubscribeFunc();
      }
      
      // Clear any pending timeouts on unmount
      if (spinTimeoutRef.current) {
        clearTimeout(spinTimeoutRef.current);
      }
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
    } as WheelSpinEvent);
    
    if (options?.onSpinStart) options.onSpinStart();
  }, [isSpinning, broadcast, options]);
  
  // Complete a wheel spin with a selected category
  const completeSpin = useCallback((category: string) => {
    setIsSpinning(false);
    setSelectedCategory(category);
    
    broadcast({
      type: 'wheel_stop',
      timestamp: Date.now()
    } as WheelStopEvent);
    
    broadcast({
      type: 'category_selected',
      category,
      timestamp: Date.now()
    } as WheelCategorySelectedEvent);
    
    if (options?.onCategorySelected) options.onCategorySelected(category);
    if (options?.onSpinComplete) options.onSpinComplete();
  }, [broadcast, options]);
  
  // Reset the wheel
  const resetWheel = useCallback(() => {
    setSelectedCategory(null);
    
    broadcast({
      type: 'wheel_reset',
      timestamp: Date.now()
    } as WheelResetEvent);
    
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
