
import React, { useState, useEffect, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import { Users, FileQuestion, Timer } from 'lucide-react';
import { toast } from 'sonner';
import { saveGameEdition, loadGameEdition } from '@/lib/supabase';
import { useFullscreen } from '@/hooks/useFullscreen';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import { useSubscription } from '@/hooks/useSubscription';
import { useSoundEffects } from '@/hooks/useSoundEffects';
import EventsBar from './hostpanel/EventsBar';
import SwitchableHostPanel from './SwitchableHostPanel';
import TopBarControls from './hostpanel/TopBarControls';
import GameActionButtons from './hostpanel/GameActionButtons';
import PreparationView from './hostpanel/PreparationView';

const UnifiedHostPanel = () => {
  // State variables
  const [activeView, setActiveView] = useState<string>('preparation');
  const [soundMuted, setSoundMuted] = useState(false);
  const [editionName, setEditionName] = useState('default');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [lastEvents, setLastEvents] = useState<string[]>([
    "Panel hosta uruchomiony"
  ]);
  const [availableEditions, setAvailableEditions] = useState<{name: string}[]>([]);
  const [welcomeShown, setWelcomeShown] = useState(false);
  
  // Context and hooks
  const { 
    loadGameData, 
    saveGameData, 
    resetGame,
    setRound,
    round,
    players,
    timerRunning,
    timerSeconds,
    startTimer,
    stopTimer,
  } = useGameContext();
  
  const panelRef = useRef<HTMLDivElement>(null);
  const { isFullscreen, toggleFullscreen } = useFullscreen(panelRef, {
    onEnter: () => addEvent('Tryb pełnoekranowy aktywny'),
    onExit: () => addEvent('Tryb pełnoekranowy wyłączony')
  });

  const { saveGame, loadGame, getSavedGames } = useGamePersistence();
  const { broadcast } = useSubscription('game_events', 'new_event', () => {}, { immediate: false });
  const { playSound, stopAllSounds, enabled: soundsEnabled, setEnabled: setSoundsEnabled } = useSoundEffects({
    useLocalStorage: true
  });

  // Helper function to add events to the event bar
  const addEvent = (event: string) => {
    setLastEvents(prev => [event, ...prev.slice(0, 9)]);
  };

  // Load game data on initial render
  useEffect(() => {
    loadGameData();
    
    // Show welcome toast just once per session
    if (!welcomeShown) {
      toast.success('Witaj w panelu prowadzącego!', {
        description: 'Wybierz potrzebne narzędzia i rozpocznij grę',
      });
      setWelcomeShown(true);
    }
    
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
    
    // Check sound mute status
    setSoundMuted(!soundsEnabled);
  }, []); // Run only once on component mount

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
    
    // Broadcast sound setting to overlay
    broadcast({
      type: 'sound_control',
      action: soundMuted ? 'play' : 'stop'
    });
  };
  
  // Load intro setting from localStorage
  useEffect(() => {
    const savedSetting = localStorage.getItem('showIntroOnLoad');
    if (savedSetting !== null) {
      // Remove this setting as we're not using it anymore
      localStorage.removeItem('showIntroOnLoad');
    }
  }, []);
  
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
  
  // Start game (simplified, no intro)
  const startGame = () => {
    // Only allow starting if we have at least one player
    if (players.length === 0) {
      toast.error('Dodaj co najmniej jednego gracza przed rozpoczęciem gry');
      return;
    }
    
    setRound(GameRound.ROUND_ONE);
    addEvent('Runda 1 rozpoczęta!');
    playSound('success');
      
    // Switch to gamemanagement view
    setActiveView('gamemanagement');
    toast.success('Runda 1 rozpoczęta!');
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
      <TopBarControls
        soundMuted={soundMuted}
        toggleSound={toggleSound}
        isFullscreen={isFullscreen}
        toggleFullscreen={toggleFullscreen}
        setSaveDialogOpen={setSaveDialogOpen}
        saveDialogOpen={saveDialogOpen}
        setLoadDialogOpen={setLoadDialogOpen}
        loadDialogOpen={loadDialogOpen}
        editionName={editionName}
        setEditionName={setEditionName}
        handleSaveEdition={handleSaveEdition}
        handleLoadEdition={handleLoadEdition}
        availableEditions={availableEditions}
      />
      
      <div className="mb-4">
        <EventsBar lastEvents={lastEvents} className="mb-4" />
      </div>
      
      <div className="mb-4 flex flex-wrap gap-2">
        {round === GameRound.SETUP && (
          <button
            className="bg-neon-green text-black hover:bg-neon-green/80 rounded-md px-4 py-2 flex items-center"
            onClick={startGame}
          >
            Start gry
          </button>
        )}
        
        <button
          className="border-neon-blue text-neon-blue hover:bg-neon-blue/20 border rounded-md px-4 py-2 flex items-center"
          onClick={startNewGame}
        >
          Nowa gra
        </button>
        
        <button
          className="border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20 border rounded-md px-4 py-2 flex items-center"
          onClick={handleSaveLocal}
        >
          Zapisz lokalnie
        </button>
        
        <button
          className="border-neon-purple text-neon-purple hover:bg-neon-purple/20 border rounded-md px-4 py-2 flex items-center"
          onClick={handleLoadLocal}
        >
          Wczytaj lokalnie
        </button>
        
        <button
          className="border-neon-pink text-neon-pink hover:bg-neon-pink/20 border rounded-md px-4 py-2 flex items-center"
          onClick={toggleSound}
        >
          {soundMuted ? "Włącz dźwięk" : "Wycisz dźwięk"}
        </button>
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
            <PreparationView
              players={players}
              addEvent={addEvent}
              handleTimerStart={handleTimerStart}
              timerRunning={timerRunning}
              timerSeconds={timerSeconds}
              stopTimer={stopTimer}
              startGame={startGame}
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
    </div>
  );
};

export default UnifiedHostPanel;
