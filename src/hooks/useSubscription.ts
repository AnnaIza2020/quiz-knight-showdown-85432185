
import { useEffect, useState } from 'react';
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

/**
 * Hook do zarządzania subskrypcją do kanału Supabase Realtime
 * @param channel Nazwa kanału
 * @param event Nazwa zdarzenia
 * @param callback Funkcja wywołana przy otrzymaniu zdarzenia
 */
export function useSubscription<T = any>(
  channel: string,
  event: string,
  callback: (payload: T) => void
) {
  const [subscription, setSubscription] = useState<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    const setupSubscription = async () => {
      try {
        // Ustaw subskrypcję
        const newSubscription = supabase
          .channel(channel)
          .on('broadcast', { event }, (payload) => {
            if (mounted) {
              callback(payload.payload as T);
            }
          })
          .on('presence', { event: 'sync' }, () => {
            if (mounted) {
              setIsConnected(true);
            }
          })
          .on('presence', { event: 'join' }, () => {
            console.log(`Użytkownik dołączył do kanału ${channel}`);
          })
          .on('presence', { event: 'leave' }, () => {
            console.log(`Użytkownik opuścił kanał ${channel}`);
          })
          .subscribe();

        if (mounted) {
          setSubscription(newSubscription);
        }
      } catch (err) {
        console.error('Błąd podczas tworzenia subskrypcji:', err);
        if (mounted) {
          setError(err instanceof Error ? err : new Error(String(err)));
        }
      }
    };

    setupSubscription();

    return () => {
      mounted = false;
      // Zamknij subskrypcję przy odmontowaniu
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [channel, event, callback]);

  return { isConnected, error };
}

// Funkcja pomocnicza do nadawania wiadomości do kanału
export const broadcastToChannel = async (
  channel: string,
  event: string,
  payload: any
) => {
  try {
    await supabase.channel(channel).send({
      type: 'broadcast',
      event,
      payload,
    });
    return true;
  } catch (error) {
    console.error('Błąd podczas nadawania wiadomości:', error);
    return false;
  }
};
