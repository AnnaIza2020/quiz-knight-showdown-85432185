
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NarratorOverlayProps {
  isPlaying: boolean;
}

const NarratorOverlay: React.FC<NarratorOverlayProps> = ({ isPlaying }) => {
  return (
    <AnimatePresence>
      {isPlaying && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/70 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="max-w-2xl p-6 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <motion.p 
              className="text-2xl md:text-3xl text-white leading-relaxed"
              animate={{ 
                textShadow: [
                  `0 0 5px rgba(255,255,255,0.5)`,
                  `0 0 10px rgba(255,255,255,0.7)`,
                  `0 0 5px rgba(255,255,255,0.5)`
                ] 
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              "Witacie, drodzy widzowie, w najbardziej zwariowanym, pikselowym i pełnym memów teleturnieju w historii internetu! Przygotujcie się na epicką podróż przez zakamarki polskiego internetu, gdzie wiedza, refleks i odrobina szczęścia to wasze jedyne bronie."
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NarratorOverlay;
