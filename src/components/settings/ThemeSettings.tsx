
import React, { useState, useRef, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Download, Upload, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface ThemeOption {
  id: string;
  name: string;
  primaryColor: string;
  buttonColor: string;
  backgroundColor: string;
  textColor: string;
}

const ThemeSettings = () => {
  const { 
    primaryColor, 
    secondaryColor, 
    setPrimaryColor, 
    setSecondaryColor, 
    gameLogo,
    setGameLogo,
    saveGameData
  } = useGameContext();
  
  const [selectedTheme, setSelectedTheme] = useState<string | null>("default");
  const [customTheme, setCustomTheme] = useState({
    name: "Custom Theme",
    primaryColor: primaryColor || "#9b87f5",
    backgroundColor: secondaryColor || "#1A1F2C",
    cardColor: "#203748",
    textColor: "#FFFFFF",
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(gameLogo);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Synchronizacja kolorów z kontekstem gry
  useEffect(() => {
    setCustomTheme(prev => ({
      ...prev,
      primaryColor: primaryColor || prev.primaryColor,
      backgroundColor: secondaryColor || prev.backgroundColor
    }));
  }, [primaryColor, secondaryColor]);

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
      
      // Zapisz zmiany w localStorage
      saveGameData();
      toast.success('Motyw został zastosowany', {
        description: `Wybrano motyw: ${theme.name}`
      });
    }
  };

  const handleCustomThemeChange = (field: string, value: string) => {
    setCustomTheme(prev => ({ ...prev, [field]: value }));
  };

  const applyCustomTheme = () => {
    setPrimaryColor(customTheme.primaryColor);
    setSecondaryColor(customTheme.backgroundColor);
    
    // Zapisz zmiany w localStorage
    saveGameData();
    toast.success('Własny motyw został zastosowany');
  };
  
  // Obsługa uploadu logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      
      // Walidacja typu pliku
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!validTypes.includes(file.type)) {
        toast.error('Nieprawidłowy format pliku', {
          description: 'Dozwolone formaty: JPEG, PNG, GIF, SVG'
        });
        return;
      }
      
      // Walidacja rozmiaru pliku (max 1MB)
      if (file.size > 1024 * 1024) {
        toast.error('Plik jest za duży', {
          description: 'Maksymalny rozmiar pliku to 1MB'
        });
        return;
      }
      
      setLogoFile(file);
      
      // Stwórz podgląd pliku
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setLogoPreview(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSaveLogo = () => {
    if (!logoFile) {
      toast.error('Nie wybrano pliku');
      return;
    }
    
    setIsUploading(true);
    
    // Symulacja uploadu dla demo
    setTimeout(() => {
      try {
        // W prawdziwym scenariuszu, tutaj byłby kod do uploadu pliku na serwer
        
        // Zapisz URL logo w localStorage
        if (logoPreview) {
          setGameLogo(logoPreview);
          saveGameData();
          toast.success('Logo zostało zapisane');
        }
      } catch (error) {
        console.error('Błąd podczas zapisywania logo:', error);
        toast.error('Wystąpił błąd podczas zapisywania logo');
      } finally {
        setIsUploading(false);
      }
    }, 1000);
  };
  
  const handleClearLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    setGameLogo(null);
    saveGameData();
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    toast.success('Logo zostało usunięte');
  };
  
  const handleExportTheme = () => {
    try {
      const themeData = {
        primaryColor: primaryColor,
        secondaryColor: secondaryColor,
        customTheme: customTheme,
        exportDate: new Date().toISOString()
      };
      
      const dataStr = JSON.stringify(themeData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `gameshow_theme_${new Date().toLocaleDateString('pl-PL').replace(/\./g, '-')}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success('Motyw został wyeksportowany');
    } catch (error) {
      console.error('Błąd podczas eksportu motywu:', error);
      toast.error('Błąd podczas eksportu motywu');
    }
  };
  
  const handleImportTheme = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importData = JSON.parse(event.target?.result as string);
          
          if (!importData.primaryColor || !importData.secondaryColor) {
            throw new Error('Nieprawidłowy format pliku');
          }
          
          setPrimaryColor(importData.primaryColor);
          setSecondaryColor(importData.secondaryColor);
          
          if (importData.customTheme) {
            setCustomTheme(importData.customTheme);
          }
          
          saveGameData();
          toast.success('Motyw został zaimportowany');
        } catch (error) {
          console.error('Błąd podczas importu motywu:', error);
          toast.error('Nieprawidłowy format pliku');
        }
      };
      reader.readAsText(file);
    };
    
    fileInput.click();
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
            <h3 className="text-lg font-semibold mb-4">Logo gry</h3>
            <div className="border border-gray-700 rounded-lg p-4 bg-black/30">
              <div className="flex flex-col items-center space-y-4">
                {/* Logo preview */}
                <div className="w-full aspect-video flex items-center justify-center border border-dashed border-gray-600 rounded-lg overflow-hidden bg-black/50">
                  {isUploading ? (
                    <Skeleton className="w-3/4 h-1/2" />
                  ) : logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Game Logo" 
                      className="max-h-full max-w-full object-contain" 
                    />
                  ) : (
                    <p className="text-white/50">Brak logo</p>
                  )}
                </div>
                
                {/* Logo upload */}
                <div className="w-full">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoUpload}
                    accept="image/jpeg,image/png,image/gif,image/svg+xml"
                    className="hidden"
                  />
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="flex-1"
                    >
                      <Upload size={16} className="mr-2" />
                      Wybierz logo
                    </Button>
                    
                    {logoPreview && (
                      <>
                        <Button
                          variant="outline"
                          onClick={handleSaveLogo}
                          disabled={isUploading || !logoFile}
                          className="px-3"
                        >
                          <Check size={16} className="mr-1" /> Zapisz
                        </Button>
                        <Button
                          variant="outline"
                          onClick={handleClearLogo}
                          className="px-3"
                        >
                          <X size={16} className="mr-1" /> Usuń
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                
                <p className="text-xs text-white/50 text-center">
                  Zalecany format: PNG lub SVG z przezroczystym tłem<br />
                  Maksymalny rozmiar: 1MB
                </p>
              </div>
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-700"
                onClick={handleExportTheme}
              >
                <Download size={16} className="mr-1" /> Eksportuj motyw
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-gray-700"
                onClick={handleImportTheme}
              >
                <Upload size={16} className="mr-1" /> Importuj motyw
              </Button>
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
            
            <Button 
              onClick={applyCustomTheme} 
              className="w-full bg-neon-green hover:bg-neon-green/80 mt-4 text-black"
            >
              Zastosuj motyw
            </Button>
            
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-3">Przypisz motywy do rund</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span>Runda 1: Internet</span>
                  <select className="bg-black/50 border border-gray-700 text-white px-3 py-1 rounded-md">
                    <option>Default</option>
                    <option>Cyberpunk</option>
                    <option>RetroWave</option>
                    <option>Classic TV</option>
                    <option>Neon</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Runda 2: Szybkie pytania</span>
                  <select className="bg-black/50 border border-gray-700 text-white px-3 py-1 rounded-md">
                    <option>Default</option>
                    <option>Cyberpunk</option>
                    <option>RetroWave</option>
                    <option>Classic TV</option>
                    <option>Neon</option>
                  </select>
                </div>
                
                <div className="flex justify-between items-center">
                  <span>Runda 3: Koło fortuny</span>
                  <select className="bg-black/50 border border-gray-700 text-white px-3 py-1 rounded-md">
                    <option>Default</option>
                    <option>Cyberpunk</option>
                    <option>RetroWave</option>
                    <option>Classic TV</option>
                    <option>Neon</option>
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

export default ThemeSettings;
