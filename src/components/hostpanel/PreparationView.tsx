
import React from 'react';
import { Player } from '@/types/game-types';
import PlayerCardWithControls from './PlayerCardWithControls';

interface PreparationViewProps {
  players: Player[];
  addEvent: (event: string) => void;
  handleTimerStart: (seconds: number) => void;
  timerRunning: boolean;
  timerSeconds: number;
  stopTimer: () => void;
  startGame: () => void;
}

const PreparationView: React.FC<PreparationViewProps> = ({
  players,
  addEvent,
  handleTimerStart,
  timerRunning,
  timerSeconds,
  stopTimer,
  startGame
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-black/50 backdrop-blur-md p-6 rounded-lg border border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-white">Przygotowanie do gry</h2>
        <p className="text-white/80 mb-4">
          Dodaj graczy, kategorie i pytania przed rozpoczęciem gry.
        </p>
        
        <div className="flex flex-col gap-4">
          <button
            className="bg-neon-green text-black hover:bg-neon-green/80 rounded-md px-4 py-2 w-full"
            onClick={startGame}
          >
            Rozpocznij grę
          </button>

          <button
            className="bg-transparent border border-neon-blue text-neon-blue hover:bg-neon-blue/10 rounded-md px-4 py-2 w-full"
            onClick={() => handleTimerStart(60)}
          >
            Rozpocznij odliczanie 60s
          </button>

          {timerRunning && (
            <div className="flex gap-2">
              <div className="bg-neon-pink/20 rounded-md px-4 py-2 flex-grow text-center">
                Pozostało: {timerSeconds}s
              </div>
              <button
                className="bg-neon-pink text-black hover:bg-neon-pink/80 rounded-md px-4 py-2"
                onClick={stopTimer}
              >
                Zatrzymaj
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-black/50 backdrop-blur-md p-6 rounded-lg border border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-white">Gracze</h2>
        {players.length === 0 ? (
          <p className="text-white/60 text-center py-6">
            Brak graczy. Dodaj graczy w panelu ustawień.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {players.map(player => (
              <PlayerCardWithControls 
                key={player.id} 
                player={player} 
                isCompact={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PreparationView;
