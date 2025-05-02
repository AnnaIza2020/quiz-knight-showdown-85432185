
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import { Button } from '@/components/ui/button';
import { Settings, Home, Volume2, VolumeX, Save, PlayCircle, RefreshCw, Maximize, Minimize } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SwitchableHostPanel from './SwitchableHostPanel';
import { toast } from 'sonner';
import { saveGameEdition } from '@/lib/supabase';
import { useFullscreen } from '@/hooks/useFullscreen';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const UnifiedHostPanel = () => {
  const [activeView, setActiveView] = useState<string>('modern');
  const [soundMuted, setSoundMuted] = useState(false);
  const [editionName, setEditionName] = useState('default');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  
  const { 
    loadGameData, 
    saveGameData, 
    setEnabled: setSoundsEnabled, 
    playSound, 
    resetGame,
    setRound,
    round,
  } = useGameContext();
  
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  
  const { isFullscreen, toggleFullscreen } = useFullscreen(panelRef, {
    onEnter: () => toast.success('Tryb pełnoekranowy aktywny'),
    onExit: () => toast.info('Tryb pełnoekranowy wyłączony')
  });

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
  
  // Handle save edition
  const handleSaveEdition = async () => {
    if (!editionName.trim()) {
      toast.error('Nazwa edycji nie może być pusta');
      return;
    }
    
    // Get all game data to save
    const gameData = {
      players: localStorage.getItem('gameShowPlayers') ? 
        JSON.parse(localStorage.getItem('gameShowPlayers')!) : [],
      categories: localStorage.getItem('gameShowCategories') ? 
        JSON.parse(localStorage.getItem('gameShowCategories')!) : [],
      specialCards: localStorage.getItem('gameShowSpecialCards') ? 
        JSON.parse(localStorage.getItem('gameShowSpecialCards')!) : [],
      specialCardRules: localStorage.getItem('gameShowSpecialCardRules') ? 
        JSON.parse(localStorage.getItem('gameShowSpecialCardRules')!) : [],
      settings: localStorage.getItem('gameShowSettings') ? 
        JSON.parse(localStorage.getItem('gameShowSettings')!) : {},
      savedAt: new Date().toISOString()
    };
    
    // Save to Supabase
    const result = await saveGameEdition(gameData, editionName);
    
    if (result.success) {
      toast.success(`Edycja "${editionName}" zapisana pomyślnie!`);
      setSaveDialogOpen(false);
    }
  };
  
  // Start game with intro
  const startGameWithIntro = () => {
    // Play intro animation
    setIsIntroPlaying(true);
    playSound('round-start');
    
    // After intro finishes, start round 1
    setTimeout(() => {
      setIsIntroPlaying(false);
      setRound(GameRound.ROUND_ONE);
      toast.success('Runda 1 rozpoczęta!');
      playSound('success');
    }, 5000); // Adjust time according to your intro animation
  };
  
  // Start new game
  const startNewGame = () => {
    resetGame();
    toast.success('Nowa gra przygotowana!', {
      description: 'Wszystkie dane zostały zresetowane.'
    });
  };

  return (
    <div ref={panelRef} className="min-h-screen bg-neon-background p-4 flex flex-col">
      {isIntroPlaying && (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
          <div className="text-5xl text-neon-pink animate-pulse font-bold">
            Quiz Knight Showdown
            <div className="text-2xl text-center mt-4 text-white">Rozpoczynamy...</div>
          </div>
        </div>
      )}
      
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
            onClick={toggleFullscreen}
            className="border-white/20 text-white hover:bg-white/10"
            title={isFullscreen ? "Wyjdź z trybu pełnoekranowego" : "Tryb pełnoekranowy"}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </Button>
          
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="border-white/20 text-white hover:bg-white/10"
                title="Zapisz edycję"
              >
                <Save size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Zapisz edycję gry</DialogTitle>
                <DialogDescription>
                  Podaj nazwę edycji, aby zapisać aktualny stan gry, w tym pytania, graczy i ustawienia.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="edition-name" className="text-right">
                    Nazwa
                  </Label>
                  <Input
                    id="edition-name"
                    value={editionName}
                    onChange={(e) => setEditionName(e.target.value)}
                    className="col-span-3"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                  Anuluj
                </Button>
                <Button onClick={handleSaveEdition}>Zapisz</Button>
              </div>
            </DialogContent>
          </Dialog>
          
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
      
      <div className="mb-4 flex gap-2">
        <Button
          variant="default"
          className="bg-neon-green text-black hover:bg-neon-green/80"
          onClick={startGameWithIntro}
          disabled={isIntroPlaying || round !== GameRound.SETUP}
        >
          <PlayCircle size={18} className="mr-2" />
          Start gry
        </Button>
        
        <Button
          variant="outline"
          className="border-neon-blue text-neon-blue hover:bg-neon-blue/20"
          onClick={startNewGame}
        >
          <RefreshCw size={18} className="mr-2" />
          Nowa gra
        </Button>
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
