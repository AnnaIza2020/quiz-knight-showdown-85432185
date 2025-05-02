
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, Upload } from 'lucide-react';

interface ThemeOption {
  id: string;
  name: string;
  primaryColor: string;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
}

const SettingsThemes = () => {
  const { primaryColor, secondaryColor, setPrimaryColor, setSecondaryColor, setGameLogo } = useGameContext();
  
  const [selectedTheme, setSelectedTheme] = useState<string | null>("default");
  const [customTheme, setCustomTheme] = useState({
    name: "Custom Theme",
    primaryColor: primaryColor || "#9b87f5",
    backgroundColor: secondaryColor || "#1A1F2C",
    cardColor: "#203748",
    textColor: "#FFFFFF",
  });

  const themes: ThemeOption[] = [
    {
      id: "default",
      name: "Default",
      primaryColor: "#9b87f5",
      buttonColor: "#9b87f5",
      backgroundColor: "#1A1F2C",
      textColor: "#FFFFFF",
    },
    {
      id: "cyberpunk",
      name: "Cyberpunk",
      primaryColor: "#00FFF7",
      buttonColor: "#00FFF7",
      backgroundColor: "#141421",
      textColor: "#00FFF7",
    },
    {
      id: "retrowave",
      name: "RetroWave",
      primaryColor: "#FF00FF",
      buttonColor: "#FF00FF",
      backgroundColor: "#120634",
      textColor: "#FF00FF",
    },
    {
      id: "classicTV",
      name: "Classic TV",
      primaryColor: "#FFD700",
      buttonColor: "#FFD700",
      backgroundColor: "#191919",
      textColor: "#FFFFFF",
    },
    {
      id: "neon",
      name: "Neon",
      primaryColor: "#39FF14",
      buttonColor: "#39FF14",
      backgroundColor: "#0D0D0D",
      textColor: "#FFFFFF",
    },
  ];

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    
    const theme = themes.find(t => t.id === themeId);
    if (theme) {
      setPrimaryColor(theme.primaryColor);
      setSecondaryColor(theme.backgroundColor);
    }
  };

  const handleCustomThemeChange = (field: string, value: string) => {
    setCustomTheme(prev => ({ ...prev, [field]: value }));
  };

  const applyCustomTheme = () => {
    setPrimaryColor(customTheme.primaryColor);
    setSecondaryColor(customTheme.backgroundColor);
  };
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <h2 className="text-xl font-bold mb-2 text-white">Motywy i Style</h2>
      <p className="text-white/60 text-sm mb-6">
        Tu zmienisz wygląd sceny, motywy i efekty.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Predefined themes */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Gotowe motywy</h3>
          <div className="grid grid-cols-2 gap-4">
            {themes.map((theme) => (
              <div
                key={theme.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  selectedTheme === theme.id 
                    ? 'border-2 border-white shadow-lg' 
                    : 'border-gray-700 hover:border-gray-500'
                }`}
                style={{ backgroundColor: theme.backgroundColor }}
                onClick={() => handleThemeSelect(theme.id)}
              >
                <div 
                  className="absolute top-2 right-2 w-4 h-4 rounded-full"
                  style={{ 
                    backgroundColor: theme.primaryColor,
                    boxShadow: selectedTheme === theme.id ? `0 0 8px 2px ${theme.primaryColor}` : 'none' 
                  }}
                />
                <h4 
                  className="font-medium mb-2" 
                  style={{ color: theme.textColor }}
                >
                  {theme.name}
                </h4>
                <p style={{ color: theme.textColor }}>Przykładowy tekst</p>
                <div 
                  className="mt-2 text-center py-1 rounded-md text-sm"
                  style={{ backgroundColor: theme.buttonColor, color: theme.backgroundColor }}
                >
                  Przycisk
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Podgląd na żywo</h3>
            <div className="border border-gray-700 rounded-lg p-4 bg-black/30">
              <div className="text-center" style={{ color: primaryColor }}>
                <h4 className="text-xl font-bold mb-2">QUIZ SHOW</h4>
                
                <div className="bg-black/40 rounded-lg p-4 mt-4 mb-2">
                  <p className="text-white">Przykładowe pytanie</p>
                  <p className="text-sm text-white/70">W którym roku miała miejsce bitwa pod Grunwaldem?</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-black/60 rounded text-white p-2">1410</div>
                    <div className="bg-black/60 rounded text-white p-2">1492</div>
                    <div className="bg-black/60 rounded text-white p-2">1385</div>
                    <div className="bg-black/60 rounded text-white p-2">1505</div>
                  </div>
                </div>
                
                <div className="flex justify-between mt-4">
                  <Button variant="outline" size="sm" className="border-gray-700">
                    Eksportuj motyw
                  </Button>
                  <Button variant="outline" size="sm" className="border-gray-700">
                    Importuj motyw
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Custom theme settings */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Dostosuj motyw</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="theme-name">Nazwa motywu</Label>
              <Input
                id="theme-name"
                value={customTheme.name}
                onChange={(e) => handleCustomThemeChange('name', e.target.value)}
                className="bg-black/50 border border-gray-700 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="primary-color">Kolor główny (przyciski, akcenty)</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  id="primary-color"
                  value={customTheme.primaryColor}
                  onChange={(e) => handleCustomThemeChange('primaryColor', e.target.value)}
                  className="w-12 h-10 p-1 bg-transparent border-0"
                />
                <Input
                  type="text"
                  value={customTheme.primaryColor}
                  onChange={(e) => handleCustomThemeChange('primaryColor', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="background-color">Kolor tła</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  id="background-color"
                  value={customTheme.backgroundColor}
                  onChange={(e) => handleCustomThemeChange('backgroundColor', e.target.value)}
                  className="w-12 h-10 p-1 bg-transparent border-0"
                />
                <Input
                  type="text"
                  value={customTheme.backgroundColor}
                  onChange={(e) => handleCustomThemeChange('backgroundColor', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="card-color">Kolor kart</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  id="card-color"
                  value={customTheme.cardColor}
                  onChange={(e) => handleCustomThemeChange('cardColor', e.target.value)}
                  className="w-12 h-10 p-1 bg-transparent border-0"
                />
                <Input
                  type="text"
                  value={customTheme.cardColor}
                  onChange={(e) => handleCustomThemeChange('cardColor', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="text-color">Kolor tekstu</Label>
              <div className="flex gap-2 items-center">
                <Input
                  type="color"
                  id="text-color"
                  value={customTheme.textColor}
                  onChange={(e) => handleCustomThemeChange('textColor', e.target.value)}
                  className="w-12 h-10 p-1 bg-transparent border-0"
                />
                <Input
                  type="text"
                  value={customTheme.textColor}
                  onChange={(e) => handleCustomThemeChange('textColor', e.target.value)}
                  className="bg-black/50 border border-gray-700 text-white"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="font-family">Czcionka</Label>
              <select
                id="font-family"
                className="w-full bg-black/50 border border-gray-700 text-white px-3 py-2 rounded-md"
              >
                <option value="sans">Sans Serif</option>
                <option value="serif">Serif</option>
                <option value="mono">Monospace</option>
                <option value="display">Display</option>
                <option value="handwriting">Handwriting</option>
              </select>
            </div>
            
            <div>
              <Label htmlFor="logo-upload">Logo</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="logo-upload"
                  type="file"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // In a real app, we would upload this file
                      // For now, we'll just use a placeholder
                      setGameLogo("/placeholder.svg");
                    }
                  }}
                />
                <label 
                  htmlFor="logo-upload" 
                  className="bg-black/50 border border-gray-700 text-white px-3 py-2 rounded-md cursor-pointer text-sm"
                >
                  Wybierz plik. Nie wybrano pliku
                </label>
                <p className="text-xs text-white/60">
                  Funkcja przewijania własnego logo będzie dostępna wkrótce
                </p>
              </div>
            </div>
            
            <Button 
              onClick={applyCustomTheme} 
              className="w-full bg-neon-green hover:bg-neon-green/80 mt-4"
            >
              Zastosuj motyw
            </Button>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Przypisz motywy do rund</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Standardowa runda</span>
                  <select className="bg-black/50 border border-gray-700 text-white px-3 py-1 rounded-md">
                    <option>Default</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Szybkie pytania</span>
                  <select className="bg-black/50 border border-gray-700 text-white px-3 py-1 rounded-md">
                    <option>Default</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Koło Chaosu</span>
                  <select className="bg-black/50 border border-gray-700 text-white px-3 py-1 rounded-md">
                    <option>Default</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsThemes;
