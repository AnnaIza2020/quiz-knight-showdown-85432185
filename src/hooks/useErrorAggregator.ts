
import { toast } from 'sonner';
import { useState, useCallback } from 'react';

export interface ErrorConfig {
  category?: string;
  silent?: boolean;
  throttleMs?: number;  // Added this property that was missing
}

export interface ErrorAggregatorOptions {
  throttleMs?: number;
  maxDuplicates?: number;
  silentCategories?: string[];
}

/**
 * Hook for aggregating and managing error messages
 * Prevents duplicate errors from flooding the UI
 */
export function useErrorAggregator(options?: ErrorAggregatorOptions) {
  const [errorCounts, setErrorCounts] = useState<Record<string, number>>({});
  const [throttledErrors, setThrottledErrors] = useState<Set<string>>(new Set());
  
  // Default options
  const throttleMs = options?.throttleMs || 3000;
  const maxDuplicates = options?.maxDuplicates || 3;
  const silentCategories = new Set(options?.silentCategories || []);
  
  /**
   * Report an error with optional configuration
   */
  const reportError = useCallback((message: string, config?: ErrorConfig) => {
    const category = config?.category || 'general';
    const isSilent = config?.silent || silentCategories.has(category);
    
    // Create a unique key for this error
    const errorKey = `${category}:${message}`;
    
    // Check if this error is currently throttled
    if (throttledErrors.has(errorKey)) {
      return; // Skip showing this error
    }
    
    // Update error count
    setErrorCounts(prev => {
      const currentCount = (prev[errorKey] || 0) + 1;
      return { ...prev, [errorKey]: currentCount };
    });
    
    // Determine if we should show or throttle this error
    const currentCount = errorCounts[errorKey] || 0;
    
    // If this is a silent error or we've shown it too many times, don't show it
    if (isSilent) {
      console.error(`[${category}] ${message}`);
      return;
    }
    
    if (currentCount >= maxDuplicates) {
      // If we've shown this error too many times, throttle it
      if (!throttledErrors.has(errorKey)) {
        setThrottledErrors(prev => new Set(prev).add(errorKey));
        
        // Show aggregated message
        toast.error(`Multiple similar errors occurred`, {
          description: `${message} (${currentCount} occurrences)`,
          duration: 5000,
        });
        
        // Set a timer to remove from throttled list
        setTimeout(() => {
          setThrottledErrors(prev => {
            const newSet = new Set(prev);
            newSet.delete(errorKey);
            return newSet;
          });
        }, throttleMs);
      }
    } else {
      // Show the error normally
      toast.error(message);
    }
    
    // Log to console regardless
    console.error(`[${category}] ${message}`);
  }, [errorCounts, maxDuplicates, silentCategories, throttleMs, throttledErrors]);
  
  /**
   * Reset error counts for a category or all categories
   */
  const resetErrorCounts = useCallback((category?: string) => {
    if (category) {
      const prefix = `${category}:`;
      setErrorCounts(prev => {
        const newCounts = { ...prev };
        Object.keys(newCounts).forEach(key => {
          if (key.startsWith(prefix)) {
            delete newCounts[key];
          }
        });
        return newCounts;
      });
    } else {
      setErrorCounts({});
    }
  }, []);
  
  return {
    reportError,
    errorCounts,
    resetErrorCounts
  };
}
