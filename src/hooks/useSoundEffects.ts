
import { useRef } from 'react';

export type SoundEffect = 
  'success' | 'fail' | 'bonus' | 'round-start' | 
  'eliminate' | 'victory' | 'timeout' | 'wheel-spin';

type SoundOptions = {
  enabled: boolean;
  volume?: number;
  preload?: boolean;
};

const soundPaths: Record<SoundEffect, string> = {
  'success': '/sounds/success.mp3',
  'fail': '/sounds/fail.mp3',
  'bonus': '/sounds/bonus.mp3',
  'round-start': '/sounds/round-start.mp3',
  'eliminate': '/sounds/eliminate.mp3',
  'victory': '/sounds/victory.mp3',
  'timeout': '/sounds/timeout.mp3',
  'wheel-spin': '/sounds/wheel-spin.mp3'
};

export const useSoundEffects = (options: SoundOptions = { enabled: true }) => {
  const soundCacheRef = useRef<Record<SoundEffect, HTMLAudioElement | null>>({
    'success': null,
    'fail': null,
    'bonus': null,
    'round-start': null,
    'eliminate': null,
    'victory': null,
    'timeout': null,
    'wheel-spin': null
  });

  // Preload sounds if enabled
  const preloadSounds = () => {
    if (!options.enabled || !options.preload) return;
    
    Object.entries(soundPaths).forEach(([key, path]) => {
      const audio = new Audio(path);
      audio.preload = 'auto';
      soundCacheRef.current[key as SoundEffect] = audio;
    });
  };

  // Play sound effect with optional volume override
  const playSound = (effect: SoundEffect, volumeOverride?: number) => {
    if (!options.enabled) return;
    
    try {
      let audio = soundCacheRef.current[effect];
      
      // Create audio if not cached
      if (!audio) {
        audio = new Audio(soundPaths[effect]);
        soundCacheRef.current[effect] = audio;
      }
      
      // Reset to beginning if already playing
      audio.currentTime = 0;
      
      // Set volume
      const volume = volumeOverride !== undefined ? volumeOverride : (options.volume || 0.5);
      audio.volume = Math.min(1, Math.max(0, volume));
      
      // Play sound
      audio.play().catch((error) => {
        console.error(`Error playing sound ${effect}:`, error);
      });
    } catch (error) {
      console.error(`Error with sound ${effect}:`, error);
    }
  };

  // Mute/unmute all sounds
  const setEnabled = (enabled: boolean) => {
    options.enabled = enabled;
  };

  // Set global volume for all sounds
  const setVolume = (volume: number) => {
    options.volume = Math.min(1, Math.max(0, volume));
  };

  return {
    playSound,
    setEnabled,
    setVolume,
    preloadSounds
  };
};
