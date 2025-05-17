
import { useState, useEffect, useRef } from 'react';
import { useErrorAggregator, ErrorConfig } from './useErrorAggregator';

export interface SoundEffectOptions {
  volume?: number;
  loop?: boolean;
  onEnd?: () => void;
}

export interface SoundEffectConfig {
  enabled?: boolean;
  useLocalStorage?: boolean;
  defaultVolume?: number;
}

/**
 * Hook do zarządzania efektami dźwiękowymi w aplikacji
 */
export function useSoundEffects(config?: SoundEffectConfig) {
  // Initialize with config or default values
  const [soundsEnabled, setSoundsEnabled] = useState<boolean>(config?.enabled ?? true);
  const [volume, setVolume] = useState<number>(config?.defaultVolume ?? 1.0);
  const [availableSounds, setAvailableSounds] = useState<Record<string, string>>({});
  const [soundStatus, setSoundStatus] = useState<Record<string, any>>({});
  const [soundsPreloaded, setSoundsPreloaded] = useState<boolean>(false);
  
  const audioElements = useRef<Record<string, HTMLAudioElement>>({});
  const { reportError } = useErrorAggregator({
    throttleMs: 5000,   // Throttle similar errors for 5 seconds
    maxDuplicates: 3,   // Show individual errors up to 3 times before aggregating
    silentCategories: ['sound-loading'] // Don't show sound loading errors in toasts
  });

  // Save sound preferences to localStorage if configured
  useEffect(() => {
    if (config?.useLocalStorage) {
      try {
        localStorage.setItem('game_sounds_enabled', soundsEnabled ? 'true' : 'false');
        localStorage.setItem('game_sounds_volume', volume.toString());
      } catch (error) {
        console.warn('Failed to save sound preferences to localStorage', error);
      }
    }
  }, [soundsEnabled, volume, config?.useLocalStorage]);

  // Load sound preferences from localStorage on mount if configured
  useEffect(() => {
    if (config?.useLocalStorage) {
      try {
        const savedEnabled = localStorage.getItem('game_sounds_enabled');
        const savedVolume = localStorage.getItem('game_sounds_volume');
        
        if (savedEnabled !== null) {
          setSoundsEnabled(savedEnabled === 'true');
        }
        
        if (savedVolume !== null) {
          const parsedVolume = parseFloat(savedVolume);
          if (!isNaN(parsedVolume) && parsedVolume >= 0 && parsedVolume <= 1) {
            setVolume(parsedVolume);
          }
        }
      } catch (error) {
        console.warn('Failed to load sound preferences from localStorage', error);
      }
    }
  }, [config?.useLocalStorage]);

  // A function to preload all sounds
  const preloadSounds = async (sounds: Record<string, string>) => {
    const failedSounds: string[] = [];
    
    await Promise.all(
      Object.entries(sounds).map(async ([name, url]) => {
        return new Promise<void>((resolve) => {
          const audio = new Audio();
          audioElements.current[name] = audio;
          
          audio.addEventListener('canplaythrough', () => {
            setSoundStatus(prev => ({ ...prev, [name]: 'loaded' }));
            resolve();
          });
          
          audio.addEventListener('error', (error) => {
            console.error(`Failed to load sound ${name} from ${url}`, error);
            setSoundStatus(prev => ({ ...prev, [name]: 'error' }));
            const errorConfig: ErrorConfig = {
              category: 'sound-loading',
              silent: true
            };
            reportError(`Failed to load sound ${name}`, errorConfig);
            failedSounds.push(name);
            resolve();
          });
          
          audio.src = url;
          audio.preload = 'auto';
        });
      })
    );

    setAvailableSounds(sounds);
    setSoundsPreloaded(true);
    return Object.keys(sounds).filter(name => !failedSounds.includes(name));
  };

  // Function to add a custom sound
  const addCustomSound = (name: string, url: string | File) => {
    if (typeof url === 'string') {
      setAvailableSounds(prev => ({ ...prev, [name]: url }));
    } else { // If it's a File object
      const objectURL = URL.createObjectURL(url);
      setAvailableSounds(prev => ({ ...prev, [name]: objectURL }));
    }
  };

  // Function to play a sound with optional settings
  const playSound = (sound: string, volumeOverride?: number) => {
    playSoundWithOptions(sound, { volume: volumeOverride });
  };
  
  const playSoundWithOptions = (sound: string, options: SoundEffectOptions = {}) => {
    if (!soundsEnabled) return;
    
    const url = availableSounds[sound];
    if (!url) {
      console.warn(`Sound ${sound} not found in available sounds.`);
      const errorConfig: ErrorConfig = { 
        category: 'sound-playback'
      };
      reportError(`Sound ${sound} not found`, errorConfig);
      return;
    }
    
    // Use existing audio element or create a new one
    const audio = audioElements.current[sound] || new Audio(url);
    audioElements.current[sound] = audio;
    
    // Set volume with overall volume and optional override
    audio.volume = volume * (options.volume !== undefined ? options.volume : 1);
    
    // Set loop if specified
    if (options.loop !== undefined) {
      audio.loop = options.loop;
    }
    
    // Handle onEnd callback
    if (options.onEnd) {
      audio.addEventListener('ended', options.onEnd, { once: true });
    }
    
    // Play the sound
    audio.play().catch(error => {
      console.error(`Failed to play sound ${sound}:`, error);
      const errorConfig: ErrorConfig = { 
        category: 'sound-playback'
      };
      reportError(`Failed to play sound ${sound}`, errorConfig);
    });
  };

  // Function to stop a specific sound
  const stopSound = (sound: string) => {
    const audio = audioElements.current[sound];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  // Function to stop all sounds
  const stopAllSounds = () => {
    Object.values(audioElements.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  };

  // Effect to load default sounds on mount
  useEffect(() => {
    const defaultSounds = {
      'success': '/sounds/success.mp3',
      'fail': '/sounds/fail.mp3',
      'timeout': '/sounds/timeout.mp3',
      'eliminate': '/sounds/eliminate.mp3',
      'round-start': '/sounds/round-start.mp3',
      'victory': '/sounds/victory.mp3',
      'card-reveal': '/sounds/card-reveal.mp3',
      'wheel-spin': '/sounds/wheel-spin.mp3',
      'wheel-tick': '/sounds/wheel-tick.mp3',
      'bonus': '/sounds/bonus.mp3',
      'intro-music': '/sounds/intro.mp3',
      'narrator': '/sounds/narrator.mp3'
    };
    
    preloadSounds(defaultSounds);
  }, []);

  return {
    // For compatibility with both naming conventions
    soundsEnabled,
    setSoundsEnabled,
    volume,
    setVolume,
    availableSounds,
    addCustomSound,
    preloadSounds,
    playSound,
    playSoundWithOptions,
    stopSound,
    stopAllSounds,
    soundStatus,
    soundsPreloaded
  };
}
