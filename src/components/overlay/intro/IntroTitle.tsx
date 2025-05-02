
import React from 'react';
import { motion } from 'framer-motion';

interface IntroTitleProps {
  primaryColor: string;
}

const IntroTitle: React.FC<IntroTitleProps> = ({ primaryColor }) => {
  return (
    <motion.h1
      className="text-5xl md:text-7xl font-bold mb-6 text-center"
      style={{ 
        color: primaryColor,
        textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`
      }}
      animate={{
        textShadow: [
          `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`,
          `0 0 15px ${primaryColor}, 0 0 30px ${primaryColor}, 0 0 40px ${primaryColor}`,
          `0 0 5px ${primaryColor}, 0 0 15px ${primaryColor}`,
          `0 0 15px ${primaryColor}, 0 0 30px ${primaryColor}, 0 0 40px ${primaryColor}`,
          `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`,
        ],
      }}
      transition={{
        duration: 5,
        repeat: Infinity,
        repeatType: 'reverse',
      }}
    >
      DISCORD GAME SHOW
    </motion.h1>
  );
};

export default IntroTitle;
