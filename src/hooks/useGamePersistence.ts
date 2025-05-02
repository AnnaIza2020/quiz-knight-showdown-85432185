import { useCallback } from 'react';
import { GameRound, Player, Category } from '@/types/game-types';

// Define what game state we'll save
interface GameSaveState {
  round: GameRound;
  players: Player[];
  categories: Category[];
  activePlayerId: string | null;
  winnerIds: string[];
  primaryColor: string;
  secondaryColor: string;
  hostCameraUrl: string;
  gameLogo: string | null;
  timestamp: number;
  saveName: string;
}

// Keep track of the saves with a simple structure
interface GameSaveList {
  saves: {
    id: string;
    name: string;
    timestamp: number;
    round: GameRound;
  }[];
}

export const useGamePersistence = () => {
  // Save the current game state
  const saveGame = useCallback((state: Omit<GameSaveState, 'timestamp' | 'saveName'>, saveName: string) => {
    try {
      // Generate a unique ID for this save
      const saveId = `game_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // Get the current save list or initialize a new one
      const saveListJson = localStorage.getItem('discord_game_show_saves');
      const saveList: GameSaveList = saveListJson 
        ? JSON.parse(saveListJson) 
        : { saves: [] };
      
      // Create the full save data
      const saveData: GameSaveState = {
        ...state,
        timestamp: Date.now(),
        saveName: saveName || `Save ${saveList.saves.length + 1}`
      };
      
      // Update the save list
      saveList.saves.push({
        id: saveId,
        name: saveData.saveName,
        timestamp: saveData.timestamp,
        round: saveData.round
      });
      
      // Save both the list and the actual save data
      localStorage.setItem('discord_game_show_saves', JSON.stringify(saveList));
      localStorage.setItem(saveId, JSON.stringify(saveData));
      
      return {
        success: true,
        saveId
      };
    } catch (error) {
      console.error("Failed to save game:", error);
      return {
        success: false,
        error: "Nie udało się zapisać gry"
      };
    }
  }, []);
  
  // Load a saved game
  const loadGame = useCallback((saveId: string) => {
    try {
      const saveDataJson = localStorage.getItem(saveId);
      if (!saveDataJson) {
        return {
          success: false,
          error: "Nie znaleziono zapisu gry"
        };
      }
      
      const saveData: GameSaveState = JSON.parse(saveDataJson);
      return {
        success: true,
        data: saveData
      };
    } catch (error) {
      console.error("Failed to load game:", error);
      return {
        success: false,
        error: "Nie udało się wczytać gry"
      };
    }
  }, []);
  
  // Get the list of all saved games
  const getSavedGames = useCallback(() => {
    try {
      const saveListJson = localStorage.getItem('discord_game_show_saves');
      if (!saveListJson) {
        return {
          success: true,
          saves: []
        };
      }
      
      const saveList: GameSaveList = JSON.parse(saveListJson);
      return {
        success: true,
        saves: saveList.saves.sort((a, b) => b.timestamp - a.timestamp)
      };
    } catch (error) {
      console.error("Failed to get saved games:", error);
      return {
        success: false,
        error: "Nie udało się pobrać listy zapisanych gier",
        saves: []
      };
    }
  }, []);
  
  // Delete a saved game
  const deleteSavedGame = useCallback((saveId: string) => {
    try {
      // Get the save list
      const saveListJson = localStorage.getItem('discord_game_show_saves');
      if (!saveListJson) {
        return {
          success: false,
          error: "Nie znaleziono listy zapisanych gier"
        };
      }
      
      // Remove the save from the list
      const saveList: GameSaveList = JSON.parse(saveListJson);
      saveList.saves = saveList.saves.filter(save => save.id !== saveId);
      localStorage.setItem('discord_game_show_saves', JSON.stringify(saveList));
      
      // Delete the save data
      localStorage.removeItem(saveId);
      
      return {
        success: true
      };
    } catch (error) {
      console.error("Failed to delete saved game:", error);
      return {
        success: false,
        error: "Nie udało się usunąć zapisanej gry"
      };
    }
  }, []);
  
  return {
    saveGame,
    loadGame,
    getSavedGames,
    deleteSavedGame
  };
};
