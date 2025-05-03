
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type ConnectionStatus = 'connected' | 'error' | 'checking';

interface PlayerConnectionOptions {
  playerId?: string;
  playerNickname?: string;
}

export const usePlayerConnection = (options?: PlayerConnectionOptions) => {
  const [status, setStatus] = useState<ConnectionStatus>('checking');
  const [isReady, setIsReady] = useState<boolean>(false);
  const [gameEvent, setGameEvent] = useState<string>('');
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerSeconds, setTimerSeconds] = useState<number>(30);
  const [question, setQuestion] = useState<any>(null);

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
            
            // If connected and player ID provided, subscribe to player's game events
            if (options?.playerId) {
              subscribeToPlayerEvents(options.playerId);
            }
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
  }, [options?.playerId]);

  // Subscribe to player events
  const subscribeToPlayerEvents = (playerId: string) => {
    try {
      // Subscribe to game state changes
      const channel = supabase
        .channel(`player-${playerId}`)
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'game_state',
          filter: `active_player_id=eq.${playerId}`
        }, (payload) => {
          console.log('Game state updated:', payload);
          
          // Update timer if present in payload
          if (payload.new.timer_running !== undefined) {
            setTimerRunning(payload.new.timer_running);
          }
          
          if (payload.new.timer_duration !== undefined) {
            setTimerSeconds(payload.new.timer_duration);
          }
          
          // Update question if present
          if (payload.new.current_question) {
            setQuestion(payload.new.current_question);
          }
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'players',
          filter: `id=eq.${playerId}`
        }, (payload) => {
          console.log('Player data updated:', payload);
          
          // Check for status changes that might trigger events
          if (payload.new.status !== payload.old.status) {
            setGameEvent(`Status changed to: ${payload.new.status}`);
          }
        })
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    } catch (error) {
      console.error('Failed to subscribe to player events:', error);
    }
  };

  return {
    status,
    isConnected: status === 'connected',
    isReady,
    gameEvent,
    timerRunning,
    timerSeconds,
    question,
    connectionStatus: status
  };
};
