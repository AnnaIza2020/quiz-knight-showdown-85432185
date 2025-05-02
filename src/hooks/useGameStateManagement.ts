
import { useState } from 'react';
import { GameRound, Player, Category, Question } from '@/types/game-types';

export const useGameStateManagement = () => {
  // Game state
  const [round, setRound] = useState<GameRound>(GameRound.SETUP);
  const [players, setPlayers] = useState<Player[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(5);
  const [winnerIds, setWinnerIds] = useState<string[]>([]);
  
  // Game settings
  const [gameLogo, setGameLogo] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState('#ff00ff'); // Neon pink
  const [secondaryColor, setSecondaryColor] = useState('#00ffff'); // Neon blue
  const [hostCameraUrl, setHostCameraUrl] = useState('');

  // Player methods
  const addPlayer = (player: Player) => {
    setPlayers((prev) => [...prev, player]);
  };

  const updatePlayer = (updatedPlayer: Player) => {
    setPlayers((prev) =>
      prev.map((player) => (player.id === updatedPlayer.id ? updatedPlayer : player))
    );
  };

  const removePlayer = (playerId: string) => {
    setPlayers((prev) => prev.filter((player) => player.id !== playerId));
  };

  // Category methods
  const addCategory = (category: Category) => {
    setCategories((prev) => [...prev, category]);
  };

  const removeCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((category) => category.id !== categoryId));
  };

  // Question methods
  const selectQuestion = (question: Question | null) => {
    setCurrentQuestion(question);
  };

  // Timer methods
  const startTimer = (seconds: number) => {
    setTimerSeconds(seconds);
    setTimerRunning(true);
  };

  const stopTimer = () => {
    setTimerRunning(false);
  };

  // Player active status
  const setActivePlayer = (playerId: string | null) => {
    setActivePlayerId(playerId);
  };

  return {
    // State
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
    setWinnerIds, // Make sure this is included
    gameLogo,
    setGameLogo,
    primaryColor,
    setPrimaryColor,
    secondaryColor,
    setSecondaryColor,
    hostCameraUrl,
    setHostCameraUrl,
    
    // Methods
    addPlayer,
    updatePlayer,
    removePlayer,
    addCategory,
    removeCategory,
    selectQuestion,
    setActivePlayer,
    startTimer,
    stopTimer,
  };
};
