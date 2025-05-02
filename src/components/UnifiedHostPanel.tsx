
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Settings, Home, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SwitchableHostPanel from './SwitchableHostPanel';
import { toast } from 'sonner';

const UnifiedHostPanel = () => {
  const [activeView, setActiveView] = useState<string>('modern');
  const [soundMuted, setSoundMuted] = useState(false);
  const { loadGameData, saveGameData, setEnabled: setSoundsEnabled } = useGameContext();
  const navigate = useNavigate();

  // Load game data on initial render
  useEffect(() => {
    loadGameData();
    toast.success('Witaj w panelu prowadzącego!', {
      description: 'Wybierz potrzebne narzędzia i rozpocznij grę',
    });
  }, [loadGameData]);

  // Save game data whenever important game state changes
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGameData();
    }, 30000); // Save every 30 seconds
    
    // Cleanup
    return () => clearInterval(saveInterval);
  }, [saveGameData]);
  
  // Handle sound toggle
  const toggleSound = () => {
    setSoundMuted(!soundMuted);
    setSoundsEnabled(soundMuted);
    toast.info(soundMuted ? 'Dźwięki włączone' : 'Dźwięki wyciszone');
  };

  return (
    <div className="min-h-screen bg-neon-background p-4 flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Panel Prowadzącego</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleSound}
            className="border-white/20 text-white hover:bg-white/10"
          >
            {soundMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Home size={20} />
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/settings')}
            className="border-white/20 text-white hover:bg-white/10"
          >
            <Settings size={20} />
          </Button>
        </div>
      </div>
      
      <Tabs value={activeView} onValueChange={setActiveView} className="flex-grow flex flex-col">
        <TabsList className="w-full grid grid-cols-2 mb-6">
          <TabsTrigger value="modern" className="text-base py-3">
            Panel Nowoczesny
          </TabsTrigger>
          <TabsTrigger value="classic" className="text-base py-3">
            Panel Klasyczny
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-4 flex-grow">
          <TabsContent value="modern" className="h-full">
            <SwitchableHostPanel view="modern" />
          </TabsContent>
          <TabsContent value="classic" className="h-full">
            <SwitchableHostPanel view="classic" />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default UnifiedHostPanel;
