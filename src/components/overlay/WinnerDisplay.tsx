
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Player } from '@/types/game-types';
import NeonLogo from '@/components/NeonLogo';

interface WinnerDisplayProps {
  show: boolean;
  winners: (Player | undefined)[];
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({ show, winners }) => {
  if (!show) return null;
  
  // Filter out undefined winners
  const validWinners = winners.filter((w): w is Player => w !== undefined);
  
  // If no valid winners, don't show anything
  if (validWinners.length === 0) return null;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex flex-col items-center"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8, type: 'spring' }}
          >
            <div className="mb-8">
              <NeonLogo size="lg" />
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 text-center">
              <span className="text-neon-yellow">ZWYCIĘZCA!</span>
            </h1>
            
            <div className="flex flex-wrap justify-center gap-8">
              {validWinners.map((winner) => (
                <motion.div
                  key={winner.id}
                  className="flex flex-col items-center"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  {/* Winner camera or avatar */}
                  <div className="w-64 h-48 rounded-lg border-4 border-neon-yellow shadow-[0_0_30px_rgba(255,255,0,0.5)] overflow-hidden mb-4">
                    {winner.cameraUrl ? (
                      <iframe 
                        src={winner.cameraUrl}
                        title={`Winner ${winner.name}`}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    ) : winner.avatar ? (
                      <img 
                        src={winner.avatar} 
                        alt={winner.name} 
                        className="w-full h-full object-cover" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-neon-background">
                        <span className="text-3xl font-bold text-neon-yellow">👑</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Winner name */}
                  <h2 className="text-2xl font-bold text-neon-yellow mb-2">{winner.name}</h2>
                  
                  {/* Winner points */}
                  <div className="bg-neon-yellow/80 text-black px-4 py-2 rounded-full font-bold">
                    {winner.points} punktów
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinnerDisplay;
