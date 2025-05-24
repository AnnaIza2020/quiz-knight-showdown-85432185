
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
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
        const { data, error } = await supabase.rpc('load_game_data', { 
          key: 'availableEditions' 
        });
          
        if (error) throw error;
          
        if (data && Array.isArray(data)) {
          // Cast Json array to proper type
          const editions = data.map(item => ({
            name: typeof item === 'string' ? item : (item as any)?.name || 'Unknown'
          }));
          setAvailableEditions(editions);
        } else {
          setAvailableEditions([]);
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
    
    // Save to Supabase
    try {
      const { error } = await supabase.rpc('save_game_data', { 
        key: editionName, 
        value: gameData 
      });
        
      if (error) throw error;
      
      // Update available editions
      const currentEditions = [...availableEditions];
      if (!currentEditions.find(e => e.name === editionName)) {
        const newEditions = [...currentEditions, { name: editionName }];
        setAvailableEditions(newEditions);
        
        // Save updated editions list
        await supabase.rpc('save_game_data', { 
          key: 'availableEditions', 
          value: newEditions 
        });
      }
      
      toast.success(`Edycja "${editionName}" zapisana pomyślnie!`);
      addEvent(`Zapisano edycję "${editionName}"`);
      setSaveDialogOpen(false);
    } catch (err) {
      console.error('Error saving edition:', err);
      toast.error('Nie udało się zapisać edycji');
    }
  };

  // Handle load edition
  const handleLoadEdition = async (name: string) => {
    try {
      const { data, error } = await supabase.rpc('load_game_data', { 
        key: name 
      });
        
      if (error) throw error;
      
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        // Type assertion for proper object handling
        const gameData = data as Record<string, any>;
        
        // Update local storage with loaded data
        if (gameData.players) {
          localStorage.setItem('gameShowPlayers', JSON.stringify(gameData.players));
        }
        
        if (gameData.categories) {
          localStorage.setItem('gameShowCategories', JSON.stringify(gameData.categories));
        }
        
        if (gameData.specialCards) {
          localStorage.setItem('gameShowSpecialCards', JSON.stringify(gameData.specialCards));
        }
        
        if (gameData.specialCardRules) {
          localStorage.setItem('gameShowSpecialCardRules', JSON.stringify(gameData.specialCardRules));
        }
        
        if (gameData.settings) {
          localStorage.setItem('gameShowSettings', JSON.stringify(gameData.settings));
        }
        
        // Reload game data
        loadContextGameData();
        toast.success(`Edycja "${name}" wczytana pomyślnie!`);
        addEvent(`Wczytano edycję "${name}"`);
        setLoadDialogOpen(false);
      } else {
        toast.error('Nie znaleziono danych dla tej edycji');
      }
    } catch (err) {
      console.error('Error loading edition:', err);
      toast.error('Nie udało się wczytać edycji');
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
