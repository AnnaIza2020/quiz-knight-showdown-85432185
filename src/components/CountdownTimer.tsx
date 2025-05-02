
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  size = 'md', 
  className 
}) => {
  const { timerRunning, timerSeconds } = useGameContext();
  
  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl'
  };
  
  const containerSizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20',
    lg: 'w-32 h-32'
  };
  
  if (!timerRunning && timerSeconds === 0) {
    return null;
  }
  
  // Określ kolor zależnie od pozostałego czasu
  let timerColor = 'text-neon-green';
  if (timerSeconds <= 3) {
    timerColor = 'text-neon-red animate-pulse';
  } else if (timerSeconds <= 10) {
    timerColor = 'text-neon-yellow';
  }

  return (
    <div className={cn('flex flex-col items-center', className)}>
      <div 
        className={cn(
          containerSizeClasses[size],
          'rounded-full flex items-center justify-center',
          'border-4',
          timerSeconds <= 3 ? 'border-neon-red' : timerSeconds <= 10 ? 'border-neon-yellow' : 'border-neon-green'
        )}
      >
        <div className={cn(sizeClasses[size], 'font-bold', timerColor)}>
          {timerSeconds}
        </div>
      </div>
      
      {timerRunning && (
        <div className="mt-1 text-white/80 text-sm">
          Czas biegnie
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;
