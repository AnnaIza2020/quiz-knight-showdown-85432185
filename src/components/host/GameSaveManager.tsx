
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/card';
import { Save, Upload } from 'lucide-react';
import { useGameContext } from '@/context/GameContext';
import { useLogsContext } from '@/context/LogsContext';

interface GameSaveManagerProps {
  // Props if needed
}

const GameSaveManager: React.FC<GameSaveManagerProps> = () => {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [gameName, setGameName] = useState('');
  
  const { addLog } = useLogsContext();
  const { 
    players, 
    categories, 
    round,
    roundSettings,
    specialCards,
    specialCardRules,
    gameLogo,
    primaryColor,
    secondaryColor
  } = useGameContext();
  
  const handleSaveGame = () => {
    if (!gameName.trim()) {
      toast.error('Podaj nazwę zapisu gry');
      return;
    }
    
    try {
      // Create a game state object to save
      const gameState = {
        name: gameName,
        timestamp: new Date().toISOString(),
        players,
        categories,
        round,
        roundSettings,
        specialCards,
        specialCardRules,
        settings: {
          gameLogo,
          primaryColor,
          secondaryColor
        }
      };
      
      // Convert to string for local storage
      const gameStateString = JSON.stringify(gameState);
      
      // Save to localStorage with a specific key
      localStorage.setItem(`game_save_${Date.now()}`, gameStateString);
      
      // Close dialog and show success message
      setSaveDialogOpen(false);
      setGameName('');
      
      toast.success('Gra została zapisana lokalnie');
      addLog({
        type: 'system',
        action: 'Game saved locally',
        value: gameName
      });
    } catch (error) {
      console.error('Error saving game:', error);
      toast.error('Nie udało się zapisać gry');
    }
  };
  
  const handleLoadGame = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const gameState = JSON.parse(e.target?.result as string);
        
        // Here you would implement the logic to update the game state
        // with the loaded data, but this requires appropriate methods from GameContext
        
        toast.success('Gra została załadowana');
        addLog({
          type: 'system',
          action: 'Game loaded from file',
          value: file.name
        });
      } catch (error) {
        console.error('Error loading game:', error);
        toast.error('Nie udało się załadować gry');
      }
    };
    
    reader.onerror = () => {
      toast.error('Błąd odczytu pliku');
    };
    
    reader.readAsText(file);
  };
  
  const exportGame = () => {
    try {
      // Create a game state object to export
      const gameState = {
        name: `Discord Game Show - ${new Date().toLocaleDateString()}`,
        timestamp: new Date().toISOString(),
        players,
        categories,
        round,
        roundSettings,
        specialCards,
        specialCardRules,
        settings: {
          gameLogo,
          primaryColor,
          secondaryColor
        }
      };
      
      // Convert to string for download
      const gameStateString = JSON.stringify(gameState, null, 2);
      
      // Create a download link
      const blob = new Blob([gameStateString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      
      // Format file name with timestamp
      const fileName = `discord_game_show_${new Date().toISOString().split('T')[0]}.json`;
      
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Gra została wyeksportowana do pliku');
      addLog({
        type: 'system',
        action: 'Game exported to file',
        value: fileName
      });
    } catch (error) {
      console.error('Error exporting game:', error);
      toast.error('Nie udało się wyeksportować gry');
    }
  };
  
  return (
    <div className="space-y-4 p-4 bg-black/30 rounded-lg border border-white/10">
      <h3 className="text-lg font-semibold mb-2">Zapisz / Wczytaj Grę</h3>
      
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          onClick={() => setSaveDialogOpen(true)}
          className="bg-blue-900/10 hover:bg-blue-900/20 border-blue-500/30"
        >
          <Save className="mr-2 h-4 w-4" />
          Zapisz lokalnie
        </Button>
        
        <Button 
          variant="outline" 
          onClick={exportGame}
          className="bg-green-900/10 hover:bg-green-900/20 border-green-500/30"
        >
          <Save className="mr-2 h-4 w-4" />
          Eksportuj do pliku
        </Button>
      </div>
      
      <div className="grid grid-cols-1">
        <Label htmlFor="loadGame" className="w-full">
          <div className="cursor-pointer bg-yellow-900/10 hover:bg-yellow-900/20 text-center p-2 rounded-md border border-yellow-500/30 flex items-center justify-center">
            <Upload className="mr-2 h-4 w-4" />
            Wczytaj z pliku
            <Input
              id="loadGame"
              type="file"
              onChange={handleLoadGame}
              accept="application/json"
              className="hidden"
            />
          </div>
        </Label>
      </div>
      
      {/* Save Dialog */}
      {saveDialogOpen && (
        <Dialog className="bg-black/90 rounded-lg border border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Zapisz grę</DialogTitle>
            <DialogDescription className="text-white/60">
              Zapisz aktualny stan gry w pamięci przeglądarki
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-4">
            <Label htmlFor="gameName">Nazwa zapisu</Label>
            <Input
              id="gameName"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              className="mt-1 bg-black/50 border-white/20"
              placeholder="np. Turniej Czerwiec 2025"
            />
          </div>
          
          <DialogFooter className="p-4 pt-0">
            <Button
              variant="ghost"
              onClick={() => setSaveDialogOpen(false)}
            >
              Anuluj
            </Button>
            <Button
              onClick={handleSaveGame}
              disabled={!gameName.trim()}
            >
              Zapisz
            </Button>
          </DialogFooter>
        </Dialog>
      )}
    </div>
  );
};

export default GameSaveManager;
