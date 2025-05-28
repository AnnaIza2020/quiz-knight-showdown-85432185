
import { useState } from 'react';
import { Player, Question } from '@/types/interfaces';
import { GameRound } from '@/types/game-types';

export const useGameStateManagement = () => {
  const [round, setRound] = useState<GameRound>(GameRound.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);
  const [winnerIds, setWinnerIds] = useState<string[]>([]);
  const [specialCards, setSpecialCards] = useState<any[]>([]);
  const [specialCardRules, setSpecialCardRules] = useState<any[]>([]);
  const [gameLogo, setGameLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#00FFA3');
  const [secondaryColor, setSecondaryColor] = useState('#00E0FF');
  const [hostCameraUrl, setHostCameraUrl] = useState('');

  const addPlayer = (player: Player) => {
    setPlayers(prev => [...prev, player]);
  };

  const updatePlayer = (player: Player) => {
    setPlayers(prev => prev.map(p => p.id === player.id ? player : p));
  };

  const removePlayer = (playerId: string) => {
    setPlayers(prev => prev.filter(p => p.id !== playerId));
  };

  const addCategory = (category: any) => {
    setCategories(prev => [...prev, category]);
  };

  const removeCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(c => c.id !== categoryId));
  };

  const selectQuestion = (question: Question | null) => {
    setCurrentQuestion(question);
  };

  const setActivePlayer = (playerId: string | null) => {
    setActivePlayerId(playerId);
  };

  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  const loadGameData = async () => {
    // Mock implementation
    return Promise.resolve({ success: true });
  };

  const saveGameData = async () => {
    // Mock implementation
    return Promise.resolve({ success: true });
  };

  return {
    round,
    setRound,
    players,
    setPlayers,
    categories,
    setCategories,
    currentQuestion,
    activePlayerId,
    timerRunning,
    setTimerRunning,
    timerSeconds,
    setTimerSeconds,
    winnerIds,
    setWinnerIds,
    specialCards,
    setSpecialCards,
    specialCardRules,
    setSpecialCardRules,
    gameLogo,
    setGameLogo,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    hostCameraUrl,
    setHostCameraUrl,
    addPlayer,
    updatePlayer,
    removePlayer,
    addCategory,
    removeCategory,
    selectQuestion,
    setActivePlayer,
    startTimer,
    stopTimer,
    loadGameData,
    saveGameData
  };
};
