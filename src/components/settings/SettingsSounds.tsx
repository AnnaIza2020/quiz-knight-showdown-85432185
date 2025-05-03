import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Play, RefreshCcw, Download, Upload, X, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useSoundManagement } from '@/hooks/useSoundManagement';
import SettingsLayout from './SettingsLayout';

const SettingsSounds = () => {
  const { 
    soundsEnabled, 
    setSoundsEnabled, 
    volumeLevel, 
    setVolumeLevel, 
    availableSounds, 
    testSound, 
    addSound 
  } = useSoundManagement({ initialEnabled: true });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [customSoundName, setCustomSoundName] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Sound type definitions - matching the ones provided in useSoundEffects
  const gameSounds = [
    { id: 'success', name: 'Poprawna odpowiedź', description: 'Dźwięk dla poprawnej odpowiedzi' },
    { id: 'fail', name: 'Błędna odpowiedź', description: 'Dźwięk dla błędnej odpowiedzi' },
    { id: 'round-start', name: 'Początek rundy', description: 'Dźwięk rozpoczęcia rundy' },
    { id: 'timeout', name: 'Koniec czasu', description: 'Dźwięk zakończenia odliczania' },
    { id: 'card-reveal', name: 'Użycie karty', description: 'Dźwięk użycia karty specjalnej' },
    { id: 'wheel-tick', name: 'Koło fortuny', description: 'Dźwięk obracającego się koła fortuny' },
    { id: 'wheel-spin', name: 'Obrót koła', description: 'Dźwięk pełnego obrotu koła' },
    { id: 'victory', name: 'Zwycięzca', description: 'Dźwięk ogłoszenia zwycięzcy' },
    { id: 'eliminate', name: 'Eliminacja', description: 'Dźwięk eliminacji gracza' },
    { id: 'damage', name: 'Obrażenia', description: 'Dźwięk otrzymania obrażeń' },
    { id: 'powerup', name: 'Power-up', description: 'Dźwięk zdobycia wzmocnienia' },
    { id: 'bonus', name: 'Bonus', description: 'Dźwięk zdobycia bonusu' },
  ];
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Validate file type
      if (!file.type.startsWith('audio/')) {
        toast.error('Nieprawidłowy format pliku', {
          description: 'Proszę wybrać plik dźwiękowy (mp3, wav, ogg)'
        });
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Plik jest za duży', {
          description: 'Maksymalny rozmiar pliku to 2MB'
        });
        return;
      }
      
      setSelectedFile(file);
      
      // Extract filename without extension as suggested name
      const fileName = file.name.replace(/\.[^/.]+$/, '');
      setCustomSoundName(fileName);
    }
  };
  
  const handleAddCustomSound = () => {
    if (!selectedFile || !customSoundName.trim()) {
      toast.error('Brakujące dane', {
        description: 'Wybierz plik dźwiękowy i podaj nazwę'
      });
      return;
    }
    
    // Add custom sound
    const success = addSound(customSoundName, selectedFile);
    
    if (success) {
      toast.success('Dodano nowy dźwięk', {
        description: `Dźwięk "${customSoundName}" został dodany`
      });
      
      // Reset form
      setSelectedFile(null);
      setCustomSoundName('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } else {
      toast.error('Nie udało się dodać dźwięku', {
        description: 'Spróbuj ponownie z innym plikiem'
      });
    }
  };
  
  const clearFileSelection = () => {
    setSelectedFile(null);
    setCustomSoundName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  return (
    <SettingsLayout 
      title="Zarządzanie dźwiękami"
      description="Dodawaj, modyfikuj i zarządzaj efektami dźwiękowymi w grze."
    >
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
            disabled={!soundsEnabled}
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
      
      {/* Add custom sound section */}
      <div className="mb-8 p-4 bg-black/20 border border-gray-800 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Dodaj własny dźwięk</h3>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="custom-sound-name">Nazwa dźwięku</Label>
            <Input 
              id="custom-sound-name"
              value={customSoundName}
              onChange={(e) => setCustomSoundName(e.target.value)}
              placeholder="np. Fanfary, Alarm, itp."
              className="bg-black/30 mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="sound-file">Plik dźwiękowy</Label>
            <div className="flex gap-2 mt-1">
              <input
                type="file"
                id="sound-file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="audio/*"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1"
              >
                <Upload size={16} className="mr-2" />
                {selectedFile ? selectedFile.name : 'Wybierz plik...'}
              </Button>
              {selectedFile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={clearFileSelection}
                >
                  <X size={18} />
                </Button>
              )}
            </div>
            <p className="text-xs text-white/50 mt-1">
              Obsługiwane formaty: MP3, WAV, OGG (max 2MB)
            </p>
          </div>
          
          <Button
            onClick={handleAddCustomSound}
            disabled={!selectedFile || !customSoundName.trim()}
            className="w-full"
          >
            <Plus size={16} className="mr-2" /> Dodaj nowy dźwięk
          </Button>
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Dźwięki gry</h3>
        <div className="space-y-4">
          {gameSounds.map((sound) => (
            <div 
              key={sound.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-3 bg-black/30 border border-gray-800 rounded gap-3"
            >
              <div>
                <h4 className="font-medium">{sound.name}</h4>
                <p className="text-sm text-white/60">{sound.description}</p>
              </div>
              <div className="flex items-center gap-2 mt-2 md:mt-0">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 px-3 border-gray-700"
                  onClick={() => testSound(sound.id)}
                  disabled={!soundsEnabled}
                >
                  <Play size={16} className="mr-1" /> Test
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="h-9 px-3 border-gray-700"
                >
                  <Upload size={16} className="mr-1" /> Zmień
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
    </SettingsLayout>
  );
};

export default SettingsSounds;
