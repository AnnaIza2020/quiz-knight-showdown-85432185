
import { useEffect, useRef } from 'react';

interface SubscriptionOptions {
  onMessage?: (data: any) => void;
  onError?: (error: Error) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  immediate?: boolean;
}

export const useSubscription = (channel: string, options: SubscriptionOptions = {}) => {
  const { onMessage, onError, onConnect, onDisconnect, immediate = true } = options;
  const subscribedRef = useRef(false);

  useEffect(() => {
    if (!immediate || subscribedRef.current) return;
    
    subscribedRef.current = true;
    
    // Mock subscription logic
    console.log(`Subscribed to channel: ${channel}`);
    
    if (onConnect) {
      onConnect();
    }

    // Cleanup function
    return () => {
      subscribedRef.current = false;
      console.log(`Unsubscribed from channel: ${channel}`);
      
      if (onDisconnect) {
        onDisconnect();
      }
    };
  }, [channel, onConnect, onDisconnect, immediate]);

  // Mock methods
  const send = (data: any) => {
    console.log(`Sending data to ${channel}:`, data);
    
    // Simulate processing
    setTimeout(() => {
      if (onMessage) {
        onMessage({ type: 'response', data });
      }
    }, 100);
  };

  const broadcast = (data: any) => {
    console.log(`Broadcasting to ${channel}:`, data);
    
    // Simulate broadcasting
    setTimeout(() => {
      if (onMessage) {
        onMessage({ type: 'broadcast', data });
      }
    }, 50);
  };

  const disconnect = () => {
    subscribedRef.current = false;
    if (onDisconnect) {
      onDisconnect();
    }
  };

  return {
    send,
    broadcast,
    disconnect,
    isConnected: subscribedRef.current
  };
};
