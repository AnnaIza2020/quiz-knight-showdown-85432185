
import { useState, useEffect, useRef } from 'react';
import { SoundEffect } from '@/types/game-types';

export interface SoundEffectOptions {
  volume?: number;
  loop?: boolean;
  onEnd?: () => void;
  playbackRate?: number;
}

interface UseSoundEffectsOptions {
  enabled?: boolean;
  defaultVolume?: number;
  useLocalStorage?: boolean;
}

export const useSoundEffects = (options: UseSoundEffectsOptions = {}) => {
  const {
    enabled: initialEnabled = true,
    defaultVolume = 0.5,
    useLocalStorage = false
  } = options;
  
  // Stany dla ustawień dźwięku
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (useLocalStorage) {
      const savedEnabled = localStorage.getItem('soundsEnabled');
      return savedEnabled !== null ? savedEnabled === 'true' : initialEnabled;
    }
    return initialEnabled;
  });
  
  const [volume, setVolume] = useState<number>(() => {
    if (useLocalStorage) {
      const savedVolume = localStorage.getItem('soundVolume');
      return savedVolume !== null ? parseFloat(savedVolume) : defaultVolume;
    }
    return defaultVolume;
  });
  
  // Referencje do aktualnie odtwarzanych dźwięków
  const soundRefs = useRef<Map<string, HTMLAudioElement>>(new Map());
  const [soundsPreloaded, setSoundsPreloaded] = useState(false);
  
  // Domyślne dźwięki gry
  const defaultSounds: Record<string, string> = {
    'success': '/sounds/success.mp3',
    'fail': '/sounds/fail.mp3',
    'timeout': '/sounds/timeout.mp3',
    'eliminate': '/sounds/eliminate.mp3',
    'round-start': '/sounds/round-start.mp3',
    'victory': '/sounds/victory.mp3',
    'wheel-spin': '/sounds/wheel-spin.mp3',
    'wheel-tick': '/sounds/wheel-tick.mp3',
    'bonus': '/sounds/bonus.mp3',
    'narrator': '/sounds/narrator.mp3',
    'intro-music': '/sounds/intro-music.mp3',
    'card-reveal': '/sounds/card-reveal.mp3'
  };
  
  // Stan przechowujący dodatkowe niestandardowe dźwięki
  const [customSounds, setCustomSounds] = useState<Record<string, string>>(() => {
    if (useLocalStorage) {
      const saved = localStorage.getItem('customSounds');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  
  // Funkcja do dodawania niestandardowych dźwięków
  const addCustomSound = (name: string, url: string): void => {
    setCustomSounds((prev) => {
      const updatedSounds = { ...prev, [name]: url };
      if (useLocalStorage) {
        localStorage.setItem('customSounds', JSON.stringify(updatedSounds));
      }
      return updatedSounds;
    });
    
    // Preload the sound
    preloadSound(name, url);
  };
  
  // Łączymy domyślne i niestandardowe dźwięki
  const availableSounds = { ...defaultSounds, ...customSounds };
  
  // Obsługa zmian ustawień dźwięku w localStorage
  useEffect(() => {
    if (useLocalStorage) {
      localStorage.setItem('soundsEnabled', String(enabled));
      localStorage.setItem('soundVolume', String(volume));
    }
  }, [enabled, volume, useLocalStorage]);
  
  // Funkcja do wstępnego ładowania dźwięków
  const preloadSound = (id: string, url: string) => {
    if (!soundRefs.current.has(id)) {
      const audio = new Audio(url);
      audio.preload = 'auto';
      soundRefs.current.set(id, audio);
      
      // Preload attempt
      audio.load();
    }
  };
  
  // Wstępne ładowanie domyślnych dźwięków
  useEffect(() => {
    // Preload default sounds
    Object.entries(defaultSounds).forEach(([id, url]) => {
      preloadSound(id, url);
    });
    
    // Preload custom sounds
    Object.entries(customSounds).forEach(([id, url]) => {
      preloadSound(id, url);
    });
    
    setSoundsPreloaded(true);
    
    // Cleanup function
    return () => {
      soundRefs.current.forEach((audio) => {
        audio.pause();
        audio.src = '';
      });
      soundRefs.current.clear();
    };
  }, []);
  
  // Odtwarzanie dźwięku
  const playSound = (sound: SoundEffect, customVolume?: number): void => {
    if (!enabled) return;
    
    // Get the URL for the sound
    const soundUrl = availableSounds[sound];
    if (!soundUrl) {
      console.error(`Sound not found: ${sound}`);
      return;
    }
    
    try {
      // Check if we have a preloaded audio element
      let audio = soundRefs.current.get(sound as string);
      
      if (!audio) {
        // If not preloaded, create and preload
        audio = new Audio(soundUrl);
        soundRefs.current.set(sound as string, audio);
      } else {
        // Reset the audio if it exists
        audio.pause();
        audio.currentTime = 0;
      }
      
      // Set volume and play
      audio.volume = customVolume !== undefined ? customVolume : volume;
      audio.play().catch((err) => {
        console.error(`Error playing sound ${sound}:`, err);
      });
    } catch (e) {
      console.error(`Error handling sound ${sound}:`, e);
    }
  };
  
  // Odtwarzanie dźwięku z dodatkowymi opcjami
  const playSoundWithOptions = (sound: SoundEffect, options: SoundEffectOptions = {}): void => {
    if (!enabled) return;
    
    const { volume: customVolume, loop = false, onEnd, playbackRate = 1 } = options;
    
    // Get the URL for the sound
    const soundUrl = availableSounds[sound];
    if (!soundUrl) {
      console.error(`Sound not found: ${sound}`);
      return;
    }
    
    try {
      // Check if we have a preloaded audio element
      let audio = soundRefs.current.get(sound as string);
      
      if (!audio) {
        // If not preloaded, create and preload
        audio = new Audio(soundUrl);
        soundRefs.current.set(sound as string, audio);
      } else {
        // Reset the audio if it exists
        audio.pause();
        audio.currentTime = 0;
      }
      
      // Configure audio element
      audio.volume = customVolume !== undefined ? customVolume : volume;
      audio.loop = loop;
      audio.playbackRate = playbackRate;
      
      if (onEnd) {
        audio.onended = onEnd;
      }
      
      audio.play().catch((err) => {
        console.error(`Error playing sound ${sound}:`, err);
      });
    } catch (e) {
      console.error(`Error handling sound ${sound}:`, e);
    }
  };
  
  // Zatrzymanie dźwięku
  const stopSound = (sound: SoundEffect): void => {
    const audio = soundRefs.current.get(sound as string);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  };
  
  // Zatrzymanie wszystkich dźwięków
  const stopAllSounds = (): void => {
    soundRefs.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  };
  
  return {
    enabled,
    setEnabled,
    volume,
    setVolume,
    playSound,
    playSoundWithOptions,
    stopSound,
    stopAllSounds,
    soundsPreloaded,
    availableSounds,
    addCustomSound
  };
};
