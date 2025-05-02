
import React from 'react';
import { motion } from 'framer-motion';

const IntroSubtitle: React.FC = () => {
  return (
    <motion.p 
      className="text-lg md:text-xl text-white mb-8 text-center max-w-xl px-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      Interaktywny teleturniej z trzema rundami, specjalnymi kartami i animacjami dla streamerów na Twitchu i Discordzie. 
      Pytania z polskiego internetu, Twitcha i gier w Polsce.
    </motion.p>
  );
};

export default IntroSubtitle;
