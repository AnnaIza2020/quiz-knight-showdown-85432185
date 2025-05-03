
import React, { useEffect, useState } from 'react';
import { Player } from '@/types/game-types';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Award } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';

interface WinnerDisplayProps {
  show: boolean;
  winners: (Player | undefined)[];
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ show, winners }) => {
  const [displayed, setDisplayed] = useState(false);
  const { playSound } = useGameContext();
  
  useEffect(() => {
    if (show && winners.length > 0) {
      setDisplayed(true);
      // Play victory sound
      playSound('victory');
    } else {
      setDisplayed(false);
    }
  }, [show, winners]);
  
  if (!displayed || winners.length === 0) return null;

  return (
    <AnimatePresence>
      {displayed && (
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative rounded-lg p-12 bg-gradient-to-b from-black/80 to-violet-950/80 border-2 border-neon-purple shadow-[0_0_30px_rgba(155,135,245,0.8)] text-center max-w-2xl w-full"
            initial={{ scale: 0.8, y: 50 }}
            animate={{ scale: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
            >
              <Trophy className="h-24 w-24 text-yellow-400 drop-shadow-[0_0_10px_rgba(255,200,0,0.8)]" />
            </motion.div>
            
            <motion.h1
              className="text-4xl font-bold mb-2 mt-8 text-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              Zwycięzca!
            </motion.h1>
            
            <motion.div
              className="space-y-8 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 }}
            >
              {winners.map((winner, index) => (
                winner && (
                <motion.div
                  key={winner.id || index}
                  className="bg-black/30 rounded-lg p-6 border border-white/20"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 1.6 + index * 0.2 }}
                >
                  <div className="flex items-center justify-center mb-4">
                    {winner.avatar ? (
                      <img 
                        src={winner.avatar} 
                        alt={winner.name}
                        className="h-24 w-24 rounded-full border-4 border-yellow-500 shadow-glow"
                      />
                    ) : (
                      <div className="h-24 w-24 rounded-full bg-violet-800 flex items-center justify-center text-3xl font-bold text-white border-4 border-yellow-500">
                        {winner.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-1 text-white">{winner.name}</h2>
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                    <span className="text-xl font-semibold">{winner.points} punktów</span>
                  </div>
                </motion.div>
                )
              ))}
            </motion.div>
            
            <motion.div
              className="mt-8 text-lg text-white/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              Gratulacje dla zwycięzcy!
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinnerDisplay;
