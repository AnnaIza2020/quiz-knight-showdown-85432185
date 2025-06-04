
import React from 'react';
import { motion } from 'framer-motion';
import { GameRound } from '@/types/game-types';
import { Badge } from '@/components/ui/badge';

interface GameOverlayHeaderProps {
  round: GameRound;
  gameTitle?: string;
  timerSeconds?: number;
  timerRunning?: boolean;
}

const GameOverlayHeader: React.FC<GameOverlayHeaderProps> = ({
  round,
  gameTitle = "Discord Game Show",
  timerSeconds = 0,
  timerRunning = false
}) => {
  const getRoundName = () => {
    switch (round) {
      case GameRound.ROUND_ONE:
        return 'Runda 1: Wiedza z Internetu';
      case GameRound.ROUND_TWO:
        return 'Runda 2: 5 Sekund';
      case GameRound.ROUND_THREE:
        return 'Runda 3: Koło Fortuny';
      case GameRound.FINISHED:
        return 'Gra Zakończona';
      default:
        return 'Przygotowanie';
    }
  };

  return (
    <motion.div 
      className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="bg-black/80 backdrop-blur-md rounded-lg border border-white/20 px-6 py-3">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-white">{gameTitle}</h1>
          
          <Badge 
            variant="outline" 
            className="text-neon-blue border-neon-blue bg-neon-blue/10"
          >
            {getRoundName()}
          </Badge>
          
          {timerRunning && (
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
              <span className="text-white font-mono text-lg">
                {timerSeconds}s
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default GameOverlayHeader;
