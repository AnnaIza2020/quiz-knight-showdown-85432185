
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

type ConnectionStatus = 'connected' | 'error' | 'checking';

export const usePlayerConnection = () => {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [isReady, setIsReady] = useState<boolean>(false);

  // Check connection status
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Attempt a simple query to check connection
        if (supabase) {
          const { error } = await supabase.from('players').select('id').limit(1);
          
          if (error) {
            console.error('Connection error:', error);
            setStatus('error');
          } else {
            setStatus('connected');
          }
        } else {
          // No supabase client available
          setStatus('error');
        }
      } catch (error) {
        console.error('Connection error:', error);
        setStatus('error');
      } finally {
        setIsReady(true);
      }
    };
    
    checkConnection();
    
    // Periodically check connection (every 30 seconds)
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return {
    status,
    isConnected: status === 'connected',
    isReady
  };
};
