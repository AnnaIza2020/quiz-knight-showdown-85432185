
import { toast } from 'sonner';

export const useSettingsExport = () => {
  const handleExportSettings = () => {
    try {
      // Get all settings from localStorage
      const settings = {
        players: JSON.parse(localStorage.getItem('gameShowPlayers') || '[]'),
        categories: JSON.parse(localStorage.getItem('gameShowCategories') || '[]'),
        specialCards: JSON.parse(localStorage.getItem('gameShowSpecialCards') || '[]'),
        specialCardRules: JSON.parse(localStorage.getItem('gameShowSpecialCardRules') || '[]'),
        settings: JSON.parse(localStorage.getItem('gameShowSettings') || '{}'),
        theme: JSON.parse(localStorage.getItem('gameTheme') || '{}'),
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
  };

  return { handleExportSettings };
};
