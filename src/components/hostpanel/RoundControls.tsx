
import React from 'react';
import { GameRound } from '@/types/game-types';

interface RoundControlsProps {
  round: GameRound;
  handleStartTimer: (seconds: number) => void;
}

const RoundControls = ({ round, handleStartTimer }: RoundControlsProps) => {
  // Render round-specific controls
  switch (round) {
    case GameRound.ROUND_ONE:
      return (
        <div className="mt-6 p-4 bg-black/50 backdrop-blur-sm rounded-lg border border-neon-blue/30">
          <h3 className="text-neon-blue text-xl mb-3">Wybór kategorii i trudności</h3>
          <div className="grid grid-cols-4 gap-3">
            {['Sport', 'Historia', 'Geografia', 'Kultura'].map(category => (
              <div key={category} className="flex flex-col gap-2">
                <div className="text-center text-neon-pink font-bold mb-1">{category}</div>
                {[5, 10, 15, 20].map(points => (
                  <button
                    key={`${category}-${points}`}
                    className="py-2 px-4 bg-black border border-neon-yellow text-neon-yellow rounded-md hover:bg-neon-yellow/20"
                  >
                    {points}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      );
      
    case GameRound.ROUND_TWO:
      return (
        <div className="mt-6 p-4 bg-black/50 backdrop-blur-sm rounded-lg border border-neon-blue/30">
          <h3 className="text-neon-blue text-xl mb-3">Runda 5 Sekund</h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              className="py-3 px-6 bg-black border-2 border-neon-green text-neon-green rounded-md font-bold hover:bg-neon-green/20"
              onClick={() => handleStartTimer(5)}
            >
              Rozpocznij 5s
            </button>
            <button
              className="py-3 px-6 bg-black border-2 border-neon-red text-neon-red rounded-md font-bold hover:bg-neon-red/20"
            >
              Niepoprawna odpowiedź
            </button>
          </div>
        </div>
      );
      
    case GameRound.ROUND_THREE:
      return (
        <div className="mt-6 p-4 bg-black/50 backdrop-blur-sm rounded-lg border border-neon-blue/30">
          <h3 className="text-neon-purple text-xl mb-3">Koło Fortuny</h3>
          <div className="flex justify-center">
            <button
              className="py-3 px-8 bg-black border-2 border-neon-purple text-neon-purple rounded-md font-bold hover:bg-neon-purple/20 text-xl"
            >
              Kręć kołem
            </button>
          </div>
        </div>
      );
      
    default:
      return (
        <div className="mt-6 p-4 bg-black/50 backdrop-blur-sm rounded-lg">
          <h3 className="text-white text-xl">Przygotowanie do gry</h3>
          <p className="text-white/70">Wybierz graczy i rozpocznij rundę 1</p>
        </div>
      );
  }
};

export default RoundControls;
