import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Save, Download, Upload } from 'lucide-react';

const GameSaveManager: React.FC = () => {
  const { saveGameData, loadGameData, players, categories } = useGameContext();
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    try {
      saveGameData();
      toast.success('Gra została zapisana');
    } catch (error) {
      console.error('Błąd podczas zapisywania gry:', error);
      toast.error('Nie udało się zapisać gry');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoad = () => {
    setIsLoading(true);
    try {
      loadGameData();
      toast.success('Gra została wczytana');
    } catch (error) {
      console.error('Błąd podczas wczytywania gry:', error);
      toast.error('Nie udało się wczytać gry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    try {
      // Przygotuj dane do eksportu
      const gameData = {
        players,
        categories,
        exportDate: new Date().toISOString(),
      };

      // Utwórz plik JSON do pobrania
      const dataStr = JSON.stringify(gameData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      // Utwórz link do pobrania pliku
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `quiz-game-export-${new Date().toISOString().slice(0, 10)}.json`;
      
      // Symuluj kliknięcie w link
      document.body.appendChild(link);
      link.click();
      
      // Usuń link
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success('Dane gry zostały wyeksportowane');
    } catch (error) {
      console.error('Błąd podczas eksportu danych:', error);
      toast.error('Nie udało się wyeksportować danych gry');
    }
  };

  const handleImport = () => {
    try {
      // Utwórz input typu file
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'application/json';
      
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const content = event.target?.result as string;
            const gameData = JSON.parse(content);
            
            // TODO: Implementacja importu danych
            console.log('Zaimportowane dane:', gameData);
            toast.success('Dane zostały zaimportowane');
            
            // Odśwież komponenty
            loadGameData();
          } catch (error) {
            console.error('Błąd podczas parsowania pliku JSON:', error);
            toast.error('Nieprawidłowy format pliku');
          }
        };
        
        reader.readAsText(file);
      };
      
      // Symuluj kliknięcie w input
      document.body.appendChild(input);
      input.click();
      document.body.removeChild(input);
    } catch (error) {
      console.error('Błąd podczas importu danych:', error);
      toast.error('Nie udało się zaimportować danych');
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={handleSave}
        disabled={isSaving}
        className="bg-black/40 border-white/30 text-white/80 hover:bg-white/10 hover:text-white"
      >
        <Save size={14} className="mr-1" />
        {isSaving ? 'Zapisywanie...' : 'Zapisz grę'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleLoad}
        disabled={isLoading}
        className="bg-black/40 border-white/30 text-white/80 hover:bg-white/10 hover:text-white"
      >
        <Download size={14} className="mr-1" />
        {isLoading ? 'Wczytywanie...' : 'Wczytaj grę'}
      </Button>
      
      <Button
        variant="outline"
        size="sm"
        onClick={handleExport}
        className="bg-black/40 border-white/30 text-white/80 hover:bg-white/10 hover:text-white"
      >
        <Upload size={14} className="mr-1" />
        Eksport JSON
      </Button>
    </div>
  );
};

export default GameSaveManager;
