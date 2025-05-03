
import { useState, useEffect, useRef } from 'react';
import { SoundEffect } from '@/types/game-types';
import { toast } from 'sonner';

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
  const [soundsPreloaded, setSoundsPreloaded] = useState(false);
  const fallbacksCreated = useRef<Record<string, boolean>>({});
  
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
    'powerup': '/sounds/powerup.mp3',
    'bonus': '/sounds/bonus.mp3',
    'fail': '/sounds/fail.mp3',
    'eliminate': '/sounds/eliminate.mp3'
  };
  
  // Create a simple fallback sound (beep)
  const createFallbackSound = (soundName: string) => {
    if (fallbacksCreated.current[soundName]) return;
    
    // Create a simple beep sound as fallback
    const beepCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = beepCtx.createOscillator();
    oscillator.type = 'sine';
    
    // Different frequencies for different sound types
    if (soundName === 'success' || soundName === 'powerup') {
      oscillator.frequency.value = 660; // Higher pitch for positive sounds
    } else if (soundName === 'failure' || soundName === 'fail' || soundName === 'eliminate') {
      oscillator.frequency.value = 330; // Lower pitch for negative sounds
    } else {
      oscillator.frequency.value = 440; // Medium pitch for neutral sounds
    }
    
    const gainNode = beepCtx.createGain();
    gainNode.gain.value = 0.1;
    oscillator.connect(gainNode);
    gainNode.connect(beepCtx.destination);
    
    const duration = 0.15;
    oscillator.start();
    oscillator.stop(beepCtx.currentTime + duration);
    
    fallbacksCreated.current[soundName] = true;
    
    // Log fallback creation once per session
    if (Object.keys(fallbacksCreated.current).length === 1) {
      console.info('Created fallback sound for missing sound effects');
    }
  };
  
  // Preload sound effects
  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create audio elements for each sound effect
    const preloadPromises = Object.entries(soundEffects).map(([name, url]) => {
      return new Promise<void>((resolve) => {
        const audio = new Audio();
        audio.preload = 'auto';
        
        audio.oncanplaythrough = () => {
          audioElements.current[name] = audio;
          resolve();
        };
        
        audio.onerror = () => {
          console.warn(`Failed to load sound effect "${name}" from ${url}`);
          // Instead of rejecting, resolve anyway but note that we'll
          // use a fallback sound later
          resolve();
        };
        
        audio.src = url;
        audio.load();
      });
    });
    
    Promise.allSettled(preloadPromises).then(() => {
      setSoundsPreloaded(true);
    });
    
    // Cleanup
    return () => {
      // Stop and remove all audio elements
      Object.values(audioElements.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioElements.current = {};
      audioContext.close().catch(console.error);
    };
  }, []);
  
  // Play a sound effect
  const playSound = (sound: SoundEffect, customVolume?: number) => {
    if (!enabled) return;
    
    try {
      // Get audio element for this sound
      let audio = audioElements.current[sound];
      
      // If not preloaded or failed to load, use fallback
      if (!audio) {
        createFallbackSound(sound);
        const url = soundEffects[sound] || '';
        
        // Try loading again
        audio = new Audio(url);
        audioElements.current[sound] = audio;
      }
      
      // Reset audio to start
      if (!audio.error) {
        audio.currentTime = 0;
        
        // Set volume
        const effectiveVolume = customVolume !== undefined ? customVolume : volume;
        audio.volume = Math.min(1, Math.max(0, effectiveVolume));
        
        // Play the sound and handle autoplay restrictions
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(err => {
            console.warn(`Failed to play sound effect "${sound}":`, err);
            // Handle autoplay restrictions
            if (err.name === 'NotAllowedError') {
              toast.error('Twoja przeglądarka blokuje automatyczne odtwarzanie dźwięku', {
                description: 'Kliknij gdziekolwiek na stronie, aby odblokować dźwięki'
              });
              
              // Add one-time click listener to enable audio
              const enableAudio = () => {
                audio.play().catch(e => console.error('Still cannot play audio:', e));
                document.removeEventListener('click', enableAudio);
              };
              document.addEventListener('click', enableAudio, { once: true });
            }
          });
        }
      } else {
        // Audio element has error - use fallback sound
        createFallbackSound(sound);
      }
    } catch (error) {
      console.error(`Error playing sound effect "${sound}":`, error);
      createFallbackSound(sound);
    }
  };
  
  // Play a sound with options
  const playSoundWithOptions = (sound: SoundEffect, options: SoundOptions = {}) => {
    if (!enabled) return null;
    
    try {
      // Get audio element for this sound
      let audio = audioElements.current[sound];
      
      // If not preloaded or failed to load, use fallback
      if (!audio || audio.error) {
        createFallbackSound(sound);
        
        const url = soundEffects[sound] || '';
        if (!url) {
          console.warn(`Sound effect "${sound}" not found`);
          return null;
        }
        
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
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(err => {
          console.warn(`Failed to play sound effect "${sound}":`, err);
          // Same autoplay handling as in playSound
          createFallbackSound(sound);
        });
      }
      
      // Return the audio element for further control (e.g., stopping a looped sound)
      return audio;
    } catch (error) {
      console.error(`Error playing sound effect "${sound}":`, error);
      createFallbackSound(sound);
      return null;
    }
  };
  
  // Add a custom sound effect
  const addCustomSound = (name: string, soundUrl: string | File): boolean => {
    try {
      if (soundEffects[name as SoundEffect]) {
        console.warn(`Sound effect "${name}" already exists, overwriting`);
      }
      
      let url = '';
      if (typeof soundUrl === 'string') {
        url = soundUrl;
      } else {
        // Create object URL for File
        url = URL.createObjectURL(soundUrl);
      }
      
      // Add to sound effects map
      (soundEffects as any)[name] = url;
      
      // Preload the sound
      const audio = new Audio(url);
      audio.preload = 'auto';
      audioElements.current[name] = audio;
      
      return true;
    } catch (error) {
      console.error(`Error adding custom sound "${name}":`, error);
      return false;
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
    
    // Update volume for all currently loaded audio elements
    Object.values(audioElements.current).forEach(audio => {
      audio.volume = clampedVolume;
    });
    
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
    setVolume: setGlobalVolume,
    soundsPreloaded,
    addCustomSound,
    availableSounds: Object.keys(soundEffects)
  };
};
