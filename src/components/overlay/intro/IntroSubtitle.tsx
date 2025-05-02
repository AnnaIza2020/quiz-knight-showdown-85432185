
import React from 'react';
import { motion } from 'framer-motion';

const IntroSubtitle: React.FC = () => {
  return (
    <motion.p 
      className="text-2xl md:text-3xl text-white mb-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -10] }}
      transition={{ 
        duration: 4, 
        repeat: Infinity,
        times: [0, 0.1, 0.9, 1],
      }}
    >
      Zaraz zaczynamy!
    </motion.p>
  );
};

export default IntroSubtitle;
