
import { useState, useCallback, useRef, useEffect } from 'react';

type SubscriptionHandler<T> = (payload: T) => void;

interface SubscribeOptions {
  immediate?: boolean;
}

/**
 * Custom hook for subscribing to and broadcasting events in a global event system
 * 
 * @param channel The event channel to subscribe to
 * @param event The specific event to listen for
 * @param handler The function to call when the event is received
 * @param options Options for the subscription behavior
 * @returns Object with subscribe and broadcast methods
 */
export function useSubscription<T = any>(
  channel: string,
  event: string,
  handler: SubscriptionHandler<T>,
  options?: SubscribeOptions
) {
  const handlerRef = useRef<SubscriptionHandler<T>>(handler);
  const subscribedRef = useRef<boolean>(false);
  
  // Update the handler reference whenever it changes
  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);
  
  // Create a unique ID for this subscriber
  const subscriberId = useRef<string>(Math.random().toString(36).substring(2, 15));
  
  // Get the global events object or create it if it doesn't exist
  const getEvents = useCallback(() => {
    if (!(window as any).__gameEvents) {
      (window as any).__gameEvents = {};
    }
    return (window as any).__gameEvents;
  }, []);
  
  // Subscribe to events (returns unsubscribe function)
  const subscribe = useCallback(() => {
    const events = getEvents();
    
    if (!events[channel]) {
      events[channel] = {};
    }
    
    if (!events[channel][event]) {
      events[channel][event] = {};
    }
    
    // Register this subscriber
    events[channel][event][subscriberId.current] = (payload: T) => {
      if (handlerRef.current) {
        handlerRef.current(payload);
      }
    };
    
    subscribedRef.current = true;
    
    // Return unsubscribe function
    return () => {
      if (events[channel] && events[channel][event]) {
        delete events[channel][event][subscriberId.current];
        subscribedRef.current = false;
      }
    };
  }, [channel, event, getEvents]);
  
  // Broadcast an event to all subscribers
  const broadcast = useCallback((payload: T) => {
    const events = getEvents();
    
    if (!events[channel] || !events[channel][event]) {
      return;
    }
    
    // Call all subscriber handlers
    Object.values(events[channel][event]).forEach((handler: any) => {
      try {
        handler(payload);
      } catch (error) {
        console.error(`Error in subscription handler for ${channel}.${event}:`, error);
      }
    });
  }, [channel, event, getEvents]);
  
  // Auto-subscribe if immediate option is true (default)
  useEffect(() => {
    const immediate = options?.immediate !== false;
    
    if (immediate && !subscribedRef.current) {
      const unsubscribe = subscribe();
      return unsubscribe;
    }
  }, [options?.immediate, subscribe]);
  
  return { subscribe, broadcast };
}
