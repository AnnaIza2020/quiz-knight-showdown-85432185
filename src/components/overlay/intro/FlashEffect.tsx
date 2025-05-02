
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FlashEffectProps {
  active: boolean;
}

const FlashEffect: React.FC<FlashEffectProps> = ({ active }) => {
  return (
    <AnimatePresence>
      {active && (
        <motion.div 
          className="absolute inset-0 bg-white z-60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </AnimatePresence>
  );
};

export default FlashEffect;
