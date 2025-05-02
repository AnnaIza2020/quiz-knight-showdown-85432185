
import { useCallback, useEffect, useState } from 'react';

// Define the available sound effects in the game
export type SoundEffect = 
  | 'success' 
  | 'fail' 
  | 'bonus' 
  | 'eliminate' 
  | 'victory' 
  | 'timeout'
  | 'wheel-tick'
  | 'round-start'
  | 'card-reveal';

// Sound file paths
const soundPaths: Record<SoundEffect, string> = {
  success: '/sounds/success.mp3',
  fail: '/sounds/fail.mp3',
  bonus: '/sounds/bonus.mp3',
  eliminate: '/sounds/eliminate.mp3',
  victory: '/sounds/victory.mp3',
  timeout: '/sounds/timeout.mp3',
  'wheel-tick': '/sounds/wheel-tick.mp3',
  'round-start': '/sounds/round-start.mp3',
  'card-reveal': '/sounds/card-reveal.mp3'
};

// Default volume levels for each sound type
const defaultVolumes: Record<SoundEffect, number> = {
  success: 0.5,
  fail: 0.5,
  bonus: 0.5,
  eliminate: 0.7,
  victory: 0.7,
  timeout: 0.6,
  'wheel-tick': 0.3,
  'round-start': 0.7,
  'card-reveal': 0.6
};

interface UseSoundEffectsProps {
  enabled?: boolean; // Whether sound is enabled overall
}

export const useSoundEffects = ({ enabled = true }: UseSoundEffectsProps = {}) => {
  const [soundsLoaded, setSoundsLoaded] = useState<Record<SoundEffect, boolean>>({} as any);
  const [audioElements, setAudioElements] = useState<Record<SoundEffect, HTMLAudioElement>>({} as any);
  
  // Initialize audio elements on mount
  useEffect(() => {
    if (!enabled) return;
    
    const elements: Partial<Record<SoundEffect, HTMLAudioElement>> = {};
    const loaded: Partial<Record<SoundEffect, boolean>> = {};
    
    // Create audio elements for each sound
    Object.entries(soundPaths).forEach(([key, path]) => {
      const soundKey = key as SoundEffect;
      const audio = new Audio(path);
      audio.volume = defaultVolumes[soundKey];
      
      // Track when each sound is loaded
      audio.addEventListener('canplaythrough', () => {
        loaded[soundKey] = true;
        setSoundsLoaded(prev => ({ ...prev, [soundKey]: true }));
      });
      
      audio.addEventListener('error', () => {
        console.error(`Failed to load sound: ${path}`);
        loaded[soundKey] = false;
        setSoundsLoaded(prev => ({ ...prev, [soundKey]: false }));
      });
      
      // Preload audio
      audio.load();
      elements[soundKey] = audio;
    });
    
    setAudioElements(elements as Record<SoundEffect, HTMLAudioElement>);
    
    // Cleanup function
    return () => {
      Object.values(elements).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, [enabled]);
  
  // Play a sound effect with optional volume override
  const playSound = useCallback((sound: SoundEffect, volume?: number) => {
    if (!enabled || !audioElements[sound]) return;
    
    try {
      // Stop and reset the audio element before playing again
      const audio = audioElements[sound];
      audio.pause();
      audio.currentTime = 0;
      
      // Set volume if provided, otherwise use default
      if (volume !== undefined) {
        audio.volume = Math.max(0, Math.min(1, volume)); // Clamp between 0 and 1
      }
      
      // Play the sound
      audio.play().catch(error => {
        console.error(`Failed to play sound: ${sound}`, error);
      });
    } catch (error) {
      console.error(`Error playing sound: ${sound}`, error);
    }
  }, [audioElements, enabled]);
  
  return {
    playSound,
    soundsLoaded,
    isReady: Object.values(soundsLoaded).every(Boolean)
  };
};
