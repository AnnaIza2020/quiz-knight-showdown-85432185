
import { useEffect, useRef } from 'react';

interface UseSubscriptionOptions {
  onMessage?: (data: any) => void;
  onError?: (error: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export const useSubscription = (
  topic?: string, 
  options: UseSubscriptionOptions = {}
) => {
  const connectionRef = useRef<{
    send: (data: any) => void;
    disconnect: () => void;
    isConnected: boolean;
    broadcast: (data: any) => void;
  }>({
    send: (data: any) => {
      console.log('Mock send:', data);
      if (options.onMessage) {
        setTimeout(() => options.onMessage?.(data), 100);
      }
    },
    disconnect: () => {
      console.log('Mock disconnect');
      if (options.onDisconnect) {
        options.onDisconnect();
      }
    },
    isConnected: true,
    broadcast: (data: any) => {
      console.log('Mock broadcast:', data);
      if (options.onMessage) {
        setTimeout(() => options.onMessage?.(data), 100);
      }
    }
  });

  useEffect(() => {
    if (options.onConnect) {
      options.onConnect();
    }

    return () => {
      if (options.onDisconnect) {
        options.onDisconnect();
      }
    };
  }, []);

  return connectionRef.current;
};
