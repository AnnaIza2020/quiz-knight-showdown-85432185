
import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedBackgroundProps {
  primaryColor: string;
  secondaryColor: string;
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ 
  primaryColor,
  secondaryColor 
}) => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Grid lines background */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full bg-grid-pattern"></div>
      </div>
      
      {/* Moving light blobs */}
      <div className="absolute inset-0 opacity-20">
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              background: i % 3 === 0 ? primaryColor : i % 3 === 1 ? secondaryColor : '#33ff88',
              width: Math.random() * 400 + 100,
              height: Math.random() * 400 + 100,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(100px)',
            }}
            animate={{
              x: [Math.random() * 200 - 100, Math.random() * 200 - 100],
              y: [Math.random() * 200 - 100, Math.random() * 200 - 100],
              scale: [1, 1.2, 0.8, 1.1, 1],
              opacity: [0.4, 0.7, 0.5, 0.8, 0.4],
            }}
            transition={{
              repeat: Infinity,
              repeatType: 'reverse',
              duration: Math.random() * 15 + 10,
            }}
          />
        ))}
      </div>
      
      {/* Animated lines */}
      <div className="absolute inset-0">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={`line-${i}`}
            className="absolute h-px w-full overflow-hidden"
            style={{
              top: `${10 + i * 10}%`,
              background: `linear-gradient(90deg, transparent 0%, ${i % 2 === 0 ? primaryColor : secondaryColor} 50%, transparent 100%)`,
              opacity: 0.4,
            }}
            animate={{
              x: ['-100%', '100%'],
            }}
            transition={{
              repeat: Infinity,
              duration: Math.random() * 5 + 10,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default AnimatedBackground;
