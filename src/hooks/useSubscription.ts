
import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';

/**
 * Hook for subscribing to real-time changes
 * @param channel - Channel name to subscribe to
 * @param event - Event name to listen for
 * @param callback - Callback function to execute when event is triggered
 */
export const useSubscription = <T>(
  channel: string,
  event: string,
  callback: (payload: T) => void
) => {
  useEffect(() => {
    // Initialize Supabase subscription
    const subscription = supabase
      .channel(channel)
      .on('broadcast', { event }, (payload) => {
        callback(payload.payload as T);
      })
      .subscribe();
    
    // Cleanup on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [channel, event, callback]);
};
