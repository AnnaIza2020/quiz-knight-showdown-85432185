import { useState, useEffect, useRef } from 'react';
import { SoundEffect } from '@/types/game-types';

interface SoundOptions {
  volume?: number;
  loop?: boolean;
}

interface SoundEffectsOptions {
  enabled?: boolean;
  useLocalStorage?: boolean;
  defaultVolume?: number;
}

export const useSoundEffects = (options: SoundEffectsOptions = {}) => {
  const [enabled, setEnabled] = useState(options.enabled !== false);
  const [volume, setVolume] = useState(options.defaultVolume || 0.5);
  const audioElements = useRef<Record<string, HTMLAudioElement>>({});
  
  // Load enabled state from localStorage if requested
  useEffect(() => {
    if (options.useLocalStorage) {
      const savedEnabled = localStorage.getItem('soundEffectsEnabled');
      if (savedEnabled !== null) {
        setEnabled(savedEnabled === 'true');
      }
      
      const savedVolume = localStorage.getItem('soundEffectsVolume');
      if (savedVolume !== null) {
        setVolume(parseFloat(savedVolume));
      }
    }
  }, [options.useLocalStorage]);
  
  // Save enabled state to localStorage if requested
  useEffect(() => {
    if (options.useLocalStorage) {
      localStorage.setItem('soundEffectsEnabled', enabled.toString());
      localStorage.setItem('soundEffectsVolume', volume.toString());
    }
  }, [enabled, volume, options.useLocalStorage]);
  
  // Sound effect URLs
  const soundEffects: Record<SoundEffect, string> = {
    'success': '/sounds/success.mp3',
    'failure': '/sounds/failure.mp3',
    'click': '/sounds/click.mp3',
    'wheel-spin': '/sounds/wheel-spin.mp3',
    'wheel-tick': '/sounds/wheel-tick.mp3',
    'card-reveal': '/sounds/card-reveal.mp3',
    'victory': '/sounds/victory.mp3',
    'timeout': '/sounds/timeout.mp3',
    'round-start': '/sounds/round-start.mp3',
    'damage': '/sounds/damage.mp3',
    'powerup': '/sounds/powerup.mp3'
  };
  
  // Preload sound effects
  useEffect(() => {
    // Create audio elements for each sound effect
    Object.entries(soundEffects).forEach(([name, url]) => {
      const audio = new Audio(url);
      audio.preload = 'auto';
      audioElements.current[name] = audio;
    });
    
    // Cleanup
    return () => {
      // Stop and remove all audio elements
      Object.values(audioElements.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioElements.current = {};
    };
  }, []);
  
  // Play a sound effect
  const playSound = (sound: SoundEffect, customVolume?: number) => {
    if (!enabled) return;
    
    try {
      // Get audio element for this sound
      let audio = audioElements.current[sound];
      
      // If not preloaded, create it
      if (!audio) {
        const url = soundEffects[sound] || '';
        audio = new Audio(url);
        audioElements.current[sound] = audio;
      }
      
      // Reset audio to start
      audio.currentTime = 0;
      
      // Set volume
      const effectiveVolume = customVolume !== undefined ? customVolume : volume;
      audio.volume = Math.min(1, Math.max(0, effectiveVolume));
      
      // Play the sound
      audio.play().catch(err => {
        console.warn(`Failed to play sound effect "${sound}":`, err);
      });
    } catch (error) {
      console.error(`Error playing sound effect "${sound}":`, error);
    }
  };
  
  // Play a sound with options
  const playSoundWithOptions = (sound: SoundEffect, options: SoundOptions = {}) => {
    if (!enabled) return;
    
    try {
      // Get audio element for this sound
      let audio = audioElements.current[sound];
      
      // If not preloaded, create it
      if (!audio) {
        const url = soundEffects[sound] || '';
        audio = new Audio(url);
        audioElements.current[sound] = audio;
      }
      
      // Reset audio to start
      audio.currentTime = 0;
      
      // Set volume
      const effectiveVolume = options.volume !== undefined ? options.volume : volume;
      audio.volume = Math.min(1, Math.max(0, effectiveVolume));
      
      // Set loop
      audio.loop = !!options.loop;
      
      // Play the sound
      audio.play().catch(err => {
        console.warn(`Failed to play sound effect "${sound}":`, err);
      });
      
      // Return the audio element for further control (e.g., stopping a looped sound)
      return audio;
    } catch (error) {
      console.error(`Error playing sound effect "${sound}":`, error);
      return null;
    }
  };
  
  // Stop a specific sound effect
  const stopSound = (sound: SoundEffect) => {
    const audio = audioElements.current[sound];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };
  
  // Stop all sound effects
  const stopAllSounds = () => {
    Object.values(audioElements.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  };
  
  // Set global volume for all sounds
  const setGlobalVolume = (newVolume: number) => {
    const clampedVolume = Math.min(1, Math.max(0, newVolume));
    setVolume(clampedVolume);
    
    if (options.useLocalStorage) {
      localStorage.setItem('soundEffectsVolume', clampedVolume.toString());
    }
  };
  
  return {
    enabled,
    setEnabled,
    playSound,
    playSoundWithOptions,
    stopSound,
    stopAllSounds,
    volume,
    setVolume: setGlobalVolume
  };
};
