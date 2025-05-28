
import { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import { toast } from 'sonner';

export const useHostActions = () => {
  const { 
    round, 
    setRound, 
    players, 
    setPlayers,
    playSound,
    addLog 
  } = useGameContext();
  
  const [events, setEvents] = useState<string[]>([]);

  const addEvent = (event: string) => {
    const timestamp = new Date().toLocaleTimeString();
    const eventWithTime = `[${timestamp}] ${event}`;
    setEvents(prev => [eventWithTime, ...prev.slice(0, 9)]);
    addLog(event);
  };

  const startGame = () => {
    setRound(GameRound.ROUND_ONE);
    playSound('round-start');
    addEvent('Gra rozpoczęta!');
    toast.success('Gra rozpoczęta!');
  };

  const startNewGame = () => {
    setRound(GameRound.SETUP);
    setPlayers([]);
    addEvent('Nowa gra rozpoczęta');
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
      addEvent('Gra zapisana lokalnie');
      toast.success('Gra zapisana lokalnie');
    } catch (error) {
      addEvent('Błąd zapisywania gry');
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
        addEvent('Gra wczytana z pamięci lokalnej');
        toast.success('Gra wczytana pomyślnie');
      } else {
        toast.error('Brak zapisanych danych');
      }
    } catch (error) {
      addEvent('Błąd wczytywania gry');
      toast.error('Błąd wczytywania gry');
    }
  };

  return {
    events,
    addEvent,
    startGame,
    startNewGame,
    handleSaveLocal,
    handleLoadLocal
  };
};
