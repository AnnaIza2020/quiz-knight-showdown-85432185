
import { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import { SoundEffect } from '@/types/game-types';

interface SoundManagementOptions {
  initialVolume?: number;
  initialEnabled?: boolean;
}

export const useSoundManagement = (options?: SoundManagementOptions) => {
  const {
    playSound,
    setEnabled,
    volume = 0.5,
    setVolume,
    availableSounds = {},
    addCustomSound
  } = useGameContext();
  
  const [soundsEnabled, setSoundsEnabled] = useState(options?.initialEnabled ?? true);
  const [volumeLevel, setVolumeLevel] = useState(Math.round((options?.initialVolume || volume) * 100));
  
  // Sync with context
  useEffect(() => {
    setVolumeLevel(Math.round(volume * 100));
  }, [volume]);
  
  // Update volume in context when slider changes
  useEffect(() => {
    setVolume?.(volumeLevel / 100);
  }, [volumeLevel, setVolume]);
  
  // Update enabled state in context
  useEffect(() => {
    setEnabled?.(soundsEnabled);
  }, [soundsEnabled, setEnabled]);
  
  const handleSoundsToggle = (enabled: boolean) => {
    setSoundsEnabled(enabled);
    toast.info(enabled ? 'Dźwięki włączone' : 'Dźwięki wyciszone');
  };
  
  const handleVolumeChange = (value: number) => {
    setVolumeLevel(value);
  };
  
  const testSound = (soundId: string) => {
    if (playSound && soundsEnabled) {
      playSound(soundId as SoundEffect);
    }
  };
  
  const addSound = (name: string, file: File): boolean => {
    if (!addCustomSound) {
      toast.error('Nie można dodać dźwięku', {
        description: 'Funkcja dodawania dźwięków nie jest dostępna'
      });
      return false;
    }
    
    return addCustomSound(name, file);
  };
  
  return {
    soundsEnabled,
    setSoundsEnabled: handleSoundsToggle,
    volumeLevel,
    setVolumeLevel: handleVolumeChange,
    availableSounds,
    testSound,
    addSound,
    playSound: (sound: SoundEffect) => playSound?.(sound)
  };
};
