
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { motion } from 'framer-motion';
import { useSubscription } from '@/hooks/useSubscription';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import CountdownTimer from '@/components/CountdownTimer';

interface PlayerData {
  nickname: string;
  color: string;
  camera_url?: string;
  avatar_url?: string;
  points: number;
  life_percent: number;
  status?: string;
  token: string;
}

const PlayerView = () => {
  const { playerToken } = useParams();
  const [player, setPlayer] = useState<PlayerData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameEvent, setGameEvent] = useState<string | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  
  const { playSound } = useSoundEffects({
    useLocalStorage: true,
    defaultVolume: 0.5
  });
  
  // Load player data from Supabase
  useEffect(() => {
    const fetchPlayerData = async () => {
      try {
        setLoading(true);
        
        if (!playerToken) {
          setError('Nieprawidłowy token gracza');
          return;
        }
        
        // Use a link token to find the player
        const { data, error } = await supabase
          .from('players')
          .select('*')
          .eq('unique_link_token', playerToken)
          .single();
        
        if (error) {
          console.error('Error fetching player:', error);
          setError('Nie udało się znaleźć gracza');
          return;
        }
        
        if (!data) {
          setError('Nie znaleziono gracza');
          return;
        }
        
        setPlayer(data);
        
        // Set the player token in local storage
        localStorage.setItem('playerToken', data.token);
        
        // Alert the host that player has joined
        await supabase
          .channel('game_events')
          .send({
            type: 'broadcast',
            event: 'player_joined',
            payload: { 
              player_id: data.id,
              nickname: data.nickname
            }
          });
          
      } catch (err) {
        console.error('Error:', err);
        setError('Wystąpił błąd podczas ładowania danych gracza');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPlayerData();
  }, [playerToken]);
  
  // Subscribe to game events
  useSubscription<any>(
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
  
  if (loading) {
    return (
      <div className="min-h-screen bg-neon-background flex items-center justify-center">
        <div className="text-white text-xl">Ładowanie panelu gracza...</div>
      </div>
    );
  }
  
  if (error || !player) {
    return (
      <div className="min-h-screen bg-neon-background flex flex-col items-center justify-center p-4">
        <h1 className="text-neon-red text-2xl mb-4">Błąd</h1>
        <p className="text-white text-center">{error || 'Nie można załadować panelu gracza'}</p>
        <p className="text-white/50 text-center mt-4">
          Sprawdź, czy link jest poprawny lub skontaktuj się z hostem gry.
        </p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-neon-background p-4 flex flex-col">
      <div className="max-w-3xl mx-auto w-full">
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
              initialSeconds={timerSeconds} 
              onComplete={() => setTimerRunning(false)}
              size="xl"
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
              <div className="text-white">
                {player.status === 'active' ? 'Aktywny' : 
                 player.status === 'eliminated' ? 'Wyeliminowany' : 'Oczekiwanie'}
              </div>
            </div>
            
            <div>
              <div className="text-sm text-white/70">ID gracza</div>
              <div className="text-white/50 text-sm">{playerToken}</div>
            </div>
          </div>
          
          <div className="mt-4 text-center text-sm text-white/50">
            Nie zamykaj tego okna! Host gry widzi Twoją kamerę.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerView;
