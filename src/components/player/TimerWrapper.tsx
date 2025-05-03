
import React from 'react';
import { TimerProvider } from '@/context/TimerContext';
import CountdownTimer from '@/components/CountdownTimer';

interface TimerWrapperProps {
  seconds: number;
  isRunning: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const TimerWrapper: React.FC<TimerWrapperProps> = ({ 
  seconds, 
  isRunning, 
  size = "lg", 
  className 
}) => {
  return (
    <TimerProvider initialSeconds={seconds} autoStart={isRunning}>
      {isRunning && (
        <div className="mb-6">
          <CountdownTimer 
            size={size}
            className={className || "mx-auto"}
          />
        </div>
      )}
    </TimerProvider>
  );
};

export default TimerWrapper;
