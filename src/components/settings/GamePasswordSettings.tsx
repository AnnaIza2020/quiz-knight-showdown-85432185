
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import { Loader2, Save, Lock, Eye, EyeOff } from 'lucide-react';

interface GameSettings {
  accessPassword: string;
}

const GamePasswordSettings: React.FC = () => {
  const [settings, setSettings] = useState<GameSettings>({ accessPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);
  
  // Load game settings from database
  const loadSettings = async () => {
    setIsLoading(true);
    
    try {
      // Check if game_settings table exists in the Database types
      // If not, we'll try the query anyway
      const { data, error } = await supabase
        .from('game_settings')
        .select('*')
        .eq('id', 'access_password')
        .single();
      
      if (error) {
        if (error.code !== 'PGRST116') { // PGRST116 is "No rows returned" error
          console.error('Error fetching game settings:', error);
          toast.error('Błąd podczas pobierania ustawień');
        }
        // No settings found, use defaults
      } else if (data) {
        // Data found, update settings
        setSettings({ 
          accessPassword: data.value?.password || '' 
        });
      }
    } catch (err) {
      console.error('Error in loadSettings:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Save settings to database
  const saveSettings = async () => {
    setIsLoading(true);
    
    try {
      // Check if record exists
      const { data, error: checkError } = await supabase
        .from('game_settings')
        .select('*')
        .eq('id', 'access_password')
        .single();
      
      const settingsData = {
        password: settings.accessPassword
      };
      
      if (checkError && checkError.code === 'PGRST116') {
        // No record found, create new
        const { error } = await supabase
          .from('game_settings')
          .insert({
            id: 'access_password',
            value: settingsData
          });
          
        if (error) throw error;
      } else {
        // Record exists, update
        const { error } = await supabase
          .from('game_settings')
          .update({ value: settingsData })
          .eq('id', 'access_password');
          
        if (error) throw error;
      }
      
      toast.success('Zapisano ustawienia dostępu');
    } catch (err) {
      console.error('Error saving settings:', err);
      toast.error('Błąd podczas zapisywania ustawień');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle password visibility
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Card className="bg-black/40 border border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Lock className="h-5 w-5 text-neon-blue" />
          <span>Ustawienia dostępu</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-neon-blue" />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">Hasło do panelu prowadzącego</label>
              <div className="relative">
                <Input 
                  type={showPassword ? "text" : "password"}
                  value={settings.accessPassword}
                  onChange={(e) => setSettings({ ...settings, accessPassword: e.target.value })}
                  placeholder="Hasło (opcjonalnie)" 
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-2 top-2 text-white/50 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-white/50 mt-1">
                Ustaw hasło, aby zabezpieczyć panel prowadzącego. Pozostaw puste, jeśli hasło nie jest potrzebne.
              </p>
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={saveSettings}
                disabled={isLoading}
                className="bg-neon-blue hover:bg-neon-blue/80"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Zapisywanie...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Zapisz ustawienia
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GamePasswordSettings;
