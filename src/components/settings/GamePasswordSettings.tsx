
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';
import SettingsLayout from './SettingsLayout';
import { z } from 'zod';

interface PasswordSettings {
  enabled: boolean;
  password: string;
  attempts: number;
  expiresAfter: number;
}

const DEFAULT_SETTINGS: PasswordSettings = {
  enabled: false,
  password: "discord123",
  attempts: 3,
  expiresAfter: 24
};

// Password validation schema
const passwordSchema = z.object({
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków")
});

const GamePasswordSettings = () => {
  const [settings, setSettings] = useState<PasswordSettings>(DEFAULT_SETTINGS);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('game_settings')
          .select('value')
          .eq('id', 'password')
          .single();

        if (error) {
          console.error("Error loading password settings:", error);
          return;
        }

        if (data?.value) {
          try {
            // Handle data.value as JSON object or string
            let parsedData: PasswordSettings;
            
            if (typeof data.value === 'object' && data.value !== null) {
              parsedData = data.value as PasswordSettings;
            } else if (typeof data.value === 'string') {
              parsedData = JSON.parse(data.value) as PasswordSettings;
            } else {
              throw new Error('Invalid data format');
            }
            
            // Ensure all required fields are present
            setSettings({
              enabled: parsedData.enabled ?? DEFAULT_SETTINGS.enabled,
              password: parsedData.password ?? DEFAULT_SETTINGS.password,
              attempts: parsedData.attempts ?? DEFAULT_SETTINGS.attempts,
              expiresAfter: parsedData.expiresAfter ?? DEFAULT_SETTINGS.expiresAfter
            });
          } catch (parseErr) {
            console.error("Error parsing password settings:", parseErr);
            toast.error("Błąd odczytu ustawień hasła");
          }
        }
      } catch (err) {
        console.error("Unexpected error loading password settings:", err);
      }
    };

    loadSettings();
  }, []);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSettingChange = (field: keyof PasswordSettings, value: any) => {
    setSettings({ ...settings, [field]: value });
    
    // Clear validation error when editing password
    if (field === 'password') {
      setValidationError(null);
    }
  };

  const generateRandomPassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 10; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setSettings({ ...settings, password: result });
    setValidationError(null);
  };

  const saveSettings = async () => {
    try {
      // Validate password
      const validation = passwordSchema.safeParse({ password: settings.password });
      
      if (!validation.success) {
        setValidationError(validation.error.errors[0].message);
        return;
      }
      
      setLoading(true);
      
      const { error } = await supabase
        .from('game_settings')
        .upsert(
          { id: 'password', value: settings },
          { onConflict: 'id' }
        );

      if (error) {
        console.error("Error saving password settings:", error);
        toast.error("Błąd zapisywania ustawień hasła", {
          description: error.message
        });
        return;
      }

      toast.success("Ustawienia hasła zapisane", {
        description: settings.enabled 
          ? "Hasło zostało włączone" 
          : "Hasło zostało wyłączone"
      });
      
    } catch (err) {
      console.error("Error saving password settings:", err);
      toast.error("Wystąpił nieoczekiwany błąd");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsLayout
      title="Hasło Dostępu"
      description="Ustaw hasło wymagane do dołączenia do gry jako gracz lub widz."
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">Włącz hasło</h3>
            <p className="text-sm text-white/60">
              Wymagaj hasła od graczy dołączających do gry
            </p>
          </div>
          <Switch
            checked={settings.enabled}
            onCheckedChange={(checked) => handleSettingChange('enabled', checked)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Hasło</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={settings.password}
                onChange={(e) => handleSettingChange('password', e.target.value)}
                className={validationError ? "border-red-500 pr-10" : "pr-10"}
                placeholder="Minimum 6 znaków"
                disabled={!settings.enabled}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <Button
              variant="outline"
              onClick={generateRandomPassword}
              disabled={!settings.enabled}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Losuj
            </Button>
          </div>
          {validationError && (
            <p className="text-red-500 text-sm">{validationError}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="attempts">Dozwolone próby</Label>
          <Input
            id="attempts"
            type="number"
            min={1}
            max={10}
            value={settings.attempts}
            onChange={(e) => handleSettingChange('attempts', parseInt(e.target.value, 10))}
            disabled={!settings.enabled}
          />
          <p className="text-sm text-white/60">
            Liczba prób przed czasowym zablokowaniem dostępu
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="expires">Wygasa po (godziny)</Label>
          <Input
            id="expires"
            type="number"
            min={1}
            value={settings.expiresAfter}
            onChange={(e) => handleSettingChange('expiresAfter', parseInt(e.target.value, 10))}
            disabled={!settings.enabled}
          />
          <p className="text-sm text-white/60">
            Czas w godzinach, po którym hasło wygasa i trzeba będzie wygenerować nowe
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10">
          <Button
            onClick={saveSettings}
            disabled={loading}
            className="w-full"
          >
            {loading ? 'Zapisywanie...' : 'Zapisz ustawienia hasła'}
          </Button>
        </div>
      </div>
    </SettingsLayout>
  );
};

export default GamePasswordSettings;
