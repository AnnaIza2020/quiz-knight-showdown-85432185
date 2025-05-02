
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { useGameContext } from '@/context/GameContext';
import { motion } from 'framer-motion';

interface CountdownTimerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ size = 'md', className }) => {
  const { timerRunning, timerSeconds, playSound } = useGameContext();
  const [animateCount, setAnimateCount] = useState(false);

  // Update animation state when timer changes
  useEffect(() => {
    if (timerRunning) {
      setAnimateCount(true);
      setTimeout(() => setAnimateCount(false), 300);
    }
  }, [timerSeconds, timerRunning]);

  // Play sounds based on remaining time
  useEffect(() => {
    if (timerRunning) {
      if (timerSeconds <= 3 && timerSeconds > 0) {
        playSound('timeout', 0.3);
      }
    }
  }, [timerSeconds, timerRunning, playSound]);

  // Size variations
  const sizes = {
    sm: 'w-16 h-16 text-2xl',
    md: 'w-24 h-24 text-4xl',
    lg: 'w-32 h-32 text-5xl'
  };

  // Color changes based on time remaining
  const getTimerColor = () => {
    if (!timerRunning) return 'text-white/30';
    if (timerSeconds <= 3) return 'text-red-500';
    if (timerSeconds <= 5) return 'text-yellow-500';
    return 'text-neon-green';
  };

  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      className
    )}>
      <div className={cn(
        'relative flex items-center justify-center rounded-full border-4',
        sizes[size],
        timerRunning ? 'border-neon-green' : 'border-white/30'
      )}>
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: animateCount ? 1.2 : 1 }}
          className={cn('font-mono font-bold', getTimerColor())}
        >
          {timerSeconds}
        </motion.div>
        
        {/* Animated ring when timer is running */}
        {timerRunning && (
          <svg 
            className="absolute inset-0 w-full h-full -rotate-90"
            viewBox="0 0 100 100"
          >
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              strokeWidth="4"
              stroke="rgba(74, 222, 128, 0.2)"
              className="transition-all duration-1000"
            />
          </svg>
        )}
      </div>
      
      {!timerRunning && size === 'lg' && (
        <div className="mt-2 text-white/50 text-sm">
          Timer nieaktywny
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
