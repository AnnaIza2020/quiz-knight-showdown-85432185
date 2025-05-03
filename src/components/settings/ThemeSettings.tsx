import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, Upload, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import SettingsLayout from './SettingsLayout';

interface ThemeOption {
  id: string;
  name: string;
  primaryColor: string;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
  font?: string;
}

interface ThemeData {
  name: string;
  primaryColor: string;
  backgroundColor: string;
  cardColor: string;
  textColor: string;
  font: string;
}

const defaultThemes: ThemeOption[] = [
  {
    id: "default",
    name: "Default",
    primaryColor: "#9b87f5",
    buttonColor: "#9b87f5",
    backgroundColor: "#1A1F2C",
    textColor: "#FFFFFF",
    font: "Inter, sans-serif"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk",
    primaryColor: "#00FFF7",
    buttonColor: "#00FFF7",
    backgroundColor: "#141421",
    textColor: "#00FFF7",
    font: "JetBrains Mono, monospace"
  },
  {
    id: "retrowave",
    name: "RetroWave",
    primaryColor: "#FF00FF",
    buttonColor: "#FF00FF",
    backgroundColor: "#120634",
    textColor: "#FF00FF",
    font: "Orbitron, sans-serif"
  },
  {
    id: "classicTV",
    name: "Classic TV",
    primaryColor: "#FFD700",
    buttonColor: "#FFD700",
    backgroundColor: "#191919",
    textColor: "#FFFFFF",
    font: "Roboto, sans-serif"
  },
  {
    id: "neon",
    name: "Neon",
    primaryColor: "#39FF14",
    buttonColor: "#39FF14",
    backgroundColor: "#0D0D0D",
    textColor: "#FFFFFF",
    font: "Montserrat, sans-serif"
  },
];

const fontOptions = [
  { value: "Inter, sans-serif", label: "Inter (Sans Serif)" },
  { value: "Roboto, sans-serif", label: "Roboto (Sans Serif)" },
  { value: "Georgia, serif", label: "Georgia (Serif)" },
  { value: "JetBrains Mono, monospace", label: "JetBrains Mono (Monospace)" },
  { value: "Orbitron, sans-serif", label: "Orbitron (Display)" },
  { value: "Dancing Script, cursive", label: "Dancing Script (Handwriting)" }
];

const ThemeSettings = () => {
  const { primaryColor, secondaryColor, setPrimaryColor, setSecondaryColor, setGameLogo } = useGameContext();
  
  const [selectedTheme, setSelectedTheme] = useState<string | null>("default");
  const [customTheme, setCustomTheme] = useState<ThemeData>({
    name: "Custom Theme",
    primaryColor: primaryColor || "#9b87f5",
    backgroundColor: secondaryColor || "#1A1F2C",
    cardColor: "#203748",
    textColor: "#FFFFFF",
    font: "Inter, sans-serif"
  });
  const [isSaving, setIsSaving] = useState(false);

  // Load theme from Supabase or localStorage when component mounts
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // Try to load from Supabase first if available
        if (supabase) {
          try {
            const { data, error } = await supabase
              .from('game_settings')
              .select('*')
              .eq('id', 'theme')
              .single();
              
            if (data && !error) {
              const themeData = data.value;
              setCustomTheme(themeData);
              setPrimaryColor(themeData.primaryColor);
              setSecondaryColor(themeData.backgroundColor);
              
              // Find matching predefined theme if any
              const matchingTheme = defaultThemes.find(
                t => t.primaryColor === themeData.primaryColor && t.backgroundColor === themeData.backgroundColor
              );
              if (matchingTheme) {
                setSelectedTheme(matchingTheme.id);
              } else {
                setSelectedTheme(null);
              }
              return;
            }
          } catch (error) {
            console.error('Error loading theme from Supabase:', error);
          }
        }
        
        // Fallback to localStorage if Supabase fails or isn't available
        const savedTheme = localStorage.getItem('gameTheme');
        if (savedTheme) {
          const themeData = JSON.parse(savedTheme);
          setCustomTheme(themeData);
          setPrimaryColor(themeData.primaryColor);
          setSecondaryColor(themeData.backgroundColor);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadTheme();
  }, [setPrimaryColor, setSecondaryColor]);

  const handleThemeSelect = (themeId: string) => {
    setSelectedTheme(themeId);
    
    const theme = defaultThemes.find(t => t.id === themeId);
    if (theme) {
      setPrimaryColor(theme.primaryColor);
      setSecondaryColor(theme.backgroundColor);
      
      // Update custom theme with selected theme values
      setCustomTheme({
        ...customTheme,
        primaryColor: theme.primaryColor,
        backgroundColor: theme.backgroundColor,
        textColor: theme.textColor,
        font: theme.font || customTheme.font
      });
    }
  };

  const handleCustomThemeChange = (field: string, value: string) => {
    setCustomTheme(prev => ({ ...prev, [field]: value }));
    
    // If a predefined theme was selected, deselect it when user modifies values
    if (selectedTheme) {
      setSelectedTheme(null);
    }
  };

  const applyCustomTheme = async () => {
    setIsSaving(true);
    
    try {
      // Apply to UI immediately
      setPrimaryColor(customTheme.primaryColor);
      setSecondaryColor(customTheme.backgroundColor);
      
      // Font styles applied via CSS custom properties
      document.documentElement.style.setProperty('--font-family', customTheme.font);
      
      // Save to Supabase if available
      if (supabase) {
        try {
          const { error } = await supabase
            .from('game_settings')
            .upsert({
              id: 'theme',
              value: customTheme
            });
            
          if (error) throw error;
        } catch (error) {
          console.error('Error saving to Supabase:', error);
          throw error;
        }
      }
      
      // Always save to localStorage as backup
      localStorage.setItem('gameTheme', JSON.stringify(customTheme));
      
      toast.success('Motyw zastosowany', {
        description: 'Zmiany zostały zapisane i zastosowane'
      });
    } catch (error) {
      console.error('Error saving theme:', error);
      toast.error('Nie udało się zapisać motywu', {
        description: 'Spróbuj ponownie później'
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const resetToDefault = () => {
    const defaultTheme = defaultThemes[0];
    setSelectedTheme('default');
    setPrimaryColor(defaultTheme.primaryColor);
    setSecondaryColor(defaultTheme.backgroundColor);
    setCustomTheme({
      name: "Default Theme",
      primaryColor: defaultTheme.primaryColor,
      backgroundColor: defaultTheme.backgroundColor,
      cardColor: "#203748",
      textColor: defaultTheme.textColor,
      font: defaultTheme.font || "Inter, sans-serif"
    });
    
    document.documentElement.style.setProperty('--font-family', defaultTheme.font || "Inter, sans-serif");
    
    toast.info('Zresetowano do ustawień domyślnych', {
      description: 'Aby zachować zmiany, kliknij "Zastosuj motyw"'
    });
  };
  
  const exportTheme = () => {
    try {
      const dataStr = JSON.stringify(customTheme, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `motyw_${customTheme.name.replace(/\s/g, '_').toLowerCase()}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success('Motyw wyeksportowany', {
        description: 'Plik z motywem został pobrany'
      });
    } catch (error) {
      toast.error('Nie udało się wyeksportować motywu');
    }
  };
  
  const importTheme = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedTheme = JSON.parse(event?.target?.result as string);
          
          if (
            !importedTheme.primaryColor || 
            !importedTheme.backgroundColor || 
            !importedTheme.textColor
          ) {
            throw new Error('Nieprawidłowy format pliku motywu');
          }
          
          setCustomTheme({
            ...customTheme,
            ...importedTheme
          });
          
          setSelectedTheme(null); // Deselect predefined themes
          
          toast.success('Zaimportowano motyw', {
            description: 'Aby zastosować zmiany, kliknij "Zastosuj motyw"'
          });
        } catch (error) {
          toast.error('Nieprawidłowy format pliku motywu');
        }
      };
      reader.readAsText(file);
    };
    
    input.click();
  };
  
  return (
    <SettingsLayout 
      title="Motywy i Style" 
      description="Tu zmienisz wygląd sceny, motywy i efekty."
      actions={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={importTheme}>
            <Upload size={16} className="mr-1" /> Importuj
          </Button>
          <Button variant="outline" size="sm" onClick={exportTheme}>
            <Download size={16} className="mr-1" /> Eksportuj
          </Button>
          <Button variant="outline" size="sm" onClick={resetToDefault}>
            <RotateCcw size={16} className="mr-1" /> Resetuj
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Predefined themes */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Gotowe motywy</h3>
          <div className="grid grid-cols-2 gap-4">
            {defaultThemes.map((theme) => (
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
            <div 
              className="border border-gray-700 rounded-lg p-4"
              style={{ 
                backgroundColor: customTheme.backgroundColor,
                color: customTheme.textColor,
                fontFamily: customTheme.font
              }}
            >
              <div className="text-center">
                <h4 className="text-xl font-bold mb-2" style={{ color: customTheme.primaryColor }}>
                  QUIZ SHOW
                </h4>
                
                <div className="bg-black/40 rounded-lg p-4 mt-4 mb-2">
                  <p>Przykładowe pytanie</p>
                  <p className="text-sm opacity-70">W którym roku miała miejsce bitwa pod Grunwaldem?</p>
                  
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <div className="bg-black/60 rounded p-2">1410</div>
                    <div className="bg-black/60 rounded p-2">1492</div>
                    <div className="bg-black/60 rounded p-2">1385</div>
                    <div className="bg-black/60 rounded p-2">1505</div>
                  </div>
                </div>
                
                <button 
                  className="px-4 py-2 rounded-md text-sm mt-4 font-medium"
                  style={{ 
                    backgroundColor: customTheme.primaryColor, 
                    color: customTheme.backgroundColor
                  }}
                >
                  Przykładowy Przycisk
                </button>
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
                value={customTheme.font}
                onChange={(e) => handleCustomThemeChange('font', e.target.value)}
              >
                {fontOptions.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
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
                  className="bg-black/50 border border-gray-700 text-white px-3 py-2 rounded-md cursor-pointer text-sm flex items-center"
                >
                  <Upload size={16} className="mr-2" />
                  Wybierz plik. Nie wybrano pliku
                </label>
              </div>
            </div>
            
            <Button 
              onClick={applyCustomTheme} 
              className="w-full bg-neon-green hover:bg-neon-green/80 mt-4"
              disabled={isSaving}
            >
              {isSaving ? 'Zapisywanie...' : 'Zastosuj motyw'}
            </Button>
          </div>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default ThemeSettings;
