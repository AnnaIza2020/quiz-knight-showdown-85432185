
import React from 'react';
import { motion } from 'framer-motion';

interface GameLogoProps {
  primaryColor: string;
  secondaryColor: string;
}

const GameLogo: React.FC<GameLogoProps> = ({ primaryColor, secondaryColor }) => {
  return (
    <motion.div 
      className="mb-8"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 100,
        damping: 10,
        delay: 0.5
      }}
    >
      <motion.div
        animate={{
          scale: [1, 1.05, 1],
          filter: [
            `drop-shadow(0 0 8px ${primaryColor}) drop-shadow(0 0 5px ${secondaryColor})`, 
            `drop-shadow(0 0 20px ${primaryColor}) drop-shadow(0 0 15px ${secondaryColor})`, 
            `drop-shadow(0 0 8px ${primaryColor}) drop-shadow(0 0 5px ${secondaryColor})`
          ],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <img 
          src="/lovable-uploads/61b1b24f-4a7b-43f7-836c-2dae94d40d5e.png"
          alt="Discord Game Show"
          className="w-64 md:w-80"
        />
      </motion.div>
    </motion.div>
  );
};

export default GameLogo;
