
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  size = 'md',
  className
}) => {
  const { timerSeconds, timerRunning } = useGameContext();
  
  // Determine timer color based on remaining seconds
  const getTimerColor = () => {
    if (timerSeconds <= 3) return 'text-neon-red animate-pulse';
    if (timerSeconds <= 10) return 'text-neon-yellow';
    return 'text-neon-green';
  };
  
  // Determine size classes
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };
  
  if (!timerRunning && timerSeconds === 0) {
    return null;
  }
  
  return (
    <div className={cn(
      'flex items-center justify-center',
      className
    )}>
      <div className={cn(
        sizeClasses[size],
        getTimerColor(),
        'font-bold p-2 rounded-md border-2 border-white/20',
        'min-w-12 text-center'
      )}>
        {timerSeconds}
      </div>
    </div>
  );
};

export default CountdownTimer;
