import React, { useEffect, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerWrapperProps {
  seconds: number;
  isRunning: boolean;
  size?: 'sm' | 'md' | 'lg';
  showRemaining?: boolean;
  onComplete?: () => void;
  accent?: string;
  className?: string;
  urgent?: boolean; // Special flag for Round 2 5-second timer
}

const TimerWrapper: React.FC<TimerWrapperProps> = ({
  seconds,
  isRunning,
  size = 'md',
  showRemaining = true,
  onComplete,
  accent = '#10b981', // Default emerald-500
  className = '',
  urgent = false,
}) => {
  const [progress, setProgress] = useState(100);
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [textColor, setTextColor] = useState('text-white');
  const [isCompleted, setIsCompleted] = useState(false);
  
  // Size mapping
  const sizeClass = {
    'sm': 'h-16 w-16',
    'md': 'h-24 w-24',
    'lg': 'h-32 w-32',
  }[size];
  
  const fontSizeClass = {
    'sm': 'text-lg',
    'md': 'text-2xl',
    'lg': 'text-4xl',
  }[size];
  
  // Determine accent color based on time remaining
  useEffect(() => {
    let color = accent;
    let textStyle = 'text-white';
    
    if (urgent || seconds <= 5) {
      if (timeLeft <= 1) {
        color = '#ef4444'; // red-500
        textStyle = 'text-red-500';
      } else if (timeLeft <= 3) {
        color = '#f59e0b'; // amber-500
        textStyle = 'text-amber-500';
      } else if (timeLeft <= 5) {
        color = '#f97316'; // orange-500
        textStyle = 'text-orange-500';
      }
    } else {
      // Normal timer with more granular progression
      if (progress <= 25) {
        color = '#ef4444'; // red-500
        textStyle = 'text-red-500';
      } else if (progress <= 50) {
        color = '#f59e0b'; // amber-500
        textStyle = 'text-amber-500';
      }
    }
    
    setTextColor(textStyle);
  }, [progress, timeLeft, accent, urgent, seconds]);
  
  // Timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let startTime: number;
    let initialSeconds: number;
    
    if (isRunning) {
      setIsCompleted(false);
      startTime = Date.now();
      initialSeconds = seconds;
      
      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        const remaining = Math.max(0, initialSeconds - elapsed);
        const newProgress = Math.max(0, (remaining / initialSeconds) * 100);
        
        setTimeLeft(Math.ceil(remaining));
        setProgress(newProgress);
        
        if (remaining <= 0) {
          clearInterval(interval);
          setIsCompleted(true);
          if (onComplete) onComplete();
        }
      }, 50); // Update more frequently for smoother animation
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, seconds, onComplete]);
  
  // Reset when seconds change
  useEffect(() => {
    setTimeLeft(seconds);
    setProgress(100);
    setIsCompleted(false);
  }, [seconds]);
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <AnimatePresence>
        {(isRunning || showRemaining || isCompleted) && (
          <motion.div 
            className={`relative ${sizeClass}`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <CircularProgressbar 
              value={progress} 
              strokeWidth={10}
              styles={buildStyles({
                strokeLinecap: 'round',
                pathTransition: isRunning ? 'linear' : 'none',
                pathColor: accent,
                trailColor: 'rgba(255, 255, 255, 0.2)',
              })}
            />
            
            <div className={`absolute inset-0 flex items-center justify-center ${fontSizeClass} font-bold ${textColor}`}>
              {urgent && isRunning ? (
                <motion.span
                  key={timeLeft}
                  initial={{ scale: 1.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {timeLeft}
                </motion.span>
              ) : (
                <span>{timeLeft}</span>
              )}
            </div>
            
            {urgent && isRunning && (
              <motion.div
                className="absolute inset-0 rounded-full"
                animate={{ 
                  boxShadow: timeLeft <= 3 
                    ? ['0 0 0 0 rgba(239, 68, 68, 0)', '0 0 0 15px rgba(239, 68, 68, 0)']
                    : ['0 0 0 0 rgba(249, 115, 22, 0)', '0 0 0 10px rgba(249, 115, 22, 0)'] 
                }}
                transition={{ 
                  repeat: Infinity,
                  duration: timeLeft <= 3 ? 0.5 : 1
                }}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TimerWrapper;
