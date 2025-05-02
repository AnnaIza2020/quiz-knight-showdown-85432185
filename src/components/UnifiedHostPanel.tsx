
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Home, 
  Volume2, 
  VolumeX, 
  Save, 
  PlayCircle, 
  RefreshCw, 
  Maximize, 
  Minimize, 
  Upload, 
  Download, 
  Users,
  FileQuestion,
  Timer
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SwitchableHostPanel from './SwitchableHostPanel';
import { toast } from 'sonner';
import { saveGameEdition, loadGameEdition } from '@/lib/supabase';
import { useFullscreen } from '@/hooks/useFullscreen';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import EventsBar from './hostpanel/EventsBar';
import PlayersGrid from './hostpanel/PlayersGrid';
import { Separator } from '@/components/ui/separator';

const UnifiedHostPanel = () => {
  // State variables
  const [activeView, setActiveView] = useState<string>('preparation');
  const [soundMuted, setSoundMuted] = useState(false);
  const [editionName, setEditionName] = useState('default');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  const [lastEvents, setLastEvents] = useState<string[]>([
    "Panel hosta uruchomiony",
    "Przygotowanie do gry rozpoczęte"
  ]);
  const [availableEditions, setAvailableEditions] = useState<{name: string}[]>([]);
  
  // Context and hooks
  const { 
    loadGameData, 
    saveGameData, 
    setEnabled: setSoundsEnabled, 
    playSound, 
    resetGame,
    setRound,
    round,
    players,
    timerRunning,
    timerSeconds,
    startTimer,
    stopTimer,
  } = useGameContext();
  
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  
  const { isFullscreen, toggleFullscreen } = useFullscreen(panelRef, {
    onEnter: () => addEvent('Tryb pełnoekranowy aktywny'),
    onExit: () => addEvent('Tryb pełnoekranowy wyłączony')
  });

  const { saveGame, loadGame, getSavedGames } = useGamePersistence();

  // Helper function to add events to the event bar
  const addEvent = (event: string) => {
    setLastEvents(prev => [event, ...prev.slice(0, 9)]);
  };

  // Load game data on initial render
  useEffect(() => {
    loadGameData();
    toast.success('Witaj w panelu prowadzącego!', {
      description: 'Wybierz potrzebne narzędzia i rozpocznij grę',
    });
    
    // Load available editions from Supabase
    const fetchEditions = async () => {
      try {
        const response = await fetch('/api/editions');
        if (response.ok) {
          const data = await response.json();
          setAvailableEditions(data.editions || []);
        }
      } catch (error) {
        console.error('Failed to fetch editions:', error);
      }
    };
    
    fetchEditions();
  }, [loadGameData]);

  // Save game data whenever important game state changes
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveGameData();
      addEvent('Stan gry zapisany automatycznie');
    }, 30000); // Save every 30 seconds
    
    // Cleanup
    return () => clearInterval(saveInterval);
  }, [saveGameData]);
  
  // Handle sound toggle
  const toggleSound = () => {
    setSoundMuted(!soundMuted);
    setSoundsEnabled(soundMuted);
    toast.info(soundMuted ? 'Dźwięki włączone' : 'Dźwięki wyciszone');
    addEvent(soundMuted ? 'Dźwięki włączone' : 'Dźwięki wyciszone');
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
      addEvent(`Zapisano edycję "${editionName}"`);
      setSaveDialogOpen(false);
    }
  };

  // Handle load edition
  const handleLoadEdition = async (name: string) => {
    const result = await loadGameEdition(name);
    if (result.success) {
      // Update local storage with loaded data
      if (result.data.players) {
        localStorage.setItem('gameShowPlayers', JSON.stringify(result.data.players));
      }
      if (result.data.categories) {
        localStorage.setItem('gameShowCategories', JSON.stringify(result.data.categories));
      }
      if (result.data.specialCards) {
        localStorage.setItem('gameShowSpecialCards', JSON.stringify(result.data.specialCards));
      }
      if (result.data.specialCardRules) {
        localStorage.setItem('gameShowSpecialCardRules', JSON.stringify(result.data.specialCardRules));
      }
      if (result.data.settings) {
        localStorage.setItem('gameShowSettings', JSON.stringify(result.data.settings));
      }
      
      // Reload game data
      loadGameData();
      toast.success(`Edycja "${name}" wczytana pomyślnie!`);
      addEvent(`Wczytano edycję "${name}"`);
      setLoadDialogOpen(false);
    }
  };
  
  // Save game locally
  const handleSaveLocal = () => {
    const result = saveGame({
      round,
      players,
      categories: [],
      activePlayerId: null,
      winnerIds: [],
      primaryColor: '#ff00ff',
      secondaryColor: '#00ffff',
      hostCameraUrl: '',
      gameLogo: null
    }, `Zapisano ${new Date().toLocaleString()}`);
    
    if (result.success) {
      toast.success('Gra zapisana lokalnie!');
      addEvent('Zapisano grę w pamięci lokalnej');
    } else {
      toast.error('Nie udało się zapisać gry');
    }
  };
  
  // Load game locally
  const handleLoadLocal = () => {
    const saves = getSavedGames();
    if (saves.success && saves.saves.length > 0) {
      const latestSave = saves.saves[0];
      const loadResult = loadGame(latestSave.id);
      
      if (loadResult.success && loadResult.data) {
        // Apply loaded data
        setRound(loadResult.data.round);
        // Additional loading logic would go here
        toast.success(`Wczytano grę: ${latestSave.name}`);
        addEvent(`Wczytano zapisaną grę: ${latestSave.name}`);
      }
    } else {
      toast.error('Nie znaleziono zapisanych gier');
    }
  };
  
  // Start game with intro
  const startGameWithIntro = () => {
    // Only allow starting if we have at least one player
    if (players.length === 0) {
      toast.error('Dodaj co najmniej jednego gracza przed rozpoczęciem gry');
      return;
    }
    
    // Play intro animation
    setIsIntroPlaying(true);
    playSound('round-start');
    addEvent('Rozpoczynanie gry - odtwarzanie czołówki');
    
    // After intro finishes, start round 1
    setTimeout(() => {
      setIsIntroPlaying(false);
      setRound(GameRound.ROUND_ONE);
      addEvent('Runda 1 rozpoczęta!');
      playSound('success');
      // Switch to gamemanagement view
      setActiveView('gamemanagement');
      toast.success('Runda 1 rozpoczęta!');
    }, 5000); // Adjust time according to your intro animation
  };
  
  // Start new game
  const startNewGame = () => {
    resetGame();
    setRound(GameRound.SETUP);
    setActiveView('preparation');
    toast.success('Nowa gra przygotowana!', {
      description: 'Wszystkie dane zostały zresetowane.'
    });
    addEvent('Utworzono nową grę - wszystkie dane zresetowane');
  };

  // Handle timer start
  const handleTimerStart = (seconds: number) => {
    startTimer(seconds);
    addEvent(`Rozpoczęto odliczanie: ${seconds}s`);
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
          
          <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                className="border-white/20 text-white hover:bg-white/10"
                title="Wczytaj edycję"
              >
                <Upload size={20} />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Wczytaj edycję gry</DialogTitle>
                <DialogDescription>
                  Wybierz edycję do wczytania z zapisanych w bazie danych.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 max-h-80 overflow-auto">
                {availableEditions.length > 0 ? (
                  <div className="grid gap-2">
                    {availableEditions.map((edition) => (
                      <Button
                        key={edition.name}
                        variant="outline"
                        className="justify-start"
                        onClick={() => handleLoadEdition(edition.name)}
                      >
                        {edition.name}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">Brak dostępnych edycji</p>
                )}
              </div>
              <div className="flex justify-end">
                <Button variant="outline" onClick={() => setLoadDialogOpen(false)}>
                  Anuluj
                </Button>
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
      
      <div className="mb-4">
        <EventsBar lastEvents={lastEvents} className="mb-4" />
      </div>
      
      <div className="mb-4 flex gap-2">
        {round === GameRound.SETUP && (
          <Button
            variant="default"
            className="bg-neon-green text-black hover:bg-neon-green/80"
            onClick={startGameWithIntro}
            disabled={isIntroPlaying}
          >
            <PlayCircle size={18} className="mr-2" />
            Start gry
          </Button>
        )}
        
        <Button
          variant="outline"
          className="border-neon-blue text-neon-blue hover:bg-neon-blue/20"
          onClick={startNewGame}
        >
          <RefreshCw size={18} className="mr-2" />
          Nowa gra
        </Button>
        
        <Button
          variant="outline"
          className="border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20"
          onClick={handleSaveLocal}
        >
          <Download size={18} className="mr-2" />
          Zapisz lokalnie
        </Button>
        
        <Button
          variant="outline"
          className="border-neon-purple text-neon-purple hover:bg-neon-purple/20"
          onClick={handleLoadLocal}
        >
          <Upload size={18} className="mr-2" />
          Wczytaj lokalnie
        </Button>
      </div>
      
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
          {/* Preparation Tab */}
          <TabsContent value="preparation" className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
              {/* Player Management */}
              <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                <h2 className="text-xl font-bold mb-4 text-white">Zarządzanie Graczami</h2>
                {players.length > 0 ? (
                  <PlayersGrid activePlayers={players} gridSize={10} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 text-white/60">
                    <Users size={48} className="mb-4 opacity-50" />
                    <p className="text-center">Brak graczy. Dodaj graczy w panelu ustawień.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => navigate('/settings')}
                    >
                      Przejdź do ustawień
                    </Button>
                  </div>
                )}
              </div>
              
              {/* Game Preparation */}
              <div className="bg-black/40 p-4 rounded-lg border border-white/10">
                <h2 className="text-xl font-bold mb-4 text-white">Przygotowanie Gry</h2>
                
                <div className="space-y-4">
                  <div className="p-4 border border-white/10 rounded-lg">
                    <h3 className="text-lg font-medium mb-2 text-white">Status Gry</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-white/60">Aktualna runda</p>
                        <p className="text-lg font-bold text-neon-pink">{
                          round === GameRound.SETUP ? 'Przygotowanie' :
                          round === GameRound.ROUND_ONE ? 'Runda 1' :
                          round === GameRound.ROUND_TWO ? 'Runda 2' :
                          round === GameRound.ROUND_THREE ? 'Runda 3' : 'Koniec gry'
                        }</p>
                      </div>
                      <div>
                        <p className="text-sm text-white/60">Liczba graczy</p>
                        <p className="text-lg font-bold text-neon-blue">{players.length}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border border-white/10 rounded-lg">
                    <h3 className="text-lg font-medium mb-4 text-white">Odliczanie do startu</h3>
                    <div className="grid grid-cols-4 gap-2">
                      <Button 
                        variant="outline" 
                        className="border-neon-green text-neon-green hover:bg-neon-green/20"
                        onClick={() => handleTimerStart(5)}
                      >
                        5s
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-neon-blue text-neon-blue hover:bg-neon-blue/20"
                        onClick={() => handleTimerStart(10)}
                      >
                        10s
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-neon-purple text-neon-purple hover:bg-neon-purple/20"
                        onClick={() => handleTimerStart(30)}
                      >
                        30s
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20"
                        onClick={() => handleTimerStart(60)}
                      >
                        60s
                      </Button>
                    </div>
                    {timerRunning && (
                      <div className="mt-4 text-center">
                        <p className="text-2xl font-bold text-neon-green mb-2">{timerSeconds}s</p>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={stopTimer}
                        >
                          Zatrzymaj
                        </Button>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 border border-white/10 rounded-lg">
                    <h3 className="text-lg font-medium mb-2 text-white">Rozpocznij Grę</h3>
                    <p className="text-sm text-white/60 mb-4">
                      Upewnij się, że wszyscy gracze są gotowi przed rozpoczęciem gry.
                      Rozpoczęcie gry wyświetli czołówkę, a następnie przejdzie do Rundy 1.
                    </p>
                    <Button
                      className="w-full bg-neon-green text-black hover:bg-neon-green/80"
                      onClick={startGameWithIntro}
                      disabled={isIntroPlaying || players.length === 0}
                    >
                      <PlayCircle size={18} className="mr-2" />
                      Start gry z czołówką
                    </Button>
                  </div>
                </div>
              </div>
            </div>
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
    </div>
  );
};

export default UnifiedHostPanel;
