
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface TimerProps {
  seconds: number;
  isRunning: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  onComplete?: () => void;
  className?: string;
}

const Timer: React.FC<TimerProps> = ({
  seconds,
  isRunning,
  size = 'md',
  color = '#00E0FF',
  onComplete,
  className
}) => {
  const [progress, setProgress] = useState(100);
  const [initialSeconds] = useState(seconds);

  useEffect(() => {
    if (initialSeconds > 0) {
      const newProgress = (seconds / initialSeconds) * 100;
      setProgress(newProgress);
    }

    if (seconds === 0 && onComplete) {
      onComplete();
    }
  }, [seconds, initialSeconds, onComplete]);

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { size: 64, stroke: 4, fontSize: '16px' };
      case 'md':
        return { size: 96, stroke: 6, fontSize: '24px' };
      case 'lg':
        return { size: 200, stroke: 8, fontSize: '48px' };
      default:
        return { size: 96, stroke: 6, fontSize: '24px' };
    }
  };

  const { size: timerSize, stroke, fontSize } = getSizeClasses();
  const radius = (timerSize - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getTimerColor = () => {
    if (seconds <= 5 && seconds > 0) {
      return '#FF3E3E'; // Red for last 5 seconds
    }
    if (seconds <= 10 && seconds > 5) {
      return '#FFA500'; // Orange for warning
    }
    return color;
  };

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <svg
        width={timerSize}
        height={timerSize}
        className={cn('transform -rotate-90', {
          'animate-pulse': seconds <= 5 && seconds > 0
        })}
      >
        {/* Background circle */}
        <circle
          cx={timerSize / 2}
          cy={timerSize / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={stroke}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={timerSize / 2}
          cy={timerSize / 2}
          r={radius}
          stroke={getTimerColor()}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{
            filter: `drop-shadow(0 0 8px ${getTimerColor()})`,
            transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease'
          }}
        />
      </svg>
      {/* Timer text */}
      <div
        className="absolute inset-0 flex items-center justify-center font-montserrat font-bold text-white"
        style={{ fontSize }}
      >
        {seconds}
      </div>
    </div>
  );
};

export default Timer;
