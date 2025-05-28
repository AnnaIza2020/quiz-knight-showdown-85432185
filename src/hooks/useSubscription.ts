
import { useEffect, useRef } from 'react';

interface UseSubscriptionOptions {
  onMessage?: (data: any) => void;
  onError?: (error: any) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  immediate?: boolean;
}

export const useSubscription = (
  topic?: string, 
  eventType?: string | UseSubscriptionOptions,
  callback?: (data: any) => void,
  options: UseSubscriptionOptions = {}
) => {
  // Handle different parameter configurations
  let finalOptions: UseSubscriptionOptions = {};
  let finalCallback = callback;
  
  if (typeof eventType === 'object') {
    finalOptions = eventType;
    finalCallback = callback;
  } else {
    finalOptions = options;
  }

  const connectionRef = useRef<{
    send: (data: any) => void;
    disconnect: () => void;
    isConnected: boolean;
    broadcast: (data: any) => void;
  }>({
    send: (data: any) => {
      console.log('Mock send:', data);
      if (finalOptions.onMessage) {
        setTimeout(() => finalOptions.onMessage?.(data), 100);
      }
    },
    disconnect: () => {
      console.log('Mock disconnect');
      if (finalOptions.onDisconnect) {
        finalOptions.onDisconnect();
      }
    },
    isConnected: true,
    broadcast: (data: any) => {
      console.log('Mock broadcast:', data);
      if (finalOptions.onMessage) {
        setTimeout(() => finalOptions.onMessage?.(data), 100);
      }
      if (finalCallback) {
        setTimeout(() => finalCallback(data), 100);
      }
    }
  });

  useEffect(() => {
    if (finalOptions.onConnect) {
      finalOptions.onConnect();
    }

    return () => {
      if (finalOptions.onDisconnect) {
        finalOptions.onDisconnect();
      }
    };
  }, []);

  return connectionRef.current;
};
