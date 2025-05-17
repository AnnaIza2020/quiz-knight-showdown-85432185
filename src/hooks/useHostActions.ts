
import { useState, useEffect } from 'react';
import { GameRound } from '@/types/game-types';
import { toast } from 'sonner';
import { useGameContext } from '@/context/GameContext';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import { useSubscription } from '@/hooks/useSubscription';
import { useSoundEffects } from '@/hooks/useSoundEffects';

export const useHostActions = (addEvent: (event: string) => void) => {
  // State variables
  const [soundMuted, setSoundMuted] = useState(false);
  const [welcomeShown, setWelcomeShown] = useState(false);
  
  // Context and hooks
  const { 
    loadGameData: loadContextGameData, 
    saveGameData: saveContextGameData, 
    resetGame,
    setRound,
    round,
    players,
  } = useGameContext();
  
  const { saveGame, loadGame, getSavedGames } = useGamePersistence();
  const { broadcast } = useSubscription('game_events', 'new_event', () => {}, { immediate: false });
  const { playSound, stopAllSounds, soundsEnabled, setSoundsEnabled } = useSoundEffects();
  
  // Load game data on initial render
  useEffect(() => {
    loadContextGameData();
    
    // Show welcome toast just once per session
    if (!welcomeShown) {
      toast.success('Witaj w panelu prowadzącego!', {
        description: 'Wybierz potrzebne narzędzia i rozpocznij grę',
      });
      setWelcomeShown(true);
    }
    
    // Check sound mute status
    setSoundMuted(!soundsEnabled);
  }, []); 

  // Save game data whenever important game state changes
  useEffect(() => {
    const saveInterval = setInterval(() => {
      saveContextGameData();
      addEvent('Stan gry zapisany automatycznie');
    }, 30000); // Save every 30 seconds
    
    // Cleanup
    return () => clearInterval(saveInterval);
  }, [saveContextGameData, addEvent]);
  
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
      
    toast.success('Runda 1 rozpoczęta!');
  };
  
  // Start new game
  const startNewGame = () => {
    resetGame();
    setRound(GameRound.SETUP);
    
    toast.success('Nowa gra przygotowana!', {
      description: 'Wszystkie dane zostały zresetowane.'
    });
    addEvent('Utworzono nową grę - wszystkie dane zresetowane');
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

  return {
    soundMuted,
    toggleSound,
    startGame,
    startNewGame,
    handleSaveLocal,
    handleLoadLocal,
    soundsEnabled,
    playSound
  };
};
