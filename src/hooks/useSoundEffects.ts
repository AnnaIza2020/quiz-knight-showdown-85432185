
import { useCallback, useState } from 'react';
import { SoundEffect } from '@/types/game-types';

export function useSoundEffects() {
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [volume, setVolume] = useState(1);
  const [soundStatus, setSoundStatus] = useState<Record<string, any>>({});
  const [availableSounds] = useState<SoundEffect[]>([
    'success', 'fail', 'failure', 'bonus', 'card-reveal', 'eliminate',
    'intro-music', 'narrator', 'round-start', 'timeout', 'victory',
    'wheel-tick', 'wheel-spin', 'click', 'damage', 'powerup'
  ]);
  
  const playSound = useCallback((sound: SoundEffect, soundVolume?: number) => {
    if (!soundsEnabled) return;
    
    try {
      // Create and play the sound
      const audioElement = new Audio(`/sounds/${sound}.mp3`);
      audioElement.volume = soundVolume || volume;
      audioElement.play().catch(error => {
        console.warn(`Failed to play sound ${sound}:`, error);
      });
      
      // Update sound status
      setSoundStatus(prev => ({
        ...prev,
        [sound]: { playing: true, startTime: Date.now() }
      }));
      
      // Reset status when sound ends
      audioElement.onended = () => {
        setSoundStatus(prev => ({
          ...prev,
          [sound]: { playing: false, endTime: Date.now() }
        }));
      };
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }, [soundsEnabled, volume]);
  
  const stopSound = useCallback((sound: SoundEffect) => {
    // This is a simplified implementation
    console.log(`Stopping sound: ${sound}`);
    
    // Update status
    setSoundStatus(prev => ({
      ...prev,
      [sound]: { playing: false, stoppedTime: Date.now() }
    }));
  }, []);
  
  const stopAllSounds = useCallback(() => {
    // In a real implementation, we would stop all audio elements
    console.log('Stopping all sounds');
    
    // Update all statuses
    setSoundStatus({});
  }, []);
  
  const playSoundWithOptions = useCallback((sound: SoundEffect, options: any) => {
    playSound(sound, options?.volume);
  }, [playSound]);
  
  const addCustomSound = useCallback((name: string, url: string) => {
    console.log(`Adding custom sound: ${name} at ${url}`);
    // In a real implementation, we would add this to the available sounds
  }, []);
  
  return {
    playSound,
    stopSound,
    stopAllSounds,
    soundsEnabled,
    setSoundsEnabled,
    volume,
    setVolume,
    playSoundWithOptions,
    soundStatus,
    availableSounds,
    addCustomSound
  };
}
