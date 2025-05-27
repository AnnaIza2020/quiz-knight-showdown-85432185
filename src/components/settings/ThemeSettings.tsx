
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { useGameState } from '@/context/GameStateContext';
import SettingsLayout from '@/components/SettingsLayout';

const ThemeSettings: React.FC = () => {
  const { appSettings, updateAppSettings } = useGameState();
  const [localSettings, setLocalSettings] = useState(appSettings);

  const handleColorChange = (key: keyof typeof appSettings, value: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    updateAppSettings(localSettings);
  };

  return (
    <div className="space-y-6">
      <SettingsLayout 
        title="Kolory Dominujące" 
        description="Ustaw główne kolory interfejsu gry"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="primaryColor">Kolor Główny</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                id="primaryColor"
                type="color"
                value={localSettings.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="w-16 h-10"
              />
              <Input
                value={localSettings.primaryColor}
                onChange={(e) => handleColorChange('primaryColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="secondaryColor">Kolor Drugorzędny</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                id="secondaryColor"
                type="color"
                value={localSettings.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="w-16 h-10"
              />
              <Input
                value={localSettings.secondaryColor}
                onChange={(e) => handleColorChange('secondaryColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="accentColor">Kolor Akcentu</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                id="accentColor"
                type="color"
                value={localSettings.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="w-16 h-10"
              />
              <Input
                value={localSettings.accentColor}
                onChange={(e) => handleColorChange('accentColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="backgroundColor">Kolor Tła</Label>
            <div className="flex items-center gap-3 mt-2">
              <Input
                id="backgroundColor"
                type="color"
                value={localSettings.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="w-16 h-10"
              />
              <Input
                value={localSettings.backgroundColor}
                onChange={(e) => handleColorChange('backgroundColor', e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </SettingsLayout>

      <SettingsLayout 
        title="Czcionki i Typografia" 
        description="Wybierz czcionki dla różnych elementów interfejsu"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="fontFamily">Czcionka Główna</Label>
            <select
              id="fontFamily"
              value={localSettings.fontFamily}
              onChange={(e) => setLocalSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
              className="w-full p-2 bg-white/10 border border-white/20 rounded mt-2"
            >
              <option value="Montserrat">Montserrat</option>
              <option value="Inter">Inter</option>
              <option value="Roboto">Roboto</option>
              <option value="Open Sans">Open Sans</option>
            </select>
          </div>
        </div>
      </SettingsLayout>

      <SettingsLayout 
        title="Multimedia" 
        description="Ustawienia dźwięków i efektów"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Dźwięki Włączone</Label>
            <Switch
              checked={localSettings.soundsEnabled}
              onCheckedChange={(checked) => 
                setLocalSettings(prev => ({ ...prev, soundsEnabled: checked }))
              }
            />
          </div>
          
          <div>
            <Label>Głośność Główna ({Math.round(localSettings.volume * 100)}%)</Label>
            <Slider
              value={[localSettings.volume * 100]}
              onValueChange={([value]) => 
                setLocalSettings(prev => ({ ...prev, volume: value / 100 }))
              }
              max={100}
              step={5}
              className="mt-2"
              disabled={!localSettings.soundsEnabled}
            />
          </div>
        </div>
      </SettingsLayout>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-[#00FFA3] hover:bg-[#00FFA3]/80 text-black">
          Zastosuj Zmiany
        </Button>
      </div>
    </div>
  );
};

export default ThemeSettings;
