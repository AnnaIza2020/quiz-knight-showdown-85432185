
import React from 'react';
import { GameRound } from '@/types/game-types';
import { motion } from 'framer-motion';

interface RoundIndicatorProps {
  round: GameRound;
  primaryColor?: string;
  secondaryColor?: string;
}

const RoundIndicator: React.FC<RoundIndicatorProps> = ({ 
  round, 
  primaryColor = '#ff00ff',
  secondaryColor = '#00ffff'
}) => {
  if (round === GameRound.FINISHED) {
    return null; // Nie pokazujemy wskaźnika w zakończonej grze
  }
  
  let roundText = '';
  let roundColor = '';
  let roundGlow = '';
  
  switch (round) {
    case GameRound.SETUP:
      roundText = 'Przygotowanie';
      roundColor = 'text-white';
      roundGlow = 'white';
      break;
    case GameRound.ROUND_ONE:
      roundText = 'RUNDA 1 - ZRÓŻNICOWANA WIEDZA Z INTERNETU';
      roundColor = 'text-neon-pink';
      roundGlow = primaryColor;
      break;
    case GameRound.ROUND_TWO:
      roundText = 'RUNDA 2 - 5 SEKUND';
      roundColor = 'text-neon-blue';
      roundGlow = secondaryColor;
      break;
    case GameRound.ROUND_THREE:
      roundText = 'RUNDA 3 - KOŁO FORTUNY';
      roundColor = 'text-neon-purple';
      roundGlow = primaryColor;
      break;
  }
  
  return (
    <motion.div 
      className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div 
        className={`px-6 py-2 rounded-full font-bold text-xl ${roundColor}`}
        style={{ 
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
          border: `2px solid ${roundGlow}`,
          boxShadow: `0 0 10px ${roundGlow}, 0 0 20px ${roundGlow}`
        }}
      >
        {roundText}
      </div>
    </motion.div>
  );
};

export default RoundIndicator;
