
import React from 'react';
import { GameRound, Question } from '@/types/game-types';

interface PlayerActionsProps {
  activePlayerId: string | null;
  currentQuestion: Question | null;
  round: GameRound;
  handleAwardPoints: () => void;
  handleDeductHealth: () => void;
  handleBonusPoints: () => void;
  handleEliminatePlayer: () => void;
}

const PlayerActions: React.FC<PlayerActionsProps> = ({
  activePlayerId,
  currentQuestion,
  round,
  handleAwardPoints,
  handleDeductHealth,
  handleBonusPoints,
  handleEliminatePlayer,
}) => {
  return (
    <div className="neon-card">
      <h2 className="text-xl font-bold mb-4 text-white">Akcje dla gracza</h2>
      
      {activePlayerId ? (
        <div className="grid grid-cols-2 gap-4">
          <button
            className="py-2 px-4 bg-black border-2 border-neon-green text-neon-green rounded-md font-bold
                      hover:bg-neon-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAwardPoints}
            disabled={!currentQuestion}
          >
            {currentQuestion ? (
              <>Przyznaj {currentQuestion.difficulty} punktów</>
            ) : (
              <>Wybierz pytanie, aby przyznać punkty</>
            )}
          </button>
          
          <button
            className="py-2 px-4 bg-black border-2 border-neon-red text-neon-red rounded-md font-bold
                      hover:bg-neon-red/20"
            onClick={handleDeductHealth}
          >
            {round === GameRound.ROUND_ONE ? (
              <>Odejmij 20 HP</>
            ) : round === GameRound.ROUND_TWO ? (
              <>Odejmij życie</>
            ) : (
              <>Błędna odpowiedź</>
            )}
          </button>
          
          <button
            className="py-2 px-4 bg-black border-2 border-neon-yellow text-neon-yellow rounded-md font-bold
                      hover:bg-neon-yellow/20"
            onClick={handleBonusPoints}
          >
            Dodaj 5 punktów bonusowych
          </button>
          
          <button
            className="py-2 px-4 bg-black border-2 border-red-800 text-red-500 rounded-md font-bold
                      hover:bg-red-900/30"
            onClick={handleEliminatePlayer}
          >
            Wyeliminuj gracza
          </button>
        </div>
      ) : (
        <div className="text-center text-white/60">
          Wybierz gracza, aby wykonać akcje
        </div>
      )}
    </div>
  );
};

export default PlayerActions;
