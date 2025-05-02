
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
  let roundName = "";
  let roundColor = "";
  let roundGlow = "";
  
  switch (round) {
    case GameRound.ROUND_ONE:
      roundName = "RUNDA 1: WIEDZA Z POLSKIEGO INTERNETU";
      roundColor = primaryColor;
      roundGlow = primaryColor;
      break;
    case GameRound.ROUND_TWO:
      roundName = "RUNDA 2: 5 SEKUND";
      roundColor = secondaryColor;
      roundGlow = secondaryColor;
      break;
    case GameRound.ROUND_THREE:
      roundName = "RUNDA 3: KOŁO FORTUNY";
      roundColor = "#9900ff"; // Neon purple
      roundGlow = "#9900ff";
      break;
    case GameRound.FINISHED:
      roundName = "KONIEC GRY";
      roundColor = "#ffff00"; // Neon yellow
      roundGlow = "#ffff00";
      break;
    default:
      roundName = "PRZYGOTOWANIE DO GRY";
      roundColor = "white";
      roundGlow = "rgba(255,255,255,0.5)";
  }
  
  // Don't show during setup
  if (round === GameRound.SETUP) return null;

  return (
    <motion.div 
      className="absolute top-4 left-0 right-0 flex justify-center z-10"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="bg-black/80 backdrop-blur px-6 py-3 rounded-full"
        style={{
          border: `2px solid ${roundColor}`,
          boxShadow: `0 0 15px ${roundGlow}`,
        }}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <motion.h2 
          className="font-bold tracking-wider text-xl md:text-2xl"
          style={{ color: roundColor }}
          animate={{ opacity: [1, 0.8, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          {roundName}
        </motion.h2>
      </motion.div>
    </motion.div>
  );
};

export default RoundIndicator;
