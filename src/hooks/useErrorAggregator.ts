import { useState, useEffect, useCallback } from 'react';
import { errorToast } from './use-toast';

interface ErrorConfig {
  cooldownPeriod?: number; // Time in ms before same error can be shown again
  maxDuplicates?: number;  // Maximum number of identical errors before aggregating
  silentCategories?: string[]; // Categories of errors to silence completely
}

/**
 * A hook to manage error aggregation and prevent notification spam
 */
export function useErrorAggregator(config: ErrorConfig = {}) {
  const {
    cooldownPeriod = 5000,
    maxDuplicates = 2,
    silentCategories = []
  } = config;
  
  // Track error occurrences by category and message
  const [errorCounts, setErrorCounts] = useState<Record<string, Record<string, number>>>({});
  
  // Track when categories were last reported
  const [lastReported, setLastReported] = useState<Record<string, number>>({});
  
  // Reset error counts periodically to prevent memory bloat
  useEffect(() => {
    const interval = setInterval(() => {
      setErrorCounts(prev => {
        const now = Date.now();
        const newCounts: Record<string, Record<string, number>> = {};
        
        // Only keep errors that occurred in the last hour
        Object.entries(prev).forEach(([category, errors]) => {
          if (now - (lastReported[category] || 0) < 3600000) { // 1 hour
            newCounts[category] = errors;
          }
        });
        
        return newCounts;
      });
    }, 3600000); // Check every hour
    
    return () => clearInterval(interval);
  }, [lastReported]);
  
  // Function to report an error with aggregation logic
  const reportError = useCallback((message: string, category: string = "general") => {
    // If this category is silenced, don't show any notification
    if (silentCategories.includes(category)) {
      return;
    }
    
    const now = Date.now();
    const timeSinceLastReport = now - (lastReported[category] || 0);
    
    // Update error counts
    setErrorCounts(prev => {
      const categoryErrors = prev[category] || {};
      const count = (categoryErrors[message] || 0) + 1;
      
      return {
        ...prev,
        [category]: {
          ...categoryErrors,
          [message]: count
        }
      };
    });
    
    setErrorCounts(prev => {
      const count = (prev[category]?.[message] || 0) + 1;
      
      // Check if we should show this error based on cooldown and count
      if (timeSinceLastReport < cooldownPeriod) {
        return prev;
      }
      
      // Update last reported time
      setLastReported(prev => ({ ...prev, [category]: now }));
      
      // If we've seen this error multiple times, show an aggregated message
      if (count > maxDuplicates) {
        errorToast(`${message} (${count} razy)`, category);
      } else {
        // First few occurrences show normally
        errorToast(message, category);
      }
      
      return prev;
    });
  }, [cooldownPeriod, maxDuplicates, silentCategories, lastReported]);
  
  return { reportError };
}
