
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
      className="mt-4 text-xl mb-8 px-6 py-3 rounded-lg text-white border-2 transition-all duration-300"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{ 
        backgroundColor: '#10B981', // Vivid green
        borderColor: '#059669', // Darker green
      }}
    >
      {label}
    </motion.button>
  );
};

export default StartButton;
