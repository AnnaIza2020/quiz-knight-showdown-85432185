
import React from 'react';
import { motion } from 'framer-motion';
import GameOverlay from '@/components/overlay/GameOverlay';

const OverlayView: React.FC = () => {
  return (
    <motion.div 
      className="min-h-screen bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <GameOverlay />
    </motion.div>
  );
};

export default OverlayView;
