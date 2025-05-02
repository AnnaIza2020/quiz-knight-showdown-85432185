
import React, { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { useGameContext } from '@/context/GameContext';

interface CountdownTimerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  onComplete?: () => void;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  className, 
  size = 'md',
  onComplete 
}) => {
  const { timerRunning, timerSeconds, stopTimer } = useGameContext();
  const [isAnimating, setIsAnimating] = useState(false);

  // Sound effect for timer tick
  const playTickSound = () => {
    const tickSound = new Audio('/sounds/tick.mp3');
    tickSound.volume = 0.5;
    tickSound.play().catch(e => console.log('Error playing sound:', e));
  };

  // Sound effect for timer complete
  const playTimeUpSound = () => {
    const timeUpSound = new Audio('/sounds/timeup.mp3');
    timeUpSound.volume = 0.7;
    timeUpSound.play().catch(e => console.log('Error playing sound:', e));
  };

  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      playTickSound();
      setIsAnimating(true);
      
      const timeout = setTimeout(() => {
        setIsAnimating(false);
      }, 500);
      
      return () => clearTimeout(timeout);
    }
    
    if (timerRunning && timerSeconds === 0) {
      playTimeUpSound();
      stopTimer();
      if (onComplete) onComplete();
    }
  }, [timerRunning, timerSeconds, stopTimer, onComplete]);

  const sizeClasses = {
    sm: 'text-4xl',
    md: 'text-6xl',
    lg: 'text-8xl'
  };

  if (!timerRunning && timerSeconds === 0) {
    return (
      <div className={cn(
        'countdown-timer',
        sizeClasses[size],
        className
      )}>
        <span className="text-neon-red animate-bounce">TIME'S UP!</span>
      </div>
    );
  }

  if (!timerRunning) return null;

  return (
    <div className={cn(
      'countdown-timer',
      sizeClasses[size],
      isAnimating ? 'scale-110' : '',
      'transition-transform duration-200',
      className
    )}>
      {timerSeconds}
    </div>
  );
};

export default CountdownTimer;
