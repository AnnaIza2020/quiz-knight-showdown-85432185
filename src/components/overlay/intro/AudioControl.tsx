
import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioControlProps {
  playing: boolean;
  onToggle: () => void;
}

const AudioControl: React.FC<AudioControlProps> = ({ playing, onToggle }) => {
  return (
    <motion.button
      className="absolute bottom-8 right-8 p-3 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white hover:bg-black/60 transition-colors"
      onClick={onToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      animate={{
        boxShadow: playing 
          ? ['0 0 0px rgba(255,255,255,0.3)', '0 0 10px rgba(255,255,255,0.5)', '0 0 0px rgba(255,255,255,0.3)'] 
          : ['0 0 0px rgba(255,255,255,0.3)']
      }}
      transition={{
        boxShadow: {
          duration: 1.5,
          repeat: Infinity,
          repeatType: 'reverse',
        }
      }}
    >
      {playing ? <Volume2 size={24} /> : <VolumeX size={24} />}
    </motion.button>
  );
};

export default AudioControl;
