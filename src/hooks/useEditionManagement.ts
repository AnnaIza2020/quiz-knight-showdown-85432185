
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { saveGameData, loadGameData } from '@/lib/supabase';
import { useGameContext } from '@/context/GameContext';

export const useEditionManagement = (addEvent: (event: string) => void) => {
  const [editionName, setEditionName] = useState('default');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [availableEditions, setAvailableEditions] = useState<{name: string}[]>([]);
  
  const { loadGameData: loadContextGameData } = useGameContext();
  
  // Load available editions on mount
  useEffect(() => {
    const loadEditions = async () => {
      try {
        const result = await loadGameData('availableEditions');
        if (result.success && result.data) {
          setAvailableEditions(result.data);
        }
      } catch (error) {
        console.error('Failed to load editions:', error);
      }
    };
    
    loadEditions();
  }, []);
  
  // Handle save edition
  const handleSaveEdition = async () => {
    if (!editionName.trim()) {
      toast.error('Nazwa edycji nie może być pusta');
      return;
    }
    
    // Get all game data to save
    const gameData = {
      players: localStorage.getItem('gameShowPlayers') ? 
        JSON.parse(localStorage.getItem('gameShowPlayers')!) : [],
      categories: localStorage.getItem('gameShowCategories') ? 
        JSON.parse(localStorage.getItem('gameShowCategories')!) : [],
      specialCards: localStorage.getItem('gameShowSpecialCards') ? 
        JSON.parse(localStorage.getItem('gameShowSpecialCards')!) : [],
      specialCardRules: localStorage.getItem('gameShowSpecialCardRules') ? 
        JSON.parse(localStorage.getItem('gameShowSpecialCardRules')!) : [],
      settings: localStorage.getItem('gameShowSettings') ? 
        JSON.parse(localStorage.getItem('gameShowSettings')!) : {},
      savedAt: new Date().toISOString()
    };
    
    // Save to local storage
    const result = await saveGameData(gameData, editionName);
    
    if (result.success) {
      // Update available editions
      const currentEditions = [...availableEditions];
      if (!currentEditions.find(e => e.name === editionName)) {
        currentEditions.push({ name: editionName });
        setAvailableEditions(currentEditions);
        // Save updated editions list
        await saveGameData(currentEditions, 'availableEditions');
      }
      
      toast.success(`Edycja "${editionName}" zapisana pomyślnie!`);
      addEvent(`Zapisano edycję "${editionName}"`);
      setSaveDialogOpen(false);
    }
  };

  // Handle load edition
  const handleLoadEdition = async (name: string) => {
    const result = await loadGameData(name);
    if (result.success) {
      // Update local storage with loaded data
      if (result.data.players) {
        localStorage.setItem('gameShowPlayers', JSON.stringify(result.data.players));
      }
      if (result.data.categories) {
        localStorage.setItem('gameShowCategories', JSON.stringify(result.data.categories));
      }
      if (result.data.specialCards) {
        localStorage.setItem('gameShowSpecialCards', JSON.stringify(result.data.specialCards));
      }
      if (result.data.specialCardRules) {
        localStorage.setItem('gameShowSpecialCardRules', JSON.stringify(result.data.specialCardRules));
      }
      if (result.data.settings) {
        localStorage.setItem('gameShowSettings', JSON.stringify(result.data.settings));
      }
      
      // Reload game data
      loadContextGameData();
      toast.success(`Edycja "${name}" wczytana pomyślnie!`);
      addEvent(`Wczytano edycję "${name}"`);
      setLoadDialogOpen(false);
    }
  };

  return {
    editionName,
    setEditionName,
    saveDialogOpen,
    setSaveDialogOpen,
    loadDialogOpen,
    setLoadDialogOpen,
    availableEditions,
    setAvailableEditions,
    handleSaveEdition,
    handleLoadEdition
  };
};
