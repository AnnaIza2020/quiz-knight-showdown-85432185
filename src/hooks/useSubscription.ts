
import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

type SubscriptionCallback<T> = (payload: T) => void;

interface UseSubscriptionOptions {
  immediate?: boolean;
}

/**
 * Custom hook to subscribe to Supabase Realtime channels
 */
export function useSubscription<T = any>(
  channelName: string,
  eventType: string,
  callback: SubscriptionCallback<T>,
  options: UseSubscriptionOptions = { immediate: true }
) {
  const { immediate = true } = options;
  const channelRef = useRef<RealtimeChannel | null>(null);
  const callbackRef = useRef(callback);
  
  // Update callback reference when it changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Function to subscribe to the channel
  const subscribe = useCallback(() => {
    if (channelRef.current) return;
    
    try {
      // Create a new channel subscription
      const channel = supabase.channel(channelName);
      
      // Subscribe to events
      channel.on('broadcast', { event: eventType }, (payload) => {
        callbackRef.current(payload.payload as T);
      });
      
      // Subscribe to the channel
      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to channel ${channelName}, event ${eventType}`);
        }
      });
      
      // Store channel reference
      channelRef.current = channel;
    } catch (error) {
      console.error(`Error subscribing to ${channelName}:`, error);
    }
    
    // Cleanup function to unsubscribe
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [channelName, eventType]);
  
  // Function to broadcast a message
  const broadcast = useCallback((payload: any) => {
    if (!channelRef.current) {
      console.warn('Cannot broadcast message: channel is not subscribed');
      return { success: false };
    }
    
    try {
      channelRef.current.send({
        type: 'broadcast',
        event: eventType,
        payload
      });
      return { success: true };
    } catch (error) {
      console.error('Error broadcasting message:', error);
      return { success: false, error };
    }
  }, [eventType]);
  
  // Subscribe when the component mounts if immediate is true
  useEffect(() => {
    if (immediate) {
      return subscribe();
    }
  }, [immediate, subscribe]);
  
  return { subscribe, broadcast };
}

export default useSubscription;
