
import React from 'react';
import { motion } from 'framer-motion';

interface IntroTitleProps {
  primaryColor: string;
  secondaryColor: string;
}

const IntroTitle: React.FC<IntroTitleProps> = ({ primaryColor, secondaryColor }) => {
  // Hidden title since we now display it in the logo
  return (
    <motion.h1
      className="text-5xl md:text-7xl font-bold mb-6 text-center sr-only"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <span
        style={{ 
          color: primaryColor,
          textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`
        }}
        className="mr-2"
      >
        DISCORD
      </span>
      <span
        style={{ 
          color: secondaryColor,
          textShadow: `0 0 10px ${secondaryColor}, 0 0 20px ${secondaryColor}`
        }}
      >
        GAME SHOW
      </span>
    </motion.h1>
  );
};

export default IntroTitle;
