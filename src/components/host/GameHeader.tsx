
import React, { useMemo } from 'react';
import { GameRound } from '@/types/game-types';
import { Button } from '@/components/ui/button';
import { Sparkles, SkipForward, Timer, ChevronRight, History, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

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

// Używamy memo do optymalizacji renderowania komponentu
const GameHeader: React.FC<GameHeaderProps> = React.memo(({
  round,
  canAdvanceToRoundTwo,
  canAdvanceToRoundThree,
  canFinishGame,
  advanceToRoundTwo,
  advanceToRoundThree,
  handleFinishGame,
  resetGame
}) => {
  // Memo-izacja tytułu rundy - unikamy recalculate przy renderach
  const roundTitle = useMemo(() => {
    switch (round) {
      case GameRound.SETUP:
        return "Przygotowanie do Gry";
      case GameRound.ROUND_ONE:
        return "Runda 1: Zróżnicowana Wiedza";
      case GameRound.ROUND_TWO:
        return "Runda 2: 5 Sekund";
      case GameRound.ROUND_THREE:
        return "Runda 3: Koło Chaosu";
      case GameRound.FINISHED:
        return "Gra Zakończona";
      default:
        return "Nieznana Runda";
    }
  }, [round]);
  
  // Memo-izowany kolor rundy
  const roundColor = useMemo(() => {
    switch (round) {
      case GameRound.SETUP:
        return "text-white";
      case GameRound.ROUND_ONE:
        return "text-blue-400";
      case GameRound.ROUND_TWO:
        return "text-yellow-400";
      case GameRound.ROUND_THREE:
        return "text-purple-400";
      case GameRound.FINISHED:
        return "text-green-400";
      default:
        return "text-white";
    }
  }, [round]);
  
  return (
    <header className="bg-black/50 backdrop-blur-md p-4 rounded-lg border border-white/10 mb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            Discord Game Show
            <span className="text-sm px-2 py-1 rounded bg-black/40 border border-white/10">Host Panel</span>
          </h1>
          
          <motion.h2 
            className={`text-xl font-semibold ${roundColor} mt-1`}
            key={round} // Key zmienia się gdy zmienia się runda
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {roundTitle}
          </motion.h2>
        </div>
        
        <div className="flex gap-2">
          {round === GameRound.ROUND_ONE && canAdvanceToRoundTwo && (
            <Button
              variant="outline"
              className="border-yellow-400 text-yellow-400 hover:bg-yellow-400/20 flex gap-2"
              onClick={advanceToRoundTwo}
            >
              <Timer className="h-4 w-4" />
              <span className="hidden sm:inline">Przejdź do</span> Rundy 2
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          
          {round === GameRound.ROUND_TWO && canAdvanceToRoundThree && (
            <Button
              variant="outline"
              className="border-purple-400 text-purple-400 hover:bg-purple-400/20 flex gap-2"
              onClick={advanceToRoundThree}
            >
              <SkipForward className="h-4 w-4" />
              <span className="hidden sm:inline">Przejdź do</span> Rundy 3
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
          
          {round === GameRound.ROUND_THREE && canFinishGame && (
            <Button
              variant="outline"
              className="border-green-400 text-green-400 hover:bg-green-400/20 flex gap-2"
              onClick={handleFinishGame}
            >
              <Sparkles className="h-4 w-4" />
              Zakończ Grę
            </Button>
          )}
          
          {round === GameRound.FINISHED && (
            <Button
              variant="outline"
              className="border-cyan-400 text-cyan-400 hover:bg-cyan-400/20 flex gap-2"
              onClick={() => window.open('/winners', '_blank')}
            >
              <History className="h-4 w-4" />
              Historia zwycięzców
            </Button>
          )}
          
          {round === GameRound.FINISHED && (
            <Button
              variant="outline"
              className="border-blue-400 text-blue-400 hover:bg-blue-400/20 flex gap-2"
              onClick={resetGame}
            >
              <RotateCw className="h-4 w-4" />
              Nowa Gra
            </Button>
          )}
        </div>
      </div>
    </header>
  );
});

GameHeader.displayName = 'GameHeader';

export default GameHeader;
