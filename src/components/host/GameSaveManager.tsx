
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Save, Upload, Download, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const GameSaveManager = () => {
  const { saveGameData, loadGameData, resetGame } = useGameContext();
  const [saveGameName, setSaveGameName] = useState('gameshow_save');
  
  // Handle saving game to file
  const handleExportGame = () => {
    try {
      // Get data from localStorage
      const players = localStorage.getItem('gameShowPlayers');
      const categories = localStorage.getItem('gameShowCategories');
      const specialCards = localStorage.getItem('gameShowSpecialCards');
      const specialCardRules = localStorage.getItem('gameShowSpecialCardRules');
      const settings = localStorage.getItem('gameShowSettings');
      
      // Create export data
      const exportData = {
        players: players ? JSON.parse(players) : [],
        categories: categories ? JSON.parse(categories) : [],
        specialCards: specialCards ? JSON.parse(specialCards) : [],
        specialCardRules: specialCardRules ? JSON.parse(specialCardRules) : [],
        settings: settings ? JSON.parse(settings) : {},
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };
      
      // Convert to JSON and create download
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `${saveGameName}_${new Date().toLocaleDateString('pl-PL').replace(/\./g, '-')}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success('Gra została wyeksportowana');
    } catch (error) {
      console.error('Błąd podczas eksportu gry:', error);
      toast.error('Błąd podczas eksportu gry');
    }
  };
  
  // Handle importing game from file
  const handleImportGame = () => {
    // Create file input
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    
    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importData = JSON.parse(event.target?.result as string);
          
          // Validate import data
          if (!importData.players || !importData.categories) {
            throw new Error('Nieprawidłowy format pliku');
          }
          
          // Save to localStorage
          if (importData.players) localStorage.setItem('gameShowPlayers', JSON.stringify(importData.players));
          if (importData.categories) localStorage.setItem('gameShowCategories', JSON.stringify(importData.categories));
          if (importData.specialCards) localStorage.setItem('gameShowSpecialCards', JSON.stringify(importData.specialCards));
          if (importData.specialCardRules) localStorage.setItem('gameShowSpecialCardRules', JSON.stringify(importData.specialCardRules));
          if (importData.settings) localStorage.setItem('gameShowSettings', JSON.stringify(importData.settings));
          
          // Reload game data
          loadGameData();
          
          toast.success('Gra została pomyślnie zaimportowana');
        } catch (error) {
          console.error('Błąd podczas importu gry:', error);
          toast.error('Nieprawidłowy format pliku');
        }
      };
      reader.readAsText(file);
    };
    
    fileInput.click();
  };
  
  // Handle saving game
  const handleSaveGame = () => {
    saveGameData();
    toast.success('Stan gry zapisany');
  };
  
  // Handle loading saved game
  const handleLoadGame = () => {
    loadGameData();
    toast.success('Stan gry wczytany');
  };
  
  return (
    <div className="bg-black/50 p-4 rounded-lg border border-white/10">
      <h3 className="text-lg font-semibold mb-3 text-white">Zapis/Odczyt Gry</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <button
          onClick={handleSaveGame}
          className="flex items-center justify-center bg-black border border-neon-blue text-white py-2 px-3 rounded hover:bg-neon-blue/10"
        >
          <Save className="h-4 w-4 mr-2" />
          Zapisz stan
        </button>
        
        <button
          onClick={handleLoadGame}
          className="flex items-center justify-center bg-black border border-neon-green text-white py-2 px-3 rounded hover:bg-neon-green/10"
        >
          <Download className="h-4 w-4 mr-2" />
          Wczytaj stan
        </button>
        
        <button
          onClick={handleExportGame}
          className="flex items-center justify-center bg-black border border-neon-yellow text-white py-2 px-3 rounded hover:bg-neon-yellow/10"
        >
          <Upload className="h-4 w-4 mr-2" />
          Eksportuj
        </button>
        
        <button
          onClick={handleImportGame}
          className="flex items-center justify-center bg-black border border-neon-purple text-white py-2 px-3 rounded hover:bg-neon-purple/10"
        >
          <Download className="h-4 w-4 mr-2" />
          Importuj
        </button>
      </div>
      
      <div className="mt-3">
        <input
          type="text"
          value={saveGameName}
          onChange={(e) => setSaveGameName(e.target.value)}
          placeholder="Nazwa pliku"
          className="w-full p-2 rounded bg-black/30 border border-white/20 text-white"
        />
      </div>
      
      <button
        onClick={() => {
          if (window.confirm('Czy na pewno chcesz zresetować grę? Wszystkie dane zostaną utracone!')) {
            resetGame();
            toast.info('Gra została zresetowana');
          }
        }}
        className="mt-3 w-full flex items-center justify-center bg-black border border-neon-red text-neon-red py-2 px-3 rounded hover:bg-neon-red/10"
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Resetuj grę
      </button>
    </div>
  );
};

export default GameSaveManager;
