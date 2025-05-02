
import React, { useState, useEffect } from 'react';
import { Player } from '@/types/game-types';
import { Crown } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

interface WinnerDisplayProps {
  show: boolean;
  winners: (Player | undefined)[];
  className?: string;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  show,
  winners,
  className
}) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible || winners.length === 0) return null;
  
  // Filter out undefined winners
  const validWinners = winners.filter(Boolean) as Player[];
  
  return (
    <AnimatePresence>
      {show && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={cn(
            'fixed inset-0 z-50 bg-black/70 backdrop-blur-md',
            'flex flex-col items-center justify-center',
            className
          )}
        >
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            className="text-neon-yellow text-6xl font-bold mb-8 flex items-center"
          >
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [-5, 5, -5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Crown size={64} className="mr-4 text-neon-yellow" />
            </motion.div>
            
            <motion.span
              animate={{ 
                textShadow: ["0 0 10px #ffff00", "0 0 20px #ffff00", "0 0 10px #ffff00"]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              ZWYCIĘZCA
            </motion.span>
            
            <motion.div
              animate={{ 
                scale: [1, 1.2, 1],
                rotate: [5, -5, 5, 0]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Crown size={64} className="ml-4 text-neon-yellow" />
            </motion.div>
          </motion.div>
          
          <div className="flex gap-6">
            {validWinners.map((winner, index) => (
              <motion.div 
                key={winner.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ 
                  delay: 0.5 + index * 0.2,
                  type: "spring",
                  stiffness: 80
                }}
                className="flex flex-col items-center bg-black/50 rounded-lg p-6 border-2 border-neon-yellow shadow-[0_0_30px_rgba(255,255,0,0.3)]"
              >
                {winner.cameraUrl ? (
                  <motion.div 
                    className="w-64 h-48 mb-4 overflow-hidden rounded-lg"
                    initial={{ filter: "grayscale(100%)" }}
                    animate={{ filter: "grayscale(0%)" }}
                    transition={{ delay: 1, duration: 1 }}
                  >
                    <iframe 
                      src={winner.cameraUrl} 
                      title={winner.name}
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </motion.div>
                ) : winner.avatar ? (
                  <motion.img 
                    src={winner.avatar} 
                    alt={winner.name}
                    className="w-64 h-48 object-cover mb-4 rounded-lg"
                    initial={{ filter: "grayscale(100%)" }}
                    animate={{ filter: "grayscale(0%)" }}
                    transition={{ delay: 1, duration: 1 }}
                  />
                ) : (
                  <div className="w-64 h-48 mb-4 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-white/50">No Camera</span>
                  </div>
                )}
                
                <motion.h2 
                  className="text-4xl font-bold text-white mb-2"
                  animate={{ 
                    textShadow: ["0 0 5px #ffffff", "0 0 15px #ffffff", "0 0 5px #ffffff"] 
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {winner.name}
                </motion.h2>
                
                <motion.div 
                  className="text-2xl text-neon-yellow font-bold flex items-center"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  {winner.points} punktów
                </motion.div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinnerDisplay;
