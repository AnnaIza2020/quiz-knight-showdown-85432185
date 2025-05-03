
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';
import { useSubscription } from '@/hooks/useSubscription';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import CountdownTimer from '@/components/CountdownTimer';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import { TimerProvider } from '@/context/TimerContext';

interface PlayerViewContentProps {
  player: any;
}

const PlayerViewContent: React.FC<PlayerViewContentProps> = ({ player }) => {
  const [gameEvent, setGameEvent] = useState<string | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'error'>('connected');
  
  const { playSound } = useSoundEffects({
    useLocalStorage: true,
    defaultVolume: 0.5
  });
  
  // Subscribe to game events
  const { subscribe, broadcast } = useSubscription<any>(
    'game_events',
    'new_event',
    (payload) => {
      // Handle game events relevant to this player
      if (player && payload.playerId === player.id) {
        setGameEvent(payload.event || 'Nowe wydarzenie w grze');
        
        // Handle specific event types
        if (payload.type === 'points_awarded') {
          playSound('success');
        } else if (payload.type === 'points_deducted') {
          playSound('fail');
        } else if (payload.type === 'player_eliminated') {
          playSound('eliminate');
        } else if (payload.type === 'timer_started') {
          setTimerRunning(true);
          setTimerSeconds(payload.seconds || 30);
          playSound('wheel-tick');
        } else if (payload.type === 'timer_stopped') {
          setTimerRunning(false);
          playSound('timeout');
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
      if (player) {
        try {
          await supabase
            .channel('game_events')
            .send({
              type: 'broadcast',
              event: 'player_joined',
              payload: { 
                player_id: player.id,
                nickname: player.nickname
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
            player_id: player.id,
            timestamp: new Date().toISOString()
          }
        })
        .then(() => setConnectionStatus('connected'))
        .catch(() => setConnectionStatus('error'));
    }, 30000); // Every 30 seconds
    
    return () => clearInterval(pingInterval);
  }, [player]);
  
  return (
    <TimerProvider initialSeconds={timerSeconds} autoStart={timerRunning}>
      <div className="max-w-3xl mx-auto w-full">
        {/* Connection status indicator */}
        <div className="absolute top-2 right-2 flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${
            connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
          }`} />
          <span className="text-xs text-white/70">
            {connectionStatus === 'connected' ? 'Połączono' : 'Problem z połączeniem'}
          </span>
        </div>
        
        {/* Header with player info */}
        <header 
          className="mb-6 p-4 rounded-lg border" 
          style={{ 
            borderColor: player.color || '#ff00ff',
            boxShadow: `0 0 10px ${player.color || '#ff00ff'}` 
          }}
        >
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold" style={{ color: player.color || '#ff00ff' }}>
              {player.nickname}
            </h1>
            <div className="text-white font-bold">
              {player.points} punktów
            </div>
          </div>
          
          {/* Health bar */}
          <div className="mt-2">
            <div className="flex justify-between text-xs text-white/70 mb-1">
              <span>Zdrowie</span>
              <span>{player.life_percent}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <motion.div 
                className="h-full"
                style={{ 
                  backgroundColor: player.color || '#ff00ff',
                  width: `${player.life_percent}%` 
                }}
                initial={{ width: 0 }}
                animate={{ width: `${player.life_percent}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </header>
        
        {/* Game events notification */}
        {gameEvent && (
          <motion.div 
            className="mb-6 p-4 bg-black/50 border border-white/20 rounded-lg text-white text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            {gameEvent}
          </motion.div>
        )}
        
        {/* Timer display */}
        {timerRunning && (
          <div className="mb-6">
            <CountdownTimer 
              size="lg"
              className="mx-auto"
            />
          </div>
        )}
        
        {/* Camera preview */}
        <div className="aspect-video rounded-lg overflow-hidden bg-black/50 border border-white/20 mb-6">
          {player.camera_url ? (
            <iframe 
              src={player.camera_url} 
              className="w-full h-full" 
              allowFullScreen
              title="Player camera"
            />
          ) : player.avatar_url ? (
            <img 
              src={player.avatar_url} 
              alt={player.nickname} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-white/50">Brak kamery</span>
            </div>
          )}
        </div>
        
        {/* Status panel */}
        <div className="p-4 bg-black/50 border border-white/20 rounded-lg">
          <h2 className="text-white text-xl mb-4">Status gry</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-white/70">Status</div>
              <div className="text-white flex items-center">
                {player.status === 'active' ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                    Aktywny
                  </>
                ) : player.status === 'eliminated' ? (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                    Wyeliminowany
                  </>
                ) : (
                  'Oczekiwanie'
                )}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-white/70">ID gracza</div>
              <div className="text-white/50 text-sm">{player.id.substring(0, 8)}...</div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-white/50">
            Nie zamykaj tego okna! Host gry widzi Twoją kamerę.
          </div>
        </div>
      </div>
    </TimerProvider>
  );
};

export default PlayerViewContent;
