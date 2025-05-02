
import React from 'react';
import { GameRound } from '@/types/game-types';
import { RefreshCw, Timer, Menu } from 'lucide-react';
import QuestionBoard from '../QuestionBoard';
import FortuneWheel from '../FortuneWheel';
import { useGameContext } from '@/context/GameContext';

interface RoundControlsProps {
  round: GameRound;
  handleStartTimer: (seconds: number) => void;
}

const RoundControls: React.FC<RoundControlsProps> = ({
  round,
  handleStartTimer
}) => {
  const { categories } = useGameContext();
  
  // Render different controls based on game round
  if (round === GameRound.SETUP) {
    return (
      <div className="mt-6 p-6 border border-white/10 rounded-lg bg-black/30 text-center">
        <h3 className="text-xl font-semibold text-white mb-4">Przygotowanie do Gry</h3>
        <p className="text-white/70">
          Upewnij się, że wszyscy gracze są gotowi. Kliknij przycisk "Przejdź do Rundy 1" aby rozpocząć grę.
        </p>
      </div>
    );
  }
  
  if (round === GameRound.ROUND_ONE) {
    return (
      <div className="mt-6">
        <div className="mb-4 flex justify-between">
          <h3 className="text-xl font-semibold text-white">Runda 1: Zróżnicowana Wiedza</h3>
          <button 
            onClick={() => handleStartTimer(30)}
            className="flex items-center bg-black border border-neon-blue text-neon-blue hover:bg-neon-blue/20 px-3 py-1 rounded"
          >
            <Timer className="h-4 w-4 mr-1" />
            30s
          </button>
        </div>
        
        <QuestionBoard className="h-96" />
      </div>
    );
  }
  
  if (round === GameRound.ROUND_TWO) {
    return (
      <div className="mt-6">
        <div className="mb-4 flex justify-between">
          <h3 className="text-xl font-semibold text-white">Runda 2: 5 Sekund</h3>
          <button 
            onClick={() => handleStartTimer(5)}
            className="flex items-center bg-black border border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20 px-3 py-1 rounded"
          >
            <Timer className="h-4 w-4 mr-1" />
            5s
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-black/30 border border-white/10 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">Pytania 5 sekund</h4>
            <div className="flex justify-between">
              <button 
                className="bg-black/50 border border-neon-yellow text-white py-2 px-4 rounded hover:bg-neon-yellow/10"
              >
                Losowe pytanie
              </button>
              
              <button 
                className="bg-black/50 border border-neon-green text-white py-2 px-4 rounded hover:bg-neon-green/10 flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-1" />
                Następne
              </button>
            </div>
          </div>
          
          <QuestionBoard className="h-64" />
        </div>
      </div>
    );
  }
  
  if (round === GameRound.ROUND_THREE) {
    return (
      <div className="mt-6">
        <div className="mb-4 flex justify-between">
          <h3 className="text-xl font-semibold text-white">Runda 3: Koło Chaosu</h3>
          <button 
            onClick={() => handleStartTimer(30)}
            className="flex items-center bg-black border border-neon-purple text-neon-purple hover:bg-neon-purple/20 px-3 py-1 rounded"
          >
            <Timer className="h-4 w-4 mr-1" />
            30s
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FortuneWheel className="max-w-xs mx-auto" />
          <QuestionBoard className="h-96" />
        </div>
        
        <div className="mt-4 p-4 bg-black/30 border border-white/10 rounded-lg">
          <h4 className="font-semibold text-white mb-2 flex items-center">
            <Menu className="h-4 w-4 mr-2" />
            Kategorie ({categories.length})
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {categories.map(category => (
              <div 
                key={category.id}
                className="px-3 py-2 text-sm rounded bg-black/20 text-white/80 truncate"
              >
                {category.name}
              </div>
            ))}
            {categories.length === 0 && (
              <p className="text-white/50 col-span-3 text-center py-2">
                Brak kategorii. Dodaj kategorie w ustawieniach.
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  if (round === GameRound.FINISHED) {
    return (
      <div className="mt-6 p-6 border border-neon-yellow/30 rounded-lg bg-black/30 text-center">
        <h3 className="text-xl font-semibold text-neon-yellow mb-4">Gra Zakończona</h3>
        <p className="text-white/70">
          Możesz zresetować grę lub przejść do wyników końcowych.
        </p>
      </div>
    );
  }
  
  return null;
};

export default RoundControls;
