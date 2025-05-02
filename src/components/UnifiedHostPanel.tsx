
import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGameContext } from '@/context/GameContext';
import Host from '@/pages/Host';
import HostPanel from '@/pages/HostPanel';
import { Button } from '@/components/ui/button';
import { Settings, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SwitchableHostPanel from './SwitchableHostPanel';

const UnifiedHostPanel = () => {
  const [activeView, setActiveView] = useState<string>('modern');
  const { round, loadGameData, saveGameData } = useGameContext();
  const navigate = useNavigate();

  // Load game data on initial render
  useEffect(() => {
    loadGameData();
  }, [loadGameData]);

  // Save game data whenever important game state changes
  useEffect(() => {
    saveGameData();
  }, [round, saveGameData]);

  return (
    <div className="min-h-screen bg-neon-background p-4 flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-white">Panel Prowadzącego</h1>
        <div className="flex gap-2">
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
