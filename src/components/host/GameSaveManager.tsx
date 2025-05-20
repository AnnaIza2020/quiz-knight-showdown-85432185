
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { saveGameEdition, loadGameEdition } from '@/lib/supabase';
import { useGameContext } from '@/context/GameContext';

interface GameSaveManagerProps {
  saveDialogOpen: boolean;
  setSaveDialogOpen: (open: boolean) => void;
  loadDialogOpen: boolean;
  setLoadDialogOpen: (open: boolean) => void;
  editionName: string;
  setEditionName: (name: string) => void;
  handleSaveEdition?: () => void;
  handleLoadEdition?: () => void;
  availableEditions: string[];
}

const GameSaveManager: React.FC<GameSaveManagerProps> = ({
  saveDialogOpen,
  setSaveDialogOpen,
  loadDialogOpen,
  setLoadDialogOpen,
  editionName,
  setEditionName,
  handleSaveEdition,
  handleLoadEdition,
  availableEditions
}) => {
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
    specialCards,
    specialCardRules,
    roundSettings
  } = useGameContext();
  
  const [isLoading, setIsLoading] = useState(false);
  
  // Handle saving edition
  const handleSave = async () => {
    if (!editionName.trim()) {
      toast.error('Wpisz nazwę edycji');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Create edition data object
      const editionData = {
        round,
        players,
        categories,
        activePlayerId,
        winnerIds,
        primaryColor,
        secondaryColor,
        hostCameraUrl,
        gameLogo,
        specialCards,
        specialCardRules,
        roundSettings,
        savedAt: new Date().toISOString()
      };
      
      // Save to Supabase
      const result = await saveGameEdition(editionData, editionName);
      
      if (result.success) {
        toast.success('Zapisano edycję gry', {
          description: `Edycja "${editionName}" została zapisana`
        });
        setSaveDialogOpen(false);
      } else {
        toast.error('Błąd podczas zapisywania edycji', {
          description: 'Spróbuj ponownie później'
        });
      }
    } catch (error) {
      console.error('Error saving edition:', error);
      toast.error('Wystąpił błąd podczas zapisywania');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle loading edition
  const handleLoad = async () => {
    if (!editionName) {
      toast.error('Wybierz edycję do wczytania');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Load from Supabase
      const result = await loadGameEdition(editionName);
      
      if (result.success && result.data) {
        // Use the GameContext to load the data
        const {
          setRound,
          setPlayers,
          setCategories,
          setActivePlayer,
          setWinnerIds,
          setPrimaryColor,
          setSecondaryColor,
          setHostCameraUrl,
          setGameLogo,
          setSpecialCards,
          setSpecialCardRules,
          updateRoundSettings
        } = useGameContext();
        
        // Apply loaded data
        setRound(result.data.round);
        setPlayers(result.data.players);
        setCategories(result.data.categories);
        setActivePlayer(result.data.activePlayerId);
        setWinnerIds(result.data.winnerIds || []);
        setPrimaryColor(result.data.primaryColor || '#ff00ff');
        setSecondaryColor(result.data.secondaryColor || '#00ffff');
        setHostCameraUrl(result.data.hostCameraUrl || '');
        setGameLogo(result.data.gameLogo);
        
        if (result.data.specialCards) {
          setSpecialCards(result.data.specialCards);
        }
        
        if (result.data.specialCardRules) {
          setSpecialCardRules(result.data.specialCardRules);
        }
        
        if (result.data.roundSettings) {
          updateRoundSettings(result.data.roundSettings);
        }
        
        toast.success('Wczytano edycję gry', {
          description: `Edycja "${editionName}" została wczytana`
        });
        setLoadDialogOpen(false);
      } else {
        toast.error('Błąd podczas wczytywania edycji', {
          description: 'Spróbuj ponownie później'
        });
      }
    } catch (error) {
      console.error('Error loading edition:', error);
      toast.error('Wystąpił błąd podczas wczytywania');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zapisz edycję gry</DialogTitle>
            <DialogDescription>
              Wprowadź nazwę dla tej edycji gry. Jeśli edycja o tej nazwie już istnieje, zostanie nadpisana.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-1 block">Nazwa edycji</label>
            <Input
              value={editionName}
              onChange={(e) => setEditionName(e.target.value)}
              placeholder="np. Edycja Wiosna 2023"
              className="mb-4"
            />
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSaveDialogOpen(false)}
              disabled={isLoading}
            >
              Anuluj
            </Button>
            <Button
              onClick={handleSaveEdition || handleSave}
              disabled={isLoading}
              className="bg-neon-green hover:bg-neon-green/80 text-black"
            >
              {isLoading ? 'Zapisywanie...' : 'Zapisz'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Load Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wczytaj edycję gry</DialogTitle>
            <DialogDescription>
              Wybierz edycję gry do wczytania. Bieżący stan gry zostanie nadpisany.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <label className="text-sm font-medium mb-1 block">Dostępne edycje</label>
            <div className="max-h-60 overflow-y-auto border border-white/10 rounded-md">
              {availableEditions.length > 0 ? (
                availableEditions.map((edition) => (
                  <button
                    key={edition}
                    onClick={() => setEditionName(edition)}
                    className={`w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 transition-colors ${
                      editionName === edition ? 'bg-neon-blue/10 text-neon-blue' : ''
                    }`}
                  >
                    {edition}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-center text-gray-400">
                  Brak zapisanych edycji
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setLoadDialogOpen(false)}
              disabled={isLoading}
            >
              Anuluj
            </Button>
            <Button
              onClick={handleLoadEdition || handleLoad}
              disabled={isLoading || !editionName || availableEditions.length === 0}
              className="bg-neon-blue hover:bg-neon-blue/80"
            >
              {isLoading ? 'Wczytywanie...' : 'Wczytaj'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GameSaveManager;
