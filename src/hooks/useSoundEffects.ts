import { useEffect, useState, useCallback, useRef } from 'react';

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
  | 'card-reveal'
  | 'intro-music';

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
  'intro-music': '/sounds/intro-music.mp3', // New intro music
};

// Interface for useSoundEffects options
export interface UseSoundEffectsOptions {
  enabled?: boolean;
  defaultVolume?: number;
  useLocalStorage?: boolean; // Store enabled state in localStorage
}

// Interface for sound playback options
export interface PlaySoundOptions {
  volume?: number;
  loop?: boolean;
  onEnd?: () => void;
}

export const useSoundEffects = (options?: UseSoundEffectsOptions) => {
  // Get the saved state from localStorage if requested
  const getInitialState = () => {
    if (options?.useLocalStorage) {
      const savedState = localStorage.getItem('soundEffectsEnabled');
      return savedState !== null ? savedState === 'true' : options?.enabled ?? true;
    }
    return options?.enabled ?? true;
  };

  const [enabled, setEnabled] = useState<boolean>(getInitialState());
  const [audioElements, setAudioElements] = useState<Record<SoundEffect, HTMLAudioElement | null>>({} as Record<SoundEffect, HTMLAudioElement | null>);
  const defaultVolume = options?.defaultVolume ?? 1.0;
  
  // Keep track of currently playing sounds
  const playingRef = useRef<Record<SoundEffect, boolean>>({} as Record<SoundEffect, boolean>);

  // Initialize audio elements on component mount
  useEffect(() => {
    if (typeof Audio === 'undefined') return;
    
    const audioMap: Record<SoundEffect, HTMLAudioElement> = {} as Record<SoundEffect, HTMLAudioElement>;
    
    (Object.keys(SOUND_PATHS) as SoundEffect[]).forEach(effect => {
      const audio = new Audio(SOUND_PATHS[effect]);
      audioMap[effect] = audio;
      playingRef.current[effect] = false;
    });
    
    setAudioElements(audioMap);
    
    // Cleanup on unmount
    return () => {
      Object.values(audioMap).forEach(audio => {
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
      });
    };
  }, []);

  // Save enabled state to localStorage when it changes
  useEffect(() => {
    if (options?.useLocalStorage) {
      localStorage.setItem('soundEffectsEnabled', enabled.toString());
    }
  }, [enabled, options?.useLocalStorage]);

  // Play a sound effect
  const playSound = useCallback((sound: SoundEffect, optionsOrVolume?: PlaySoundOptions | number) => {
    if (!enabled) return;

    const audio = audioElements[sound];
    if (!audio) return;
    
    // Handle different forms of options
    let volume = defaultVolume;
    let loop = false;
    let onEnd: (() => void) | undefined;
    
    if (typeof optionsOrVolume === 'number') {
      volume = optionsOrVolume;
    } else if (optionsOrVolume) {
      volume = optionsOrVolume.volume ?? defaultVolume;
      loop = optionsOrVolume.loop ?? false;
      onEnd = optionsOrVolume.onEnd;
    }

    // Reset and configure
    audio.pause();
    audio.currentTime = 0;
    audio.volume = volume;
    audio.loop = loop;
    
    if (onEnd) {
      const handleEnded = () => {
        onEnd?.();
        audio.removeEventListener('ended', handleEnded);
        playingRef.current[sound] = false;
      };
      audio.addEventListener('ended', handleEnded);
    } else {
      audio.onended = () => {
        playingRef.current[sound] = false;
      };
    }
    
    // Play and catch errors silently (common in browsers before user interaction)
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playingRef.current[sound] = true;
      playPromise.catch(error => {
        console.info('Audio play prevented by browser:', error);
        playingRef.current[sound] = false;
      });
    }
    
    return {
      stop: () => {
        audio.pause();
        audio.currentTime = 0;
        playingRef.current[sound] = false;
      },
      pause: () => {
        audio.pause();
        playingRef.current[sound] = false;
      },
      resume: () => {
        if (enabled) {
          audio.play().catch(console.error);
          playingRef.current[sound] = true;
        }
      },
      isPlaying: () => playingRef.current[sound]
    };
  }, [audioElements, enabled, defaultVolume]);

  // Stop a specific sound if it's playing
  const stopSound = useCallback((sound: SoundEffect) => {
    const audio = audioElements[sound];
    if (!audio) return;
    
    audio.pause();
    audio.currentTime = 0;
    playingRef.current[sound] = false;
  }, [audioElements]);

  // Stop all currently playing sounds
  const stopAllSounds = useCallback(() => {
    Object.entries(audioElements).forEach(([sound, audio]) => {
      if (!audio || !playingRef.current[sound as SoundEffect]) return;
      audio.pause();
      audio.currentTime = 0;
      playingRef.current[sound as SoundEffect] = false;
    });
  }, [audioElements]);

  return {
    playSound,
    stopSound,
    stopAllSounds,
    enabled,
    setEnabled
  };
};
