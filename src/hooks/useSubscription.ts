
import { useEffect, useRef } from 'react';

interface UseSubscriptionOptions {
  onMessage?: (data: any) => void;
  onError?: (error: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const useSubscription = (options: UseSubscriptionOptions = {}) => {
  const connectionRef = useRef<{
    send: (data: any) => void;
    disconnect: () => void;
    isConnected: boolean;
  }>({
    send: (data: any) => {
      console.log('Mock send:', data);
      if (options.onMessage) {
        // Simulate async message
        setTimeout(() => options.onMessage?.(data), 100);
      }
    },
    disconnect: () => {
      console.log('Mock disconnect');
      if (options.onDisconnect) {
        options.onDisconnect();
      }
    },
    isConnected: true
  });

  useEffect(() => {
    // Simulate connection
    if (options.onConnect) {
      options.onConnect();
    }

    return () => {
      // Cleanup on unmount
      if (options.onDisconnect) {
        options.onDisconnect();
      }
    };
  }, []);

  return connectionRef.current;
};
