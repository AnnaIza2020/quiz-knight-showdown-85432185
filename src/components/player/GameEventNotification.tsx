
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface GameEventNotificationProps {
  message: string | null;
}

const GameEventNotification: React.FC<GameEventNotificationProps> = ({ message }) => {
  return (
    <AnimatePresence>
      {message && (
        <motion.div 
          className="mb-6 p-4 bg-black/50 border border-white/20 rounded-lg text-white text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GameEventNotification;
