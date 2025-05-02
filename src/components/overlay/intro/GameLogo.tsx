
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
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 100,
        damping: 10,
        delay: 0.5
      }}
    >
      <motion.div
        animate={{
          filter: [
            `drop-shadow(0 0 8px ${primaryColor}) drop-shadow(0 0 5px ${secondaryColor})`, 
            `drop-shadow(0 0 20px ${primaryColor}) drop-shadow(0 0 15px ${secondaryColor})`, 
            `drop-shadow(0 0 8px ${primaryColor}) drop-shadow(0 0 5px ${secondaryColor})`
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
      >
        <img 
          src="/lovable-uploads/b8ac3188-401e-435a-9869-a440ec9bbf7f.png"
          alt="Discord Game Show"
          className="w-64 md:w-80"
        />
      </motion.div>
    </motion.div>
  );
};

export default GameLogo;
