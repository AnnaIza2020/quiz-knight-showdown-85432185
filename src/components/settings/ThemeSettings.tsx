
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useGameState } from '@/context/GameStateContext';
import { toast } from 'sonner';

const ThemeSettings: React.FC = () => {
  const { gameState, updateGameState } = useGameState();

  const handleSave = () => {
    toast.success('Ustawienia motywu zostały zapisane');
  };

  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Ustawienia motywu</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="primary-color" className="text-white">Kolor główny</Label>
              <Input
                id="primary-color"
                type="color"
                defaultValue="#8B5CF6"
                className="h-10"
              />
            </div>
            <div>
              <Label htmlFor="secondary-color" className="text-white">Kolor pomocniczy</Label>
              <Input
                id="secondary-color"
                type="color"
                defaultValue="#06B6D4"
                className="h-10"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="game-logo" className="text-white">URL logo gry</Label>
            <Input
              id="game-logo"
              placeholder="https://example.com/logo.png"
              className="bg-black/50 text-white"
            />
          </div>

          <div>
            <Label htmlFor="host-camera" className="text-white">URL kamery hosta</Label>
            <Input
              id="host-camera"
              placeholder="https://example.com/camera-feed"
              className="bg-black/50 text-white"
            />
          </div>

          <Button onClick={handleSave} className="w-full">
            Zapisz ustawienia
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeSettings;
