
import React from 'react';
import { motion } from 'framer-motion';

interface StartButtonProps {
  onClick: () => void;
  primaryColor?: string;
  label?: string;
  disabled?: boolean;
}

const StartButton: React.FC<StartButtonProps> = ({ 
  onClick, 
  primaryColor = '#10B981', 
  label = "Rozpocznij Show",
  disabled = false
}) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="mt-4 text-xl mb-8 px-6 py-3 rounded-lg text-white border-2 relative"
      style={{ 
        backgroundColor: disabled ? '#555555' : primaryColor,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label}
      <motion.span
        className="absolute inset-0 rounded-lg opacity-50"
        style={{ 
          boxShadow: `0 0 15px ${primaryColor}`,
          pointerEvents: 'none'
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.button>
  );
};

export default StartButton;
