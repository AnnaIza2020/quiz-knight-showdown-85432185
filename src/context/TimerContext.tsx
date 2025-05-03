
import React, { createContext, useContext, useState, useEffect } from 'react';

interface TimerContextType {
  timerSeconds: number;
  timerRunning: boolean;
  startTimer: (seconds: number) => void;
  stopTimer: () => void;
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
  children: React.ReactNode;
}

export const TimerProvider: React.FC<TimerProviderProps> = ({
  initialSeconds = 0,
  autoStart = false,
  children
}) => {
  const [timerSeconds, setTimerSeconds] = useState<number>(initialSeconds);
  const [timerRunning, setTimerRunning] = useState<boolean>(autoStart);
  
  // Timer countdown logic
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => {
          const newValue = prev - 1;
          if (newValue <= 0) {
            setTimerRunning(false);
            return 0;
          }
          return newValue;
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);
  
  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };
  
  const stopTimer = () => {
    setTimerRunning(false);
  };
  
  const value = {
    timerSeconds,
    timerRunning,
    startTimer,
    stopTimer
  };
  
  return (
    <TimerContext.Provider value={value}>
      {children}
    </TimerContext.Provider>
  );
};

export default TimerProvider;
