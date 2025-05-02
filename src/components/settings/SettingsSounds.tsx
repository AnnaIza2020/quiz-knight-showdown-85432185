
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Play, RefreshCcw, Download } from 'lucide-react';

const SettingsSounds = () => {
  const { playSound } = useGameContext();
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [volumeLevel, setVolumeLevel] = useState(50);
  
  // Sound type definitions - matching the ones provided in useSoundEffects
  const gameSounds = [
    { id: 'timer', name: 'Timer', description: 'Dźwięk odliczania czasu' },
    { id: 'success', name: 'Poprawna odpowiedź', description: 'Dźwięk dla poprawnej odpowiedzi' },
    { id: 'fail', name: 'Błędna odpowiedź', description: 'Dźwięk dla błędnej odpowiedzi' },
    { id: 'round-start', name: 'Początek rundy', description: 'Dźwięk rozpoczęcia rundy' },
    { id: 'round-end', name: 'Koniec rundy', description: 'Dźwięk zakończenia rundy' },
    { id: 'card-reveal', name: 'Użycie karty', description: 'Dźwięk użycia karty specjalnej' },
    { id: 'wheel-tick', name: 'Koło fortuny', description: 'Dźwięk obracającego się koła fortuny' },
    { id: 'buzzer', name: 'Buzzer', description: 'Dźwięk buzzera' },
    { id: 'victory', name: 'Zwycięzca', description: 'Dźwięk ogłoszenia zwycięzcy' },
    { id: 'timeout', name: 'Pytanie', description: 'Dźwięk wyświetlenia nowego pytania' },
  ];
  
  const handleTestSound = (soundId: string) => {
    playSound(soundId as any);
  };
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-6 text-white">Zarządzanie dźwiękami</h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-4">Ustawienia globalne</h3>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Switch 
              checked={soundsEnabled} 
              onCheckedChange={setSoundsEnabled} 
              id="sound-toggle"
            />
            <Label htmlFor="sound-toggle">Dźwięki włączone</Label>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="volume-slider">Głośność:</Label>
            <span className="text-white">{volumeLevel}%</span>
          </div>
          <Slider
            id="volume-slider"
            min={0}
            max={100}
            step={1}
            value={[volumeLevel]}
            onValueChange={([value]) => setVolumeLevel(value)}
            className="w-full"
          />
        </div>
        
        <Button 
          variant="outline" 
          className="mt-4 border-gray-700 text-white"
          onClick={() => {
            setSoundsEnabled(true);
            setVolumeLevel(50);
          }}
        >
          <RefreshCcw size={16} className="mr-2" /> Resetuj wszystkie dźwięki
        </Button>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Dźwięki gry</h3>
        <div className="space-y-4">
          {gameSounds.map((sound) => (
            <div 
              key={sound.id}
              className="flex items-center justify-between p-3 bg-black/30 border border-gray-800 rounded"
            >
              <div>
                <h4 className="font-medium">{sound.name}</h4>
                <p className="text-sm text-white/60">{sound.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 px-3 border-gray-700"
                  onClick={() => handleTestSound(sound.id)}
                >
                  <Play size={16} className="mr-1" /> Test
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 px-3 border-gray-700"
                >
                  <RefreshCcw size={16} className="mr-1" /> Reset
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 px-3 border-gray-700"
                >
                  <Download size={16} className="mr-1" /> Zmień
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-black/20 rounded border border-gray-700">
        <h3 className="text-lg font-semibold mb-2">Wskazówki</h3>
        <ul className="space-y-2 text-sm text-white/80">
          <li className="flex items-start gap-2">
            <span className="text-neon-purple">•</span>
            <span>Wszystkie dźwięki są zapisywane lokalnie w przeglądarce.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neon-purple">•</span>
            <span>Zalecane formaty plików: MP3, WAV, OGG.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neon-purple">•</span>
            <span>Maksymalny rozmiar pliku: 2MB.</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-neon-purple">•</span>
            <span>Dla najlepszej kompatybilności, używaj krótkich dźwięków (poniżej 5 sekund).</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default SettingsSounds;
