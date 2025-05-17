
import React, { useEffect, useRef } from 'react';
import { TimerProvider } from '@/context/TimerContext';
import CountdownTimer from '@/components/CountdownTimer';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';

interface TimerWrapperProps {
  seconds: number;
  isRunning: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  round?: GameRound;
  autoStart?: boolean;
}

const TimerWrapper: React.FC<TimerWrapperProps> = ({ 
  seconds, 
  isRunning, 
  size = "lg", 
  className,
  round,
  autoStart = false
}) => {
  const timerRef = useRef<HTMLDivElement>(null);
  const { playSound } = useGameContext();
  const isRoundTwo = round === GameRound.ROUND_TWO;
  
  // Special effect for Round 2 - highlight timer
  useEffect(() => {
    if (isRoundTwo && isRunning) {
      if (timerRef.current) {
        timerRef.current.classList.add('animate-pulse', 'scale-105');
        
        // Play tick sound if it's Round 2 to emphasize urgency
        playSound('wheel-tick', 0.4);
      }
      
      return () => {
        if (timerRef.current) {
          timerRef.current.classList.remove('animate-pulse', 'scale-105');
        }
      };
    }
  }, [isRunning, isRoundTwo, playSound]);
  
  return (
    <TimerProvider initialSeconds={seconds} autoStart={isRunning || autoStart}>
      {isRunning && (
        <div className="mb-6" ref={timerRef}>
          <CountdownTimer 
            size={size}
            className={`${className || "mx-auto"} ${isRoundTwo ? 'text-neon-yellow' : ''}`}
          />
        </div>
      )}
    </TimerProvider>
  );
};

export default TimerWrapper;
