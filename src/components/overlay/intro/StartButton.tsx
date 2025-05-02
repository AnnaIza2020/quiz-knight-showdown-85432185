
import React from 'react';
import { motion } from 'framer-motion';

interface StartButtonProps {
  onClick: () => void;
  primaryColor: string;
  label?: string;
}

const StartButton: React.FC<StartButtonProps> = ({ onClick, primaryColor, label = "Rozpocznij Show" }) => {
  return (
    <motion.button
      onClick={onClick}
      className="neon-button mt-4 text-xl mb-8 px-6 py-3 rounded-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: [
          `0 0 5px rgba(255,255,255,0.5), 0 0 10px ${primaryColor}`,
          `0 0 10px rgba(255,255,255,0.7), 0 0 20px ${primaryColor}`,
          `0 0 5px rgba(255,255,255,0.5), 0 0 10px ${primaryColor}`
        ]
      }}
      transition={{
        boxShadow: {
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }
      }}
      style={{ 
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderColor: primaryColor,
        color: primaryColor
      }}
    >
      {label}
    </motion.button>
  );
};

export default StartButton;
