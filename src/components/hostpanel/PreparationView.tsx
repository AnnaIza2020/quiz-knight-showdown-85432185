
import React from 'react';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import { PlayCircle, Users } from 'lucide-react';
import PlayersGrid from './PlayersGrid';
import { useNavigate } from 'react-router-dom';

interface PreparationViewProps {
  players: any[];
  addEvent: (event: string) => void;
  isIntroPlaying: boolean;
  handleTimerStart: (seconds: number) => void;
  timerRunning: boolean;
  timerSeconds: number;
  stopTimer: () => void;
  startGameWithIntro: () => void;
}

const PreparationView: React.FC<PreparationViewProps> = ({
  players,
  addEvent,
  isIntroPlaying,
  handleTimerStart,
  timerRunning,
  timerSeconds,
  stopTimer,
  startGameWithIntro
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* Player Management */}
      <div className="bg-black/40 p-4 rounded-lg border border-white/10">
        <h2 className="text-xl font-bold mb-4 text-white">Zarządzanie Graczami</h2>
        {players.length > 0 ? (
          <PlayersGrid activePlayers={players} gridSize={10} />
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-white/60">
            <Users size={48} className="mb-4 opacity-50" />
            <p className="text-center">Brak graczy. Dodaj graczy w panelu ustawień.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/settings')}
            >
              Przejdź do ustawień
            </Button>
          </div>
        )}
      </div>
      
      {/* Game Preparation */}
      <div className="bg-black/40 p-4 rounded-lg border border-white/10">
        <h2 className="text-xl font-bold mb-4 text-white">Przygotowanie Gry</h2>
        
        <div className="space-y-4">
          <div className="p-4 border border-white/10 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-white">Status Gry</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-white/60">Aktualna runda</p>
                <p className="text-lg font-bold text-neon-pink">Przygotowanie</p>
              </div>
              <div>
                <p className="text-sm text-white/60">Liczba graczy</p>
                <p className="text-lg font-bold text-neon-blue">{players.length}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border border-white/10 rounded-lg">
            <h3 className="text-lg font-medium mb-4 text-white">Odliczanie do startu</h3>
            <div className="grid grid-cols-4 gap-2">
              <Button 
                variant="outline" 
                className="border-neon-green text-neon-green hover:bg-neon-green/20"
                onClick={() => handleTimerStart(5)}
              >
                5s
              </Button>
              <Button 
                variant="outline" 
                className="border-neon-blue text-neon-blue hover:bg-neon-blue/20"
                onClick={() => handleTimerStart(10)}
              >
                10s
              </Button>
              <Button 
                variant="outline" 
                className="border-neon-purple text-neon-purple hover:bg-neon-purple/20"
                onClick={() => handleTimerStart(30)}
              >
                30s
              </Button>
              <Button 
                variant="outline" 
                className="border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20"
                onClick={() => handleTimerStart(60)}
              >
                60s
              </Button>
            </div>
            {timerRunning && (
              <div className="mt-4 text-center">
                <p className="text-2xl font-bold text-neon-green mb-2">{timerSeconds}s</p>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={stopTimer}
                >
                  Zatrzymaj
                </Button>
              </div>
            )}
          </div>
          
          <div className="p-4 border border-white/10 rounded-lg">
            <h3 className="text-lg font-medium mb-2 text-white">Rozpocznij Grę</h3>
            <p className="text-sm text-white/60 mb-4">
              Upewnij się, że wszyscy gracze są gotowi przed rozpoczęciem gry.
              Rozpoczęcie gry wyświetli czołówkę, a następnie przejdzie do Rundy 1.
            </p>
            <Button
              className="w-full bg-neon-green text-black hover:bg-neon-green/80"
              onClick={startGameWithIntro}
              disabled={isIntroPlaying || players.length === 0}
            >
              <PlayCircle size={18} className="mr-2" />
              Start gry z czołówką
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreparationView;
