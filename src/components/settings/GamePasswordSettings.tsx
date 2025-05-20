
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Eye, EyeOff, Save } from 'lucide-react';
import { saveGameData, loadGameData } from '@/lib/supabase';

const GamePasswordSettings = () => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load password on component mount
  useEffect(() => {
    const loadPassword = async () => {
      setIsLoading(true);
      try {
        const result = await loadGameData('game_password');
        if (result.success && result.data) {
          setPassword(result.data);
        }
      } catch (error) {
        console.error('Error loading password:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPassword();
  }, []);

  const handleSavePassword = async () => {
    setIsLoading(true);
    try {
      const result = await saveGameData(password, 'game_password');
      if (result.success) {
        toast.success('Hasło zostało zapisane');
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

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Card className="bg-black/40 border border-white/10">
      <CardHeader>
        <CardTitle>Hasło do Gry</CardTitle>
        <CardDescription>
          Ustaw hasło wymagane do dostępu do panelu hosta gry
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <div className="relative flex-grow">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Wprowadź hasło do gry"
                className="bg-black/20 pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? 
                  <EyeOff className="h-4 w-4 text-gray-400" /> : 
                  <Eye className="h-4 w-4 text-gray-400" />
                }
              </Button>
            </div>
            <Button 
              onClick={handleSavePassword}
              disabled={isLoading}
            >
              <Save className="mr-2 h-4 w-4" /> Zapisz
            </Button>
          </div>
          
          <div className="text-sm text-white/60">
            <p>Hasło będzie wymagane podczas dostępu do:</p>
            <ul className="list-disc list-inside ml-2 mt-1">
              <li>Panelu hosta</li>
              <li>Ustawień gry</li>
              <li>Podglądu prowadzącego</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GamePasswordSettings;
