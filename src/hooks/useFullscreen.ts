
import { useState, useCallback, useEffect } from 'react';

interface UseFullscreenOptions {
  onEnter?: () => void;
  onExit?: () => void;
}

export const useFullscreen = (elementRef: React.RefObject<HTMLElement>, options: UseFullscreenOptions = {}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Handler for fullscreenchange event
  const handleFullscreenChange = useCallback(() => {
    const isCurrentlyFullscreen = document.fullscreenElement === elementRef.current;
    setIsFullscreen(isCurrentlyFullscreen);
    
    if (isCurrentlyFullscreen) {
      options.onEnter?.();
    } else {
      options.onExit?.();
    }
  }, [elementRef, options]);
  
  // Setup event listener for fullscreen change
  useEffect(() => {
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [handleFullscreenChange]);
  
  // Request fullscreen
  const enterFullscreen = useCallback(async () => {
    if (!elementRef.current) return;
    
    try {
      await elementRef.current.requestFullscreen();
    } catch (error) {
      console.error('Failed to enter fullscreen mode:', error);
    }
  }, [elementRef]);
  
  // Exit fullscreen
  const exitFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) return;
    
    try {
      await document.exitFullscreen();
    } catch (error) {
      console.error('Failed to exit fullscreen mode:', error);
    }
  }, []);
  
  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (isFullscreen) {
      exitFullscreen();
    } else {
      enterFullscreen();
    }
  }, [isFullscreen, enterFullscreen, exitFullscreen]);
  
  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen,
    toggleFullscreen
  };
};
