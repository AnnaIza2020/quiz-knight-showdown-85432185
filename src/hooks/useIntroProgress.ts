
import { useState, useEffect } from 'react';

interface UseIntroProgressOptions {
  show: boolean;
  isStarting: boolean;
  onCountdownComplete?: () => void;
}

export const useIntroProgress = ({
  show,
  isStarting,
  onCountdownComplete
}: UseIntroProgressOptions) => {
  const [progress, setProgress] = useState(0);
  const [countdownActive, setCountdownActive] = useState(false);
  const [countdownNumber, setCountdownNumber] = useState(5);
  const [flashActive, setFlashActive] = useState(false);
  
  // Progress bar animation with dynamic pacing
  useEffect(() => {
    if (!show) return;
    
    const introDuration = 28000; // 28 seconds for intro
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100 / (introDuration / 100)); // Calculate progress increment for 28 seconds
        
        // When progress gets to 95%, start countdown if not already started
        if (prev < 95 && newProgress >= 95 && !countdownActive && !isStarting) {
          setCountdownActive(true);
        }
        
        return newProgress > 100 ? 100 : newProgress;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [show, countdownActive, isStarting]);
  
  // Countdown animation
  useEffect(() => {
    if (!countdownActive) return;
    
    const interval = setInterval(() => {
      setCountdownNumber(prev => {
        const newCount = prev - 1;
        if (newCount <= 0) {
          clearInterval(interval);
          // When countdown finishes, trigger onFinished after a short delay
          setTimeout(() => {
            if (onCountdownComplete && !isStarting) onCountdownComplete();
          }, 1000);
          return 0;
        }
        return newCount;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, [countdownActive, onCountdownComplete, isStarting]);

  // Show flash effect (to be called after narrator finishes)
  const triggerFlash = () => {
    setFlashActive(true);
    setTimeout(() => {
      setFlashActive(false);
    }, 1000);
  };

  return {
    progress,
    countdownActive,
    countdownNumber,
    flashActive,
    triggerFlash
  };
};
