
import React, { useState, useEffect } from 'react';
import { GameRound } from '@/types/game-types';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/context/GameContext';
import { DatabaseIcon, FastForward, TimerReset, TimerOff, Timer } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface TopBarProps {
  round: GameRound;
  handleStartTimer: (seconds: number) => void;
  stopTimer: () => void;
  handleAdvanceToRound: (round: GameRound) => void;
}

const TopBar: React.FC<TopBarProps> = ({
  round,
  handleStartTimer,
  stopTimer,
  handleAdvanceToRound
}) => {
  const { timerRunning, timerSeconds, roundSettings } = useGameContext();
  const [roundName, setRoundName] = useState<string>('');
  const [availableEditions, setAvailableEditions] = useState<string[]>([]);
  
  // Effect to determine round name based on current round
  useEffect(() => {
    switch(round) {
      case GameRound.SETUP:
        setRoundName('Przygotowanie');
        break;
      case GameRound.ROUND_ONE:
        setRoundName('Runda 1 - Eliminacje');
        break;
      case GameRound.ROUND_TWO:
        setRoundName('Runda 2 - Szybka Odpowiedź');
        break;
      case GameRound.ROUND_THREE:
        setRoundName('Runda 3 - Koło Fortuny');
        break;
      case GameRound.FINISHED:
        setRoundName('Zakończono');
        break;
      default:
        setRoundName('Nieznana runda');
    }
  }, [round]);
  
  // Load available editions when component mounts
  useEffect(() => {
    const loadEditions = async () => {
      try {
        // Fix: Use direct table access instead of from() method
        const { data, error } = await supabase
          .from('game_settings')
          .select('id');
        
        if (error) {
          console.error('Error fetching editions:', error);
          return;
        }
        
        // Filter out records that start with 'edition_'
        if (data) {
          const editionIds = data
            .filter(record => record.id.startsWith('edition_'))
            .map(record => record.id.replace('edition_', ''));
          
          setAvailableEditions(editionIds);
        }
      } catch (err) {
        console.error('Failed to load editions:', err);
      }
    };
    
    loadEditions();
  }, []);
  
  // Get the appropriate timer duration for the current round
  const getTimerDuration = (): number => {
    switch(round) {
      case GameRound.ROUND_ONE:
        return roundSettings?.[GameRound.ROUND_ONE]?.timerDuration || 30;
      case GameRound.ROUND_TWO:
        return roundSettings?.[GameRound.ROUND_TWO]?.timerDuration || 5;
      case GameRound.ROUND_THREE:
        return roundSettings?.[GameRound.ROUND_THREE]?.timerDuration || 30;
      default:
        return 30;
    }
  };
  
  return (
    <div className="flex justify-between items-center p-4 bg-black/50 backdrop-blur-md rounded-lg border border-white/10 mb-4">
      {/* Left - Round Name and Buttons */}
      <div className="flex items-center space-x-2">
        <div>
          <span className="text-white/60 text-sm mr-1">Runda:</span>
          <span className="font-bold">{roundName}</span>
        </div>
        
        <div className="ml-4 space-x-1">
          {round === GameRound.ROUND_ONE && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAdvanceToRound(GameRound.ROUND_TWO)}
              className="text-xs bg-neon-green/10 hover:bg-neon-green/20"
              title="Przejdź do Rundy 2"
            >
              <FastForward size={14} className="mr-1" />
              Runda 2
            </Button>
          )}
          
          {round === GameRound.ROUND_TWO && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAdvanceToRound(GameRound.ROUND_THREE)}
              className="text-xs bg-neon-green/10 hover:bg-neon-green/20"
              title="Przejdź do Rundy 3"
            >
              <FastForward size={14} className="mr-1" />
              Runda 3
            </Button>
          )}
        </div>
      </div>
      
      {/* Right - Timer Controls */}
      <div className="flex items-center space-x-2">
        <span className={`font-mono ${timerRunning ? 'text-neon-green' : 'text-white/60'}`}>
          {timerRunning ? (
            `${timerSeconds}s`
          ) : (
            'Timer zatrzymany'
          )}
        </span>
        
        {!timerRunning ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStartTimer(getTimerDuration())}
            title="Rozpocznij timer"
          >
            <Timer size={16} />
          </Button>
        ) : (
          <Button
            variant="outline"
            size="sm"
            onClick={stopTimer}
            title="Zatrzymaj timer"
          >
            <TimerOff size={16} />
          </Button>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            stopTimer();
            handleStartTimer(getTimerDuration());
          }}
          title="Zresetuj timer"
        >
          <TimerReset size={16} />
        </Button>
      </div>
    </div>
  );
};

export default TopBar;
