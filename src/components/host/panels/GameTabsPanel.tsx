
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Users, FileQuestion, Timer } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import PlayerManagement from './PlayerManagement';
import SwitchableHostPanel from '@/components/SwitchableHostPanel';
import { useGameContext } from '@/context/GameContext';

interface GameTabsPanelProps {
  activeView: string;
  setActiveView: (view: string) => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
}

const GameTabsPanel: React.FC<GameTabsPanelProps> = ({
  activeView,
  setActiveView,
  showWelcome,
  setShowWelcome
}) => {
  const { players } = useGameContext();

  // Funkcja addEvent dla komponentu PlayerManagement
  const addEvent = (event: string) => {
    console.log(event); // W rzeczywistym przypadku obsługiwałoby to zdarzenia
  };

  return (
    <Tabs value={activeView} onValueChange={setActiveView} className="flex-grow flex flex-col">
      <TabsList className="w-full grid grid-cols-3 mb-6">
        <TabsTrigger value="preparation" className="text-base py-3">
          <Users size={16} className="mr-2" />
          Przygotowanie do Gry
        </TabsTrigger>
        <TabsTrigger value="gamemanagement" className="text-base py-3">
          <FileQuestion size={16} className="mr-2" />
          Zarządzanie Grą
        </TabsTrigger>
        <TabsTrigger value="timers" className="text-base py-3">
          <Timer size={16} className="mr-2" />
          Narzędzia i Timery
        </TabsTrigger>
      </TabsList>
      
      <div className="mt-4 flex-grow">
        {showWelcome && (
          <Alert className="mb-4 relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => setShowWelcome(false)}
            >
              <X size={16} />
            </Button>
            <AlertDescription>
              Witaj w panelu prowadzącego! Wybierz potrzebne narzędzia i rozpocznij grę.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Preparation Tab */}
        <TabsContent value="preparation" className="h-full">
          <PlayerManagement
            players={players}
            addEvent={addEvent}
          />
        </TabsContent>
        
        {/* Game Management Tab */}
        <TabsContent value="gamemanagement" className="h-full">
          <SwitchableHostPanel view="modern" />
        </TabsContent>
        
        {/* Timers & Tools Tab */}
        <TabsContent value="timers" className="h-full">
          <SwitchableHostPanel view="classic" />
        </TabsContent>
      </div>
    </Tabs>
  );
};

export default GameTabsPanel;
