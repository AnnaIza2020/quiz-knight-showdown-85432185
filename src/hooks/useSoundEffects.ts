
import { useState } from 'react';

export const useSoundEffects = () => {
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [availableSounds, setAvailableSounds] = useState<any[]>([]);

  const playSound = (sound: string, volume?: number) => {
    if (!soundsEnabled) return;
    console.log(`Playing sound: ${sound} at volume ${volume || 0.7}`);
  };

  const stopSound = (sound: string) => {
    console.log(`Stopping sound: ${sound}`);
  };

  const stopAllSounds = () => {
    console.log('Stopping all sounds');
  };

  const addCustomSound = (sound: any) => {
    setAvailableSounds(prev => [...prev, sound]);
  };

  return {
    playSound,
    stopSound,
    stopAllSounds,
    soundsEnabled,
    setSoundsEnabled,
    volume,
    setVolume,
    availableSounds,
    addCustomSound
  };
};
