
import React from 'react';
import { useTimerContext } from '@/context/TimerContext';
import { cn } from "@/lib/utils";
import { useGameContext } from '@/context/GameContext';

interface CountdownTimerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  size = 'md',
  className
}) => {
  // First try to get timer from TimerContext (for PlayerViewContent)
  let timerSeconds = 0;
  let timerRunning = false;
  
  try {
    // Try to use TimerContext if available
    const timerContext = useTimerContext();
    timerSeconds = timerContext.timerSeconds;
    timerRunning = timerContext.timerRunning;
  } catch (e) {
    // Fall back to GameContext if TimerContext is not available
    const { timerSeconds: gameTimerSeconds, timerRunning: gameTimerRunning } = useGameContext();
    timerSeconds = gameTimerSeconds;
    timerRunning = gameTimerRunning;
  }
  
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
