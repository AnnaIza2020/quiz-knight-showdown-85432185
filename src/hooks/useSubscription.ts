
import { useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

interface UseSubscriptionOptions {
  immediate?: boolean;
}

/**
 * Hook for subscribing to Supabase realtime events
 */
export function useSubscription<T>(
  channelName: string,
  eventName: string,
  callback: (payload: T) => void,
  options: UseSubscriptionOptions = {}
) {
  // Default to immediate subscription
  const { immediate = true } = options;
  
  // Create subscription on mount
  useEffect(() => {
    if (immediate) {
      const channel = supabase.channel(channelName);
      
      // Set up the event handler
      channel.on('broadcast', { event: eventName }, (payload) => {
        callback(payload.payload as T);
      });
      
      // Subscribe to the channel
      const subscription = channel.subscribe();
      
      // Cleanup on unmount
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [channelName, eventName, callback, immediate]);

  // Function to manually subscribe to events
  const subscribe = useCallback(() => {
    const channel = supabase.channel(channelName);
    
    // Set up the event handler
    channel.on('broadcast', { event: eventName }, (payload) => {
      callback(payload.payload as T);
    });
    
    // Subscribe to the channel
    const subscription = channel.subscribe();
    
    // Return cleanup function
    return () => {
      supabase.removeChannel(channel);
    };
  }, [channelName, eventName, callback]);
  
  // Function to broadcast an event
  const broadcast = useCallback((payload: any) => {
    try {
      const channel = supabase.channel(channelName);
      channel.send({
        type: 'broadcast',
        event: eventName,
        payload
      });
      return { success: true };
    } catch (error) {
      console.error('Error broadcasting event:', error);
      return { success: false, error };
    }
  }, [channelName, eventName]);
  
  return {
    subscribe,
    broadcast
  };
}
