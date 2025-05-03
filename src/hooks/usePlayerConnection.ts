import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import { useSubscription } from '@/hooks/useSubscription';

interface PlayerConnectionOptions {
  playerId: string;
  playerNickname: string;
  onEvent?: (eventType: string, payload: any) => void;
}

export const usePlayerConnection = ({ 
  playerId, 
  playerNickname,
  onEvent
}: PlayerConnectionOptions) => {
  const [gameEvent, setGameEvent] = useState<string | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error'>('connected');
  const [question, setQuestion] = useState<any>(null);
  const [playerCards, setPlayerCards] = useState<any[]>([]);
  
  const { playSound } = useSoundEffects({
    useLocalStorage: true,
    defaultVolume: 0.5
  });
  
  // Subscribe to game events
  const { subscribe } = useSubscription<any>(
    'game_events',
    'new_event',
    (payload) => {
      // Handle game events relevant to this player
      if (playerId && payload.playerId === playerId) {
        setGameEvent(payload.event || 'Nowe wydarzenie w grze');
        
        // Handle specific event types
        if (payload.type === 'points_awarded') {
          playSound('success');
          if (onEvent) onEvent('points_awarded', payload);
        } else if (payload.type === 'points_deducted') {
          playSound('fail');
          if (onEvent) onEvent('points_deducted', payload);
        } else if (payload.type === 'player_eliminated') {
          playSound('eliminate');
          if (onEvent) onEvent('player_eliminated', payload);
        } else if (payload.type === 'timer_started') {
          setTimerRunning(true);
          setTimerSeconds(payload.seconds || 30);
          playSound('wheel-tick');
          if (onEvent) onEvent('timer_started', payload);
        } else if (payload.type === 'timer_stopped') {
          setTimerRunning(false);
          playSound('timeout');
          if (onEvent) onEvent('timer_stopped', payload);
        } else if (payload.type === 'question_received') {
          setQuestion(payload.question);
          if (onEvent) onEvent('question_received', payload);
        } else if (payload.type === 'card_received') {
          setPlayerCards(prev => [...prev, payload.card]);
          playSound('card-reveal');
          if (onEvent) onEvent('card_received', payload);
        } else if (payload.type === 'card_used') {
          setPlayerCards(prev => prev.filter(card => card.id !== payload.cardId));
          if (onEvent) onEvent('card_used', payload);
        }
        
        // Clear event message after a few seconds
        setTimeout(() => {
          setGameEvent(null);
        }, 5000);
      }
    }
  );
  
  // Notify host about player connection
  useEffect(() => {
    const notifyHost = async () => {
      if (playerId) {
        try {
          await supabase
            .channel('game_events')
            .send({
              type: 'broadcast',
              event: 'player_joined',
              payload: { 
                player_id: playerId,
                nickname: playerNickname
              }
            });
            
          setConnectionStatus('connected');
        } catch (error) {
          console.error('Error notifying host:', error);
          setConnectionStatus('error');
        }
      }
    };
    
    notifyHost();
    
    // Set up ping interval to keep connection alive
    const pingInterval = setInterval(() => {
      supabase
        .channel('game_events')
        .send({
          type: 'broadcast',
          event: 'player_ping',
          payload: { 
            player_id: playerId,
            timestamp: new Date().toISOString()
          }
        })
        .then(() => setConnectionStatus('connected'))
        .catch(() => setConnectionStatus('error'));
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(pingInterval);
  }, [playerId, playerNickname]);
  
  return {
    gameEvent,
    timerRunning,
    timerSeconds,
    connectionStatus,
    question,
    playerCards,
    setGameEvent,
    setTimerRunning,
    setTimerSeconds,
    subscribe
  };
};

export default usePlayerConnection;
