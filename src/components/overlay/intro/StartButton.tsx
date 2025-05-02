
import React from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

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
  // Button click handler with ripple effect
  const handleClick = () => {
    if (!disabled) {
      onClick();
    }
  };
  
  return (
    <motion.button
      onClick={handleClick}
      disabled={disabled}
      className="mt-4 text-xl mb-8 px-8 py-4 rounded-lg text-white border-2 relative overflow-hidden group"
      style={{ 
        backgroundColor: disabled ? '#555555' : 'rgba(0,0,0,0.7)',
        borderColor: disabled ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.3)',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Glow effect */}
      <motion.span
        className="absolute inset-0 rounded-lg opacity-50"
        style={{ 
          boxShadow: `0 0 15px ${primaryColor}`,
          pointerEvents: 'none'
        }}
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      
      {/* Border glow */}
      <motion.span
        className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100"
        style={{
          border: `2px solid ${primaryColor}`,
          pointerEvents: 'none'
        }}
        animate={!disabled ? {
          boxShadow: [
            `0 0 5px ${primaryColor}`,
            `0 0 15px ${primaryColor}`,
            `0 0 5px ${primaryColor}`
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
      
      {/* Button content with icon */}
      <span className="relative z-10 flex items-center justify-center">
        <Play className="mr-2" size={24} />
        {label}
      </span>
      
      {/* Background hover effect */}
      <motion.span
        className="absolute inset-0 opacity-0 group-hover:opacity-100"
        style={{
          background: `linear-gradient(45deg, ${primaryColor}20, ${primaryColor}00)`,
          pointerEvents: 'none'
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Ripple effect on click */}
      <motion.span
        className="absolute inset-0"
        style={{
          pointerEvents: 'none',
          mixBlendMode: 'overlay'
        }}
        whileTap={{
          background: [
            'radial-gradient(circle at center, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 0%)',
            'radial-gradient(circle at center, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 60%)'
          ]
        }}
        transition={{ duration: 0.5 }}
      />
    </motion.button>
  );
};

export default StartButton;
