
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useGameContext } from '@/context/GameContext';
import { supabase } from '@/lib/supabase';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SettingsLayout from './SettingsLayout';

interface ThemeData {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  fontFamily: string;
  buttonStyle: string;
  logoUrl?: string;
}

const DEFAULT_THEME: ThemeData = {
  primaryColor: '#FF00FF',
  secondaryColor: '#00FFFF',
  backgroundColor: '#0F111A',
  fontFamily: 'Inter, sans-serif',
  buttonStyle: 'neon',
  logoUrl: '/lovable-uploads/5d43e62b-61b1-4821-beff-4abb5eb500f5.png'
};

const ThemeSettings = () => {
  const [theme, setTheme] = useState<ThemeData>(DEFAULT_THEME);
  const [selectedFont, setSelectedFont] = useState<string>(DEFAULT_THEME.fontFamily);
  const [selectedButtonStyle, setSelectedButtonStyle] = useState<string>(DEFAULT_THEME.buttonStyle);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { setPrimaryColor, setSecondaryColor, setGameLogo } = useGameContext();
  
  // Load theme settings from Supabase
  useEffect(() => {
    const loadThemeSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('game_settings')
          .select('value')
          .eq('id', 'theme')
          .single();
          
        if (error) {
          console.error('Error fetching theme settings:', error);
          return;
        }
        
        if (data?.value) {
          // Ensure data.value is treated as JSON and properly parsed
          let themeData: Partial<ThemeData> = {};
          
          try {
            // If data.value is already an object, use it directly
            if (typeof data.value === 'object' && data.value !== null) {
              themeData = data.value as Partial<ThemeData>;
            } 
            // If it's a string, try to parse it
            else if (typeof data.value === 'string') {
              themeData = JSON.parse(data.value) as Partial<ThemeData>;
            }
            
            // Apply parsed values with defaults for any missing properties
            setTheme({
              primaryColor: themeData.primaryColor || DEFAULT_THEME.primaryColor,
              secondaryColor: themeData.secondaryColor || DEFAULT_THEME.secondaryColor,
              backgroundColor: themeData.backgroundColor || DEFAULT_THEME.backgroundColor,
              fontFamily: themeData.fontFamily || DEFAULT_THEME.fontFamily,
              buttonStyle: themeData.buttonStyle || DEFAULT_THEME.buttonStyle,
              logoUrl: themeData.logoUrl || DEFAULT_THEME.logoUrl
            });
            
            setSelectedFont(themeData.fontFamily || DEFAULT_THEME.fontFamily);
            setSelectedButtonStyle(themeData.buttonStyle || DEFAULT_THEME.buttonStyle);
            
            // Apply loaded theme to context
            if (themeData.primaryColor) setPrimaryColor(themeData.primaryColor);
            if (themeData.secondaryColor) setSecondaryColor(themeData.secondaryColor);
            if (themeData.logoUrl) setGameLogo(themeData.logoUrl);
            
            // Set logo preview if available
            if (themeData.logoUrl) {
              setLogoPreview(themeData.logoUrl);
            }
          } catch (parseError) {
            console.error('Error parsing theme data:', parseError);
            toast.error('Błąd wczytywania ustawień motywu', {
              description: 'Format danych jest niepoprawny'
            });
          }
        }
      } catch (err) {
        console.error('Unexpected error loading theme settings:', err);
      }
    };
    
    loadThemeSettings();
  }, [setPrimaryColor, setSecondaryColor, setGameLogo]);
  
  // Handle color change
  const handleColorChange = (color: string, type: keyof ThemeData) => {
    setTheme({ ...theme, [type]: color });
    
    // Apply changes immediately to preview
    if (type === 'primaryColor') {
      setPrimaryColor(color);
    } else if (type === 'secondaryColor') {
      setSecondaryColor(color);
    }
  };
  
  // Handle font change
  const handleFontChange = (fontFamily: string) => {
    setSelectedFont(fontFamily);
    setTheme({ ...theme, fontFamily });
    
    // Apply font to document for preview
    document.documentElement.style.setProperty('--font-primary', fontFamily);
  };
  
  // Handle button style change
  const handleButtonStyleChange = (style: string) => {
    setSelectedButtonStyle(style);
    setTheme({ ...theme, buttonStyle: style });
  };
  
  // Handle logo file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      if (file.type.startsWith('image/')) {
        setLogoFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onload = () => {
          setLogoPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        toast.error('Niepoprawny format pliku', {
          description: 'Proszę wybrać plik graficzny (np. PNG, JPG)'
        });
      }
    }
  };
  
  // Save theme settings to Supabase
  const handleSaveTheme = async () => {
    setLoading(true);
    let updatedTheme = { ...theme };
    
    try {
      // Handle logo upload if file is selected
      if (logoFile) {
        const fileName = `logo_${Date.now()}.${logoFile.name.split('.').pop()}`;
        
        // Create storage bucket if it doesn't exist
        const { data: bucketExists } = await supabase
          .storage
          .getBucket('game_assets');
          
        if (!bucketExists) {
          const { error: createBucketError } = await supabase
            .storage
            .createBucket('game_assets', {
              public: true,
              allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
              fileSizeLimit: 1024 * 1024 * 2 // 2MB
            });
          
          if (createBucketError) {
            console.error('Error creating bucket:', createBucketError);
            toast.error('Błąd tworzenia przestrzeni dla plików');
            return;
          }
        }
        
        // Upload file
        const { error: uploadError, data: uploadData } = await supabase
          .storage
          .from('game_assets')
          .upload(fileName, logoFile, {
            upsert: true
          });
        
        if (uploadError) {
          console.error('Error uploading logo:', uploadError);
          toast.error('Błąd przesyłania logo', {
            description: uploadError.message
          });
        } else if (uploadData) {
          // Get public URL
          const { data: publicUrlData } = supabase
            .storage
            .from('game_assets')
            .getPublicUrl(fileName);
          
          if (publicUrlData) {
            const logoUrl = publicUrlData.publicUrl;
            updatedTheme.logoUrl = logoUrl;
            setGameLogo(logoUrl);
          }
        }
      }
      
      // Save theme settings
      const { error } = await supabase
        .from('game_settings')
        .upsert(
          { id: 'theme', value: updatedTheme },
          { onConflict: 'id' }
        );
      
      if (error) {
        console.error('Error saving theme settings:', error);
        toast.error('Błąd zapisywania ustawień motywu', {
          description: error.message
        });
      } else {
        toast.success('Ustawienia motywu zapisane', {
          description: 'Wszystkie zmiany zostały zastosowane'
        });
      }
    } catch (err) {
      console.error('Unexpected error saving theme:', err);
      toast.error('Wystąpił nieoczekiwany błąd');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset theme to defaults
  const handleResetTheme = () => {
    setTheme(DEFAULT_THEME);
    setSelectedFont(DEFAULT_THEME.fontFamily);
    setSelectedButtonStyle(DEFAULT_THEME.buttonStyle);
    setPrimaryColor(DEFAULT_THEME.primaryColor);
    setSecondaryColor(DEFAULT_THEME.secondaryColor);
    setGameLogo(DEFAULT_THEME.logoUrl || '');
    
    toast.info('Ustawienia motywu zresetowane', {
      description: 'Wszystkie ustawienia przywrócone do domyślnych wartości'
    });
  };
  
  return (
    <SettingsLayout
      title="Ustawienia Motywu"
      description="Dostosuj wygląd aplikacji, kolory, czcionki i styl elementów interfejsu."
    >
      <div className="space-y-6">
        {/* Color settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="primaryColor">Kolor główny</Label>
            <div className="flex gap-2 mt-2 items-center">
              <div 
                className="w-8 h-8 rounded border border-white/30" 
                style={{ backgroundColor: theme.primaryColor }}
              />
              <Input 
                type="text" 
                id="primaryColor" 
                value={theme.primaryColor} 
                onChange={(e) => handleColorChange(e.target.value, 'primaryColor')}
                className="font-mono"
              />
              <Input 
                type="color" 
                value={theme.primaryColor} 
                onChange={(e) => handleColorChange(e.target.value, 'primaryColor')}
                className="w-10 h-10 p-1 rounded cursor-pointer"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="secondaryColor">Kolor akcenta</Label>
            <div className="flex gap-2 mt-2 items-center">
              <div 
                className="w-8 h-8 rounded border border-white/30" 
                style={{ backgroundColor: theme.secondaryColor }}
              />
              <Input 
                type="text" 
                id="secondaryColor" 
                value={theme.secondaryColor} 
                onChange={(e) => handleColorChange(e.target.value, 'secondaryColor')}
                className="font-mono"
              />
              <Input 
                type="color" 
                value={theme.secondaryColor} 
                onChange={(e) => handleColorChange(e.target.value, 'secondaryColor')}
                className="w-10 h-10 p-1 rounded cursor-pointer"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="backgroundColor">Kolor tła</Label>
            <div className="flex gap-2 mt-2 items-center">
              <div 
                className="w-8 h-8 rounded border border-white/30" 
                style={{ backgroundColor: theme.backgroundColor }}
              />
              <Input 
                type="text" 
                id="backgroundColor" 
                value={theme.backgroundColor} 
                onChange={(e) => handleColorChange(e.target.value, 'backgroundColor')}
                className="font-mono"
              />
              <Input 
                type="color" 
                value={theme.backgroundColor} 
                onChange={(e) => handleColorChange(e.target.value, 'backgroundColor')}
                className="w-10 h-10 p-1 rounded cursor-pointer"
              />
            </div>
          </div>
        </div>
        
        {/* Font settings */}
        <div className="space-y-2">
          <Label htmlFor="fontFamily">Czcionka aplikacji</Label>
          <Select 
            value={selectedFont} 
            onValueChange={handleFontChange}
          >
            <SelectTrigger id="fontFamily" className="w-full">
              <SelectValue placeholder="Wybierz czcionkę" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter, sans-serif">Inter (domyślna)</SelectItem>
              <SelectItem value="Roboto, sans-serif">Roboto</SelectItem>
              <SelectItem value="'Playfair Display', serif">Playfair Display</SelectItem>
              <SelectItem value="'Press Start 2P', cursive">Press Start 2P</SelectItem>
              <SelectItem value="'Orbitron', sans-serif">Orbitron</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Font preview */}
          <div 
            className="mt-2 p-3 border border-white/10 rounded bg-black/30"
            style={{ fontFamily: selectedFont }}
          >
            <p className="text-lg mb-1">Przykładowy tekst w wybranej czcionce</p>
            <p className="text-sm opacity-70">ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789</p>
          </div>
        </div>
        
        {/* Button style settings */}
        <div className="space-y-2">
          <Label>Styl przycisków</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-2">
            <button
              type="button"
              onClick={() => handleButtonStyleChange('neon')}
              className={`border-2 rounded-md p-3 h-20 flex items-center justify-center ${
                selectedButtonStyle === 'neon' 
                  ? 'border-neon-blue bg-black/40 shadow-[0_0_10px_rgba(0,255,255,0.5)]' 
                  : 'border-white/20 bg-black/20'
              }`}
            >
              <div className="neon-button text-white">
                Styl Neonowy
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => handleButtonStyleChange('modern')}
              className={`border-2 rounded-md p-3 h-20 flex items-center justify-center ${
                selectedButtonStyle === 'modern' 
                  ? 'border-neon-blue bg-black/40 shadow-[0_0_10px_rgba(0,255,255,0.5)]' 
                  : 'border-white/20 bg-black/20'
              }`}
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium px-4 py-2 rounded-md">
                Styl Nowoczesny
              </div>
            </button>
            
            <button
              type="button"
              onClick={() => handleButtonStyleChange('retro')}
              className={`border-2 rounded-md p-3 h-20 flex items-center justify-center ${
                selectedButtonStyle === 'retro' 
                  ? 'border-neon-blue bg-black/40 shadow-[0_0_10px_rgba(0,255,255,0.5)]' 
                  : 'border-white/20 bg-black/20'
              }`}
            >
              <div className="bg-gray-900 border-2 border-gray-700 font-pixel text-white px-4 py-2 rounded">
                Styl Retro
              </div>
            </button>
          </div>
        </div>
        
        {/* Logo upload */}
        <div className="space-y-2">
          <Label htmlFor="logoUpload">Logo gry</Label>
          <div className="flex flex-col gap-4">
            <div className="flex gap-2">
              <Input
                id="logoUpload"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-grow"
              />
              {logoPreview && (
                <Button 
                  variant="outline"
                  onClick={() => {
                    setLogoPreview(null);
                    setLogoFile(null);
                  }}
                >
                  Usuń
                </Button>
              )}
            </div>
            
            {/* Logo preview */}
            <div className="flex justify-center p-4 border border-white/10 rounded bg-black/30 min-h-32">
              {logoPreview ? (
                <img
                  src={logoPreview}
                  alt="Logo podgląd"
                  className="max-h-32 object-contain"
                />
              ) : (
                <div className="flex items-center justify-center text-white/50 h-32">
                  Brak wybranego logo
                </div>
              )}
            </div>
            <p className="text-xs text-white/60">
              Zalecany rozmiar: 400x200 pikseli, format PNG z przezroczystością
            </p>
          </div>
        </div>
        
        {/* Preview section */}
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Podgląd motywu</h3>
          <div 
            className="rounded-lg p-6 border border-white/10 relative overflow-hidden"
            style={{ 
              background: `linear-gradient(135deg, ${theme.backgroundColor} 0%, rgba(0,0,0,0.9) 100%)`,
              fontFamily: theme.fontFamily
            }}
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            
            <div className="relative z-10">
              <h2 
                className="text-2xl font-bold mb-4 text-center"
                style={{ color: theme.primaryColor, textShadow: `0 0 10px ${theme.primaryColor}` }}
              >
                Discord Game Show
              </h2>
              
              <div className="flex justify-center gap-4 mb-6">
                <button 
                  className={`px-4 py-2 rounded transition-all ${
                    theme.buttonStyle === 'neon' ? 'neon-button' : 
                    theme.buttonStyle === 'modern' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium' :
                    'bg-gray-900 border-2 border-gray-700 font-pixel text-white'
                  }`}
                  style={{ 
                    borderColor: theme.secondaryColor,
                    color: theme.secondaryColor
                  }}
                >
                  Przycisk 1
                </button>
                
                <button 
                  className={`px-4 py-2 rounded transition-all ${
                    theme.buttonStyle === 'neon' ? 'neon-button' : 
                    theme.buttonStyle === 'modern' ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium' :
                    'bg-gray-900 border-2 border-gray-700 font-pixel text-white'
                  }`}
                  style={{ 
                    borderColor: theme.primaryColor,
                    color: theme.primaryColor
                  }}
                >
                  Przycisk 2
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div 
                  className="bg-black/50 backdrop-blur-sm p-4 rounded-lg border text-sm"
                  style={{ borderColor: `${theme.secondaryColor}40` }}
                >
                  <p style={{ color: theme.secondaryColor }}>
                    Element interfejsu 1
                  </p>
                </div>
                
                <div 
                  className="bg-black/50 backdrop-blur-sm p-4 rounded-lg border text-sm"
                  style={{ borderColor: `${theme.primaryColor}40` }}
                >
                  <p style={{ color: theme.primaryColor }}>
                    Element interfejsu 2
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex gap-3 justify-end pt-4 border-t border-white/10">
          <Button 
            variant="outline" 
            onClick={handleResetTheme}
          >
            Przywróć domyślne
          </Button>
          
          <Button 
            onClick={handleSaveTheme} 
            disabled={loading}
            className="bg-neon-blue hover:bg-neon-blue/80 text-black"
          >
            {loading ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default ThemeSettings;
