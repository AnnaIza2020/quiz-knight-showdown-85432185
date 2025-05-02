
import React from 'react';
import { Link } from 'react-router-dom';
import { GameRound } from '@/types/game-types';
import NeonLogo from '@/components/NeonLogo';
import GameSaveManager from './GameSaveManager';

interface GameHeaderProps {
  round: GameRound;
  canAdvanceToRoundTwo: boolean;
  canAdvanceToRoundThree: boolean;
  canFinishGame: boolean;
  advanceToRoundTwo: () => void;
  advanceToRoundThree: () => void;
  handleFinishGame: () => void;
  resetGame: () => void;
}

const GameHeader: React.FC<GameHeaderProps> = ({
  round,
  canAdvanceToRoundTwo,
  canAdvanceToRoundThree,
  canFinishGame,
  advanceToRoundTwo,
  advanceToRoundThree,
  handleFinishGame,
  resetGame,
}) => {
  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <NeonLogo />
        
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white hover:text-neon-blue">
            Strona główna
          </Link>
          <Link to="/overlay" className="text-white hover:text-neon-blue">
            Nakładka OBS
          </Link>
          <Link to="/settings" className="text-white hover:text-neon-blue">
            Ustawienia
          </Link>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            {round === GameRound.SETUP && <span className="text-white">Panel Hosta - Przygotowanie</span>}
            {round === GameRound.ROUND_ONE && <span className="text-neon-pink">Panel Hosta - Runda 1</span>}
            {round === GameRound.ROUND_TWO && <span className="text-neon-blue">Panel Hosta - Runda 2</span>}
            {round === GameRound.ROUND_THREE && <span className="text-neon-purple">Panel Hosta - Runda 3</span>}
            {round === GameRound.FINISHED && <span className="text-neon-yellow">Panel Hosta - Koniec gry</span>}
          </h1>
          
          <div className="flex gap-2">
            {canAdvanceToRoundTwo && (
              <button 
                className="neon-button bg-gradient-to-r from-neon-pink to-neon-purple"
                onClick={advanceToRoundTwo}
              >
                Przejdź do Rundy 2
              </button>
            )}
            
            {canAdvanceToRoundThree && (
              <button 
                className="neon-button bg-gradient-to-r from-neon-blue to-neon-purple"
                onClick={advanceToRoundThree}
              >
                Przejdź do Rundy 3
              </button>
            )}
            
            {canFinishGame && (
              <button 
                className="neon-button bg-gradient-to-r from-neon-yellow to-neon-purple"
                onClick={handleFinishGame}
              >
                Zakończ grę
              </button>
            )}
            
            {round === GameRound.FINISHED && (
              <button 
                className="neon-button bg-gradient-to-r from-neon-green to-neon-blue"
                onClick={resetGame}
              >
                Nowa gra
              </button>
            )}
          </div>
        </div>
        
        {/* Add GameSaveManager component */}
        <div className="mt-2">
          <GameSaveManager />
        </div>
      </div>
    </>
  );
};

export default GameHeader;
