
import React, { useEffect, useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import { SoundEffect } from '@/types/game-types';

// Array of default sound effects that should be preloaded
const DEFAULT_SOUNDS: SoundEffect[] = [
  'success',
  'failure',
  'click',
  'wheel-spin',
  'wheel-tick',
  'card-reveal',
  'victory',
  'timeout',
  'round-start',
  'damage',
  'powerup',
  'bonus',
  'fail',
  'eliminate'
];

const SoundPreloader: React.FC = () => {
  const { availableSounds } = useGameContext();
  const [loaded, setLoaded] = useState<Record<string, boolean>>({});
  const [hasShownErrorToast, setHasShownErrorToast] = useState(false);

  useEffect(() => {
    // Create audio elements for each sound but don't play them
    const audioElements: Record<string, HTMLAudioElement> = {};
    let failedCount = 0;
    
    DEFAULT_SOUNDS.forEach(sound => {
      const audio = new Audio(`/sounds/${sound}.mp3`);
      
      audio.addEventListener('canplaythrough', () => {
        setLoaded(prev => ({ ...prev, [sound]: true }));
        audioElements[sound] = audio;
      });
      
      audio.addEventListener('error', () => {
        failedCount++;
        setLoaded(prev => ({ ...prev, [sound]: false }));
        
        // Only show toast once if multiple sounds fail
        if (failedCount > 3 && !hasShownErrorToast) {
          toast.error('Brakuje plików dźwiękowych', { 
            description: 'Niektóre efekty dźwiękowe mogą nie działać poprawnie',
            duration: 5000
          });
          setHasShownErrorToast(true);
        }
        
        // Create fallback base64 encoded sound (a simple beep)
        const fallbackAudio = new Audio('data:audio/wav;base64,UklGRn4AAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YRoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgZGRkZGRkZGRkZAAAAAAAZGRkZGRkZGRkZAAAAA==');
        audioElements[sound] = fallbackAudio;
      });
      
      // Start loading the audio file
      audio.load();
    });
    
    // Cleanup function
    return () => {
      Object.values(audioElements).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [hasShownErrorToast]);

  // Don't render anything - this is a utility component
  return null;
};

export default SoundPreloader;
