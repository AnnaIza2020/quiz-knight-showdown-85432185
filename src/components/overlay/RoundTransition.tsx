
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameRound } from '@/types/game-types';
import { cn } from '@/lib/utils';

interface RoundTransitionProps {
  show: boolean;
  round: GameRound;
  primaryColor: string;
  secondaryColor: string;
}

const RoundTransition: React.FC<RoundTransitionProps> = ({
  show,
  round,
  primaryColor,
  secondaryColor
}) => {
  const [visible, setVisible] = useState(false);
  
  useEffect(() => {
    if (show) {
      setVisible(true);
      
      const timer = setTimeout(() => {
        setVisible(false);
      }, 3000); // Animation duration
      
      return () => clearTimeout(timer);
    }
  }, [show]);
  
  if (!visible) return null;
  
  const getRoundDetails = () => {
    switch (round) {
      case GameRound.ROUND_ONE:
        return {
          title: "RUNDA 1",
          subtitle: "Eliminacje",
          description: "10 graczy · Życie · Eliminacje",
          color: primaryColor,
          shadowColor: primaryColor
        };
      case GameRound.ROUND_TWO:
        return {
          title: "RUNDA 2",
          subtitle: "5 Sekund",
          description: "6 graczy · 3 Życia · Szybkie odpowiedzi",
          color: secondaryColor,
          shadowColor: secondaryColor
        };
      case GameRound.ROUND_THREE:
        return {
          title: "RUNDA 3",
          subtitle: "Koło Fortuny",
          description: "3 graczy · Losowe kategorie · Finał",
          color: "#ff00ff", // Neon pink
          shadowColor: "#ff00ff"
        };
      case GameRound.FINISHED:
        return {
          title: "KONIEC GRY",
          subtitle: "Zwycięzca",
          description: "Gratulacje dla zwycięzcy!",
          color: "#ffff00", // Neon yellow
          shadowColor: "#ffff00" 
        };
      default:
        return {
          title: "PRZYGOTOWANIE",
          subtitle: "Discord Game Show",
          description: "Oczekiwanie na graczy",
          color: "#ffffff",
          shadowColor: "#ffffff"
        };
    }
  };
  
  const details = getRoundDetails();
  
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Background pattern */}
            <motion.div
              className="absolute inset-0 overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxyZWN0IHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgZmlsbD0iIzE1MTUxNSI+PC9yZWN0Pgo8cGF0aCBkPSJNMzAgMzAgTDYwIDMwIEw2MCAwIEwwIDB6IiBmaWxsPSIjMWExYTFhIj48L3BhdGg+Cjwvc3ZnPg==')]" />
            </motion.div>
            
            {/* Animated lines */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(10)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent w-full"
                  style={{ top: `${10 + i * 8}%` }}
                  initial={{ x: '-100%', opacity: 0 }}
                  animate={{ x: '100%', opacity: [0, 1, 0] }}
                  transition={{ 
                    duration: 2,
                    delay: 0.1 * i,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
            
            {/* Round number */}
            <motion.div
              className="relative z-10 flex flex-col items-center"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.5 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h1
                className="text-8xl md:text-9xl font-bold"
                style={{ 
                  color: details.color,
                  textShadow: `0 0 20px ${details.shadowColor}` 
                }}
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {details.title}
              </motion.h1>
              
              <motion.h2
                className="text-3xl md:text-4xl font-bold text-white mt-4"
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -50, opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                {details.subtitle}
              </motion.h2>
              
              <motion.div
                className="h-1 w-40 mt-6"
                style={{ backgroundColor: details.color }}
                initial={{ width: 0 }}
                animate={{ width: "40rem" }}
                exit={{ width: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              />
              
              <motion.p
                className="text-white/70 text-xl mt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              >
                {details.description}
              </motion.p>
            </motion.div>
            
            {/* Corner decorations */}
            {["top-left", "top-right", "bottom-left", "bottom-right"].map((position) => (
              <motion.div
                key={position}
                className={cn(
                  "absolute w-20 h-20 border-2",
                  position === "top-left" && "top-10 left-10 border-r-0 border-b-0",
                  position === "top-right" && "top-10 right-10 border-l-0 border-b-0",
                  position === "bottom-left" && "bottom-10 left-10 border-r-0 border-t-0",
                  position === "bottom-right" && "bottom-10 right-10 border-l-0 border-t-0"
                )}
                style={{ borderColor: details.color }}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ 
                  duration: 0.5,
                  delay: ["top-left", "top-right", "bottom-left", "bottom-right"].indexOf(position) * 0.1 + 0.5 
                }}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default RoundTransition;
