import { useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { RealtimeChannel } from '@supabase/supabase-js';

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
  // Keep a reference to the subscription to prevent recreation on re-renders
  const subscriptionRef = useRef<RealtimeChannel | null>(null);
  
  useEffect(() => {
    // Only create a new subscription if we don't have one already
    if (!subscriptionRef.current) {
      // Initialize Supabase subscription
      subscriptionRef.current = supabase
        .channel(channel)
        .on('broadcast', { event }, (payload) => {
          callback(payload.payload as T);
        })
        .subscribe();
    }
    
    // Cleanup on unmount
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    };
  }, [channel, event, callback]);

  // Return functions to send broadcasts and unsubscribe
  return {
    broadcast: async (payload: T) => {
      return supabase.channel(channel).send({
        type: 'broadcast',
        event,
        payload
      });
    },
    unsubscribe: () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
    }
  };
};
