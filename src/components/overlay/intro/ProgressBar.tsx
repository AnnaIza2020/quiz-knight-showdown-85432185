
import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  primaryColor: string;
  secondaryColor: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, primaryColor, secondaryColor }) => {
  return (
    <div className="w-64 md:w-96 h-4 bg-black/50 rounded-full mb-8 overflow-hidden backdrop-blur-sm border border-white/10">
      <motion.div 
        className="h-full rounded-full relative"
        style={{ 
          background: `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
          boxShadow: `0 0 10px ${primaryColor}, 0 0 20px ${secondaryColor}`
        }}
        animate={{ 
          width: `${progress}%`,
          background: [
            `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
            `linear-gradient(90deg, ${secondaryColor}, #33ff88)`,
            `linear-gradient(90deg, #33ff88, ${primaryColor})`,
            `linear-gradient(90deg, ${primaryColor}, ${secondaryColor})`,
          ]
        }}
        transition={{ 
          width: { duration: 0.1 },
          background: { duration: 10, repeat: Infinity }
        }}
      >
        {/* Animated glow effect inside progress bar */}
        <motion.div 
          className="absolute top-0 bottom-0 w-20 bg-white/30"
          animate={{
            left: ['-10%', '110%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            filter: 'blur(10px)'
          }}
        />
      </motion.div>
    </div>
  );
};

export default ProgressBar;
