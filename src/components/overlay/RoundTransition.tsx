
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameRound } from '@/types/game-types';

interface RoundTransitionProps {
  show: boolean;
  round: GameRound;
  primaryColor?: string;
  secondaryColor?: string;
}

const RoundTransition: React.FC<RoundTransitionProps> = ({ 
  show, 
  round,
  primaryColor = '#ff00ff',
  secondaryColor = '#00ffff'
}) => {
  // Get round name for transitions
  const getRoundName = () => {
    switch (round) {
      case GameRound.SETUP:
        return "Przygotowanie";
      case GameRound.ROUND_ONE:
        return "Runda 1: Zróżnicowana Wiedza";
      case GameRound.ROUND_TWO:
        return "Runda 2: 5 Sekund";
      case GameRound.ROUND_THREE:
        return "Runda 3: Koło Chaosu";
      case GameRound.FINISHED:
        return "Finał Gry";
    }
  };
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ 
              scale: [0.8, 1.1, 1],
              opacity: 1
            }}
            exit={{ scale: 1.2, opacity: 0 }}
            transition={{ 
              duration: 0.7,
              times: [0, 0.6, 1]
            }}
            className="text-center"
          >
            <motion.h1 
              className="text-5xl font-bold mb-4" 
              style={{ 
                color: primaryColor || '#ff00ff',
                textShadow: `0 0 10px ${primaryColor || '#ff00ff'}, 0 0 20px ${primaryColor || '#ff00ff'}`
              }}
              animate={{
                textShadow: [
                  `0 0 10px ${primaryColor || '#ff00ff'}, 0 0 20px ${primaryColor || '#ff00ff'}`,
                  `0 0 20px ${primaryColor || '#ff00ff'}, 0 0 35px ${primaryColor || '#ff00ff'}`,
                  `0 0 10px ${primaryColor || '#ff00ff'}, 0 0 20px ${primaryColor || '#ff00ff'}`,
                ]
              }}
              transition={{
                duration: 1.5,
                repeat: 2,
                repeatType: 'reverse',
              }}
            >
              {getRoundName()}
            </motion.h1>
            <motion.p 
              className="text-white text-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              Rozpoczynamy!
            </motion.p>
            
            {/* Additional decorative elements */}
            <motion.div
              className="absolute inset-0 -z-10 opacity-30"
              initial={{ scale: 0 }}
              animate={{ scale: 2 }}
              transition={{ duration: 2.5 }}
            >
              <div className="w-full h-full rounded-full"
                style={{ 
                  background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)` 
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoundTransition;
