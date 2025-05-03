
import { useState, useEffect, useRef, useCallback } from 'react';
import { SoundEffect } from '@/types/game-types';
import { toast } from 'sonner';

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

interface SoundStatus {
  loaded: boolean;
  error: boolean;
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
  const [soundStatus, setSoundStatus] = useState<Record<string, SoundStatus>>({});
  
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
    'card-reveal': '/sounds/card-reveal.mp3',
    'damage': '/sounds/damage.mp3', // Nowy dźwięk
    'powerup': '/sounds/powerup.mp3' // Nowy dźwięk
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
  const addCustomSound = (name: string, url: string | File): void => {
    try {
      // Jeśli to plik, zamień go na URL
      let soundUrl = typeof url === 'string' ? url : '';
      
      if (url instanceof File) {
        soundUrl = URL.createObjectURL(url);
      }
      
      setCustomSounds((prev) => {
        const updatedSounds = { ...prev, [name]: soundUrl };
        if (useLocalStorage) {
          localStorage.setItem('customSounds', JSON.stringify(updatedSounds));
        }
        return updatedSounds;
      });
      
      // Preload the sound
      preloadSound(name, soundUrl);
      return;
    } catch (error) {
      console.error('Błąd podczas dodawania dźwięku:', error);
      toast.error('Nie udało się dodać dźwięku');
      return;
    }
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
  const preloadSound = useCallback((id: string, url: string) => {
    if (!soundRefs.current.has(id)) {
      const audio = new Audio();
      
      // Obsługa błędów
      audio.onerror = () => {
        console.warn(`Nie można załadować dźwięku: ${id}`);
        setSoundStatus(prev => ({
          ...prev,
          [id]: { loaded: false, error: true }
        }));
      };
      
      audio.oncanplaythrough = () => {
        setSoundStatus(prev => ({
          ...prev,
          [id]: { loaded: true, error: false }
        }));
      };
      
      audio.preload = 'auto';
      audio.src = url;
      soundRefs.current.set(id, audio);
      
      // Preload attempt
      audio.load();
    }
  }, []);
  
  // Znajdź pierwszy dostępny dźwięk jako fallback
  const getFallbackSound = useCallback(() => {
    for (const [id, status] of Object.entries(soundStatus)) {
      if (status.loaded && !status.error) {
        return id;
      }
    }
    return null;
  }, [soundStatus]);
  
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
  }, [preloadSound, customSounds, defaultSounds]);
  
  // Odtwarzanie dźwięku z obsługą błędów i fallbackiem
  const playSound = useCallback((sound: SoundEffect, customVolume?: number): void => {
    if (!enabled) return;
    
    // Get the URL for the sound
    const soundUrl = availableSounds[sound];
    if (!soundUrl) {
      console.warn(`Dźwięk nie znaleziony: ${sound}`);
      return;
    }
    
    try {
      // Check if we have a preloaded audio element
      let audio = soundRefs.current.get(sound as string);
      const soundHasError = soundStatus[sound as string]?.error;
      
      // Jeśli dźwięk ma błąd, użyj fallbacku
      if (soundHasError) {
        const fallbackId = getFallbackSound();
        if (fallbackId) {
          console.warn(`Używam dźwięku zastępczego dla: ${sound}`);
          audio = soundRefs.current.get(fallbackId);
        } else {
          console.error('Brak dostępnych dźwięków zastępczych');
          return;
        }
      }
      
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
        console.warn(`Błąd odtwarzania dźwięku ${sound}:`, err);
        
        // Spróbuj fallback jeśli podstawowy dźwięk nie działa
        if (!soundHasError) {
          const fallbackId = getFallbackSound();
          if (fallbackId && fallbackId !== sound) {
            const fallbackAudio = soundRefs.current.get(fallbackId);
            if (fallbackAudio) {
              console.warn(`Próbuję dźwięk zastępczy: ${fallbackId}`);
              fallbackAudio.volume = customVolume !== undefined ? customVolume : volume;
              fallbackAudio.play().catch(e => {
                console.error(`Również nie można odtworzyć dźwięku zastępczego:`, e);
              });
            }
          }
        }
      });
    } catch (e) {
      console.warn(`Błąd obsługi dźwięku ${sound}:`, e);
    }
  }, [availableSounds, enabled, getFallbackSound, soundStatus, volume]);
  
  // Odtwarzanie dźwięku z dodatkowymi opcjami
  const playSoundWithOptions = useCallback((sound: SoundEffect, options: SoundEffectOptions = {}): void => {
    if (!enabled) return;
    
    const { volume: customVolume, loop = false, onEnd, playbackRate = 1 } = options;
    
    // Get the URL for the sound
    const soundUrl = availableSounds[sound];
    if (!soundUrl) {
      console.warn(`Dźwięk nie znaleziony: ${sound}`);
      return;
    }
    
    try {
      // Check if we have a preloaded audio element
      let audio = soundRefs.current.get(sound as string);
      const soundHasError = soundStatus[sound as string]?.error;
      
      // Jeśli dźwięk ma błąd, użyj fallbacku
      if (soundHasError) {
        const fallbackId = getFallbackSound();
        if (fallbackId) {
          console.warn(`Używam dźwięku zastępczego dla: ${sound}`);
          audio = soundRefs.current.get(fallbackId);
        } else {
          console.error('Brak dostępnych dźwięków zastępczych');
          return;
        }
      }
      
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
        console.warn(`Błąd odtwarzania dźwięku ${sound}:`, err);
        
        // Spróbuj fallback jeśli podstawowy dźwięk nie działa
        if (!soundHasError) {
          const fallbackId = getFallbackSound();
          if (fallbackId && fallbackId !== sound) {
            const fallbackAudio = soundRefs.current.get(fallbackId);
            if (fallbackAudio) {
              console.warn(`Próbuję dźwięk zastępczy: ${fallbackId}`);
              fallbackAudio.volume = customVolume !== undefined ? customVolume : volume;
              fallbackAudio.loop = loop;
              fallbackAudio.playbackRate = playbackRate;
              if (onEnd) fallbackAudio.onended = onEnd;
              
              fallbackAudio.play().catch(e => {
                console.error(`Również nie można odtworzyć dźwięku zastępczego:`, e);
              });
            }
          }
        }
      });
    } catch (e) {
      console.warn(`Błąd obsługi dźwięku ${sound}:`, e);
    }
  }, [availableSounds, enabled, getFallbackSound, soundStatus, volume]);
  
  // Zatrzymanie dźwięku
  const stopSound = useCallback((sound: SoundEffect): void => {
    const audio = soundRefs.current.get(sound as string);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, []);
  
  // Zatrzymanie wszystkich dźwięków
  const stopAllSounds = useCallback((): void => {
    soundRefs.current.forEach((audio) => {
      audio.pause();
      audio.currentTime = 0;
    });
  }, []);
  
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
    addCustomSound,
    soundStatus
  };
};
