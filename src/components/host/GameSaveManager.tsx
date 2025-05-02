
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';

const GameSaveManager = () => {
  const { 
    players, 
    categories,
    round,
    currentQuestion,
    activePlayerId,
    winnerIds,
    gameLogo,
    primaryColor,
    secondaryColor,
    hostCameraUrl,
    
    // Methods for loading the game state
    setPlayers,
    setCategories,
    setRound,
    selectQuestion,
    setActivePlayer,
    setWinnerIds,
    setGameLogo,
    setPrimaryColor,
    setSecondaryColor,
    setHostCameraUrl
  } = useGameContext();
  
  const [saveSlots, setSaveSlots] = useState<string[]>(() => {
    // Get save slots from localStorage
    const slots = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('discord-game-save-')) {
        slots.push(key.replace('discord-game-save-', ''));
      }
    }
    return slots;
  });
  
  const handleSaveGame = () => {
    try {
      // Create a timestamp for the save name
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const saveName = `discord-game-save-${timestamp}`;
      
      // Create the save data
      const saveData = {
        players,
        categories,
        round,
        currentQuestion,
        activePlayerId,
        winnerIds,
        gameLogo,
        primaryColor,
        secondaryColor,
        hostCameraUrl,
        savedAt: new Date().toISOString()
      };
      
      // Save to localStorage
      localStorage.setItem(saveName, JSON.stringify(saveData));
      
      // Update save slots
      setSaveSlots([...saveSlots, timestamp]);
      
      toast.success('Gra została zapisana pomyślnie!');
    } catch (error) {
      console.error('Error saving game:', error);
      toast.error('Nie udało się zapisać gry. Spróbuj ponownie.');
    }
  };
  
  const handleLoadGame = (timestamp: string) => {
    try {
      // Get the save data from localStorage
      const saveData = JSON.parse(localStorage.getItem(`discord-game-save-${timestamp}`) || '{}');
      
      if (!saveData.players || !saveData.categories) {
        throw new Error('Nieprawidłowe dane zapisu');
      }
      
      // Load the game state
      setPlayers(saveData.players);
      setCategories(saveData.categories);
      setRound(saveData.round);
      selectQuestion(saveData.currentQuestion);
      setActivePlayer(saveData.activePlayerId);
      setWinnerIds(saveData.winnerIds || []);
      
      // Load settings
      if (saveData.gameLogo) setGameLogo(saveData.gameLogo);
      if (saveData.primaryColor) setPrimaryColor(saveData.primaryColor);
      if (saveData.secondaryColor) setSecondaryColor(saveData.secondaryColor);
      if (saveData.hostCameraUrl) setHostCameraUrl(saveData.hostCameraUrl);
      
      toast.success('Gra została załadowana pomyślnie!');
    } catch (error) {
      console.error('Error loading game:', error);
      toast.error('Nie udało się załadować gry. Spróbuj ponownie.');
    }
  };
  
  const handleDeleteSave = (timestamp: string) => {
    try {
      // Remove from localStorage
      localStorage.removeItem(`discord-game-save-${timestamp}`);
      
      // Update save slots
      setSaveSlots(saveSlots.filter(slot => slot !== timestamp));
      
      toast.success('Zapis gry został usunięty.');
    } catch (error) {
      console.error('Error deleting save:', error);
      toast.error('Nie udało się usunąć zapisu gry.');
    }
  };
  
  // Format the timestamp for display
  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp.replace(/-/g, ':')).toLocaleString('pl-PL');
    } catch (e) {
      return timestamp;
    }
  };
  
  return (
    <div className="neon-card">
      <h2 className="text-xl font-bold mb-4 text-white">Zapisane Gry</h2>
      
      <div className="flex flex-col gap-4">
        <button
          onClick={handleSaveGame}
          className="neon-button bg-gradient-to-r from-neon-green to-neon-blue"
        >
          Zapisz aktualny stan gry
        </button>
        
        {saveSlots.length > 0 ? (
          <div className="max-h-48 overflow-y-auto pr-2 space-y-2">
            {saveSlots.map((timestamp) => (
              <div 
                key={timestamp} 
                className="flex justify-between items-center p-2 bg-black/30 rounded border border-neon-blue/30"
              >
                <div className="text-white truncate max-w-xs">
                  {formatTimestamp(timestamp)}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleLoadGame(timestamp)}
                    className="px-2 py-1 bg-black/50 text-neon-green border border-neon-green/50 rounded text-sm hover:bg-neon-green/20"
                  >
                    Wczytaj
                  </button>
                  <button
                    onClick={() => handleDeleteSave(timestamp)}
                    className="px-2 py-1 bg-black/50 text-neon-red border border-neon-red/50 rounded text-sm hover:bg-neon-red/20"
                  >
                    Usuń
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-white/60 p-4">
            Brak zapisanych gier
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSaveManager;
