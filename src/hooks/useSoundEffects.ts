
import { useEffect, useState, useCallback } from 'react';

// Define the available sound effects
export type SoundEffect = 
  | 'success'
  | 'fail'
  | 'timeout'
  | 'bonus'
  | 'eliminate'
  | 'round-start'
  | 'victory'
  | 'wheel-spin'
  | 'wheel-tick'
  | 'card-reveal';

const SOUND_PATHS = {
  'success': '/sounds/success.mp3',
  'fail': '/sounds/fail.mp3',
  'timeout': '/sounds/timeout.mp3',
  'bonus': '/sounds/bonus.mp3',
  'eliminate': '/sounds/eliminate.mp3',
  'round-start': '/sounds/round-start.mp3',
  'victory': '/sounds/victory.mp3',
  'wheel-spin': '/sounds/wheel-tick.mp3', // Using wheel-tick for this
  'wheel-tick': '/sounds/wheel-tick.mp3',
  'card-reveal': '/sounds/card-reveal.mp3',
};

// Interface for useSoundEffects options
export interface UseSoundEffectsOptions {
  enabled?: boolean;
}

export const useSoundEffects = (options?: UseSoundEffectsOptions) => {
  const [enabled, setEnabled] = useState(options?.enabled ?? true);
  const [audioElements, setAudioElements] = useState<Record<SoundEffect, HTMLAudioElement | null>>({
    'success': null,
    'fail': null,
    'timeout': null,
    'bonus': null,
    'eliminate': null,
    'round-start': null,
    'victory': null,
    'wheel-spin': null,
    'wheel-tick': null,
    'card-reveal': null,
  });

  // Initialize audio elements on component mount
  useEffect(() => {
    const audioMap: Record<SoundEffect, HTMLAudioElement> = {} as Record<SoundEffect, HTMLAudioElement>;
    
    (Object.keys(SOUND_PATHS) as SoundEffect[]).forEach(effect => {
      const audio = new Audio(SOUND_PATHS[effect]);
      audioMap[effect] = audio;
    });
    
    setAudioElements(audioMap);
    
    // Cleanup on unmount
    return () => {
      Object.values(audioMap).forEach(audio => {
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  // Play a sound effect
  const playSound = useCallback((sound: SoundEffect, volume = 1.0) => {
    if (!enabled) return;

    const audio = audioElements[sound];
    if (!audio) return;

    // Reset and play
    audio.pause();
    audio.currentTime = 0;
    audio.volume = volume;
    
    // Play and catch errors silently (common in browsers before user interaction)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        console.info('Audio play prevented by browser:', error);
      });
    }
  }, [audioElements, enabled]);

  return {
    playSound,
    enabled,
    setEnabled
  };
};
