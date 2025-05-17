import { useState, useEffect, useRef } from 'react';
import { useErrorAggregator } from './useErrorAggregator';

export interface SoundEffectOptions {
  volume?: number;
  loop?: boolean;
  onEnd?: () => void;
}

/**
 * Hook to manage sound effects in the application
 */
export function useSoundEffects() {
  const [soundsEnabled, setSoundsEnabled] = useState<boolean>(true);
  const [volume, setVolume] = useState<number>(1.0);
  const [availableSounds, setAvailableSounds] = useState<Record<string, string>>({});
  const [soundStatus, setSoundStatus] = useState<Record<string, any>>({});
  
  const audioElements = useRef<Record<string, HTMLAudioElement>>({});
  const { reportError } = useErrorAggregator({
    cooldownPeriod: 10000, // Only show errors every 10 seconds
    maxDuplicates: 3,      // Show individual errors up to 3 times before aggregating
    silentCategories: ['sound-loading'] // Don't show sound loading errors in toasts
  });

  // A function to preload all sounds
  const preloadSounds = async (sounds: Record<string, string>) => {
    console.log("Preloading sounds:", sounds);
    
    // Keep track of which sounds failed to load
    const failedSounds: string[] = [];
    
    for (const [name, url] of Object.entries(sounds)) {
      try {
        const audio = new Audio(url);
        
        // Create a promise that resolves when the audio loads or rejects on error
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve, { once: true });
          audio.addEventListener('error', (e) => {
            console.warn(`Nie można załadować dźwięku: ${name}`, e);
            failedSounds.push(name);
            reject(e);
          }, { once: true });
          
          // Start loading
          audio.load();
          
          // Set a timeout to avoid waiting forever
          setTimeout(() => resolve(null), 5000);
        });
        
        audioElements.current[name] = audio;
        
      } catch (error) {
        // Don't show a toast for each failed sound, just log it
        console.warn(`Nie można załadować dźwięku: ${name}`, error);
      }
    }
    
    // If multiple sounds failed, show an aggregated error
    if (failedSounds.length > 0) {
      console.warn(`Nie udało się załadować ${failedSounds.length} dźwięków: ${failedSounds.join(', ')}`);
      
      // Only show a single notification for all failed sounds
      if (failedSounds.length > 0) {
        reportError(`Nie udało się załadować ${failedSounds.length} dźwięków.`, 'sound-loading');
      }
    }
    
    setAvailableSounds(sounds);
    return Object.keys(sounds).filter(name => !failedSounds.includes(name));
  };

  // Add a custom sound
  const addCustomSound = (name: string, source: string | File) => {
    const url = typeof source === 'string' ? source : URL.createObjectURL(source);
    setAvailableSounds(prev => ({
      ...prev,
      [name]: url
    }));
    
    // Create an audio element for the new sound
    try {
      const audio = new Audio(url);
      audioElements.current[name] = audio;
    } catch (error) {
      reportError(`Nie udało się dodać dźwięku: ${name}`, 'sound-loading');
    }
  };

  // Play a sound effect
  const playSound = (name: string, userVolume?: number) => {
    if (!soundsEnabled) return;
    
    try {
      // Get or create audio element
      let audio = audioElements.current[name];
      
      if (!audio) {
        const url = availableSounds[name];
        if (!url) {
          // Instead of showing a toast for each missing sound, just log it
          console.warn(`Dźwięk "${name}" nie jest dostępny`);
          return;
        }
        
        audio = new Audio(url);
        audioElements.current[name] = audio;
      }
      
      // Reset the audio to start from beginning if it's already playing
      audio.currentTime = 0;
      
      // Set volume
      audio.volume = typeof userVolume === 'number' ? userVolume : volume;
      
      // Play the sound
      audio.play().catch(error => {
        console.warn(`Nie można odtworzyć dźwięku: ${name}`, error);
      });
      
      // Update sound status
      setSoundStatus(prev => ({
        ...prev,
        [name]: {
          playing: true,
          timestamp: Date.now()
        }
      }));
      
    } catch (error) {
      console.warn(`Błąd odtwarzania dźwięku: ${name}`, error);
    }
  };

  // Play a sound with additional options
  const playSoundWithOptions = (name: string, options: SoundEffectOptions = {}) => {
    if (!soundsEnabled) return;
    
    try {
      const url = availableSounds[name];
      if (!url) {
        console.warn(`Dźwięk "${name}" nie jest dostępny`);
        return;
      }
      
      // Create a new audio instance for this play with options
      const audio = new Audio(url);
      
      // Apply options
      audio.volume = options.volume !== undefined ? options.volume : volume;
      audio.loop = options.loop || false;
      
      if (options.onEnd) {
        audio.addEventListener('ended', options.onEnd, { once: true });
      }
      
      // Play the sound
      audio.play().catch(error => {
        console.warn(`Nie można odtworzyć dźwięku: ${name}`, error);
      });
      
      // Update sound status
      setSoundStatus(prev => ({
        ...prev,
        [name]: {
          playing: true,
          timestamp: Date.now(),
          options
        }
      }));
      
      // Return the audio element for more control
      return audio;
      
    } catch (error) {
      console.warn(`Błąd odtwarzania dźwięku: ${name}`, error);
      return null;
    }
  };

  // Stop a specific sound
  const stopSound = (name: string) => {
    const audio = audioElements.current[name];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      
      // Update sound status
      setSoundStatus(prev => ({
        ...prev,
        [name]: {
          playing: false,
          timestamp: Date.now()
        }
      }));
    }
  };

  // Stop all sounds
  const stopAllSounds = () => {
    Object.values(audioElements.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    // Update all sound statuses
    const newStatus: Record<string, any> = {};
    Object.keys(audioElements.current).forEach(name => {
      newStatus[name] = {
        playing: false,
        timestamp: Date.now()
      };
    });
    
    setSoundStatus(newStatus);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Stop all sounds and release resources
      Object.values(audioElements.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  return {
    soundsEnabled,
    setSoundsEnabled,
    volume,
    setVolume,
    availableSounds,
    preloadSounds,
    addCustomSound,
    playSound,
    playSoundWithOptions,
    stopSound,
    stopAllSounds,
    soundStatus
  };
}

export default useSoundEffects;
