
import React, { createContext, useContext, useState, useEffect } from 'react';

interface TimerContextType {
  timerSeconds: number;
  timerRunning: boolean;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
  resetTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export const useTimerContext = (): TimerContextType => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error('useTimerContext must be used within a TimerProvider');
  }
  return context;
};

interface TimerProviderProps {
  initialSeconds?: number;
  autoStart?: boolean;
  onComplete?: () => void;
  children: React.ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({
  initialSeconds = 0,
  autoStart = false,
  onComplete,
  children
}) => {
  const [timerSeconds, setTimerSeconds] = useState<number>(initialSeconds);
  const [timerRunning, setTimerRunning] = useState<boolean>(autoStart);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  
  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerRunning && timerSeconds > 0 && !isPaused) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            setTimerRunning(false);
            if (onComplete) {
              onComplete();
            }
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds, isPaused, onComplete]);
  
  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setTimerRunning(true);
    setIsPaused(false);
  };
  
  const stopTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(0);
  };
  
  const resetTimer = () => {
    setTimerSeconds(initialSeconds);
    setTimerRunning(false);
    setIsPaused(false);
  };
  
  const pauseTimer = () => {
    setIsPaused(true);
  };
  
  const resumeTimer = () => {
    setIsPaused(false);
  };
  
  const value = {
    timerSeconds,
    timerRunning,
    startTimer,
    stopTimer,
    resetTimer,
    pauseTimer,
    resumeTimer
  };
  
  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;
