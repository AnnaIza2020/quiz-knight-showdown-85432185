
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

/**
 * Enhanced hook for subscribing to real-time changes
 * @param channel - Channel name to subscribe to
 * @param event - Event name to listen for
 * @param callback - Callback function to execute when event is triggered
 * @param options - Optional configuration options
 */
export const useSubscription = <T>(
  channel: string,
  event: string,
  callback: (payload: T) => void,
  options?: {
    immediate?: boolean; // Whether to subscribe immediately
    reconnect?: boolean; // Whether to attempt reconnection on disconnect
    retryInterval?: number; // Retry interval in ms
    retryMax?: number; // Maximum number of retries
  }
) => {
  // Default options
  const defaultOptions = {
    immediate: true,
    reconnect: true,
    retryInterval: 5000,
    retryMax: 10
  };
  
  const opts = { ...defaultOptions, ...options };
  
  // Keep a reference to the subscription to prevent recreation on re-renders
  const subscriptionRef = useRef<RealtimeChannel | null>(null);
  const callbackRef = useRef(callback); // Keep callback reference for closures
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const retryCountRef = useRef<number>(0);
  
  // Update callback reference when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Subscribe to channel function
  const subscribe = useCallback(() => {
    // Clear any existing subscription
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }

    try {
      // Initialize Supabase subscription
      subscriptionRef.current = supabase
        .channel(channel)
        .on('broadcast', { event }, (payload) => {
          callbackRef.current(payload.payload as T);
        })
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            console.log(`Subscribed to ${channel}:${event} successfully`);
            
            // Reset retry counter on successful connection
            retryCountRef.current = 0;
            
            // Clear any pending retry timeouts
            if (retryTimeoutRef.current) {
              clearTimeout(retryTimeoutRef.current);
              retryTimeoutRef.current = null;
            }
          } else if (status === 'CHANNEL_ERROR' && opts.reconnect) {
            console.warn(`Error subscribing to ${channel}:${event}, will retry (${retryCountRef.current + 1}/${opts.retryMax})`);
            
            // Cleanup current subscription
            if (subscriptionRef.current) {
              subscriptionRef.current.unsubscribe();
              subscriptionRef.current = null;
            }
            
            // Check if we should retry
            if (retryCountRef.current < opts.retryMax) {
              retryCountRef.current += 1;
              
              // Set retry timeout with exponential backoff
              const backoffTime = opts.retryInterval * Math.pow(1.5, Math.min(retryCountRef.current, 8));
              
              retryTimeoutRef.current = setTimeout(() => {
                subscribe();
              }, backoffTime);
            } else {
              console.error(`Max retries (${opts.retryMax}) reached for ${channel}:${event}`);
            }
          }
        });
        
      return subscriptionRef.current;
    } catch (error) {
      console.error(`Error creating subscription for ${channel}:${event}:`, error);
      return null;
    }
  }, [channel, event, opts.reconnect, opts.retryInterval, opts.retryMax]);
  
  // Unsubscribe function
  const unsubscribe = useCallback(() => {
    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
    
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    // Reset retry counter
    retryCountRef.current = 0;
  }, []);
  
  // Subscribe on mount if immediate is true
  useEffect(() => {
    if (opts.immediate) {
      subscribe();
    }
    
    // Cleanup on unmount
    return () => {
      unsubscribe();
    };
  }, [subscribe, unsubscribe, opts.immediate]);

  // Broadcast function
  const broadcast = useCallback(async (payload: T) => {
    try {
      return await supabase.channel(channel).send({
        type: 'broadcast',
        event,
        payload
      });
    } catch (error) {
      console.error(`Error broadcasting to ${channel}:${event}:`, error);
      return { error };
    }
  }, [channel, event]);

  // Return functions to manage subscription and broadcast
  return {
    broadcast,
    subscribe,
    unsubscribe,
    isSubscribed: !!subscriptionRef.current
  };
};
