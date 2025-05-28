
import { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import { toast } from 'sonner';

export const useHostActions = (addEvent?: (event: string) => void) => {
  const { 
    round, 
    setRound, 
    players, 
    setPlayers,
    playSound,
    addLog,
    soundsEnabled,
    setSoundsEnabled
  } = useGameContext();
  
  const [events, setEvents] = useState<string[]>([]);
  const [soundMuted, setSoundMuted] = useState(!soundsEnabled);

  const addHostEvent = (event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const eventWithTime = `[${timestamp}] ${event}`;
    setEvents(prev => [eventWithTime, ...prev.slice(0, 9)]);
    if (addEvent) addEvent(event);
    addLog(event);
  };

  const startGame = () => {
    setRound(GameRound.ROUND_ONE);
    playSound('round-start');
    addHostEvent('Gra rozpoczęta!');
    toast.success('Gra rozpoczęta!');
  };

  const startNewGame = () => {
    setRound(GameRound.SETUP);
    setPlayers([]);
    addHostEvent('Nowa gra rozpoczęta');
    toast.info('Nowa gra rozpoczęta');
  };

  const handleSaveLocal = () => {
    try {
      const gameData = {
        players,
        round,
        timestamp: Date.now()
      };
      localStorage.setItem('gameData', JSON.stringify(gameData));
      addHostEvent('Gra zapisana lokalnie');
      toast.success('Gra zapisana lokalnie');
    } catch (error) {
      addHostEvent('Błąd zapisywania gry');
      toast.error('Błąd zapisywania gry');
    }
  };

  const handleLoadLocal = () => {
    try {
      const savedData = localStorage.getItem('gameData');
      if (savedData) {
        const gameData = JSON.parse(savedData);
        setPlayers(gameData.players || []);
        setRound(gameData.round || GameRound.SETUP);
        addHostEvent('Gra wczytana z pamięci lokalnej');
        toast.success('Gra wczytana pomyślnie');
      } else {
        toast.error('Brak zapisanych danych');
      }
    } catch (error) {
      addHostEvent('Błąd wczytywania gry');
      toast.error('Błąd wczytywania gry');
    }
  };

  const toggleSound = () => {
    const newSoundState = !soundsEnabled;
    setSoundsEnabled(newSoundState);
    setSoundMuted(!newSoundState);
    toast.info(newSoundState ? 'Dźwięki włączone' : 'Dźwięki wyłączone');
  };

  return {
    events,
    addEvent: addHostEvent,
    startGame,
    startNewGame,
    handleSaveLocal,
    handleLoadLocal,
    soundMuted,
    toggleSound
  };
};
