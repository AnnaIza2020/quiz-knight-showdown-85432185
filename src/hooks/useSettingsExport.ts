
import { toast } from 'sonner';
import { useGameContext } from '@/context/GameContext';
import { useCallback } from 'react';

export const useSettingsExport = () => {
  const { saveGameData } = useGameContext();

  const handleExportSettings = useCallback(() => {
    try {
      // Ensure we save the current state before exporting
      saveGameData();
      
      // Get all settings from localStorage
      const settings = {
        players: JSON.parse(localStorage.getItem('gameShowPlayers') || '[]'),
        categories: JSON.parse(localStorage.getItem('gameShowCategories') || '[]'),
        specialCards: JSON.parse(localStorage.getItem('gameShowSpecialCards') || '[]'),
        specialCardRules: JSON.parse(localStorage.getItem('gameShowSpecialCardRules') || '[]'),
        settings: JSON.parse(localStorage.getItem('gameShowSettings') || '{}'),
        theme: JSON.parse(localStorage.getItem('gameTheme') || '{}'),
        wheelCategories: JSON.parse(localStorage.getItem('wheelCategories') || '[]'),
        exportedAt: new Date().toISOString(),
      };
      
      // Create a downloadable file
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `gameshow_settings_${new Date().toLocaleDateString('pl-PL')}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success('Ustawienia zostały wyeksportowane');
    } catch (error) {
      console.error('Error exporting settings:', error);
      toast.error('Nie udało się wyeksportować ustawień');
    }
  }, [saveGameData]);

  // Dodanie funkcji do importu ustawień
  const handleImportSettings = useCallback((file: File) => {
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const settings = JSON.parse(e.target?.result as string);
          
          // Zapisz wszystkie dane do localStorage
          if (settings.players) localStorage.setItem('gameShowPlayers', JSON.stringify(settings.players));
          if (settings.categories) localStorage.setItem('gameShowCategories', JSON.stringify(settings.categories));
          if (settings.specialCards) localStorage.setItem('gameShowSpecialCards', JSON.stringify(settings.specialCards));
          if (settings.specialCardRules) localStorage.setItem('gameShowSpecialCardRules', JSON.stringify(settings.specialCardRules));
          if (settings.settings) localStorage.setItem('gameShowSettings', JSON.stringify(settings.settings));
          if (settings.theme) localStorage.setItem('gameTheme', JSON.stringify(settings.theme));
          if (settings.wheelCategories) localStorage.setItem('wheelCategories', JSON.stringify(settings.wheelCategories));
          
          // Zapisz dane gry po zaimportowaniu
          saveGameData();
          
          toast.success('Ustawienia zostały zaimportowane');
          
          // Zasugeruj odświeżenie strony
          setTimeout(() => {
            if (window.confirm('Aby zastosować zaimportowane ustawienia, strona powinna zostać odświeżona. Czy chcesz odświeżyć stronę teraz?')) {
              window.location.reload();
            }
          }, 1000);
          
        } catch (parseError) {
          console.error('Error parsing settings file:', parseError);
          toast.error('Nieprawidłowy format pliku ustawień');
        }
      };
      
      reader.onerror = () => {
        toast.error('Wystąpił błąd podczas odczytu pliku');
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error importing settings:', error);
      toast.error('Nie udało się zaimportować ustawień');
    }
  }, [saveGameData]);

  return { handleExportSettings, handleImportSettings };
};
