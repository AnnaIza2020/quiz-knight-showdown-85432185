
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
    setCategories((prev) => {
      // Check if category with this id already exists
      const exists = prev.find(c => c.id === category.id);
      if (exists) {
        // Update existing category
        return prev.map(c => c.id === category.id ? category : c);
      }
      // Add new category
      return [...prev, category];
    });
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

  // Load game data from localStorage if available
  const loadGameData = () => {
    try {
      const savedPlayers = localStorage.getItem('gameShowPlayers');
      if (savedPlayers) {
        setPlayers(JSON.parse(savedPlayers));
      }

      const savedCategories = localStorage.getItem('gameShowCategories');
      if (savedCategories) {
        setCategories(JSON.parse(savedCategories));
      }

      const savedSettings = localStorage.getItem('gameShowSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.primaryColor) setPrimaryColor(settings.primaryColor);
        if (settings.secondaryColor) setSecondaryColor(settings.secondaryColor);
        if (settings.gameLogo) setGameLogo(settings.gameLogo);
        if (settings.hostCameraUrl) setHostCameraUrl(settings.hostCameraUrl);
      }
    } catch (error) {
      console.error('Failed to load game data from localStorage:', error);
    }
  };

  // Save game data to localStorage
  const saveGameData = () => {
    try {
      localStorage.setItem('gameShowPlayers', JSON.stringify(players));
      localStorage.setItem('gameShowCategories', JSON.stringify(categories));
      localStorage.setItem('gameShowSettings', JSON.stringify({
        primaryColor,
        secondaryColor,
        gameLogo,
        hostCameraUrl
      }));
    } catch (error) {
      console.error('Failed to save game data to localStorage:', error);
    }
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
    setWinnerIds,
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
    loadGameData,
    saveGameData,
  };
};
