
import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { GameRound } from '@/types/game-types';

// Expanded game save type with metadata
type GameSave = {
  id: string;
  name: string;
  timestamp: number;
  round: GameRound;
  playerCount: number;
  data: {
    round: GameRound;
    players: any[];
    categories: any[];
    currentQuestion: any | null;
    activePlayerId: string | null;
    winnerIds: string[];
    primaryColor: string;
    secondaryColor: string;
    hostCameraUrl: string;
    gameLogo: string | null;
  };
};

const GameSaveManager = () => {
  const {
    round,
    players,
    categories,
    currentQuestion,
    activePlayerId,
    winnerIds,
    primaryColor,
    secondaryColor,
    hostCameraUrl,
    gameLogo,
    setRound,
    setPlayers,
    setCategories,
    selectQuestion,
    setActivePlayer,
    setPrimaryColor,
    setSecondaryColor,
    setHostCameraUrl,
    setGameLogo,
    setWinnerIds,
    playSound
  } = useGameContext();

  const [saves, setSaves] = useState<GameSave[]>([]);
  const [saveName, setSaveName] = useState<string>('');
  const [expanded, setExpanded] = useState<boolean>(false);

  // Load saved games from localStorage on component mount
  useEffect(() => {
    const savedGames = localStorage.getItem('discordGameShowSaves');
    if (savedGames) {
      try {
        setSaves(JSON.parse(savedGames));
      } catch (error) {
        console.error('Failed to parse saved games:', error);
        toast({
          title: "Błąd",
          description: "Nie udało się wczytać zapisanych gier",
          variant: "destructive"
        });
      }
    }
  }, []);

  // Function to save current game state
  const handleSave = () => {
    if (!saveName.trim()) {
      toast({
        title: "Błąd",
        description: "Nazwa zapisu nie może być pusta",
        variant: "destructive"
      });
      return;
    }

    try {
      // Create save object with timestamp and metadata
      const newSave: GameSave = {
        id: Date.now().toString(),
        name: saveName,
        timestamp: Date.now(),
        round,
        playerCount: players.length,
        data: {
          round,
          players,
          categories,
          currentQuestion,
          activePlayerId,
          winnerIds,
          primaryColor,
          secondaryColor,
          hostCameraUrl,
          gameLogo
        }
      };

      // Update saves state
      const updatedSaves = [...saves, newSave];
      setSaves(updatedSaves);

      // Save to localStorage
      localStorage.setItem('discordGameShowSaves', JSON.stringify(updatedSaves));

      // Reset save name
      setSaveName('');

      // Play success sound and show toast
      playSound('success');
      toast({
        title: "Sukces",
        description: "Gra została zapisana pomyślnie",
      });
    } catch (error) {
      console.error('Error saving game:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się zapisać gry",
        variant: "destructive"
      });
    }
  };

  // Function to load a saved game
  const handleLoad = (save: GameSave) => {
    try {
      // Restore game state from save data
      setRound(save.data.round);
      setPlayers(save.data.players);
      setCategories(save.data.categories);
      selectQuestion(save.data.currentQuestion);
      setActivePlayer(save.data.activePlayerId);
      setWinnerIds(save.data.winnerIds || []);
      setPrimaryColor(save.data.primaryColor);
      setSecondaryColor(save.data.secondaryColor);
      setHostCameraUrl(save.data.hostCameraUrl);
      setGameLogo(save.data.gameLogo);

      // Play success sound and show toast
      playSound('success');
      toast({
        title: "Sukces",
        description: `Gra "${save.name}" została wczytana pomyślnie`,
      });
    } catch (error) {
      console.error('Error loading game:', error);
      toast({
        title: "Błąd",
        description: "Nie udało się wczytać gry",
        variant: "destructive"
      });
    }
  };

  // Function to delete a saved game
  const handleDelete = (id: string) => {
    const updatedSaves = saves.filter(save => save.id !== id);
    setSaves(updatedSaves);
    localStorage.setItem('discordGameShowSaves', JSON.stringify(updatedSaves));
    
    playSound('eliminate');
    toast({
      title: "Usunięto",
      description: "Zapis gry został usunięty",
    });
  };

  // Function to format date from timestamp
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleString('pl-PL');
  };

  // Get round name in Polish
  const getRoundName = (round: GameRound): string => {
    switch (round) {
      case GameRound.SETUP:
        return "Przygotowanie";
      case GameRound.ROUND_ONE:
        return "Runda 1";
      case GameRound.ROUND_TWO:
        return "Runda 2";
      case GameRound.ROUND_THREE:
        return "Runda 3";
      case GameRound.FINISHED:
        return "Zakończona";
      default:
        return "Nieznana";
    }
  };

  return (
    <div className="neon-card">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-neon-blue">Zapisywanie Gry</h3>
        <Button
          variant="ghost" 
          size="sm"
          onClick={() => setExpanded(!expanded)}
          className="text-neon-blue"
        >
          {expanded ? 'Zwiń' : 'Rozwiń'}
        </Button>
      </div>

      {expanded && (
        <>
          <div className="flex items-end gap-2 mb-4">
            <div className="flex-grow">
              <Label htmlFor="saveName" className="text-white mb-1 block">Nazwa zapisu</Label>
              <Input
                id="saveName"
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Wprowadź nazwę zapisu"
                className="bg-black/50 border-neon-blue/50 text-white"
              />
            </div>
            <Button 
              onClick={handleSave}
              className="bg-neon-blue hover:bg-blue-600 text-white"
            >
              Zapisz
            </Button>
          </div>

          {saves.length > 0 ? (
            <div className="max-h-60 overflow-y-auto pr-2">
              <div className="space-y-2">
                {saves.map((save) => (
                  <div 
                    key={save.id}
                    className="bg-black/40 border border-neon-blue/30 rounded-md p-2"
                  >
                    <div className="flex justify-between mb-1">
                      <h4 className="text-neon-blue font-medium">{save.name}</h4>
                      <span className="text-xs text-white/60">{formatDate(save.timestamp)}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-white/70 mb-2">
                      <div>
                        {getRoundName(save.round)} • {save.playerCount} graczy
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleLoad(save)}
                        className="text-neon-green border-neon-green/50 hover:bg-neon-green/10 text-xs"
                      >
                        Wczytaj
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDelete(save.id)}
                        className="text-neon-red border-neon-red/50 hover:bg-neon-red/10 text-xs"
                      >
                        Usuń
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-white/60 text-center py-4">
              Brak zapisanych gier. Wprowadź nazwę i kliknij Zapisz, aby utworzyć nowy zapis.
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default GameSaveManager;
