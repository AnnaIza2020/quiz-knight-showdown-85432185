
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Play, Upload, Volume2 } from 'lucide-react';
import SettingsLayout from '@/components/SettingsLayout';
import { toast } from 'sonner';

interface SoundSettings {
  enabled: boolean;
  masterVolume: number;
  sounds: {
    [key: string]: {
      url: string;
      volume: number;
      enabled: boolean;
    };
  };
}

const SettingsSounds: React.FC = () => {
  const [soundSettings, setSoundSettings] = useState<SoundSettings>({
    enabled: true,
    masterVolume: 70,
    sounds: {
      intro: { url: '/sounds/intro-music.mp3', volume: 80, enabled: true },
      success: { url: '/sounds/success.mp3', volume: 60, enabled: true },
      fail: { url: '/sounds/fail.mp3', volume: 60, enabled: true },
      timeout: { url: '/sounds/timeout.mp3', volume: 70, enabled: true },
      roundStart: { url: '/sounds/round-start.mp3', volume: 75, enabled: true },
      victory: { url: '/sounds/victory.mp3', volume: 85, enabled: true },
      eliminate: { url: '/sounds/eliminate.mp3', volume: 65, enabled: true },
      wheelTick: { url: '/sounds/wheel-tick.mp3', volume: 40, enabled: true },
      cardReveal: { url: '/sounds/card-reveal.mp3', volume: 55, enabled: true },
      bonus: { url: '/sounds/bonus.mp3', volume: 60, enabled: true }
    }
  });

  const soundLabels = {
    intro: 'Muzyka Intro',
    success: 'Poprawna Odpowiedź',
    fail: 'Błędna Odpowiedź',
    timeout: 'Koniec Czasu',
    roundStart: 'Start Rundy',
    victory: 'Zwycięstwo',
    eliminate: 'Eliminacja',
    wheelTick: 'Kręcenie Koła',
    cardReveal: 'Odkrycie Karty',
    bonus: 'Bonus/Efekt'
  };

  const playSound = (soundKey: string) => {
    if (!soundSettings.enabled || !soundSettings.sounds[soundKey]?.enabled) return;
    
    const audio = new Audio(soundSettings.sounds[soundKey].url);
    audio.volume = (soundSettings.masterVolume / 100) * (soundSettings.sounds[soundKey].volume / 100);
    audio.play().catch(() => {
      toast.error(`Nie można odtworzyć dźwięku: ${soundLabels[soundKey]}`);
    });
  };

  const updateSoundUrl = (soundKey: string, url: string) => {
    setSoundSettings(prev => ({
      ...prev,
      sounds: {
        ...prev.sounds,
        [soundKey]: {
          ...prev.sounds[soundKey],
          url
        }
      }
    }));
  };

  const updateSoundVolume = (soundKey: string, volume: number) => {
    setSoundSettings(prev => ({
      ...prev,
      sounds: {
        ...prev.sounds,
        [soundKey]: {
          ...prev.sounds[soundKey],
          volume
        }
      }
    }));
  };

  const toggleSound = (soundKey: string) => {
    setSoundSettings(prev => ({
      ...prev,
      sounds: {
        ...prev.sounds,
        [soundKey]: {
          ...prev.sounds[soundKey],
          enabled: !prev.sounds[soundKey].enabled
        }
      }
    }));
  };

  return (
    <div className="space-y-6">
      <SettingsLayout 
        title="Ustawienia Główne" 
        description="Globalne ustawienia dźwięku w aplikacji"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Dźwięki Włączone</Label>
            <Switch
              checked={soundSettings.enabled}
              onCheckedChange={(checked) => 
                setSoundSettings(prev => ({ ...prev, enabled: checked }))
              }
            />
          </div>
          
          <div>
            <Label>Głośność Główna ({soundSettings.masterVolume}%)</Label>
            <div className="flex items-center gap-4 mt-2">
              <Volume2 className="w-4 h-4 text-gray-400" />
              <Slider
                value={[soundSettings.masterVolume]}
                onValueChange={([value]) => 
                  setSoundSettings(prev => ({ ...prev, masterVolume: value }))
                }
                max={100}
                step={5}
                className="flex-1"
                disabled={!soundSettings.enabled}
              />
            </div>
          </div>
        </div>
      </SettingsLayout>

      <SettingsLayout 
        title="Dźwięki Systemowe" 
        description="Konfiguracja poszczególnych dźwięków w grze"
      >
        <div className="space-y-6">
          {Object.entries(soundSettings.sounds).map(([soundKey, sound]) => (
            <div key={soundKey} className="bg-white/5 border border-white/10 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-lg font-semibold">
                  {soundLabels[soundKey]}
                </Label>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={sound.enabled}
                    onCheckedChange={() => toggleSound(soundKey)}
                    disabled={!soundSettings.enabled}
                  />
                  <Button
                    size="sm"
                    onClick={() => playSound(soundKey)}
                    disabled={!soundSettings.enabled || !sound.enabled}
                    className="px-3"
                  >
                    <Play className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label className="text-sm">URL Pliku</Label>
                  <div className="flex gap-2 mt-1">
                    <Input
                      value={sound.url}
                      onChange={(e) => updateSoundUrl(soundKey, e.target.value)}
                      placeholder="https://example.com/sound.mp3"
                      className="flex-1"
                      disabled={!soundSettings.enabled}
                    />
                    <Button size="sm" variant="outline" disabled={!soundSettings.enabled}>
                      <Upload className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
                
                <div>
                  <Label className="text-sm">Głośność ({sound.volume}%)</Label>
                  <Slider
                    value={[sound.volume]}
                    onValueChange={([value]) => updateSoundVolume(soundKey, value)}
                    max={100}
                    step={5}
                    className="mt-1"
                    disabled={!soundSettings.enabled || !sound.enabled}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SettingsLayout>

      <div className="flex justify-end">
        <Button className="bg-[#00FFA3] hover:bg-[#00FFA3]/80 text-black">
          Zapisz Ustawienia Dźwięku
        </Button>
      </div>
    </div>
  );
};

export default SettingsSounds;
