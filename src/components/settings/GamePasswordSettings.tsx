
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { saveGameSetting, loadGameSetting } from '@/lib/supabase';
import { Shield, Eye, EyeOff } from 'lucide-react';

const GamePasswordSettings = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkExistingPassword = async () => {
      try {
        const existingPassword = await loadGameSetting('game_password');
        if (existingPassword) {
          setCurrentPassword('••••••••');
        }
      } catch (error) {
        console.error('Error checking existing password:', error);
      }
    };

    checkExistingPassword();
  }, []);

  const handleSave = async () => {
    if (password !== confirmPassword) {
      toast.error('Hasła nie są identyczne');
      return;
    }

    if (password.length < 4) {
      toast.error('Hasło musi mieć co najmniej 4 znaki');
      return;
    }

    setIsLoading(true);
    try {
      const success = await saveGameSetting('game_password', password);
      
      if (success) {
        toast.success('Hasło zostało zapisane');
        setCurrentPassword('••••••••');
        setPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Nie udało się zapisać hasła');
      }
    } catch (error) {
      console.error('Error saving password:', error);
      toast.error('Wystąpił błąd podczas zapisywania hasła');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Hasło dostępu do gry</h2>
        <p className="text-muted-foreground mb-6">
          Ustaw hasło, które będzie wymagane do edycji krytycznych ustawień gry podczas transmisji.
          Pomoże to zabezpieczyć panel prowadzącego przed niepowołanym dostępem.
        </p>
      </div>

      <div className="space-y-4 max-w-md">
        {currentPassword && (
          <div className="bg-secondary/50 p-4 rounded-md flex items-center gap-3">
            <Shield className="text-blue-400" />
            <div>
              <p className="font-medium">Hasło jest ustawione</p>
              <p className="text-sm text-muted-foreground">
                Nowe hasło zastąpi obecnie ustawione hasło
              </p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-medium">
            Nowe hasło
          </label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Wprowadź nowe hasło"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={toggleShowPassword}
              className="absolute inset-y-0 right-0 px-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-gray-400" />
              ) : (
                <Eye className="h-4 w-4 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm-password" className="block text-sm font-medium">
            Potwierdź hasło
          </label>
          <Input
            id="confirm-password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Potwierdź nowe hasło"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button
          onClick={handleSave}
          disabled={isLoading || !password || password !== confirmPassword}
          className="w-full"
        >
          {isLoading ? 'Zapisywanie...' : 'Zapisz hasło'}
        </Button>
      </div>
    </div>
  );
};

export default GamePasswordSettings;
