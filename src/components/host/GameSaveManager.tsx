
import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { useGamePersistence } from '@/hooks/useGamePersistence';
import { GameRound } from '@/types/game-types';

interface GameSaveManagerProps {
  className?: string;
}

const GameSaveManager: React.FC<GameSaveManagerProps> = ({ className }) => {
  const { 
    round, 
    players, 
    categories, 
    activePlayerId, 
    winnerIds,
    primaryColor,
    secondaryColor,
    hostCameraUrl,
    gameLogo,
    setRound,
    setPlayers,
    setCategories,
    setActivePlayer,
    setWinnerIds,
    setPrimaryColor,
    setSecondaryColor,
    setHostCameraUrl,
    setGameLogo,
    playSound
  } = useGameContext();
  
  const { saveGame, loadGame, getSavedGames, deleteSavedGame } = useGamePersistence();
  
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [savedGames, setSavedGames] = useState<Array<{id: string; name: string; timestamp: number; round: GameRound}>>([]);
  const [saveMessage, setSaveMessage] = useState('');
  
  useEffect(() => {
    // Load saved games list when component mounts or dialogs open
    if (loadDialogOpen) {
      const result = getSavedGames();
      if (result.success) {
        setSavedGames(result.saves);
      }
    }
  }, [getSavedGames, loadDialogOpen]);
  
  const handleSaveGame = () => {
    if (!saveName.trim()) {
      setSaveMessage('Podaj nazwę zapisu');
      return;
    }
    
    const gameState = {
      round,
      players,
      categories,
      activePlayerId,
      winnerIds,
      primaryColor,
      secondaryColor,
      hostCameraUrl,
      gameLogo
    };
    
    const result = saveGame(gameState, saveName);
    
    if (result.success) {
      playSound('success');
      setSaveMessage('Gra została zapisana!');
      setSaveName('');
      setTimeout(() => {
        setSaveDialogOpen(false);
        setSaveMessage('');
      }, 1500);
    } else {
      playSound('fail');
      setSaveMessage(result.error || 'Wystąpił błąd podczas zapisywania gry');
    }
  };
  
  const handleLoadGame = (saveId: string) => {
    const result = loadGame(saveId);
    
    if (result.success && result.data) {
      // Update game state with loaded data
      setRound(result.data.round);
      setPlayers(result.data.players);
      setCategories(result.data.categories);
      setActivePlayer(result.data.activePlayerId);
      setWinnerIds(result.data.winnerIds);
      setPrimaryColor(result.data.primaryColor);
      setSecondaryColor(result.data.secondaryColor);
      setHostCameraUrl(result.data.hostCameraUrl);
      setGameLogo(result.data.gameLogo);
      
      playSound('success');
      setLoadDialogOpen(false);
    } else {
      playSound('fail');
      setSaveMessage(result.error || 'Wystąpił błąd podczas wczytywania gry');
    }
  };
  
  const handleDeleteSave = (saveId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    const result = deleteSavedGame(saveId);
    if (result.success) {
      playSound('eliminate');
      // Update the list
      setSavedGames(prev => prev.filter(save => save.id !== saveId));
    } else {
      playSound('fail');
      setSaveMessage(result.error || 'Wystąpił błąd podczas usuwania zapisu');
    }
  };
  
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };
  
  const getRoundName = (round: GameRound) => {
    switch (round) {
      case GameRound.SETUP: return "Przygotowanie";
      case GameRound.ROUND_ONE: return "Runda 1";
      case GameRound.ROUND_TWO: return "Runda 2";
      case GameRound.ROUND_THREE: return "Runda 3";
      case GameRound.FINISHED: return "Koniec gry";
      default: return "Nieznana runda";
    }
  };
  
  return (
    <div className={`${className || ''}`}>
      <div className="flex gap-2">
        <button
          onClick={() => setSaveDialogOpen(true)}
          className="py-2 px-4 bg-black border-2 border-neon-green text-neon-green rounded-md font-bold
                    hover:bg-neon-green/20"
        >
          Zapisz grę
        </button>
        
        <button
          onClick={() => setLoadDialogOpen(true)}
          className="py-2 px-4 bg-black border-2 border-neon-blue text-neon-blue rounded-md font-bold
                    hover:bg-neon-blue/20"
        >
          Wczytaj grę
        </button>
      </div>
      
      {/* Save game dialog */}
      {saveDialogOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="neon-card w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-neon-green">Zapisz obecną grę</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-white mb-1">Nazwa zapisu</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-black/50 border border-neon-green/50 rounded text-white"
                  value={saveName}
                  onChange={(e) => setSaveName(e.target.value)}
                  placeholder="Nazwa zapisu gry"
                />
              </div>
              
              {saveMessage && (
                <div className="text-center text-neon-pink">{saveMessage}</div>
              )}
              
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setSaveDialogOpen(false);
                    setSaveName('');
                    setSaveMessage('');
                  }}
                  className="py-2 px-4 bg-black border border-white/30 text-white/70 rounded"
                >
                  Anuluj
                </button>
                
                <button
                  onClick={handleSaveGame}
                  className="py-2 px-4 bg-black border-2 border-neon-green text-neon-green rounded font-bold
                           hover:bg-neon-green/20"
                >
                  Zapisz
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Load game dialog */}
      {loadDialogOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="neon-card w-full max-w-xl">
            <h2 className="text-xl font-bold mb-4 text-neon-blue">Wczytaj zapisaną grę</h2>
            
            {savedGames.length === 0 ? (
              <div className="text-center text-white/60 my-8">
                Brak zapisanych gier
              </div>
            ) : (
              <div className="max-h-80 overflow-y-auto space-y-2">
                {savedGames.map((save) => (
                  <div 
                    key={save.id}
                    onClick={() => handleLoadGame(save.id)}
                    className="p-3 bg-black/50 border border-neon-blue/30 rounded cursor-pointer hover:border-neon-blue"
                  >
                    <div className="flex justify-between">
                      <div className="font-bold text-white">{save.name}</div>
                      <button
                        onClick={(e) => handleDeleteSave(save.id, e)}
                        className="text-neon-red hover:text-neon-pink"
                      >
                        Usuń
                      </button>
                    </div>
                    <div className="text-sm text-white/70 flex justify-between">
                      <div>{getRoundName(save.round)}</div>
                      <div>{formatDate(save.timestamp)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {saveMessage && (
              <div className="text-center text-neon-pink mt-4">{saveMessage}</div>
            )}
            
            <div className="flex justify-end mt-4">
              <button
                onClick={() => {
                  setLoadDialogOpen(false);
                  setSaveMessage('');
                }}
                className="py-2 px-4 bg-black border border-white/30 text-white/70 rounded"
              >
                Zamknij
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameSaveManager;
