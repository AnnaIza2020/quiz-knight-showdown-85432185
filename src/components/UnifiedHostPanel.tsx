
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
  const [isIntroPlaying, setIsIntroPlaying] = useState(false);
  const [showIntroOnLoad, setShowIntroOnLoad] = useState(true);
  const [lastEvents, setLastEvents] = useState<string[]>([
    "Panel hosta uruchomiony",
    "Przygotowanie do gry rozpoczęte"
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
  
  // Toggle intro display on overlay load
  const toggleShowIntroOnLoad = () => {
    setShowIntroOnLoad(!showIntroOnLoad);
    localStorage.setItem('showIntroOnLoad', (!showIntroOnLoad).toString());
    toast.info(!showIntroOnLoad ? 'Intro będzie pokazywane przy starcie' : 'Intro wyłączone przy starcie');
    addEvent(!showIntroOnLoad ? 'Włączono wyświetlanie intro przy starcie' : 'Wyłączono wyświetlanie intro przy starcie');
  };
  
  // Load intro setting from localStorage
  useEffect(() => {
    const savedSetting = localStorage.getItem('showIntroOnLoad');
    if (savedSetting !== null) {
      setShowIntroOnLoad(savedSetting === 'true');
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
    
    // Show intro on overlay
    broadcast({
      type: 'intro_control',
      action: 'show',
      event: 'Wyświetlanie czołówki na scenie'
    });
    
    // After intro finishes, start round 1
    setTimeout(() => {
      setIsIntroPlaying(false);
      setRound(GameRound.ROUND_ONE);
      addEvent('Runda 1 rozpoczęta!');
      playSound('success');
      
      // Hide intro on overlay
      broadcast({
        type: 'intro_control',
        action: 'hide',
        event: 'Czołówka zakończona, rozpoczynamy grę'
      });
      
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
    
    // Show intro if enabled
    if (showIntroOnLoad) {
      broadcast({
        type: 'intro_control',
        action: 'show',
        event: 'Nowa gra - wyświetlanie czołówki'
      });
    }
    
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
          <div className="text-5xl text-neon-pink font-bold">
            Quiz Knight Showdown
            <div className="text-2xl text-center mt-4 text-white">Rozpoczynamy...</div>
          </div>
        </div>
      )}
      
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
      
      <GameActionButtons
        round={round}
        isIntroPlaying={isIntroPlaying}
        startGameWithIntro={startGameWithIntro}
        startNewGame={startNewGame}
        handleSaveLocal={handleSaveLocal}
        handleLoadLocal={handleLoadLocal}
        isMuted={soundMuted}
        toggleMute={toggleSound}
        showIntroOnLoad={showIntroOnLoad}
        toggleShowIntroOnLoad={toggleShowIntroOnLoad}
      />
      
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
              isIntroPlaying={isIntroPlaying}
              handleTimerStart={handleTimerStart}
              timerRunning={timerRunning}
              timerSeconds={timerSeconds}
              stopTimer={stopTimer}
              startGameWithIntro={startGameWithIntro}
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
