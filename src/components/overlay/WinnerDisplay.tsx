
import React, { useState, useEffect } from 'react';
import { Player } from '@/types/game-types';
import { Crown, Star, Trophy, Award } from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { useGameContext } from '@/context/GameContext';

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
  const { playSound } = useGameContext();
  
  useEffect(() => {
    if (show) {
      setIsVisible(true);
      playSound('victory');
    } else {
      const timer = setTimeout(() => setIsVisible(false), 500);
      return () => clearTimeout(timer);
    }
  }, [show, playSound]);

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
              <Trophy size={64} className="mr-4 text-neon-yellow" />
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
              <Trophy size={64} className="ml-4 text-neon-yellow" />
            </motion.div>
          </motion.div>
          
          {/* Floating stars */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                initial={{ 
                  scale: 0,
                  opacity: 0,
                  rotate: Math.random() * 360
                }}
                animate={{ 
                  scale: [0, 1, 0],
                  opacity: [0, 0.8, 0],
                  y: [0, -100 - Math.random() * 100],
                  x: [0, (Math.random() - 0.5) * 50]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 3
                }}
              >
                {i % 3 === 0 ? (
                  <Star size={i % 2 ? 24 : 16} className="text-neon-yellow" />
                ) : i % 3 === 1 ? (
                  <Award size={i % 2 ? 20 : 14} className="text-neon-pink" />
                ) : (
                  <Crown size={i % 2 ? 18 : 12} className="text-neon-green" />
                )}
              </motion.div>
            ))}
          </div>
          
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
                {/* Crown above winner */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                  className="mb-2"
                >
                  <Crown size={40} className="text-neon-yellow" />
                </motion.div>
                
                {winner.cameraUrl ? (
                  <motion.div 
                    className="w-64 h-48 mb-4 overflow-hidden rounded-lg relative"
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
                    
                    {/* Golden frame animation */}
                    <motion.div 
                      className="absolute inset-0 pointer-events-none"
                      style={{ border: '3px solid rgba(255, 215, 0, 0.7)' }}
                      animate={{ 
                        boxShadow: [
                          '0 0 10px rgba(255, 215, 0, 0.5) inset', 
                          '0 0 20px rgba(255, 215, 0, 0.8) inset', 
                          '0 0 10px rgba(255, 215, 0, 0.5) inset'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
                ) : winner.avatar ? (
                  <motion.div
                    className="w-64 h-48 mb-4 rounded-lg relative overflow-hidden"
                    initial={{ filter: "grayscale(100%)" }}
                    animate={{ filter: "grayscale(0%)" }}
                    transition={{ delay: 1, duration: 1 }}
                  >
                    <img 
                      src={winner.avatar} 
                      alt={winner.name}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Golden frame animation */}
                    <motion.div 
                      className="absolute inset-0 pointer-events-none"
                      style={{ border: '3px solid rgba(255, 215, 0, 0.7)' }}
                      animate={{ 
                        boxShadow: [
                          '0 0 10px rgba(255, 215, 0, 0.5) inset', 
                          '0 0 20px rgba(255, 215, 0, 0.8) inset', 
                          '0 0 10px rgba(255, 215, 0, 0.5) inset'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </motion.div>
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
                
                {/* Trophy icon */}
                <motion.div
                  className="mt-4"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
                  transition={{ 
                    scale: { delay: 1.5, type: "spring" },
                    rotate: { delay: 2, duration: 1.5, repeat: Infinity }
                  }}
                >
                  <Trophy size={48} className="text-neon-yellow" />
                </motion.div>
              </motion.div>
            ))}
          </div>
          
          {/* Bottom text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="mt-8 text-white text-xl"
          >
            Gratulacje dla zwycięzcy!
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WinnerDisplay;
