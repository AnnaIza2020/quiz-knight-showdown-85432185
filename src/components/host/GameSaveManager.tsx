
import React, { useState } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Save, Upload, Download, Trash2, Database } from 'lucide-react';
import { toast } from 'sonner';
import { saveGameEdition, loadGameEdition } from '@/lib/supabase';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const GameSaveManager = () => {
  const { saveGameData, loadGameData, resetGame } = useGameContext();
  const [saveGameName, setSaveGameName] = useState('gameshow_save');
  const [editionName, setEditionName] = useState('default');
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [knownEditions, setKnownEditions] = useState<string[]>([]);
  
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
  
  // Handle saving game to Supabase
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
    const result = await saveGameEdition(gameData, editionName);
    
    if (result.success) {
      toast.success(`Edycja "${editionName}" zapisana pomyślnie w bazie danych!`);
      setSaveDialogOpen(false);
      // Add to known editions if not already there
      if (!knownEditions.includes(editionName)) {
        setKnownEditions([...knownEditions, editionName]);
      }
    }
  };
  
  // Handle loading game from Supabase
  const handleLoadEdition = async (name: string) => {
    const result = await loadGameEdition(name);
    
    if (result.success && result.data) {
      // Save to localStorage
      if (result.data.players) localStorage.setItem('gameShowPlayers', JSON.stringify(result.data.players));
      if (result.data.categories) localStorage.setItem('gameShowCategories', JSON.stringify(result.data.categories));
      if (result.data.specialCards) localStorage.setItem('gameShowSpecialCards', JSON.stringify(result.data.specialCards));
      if (result.data.specialCardRules) localStorage.setItem('gameShowSpecialCardRules', JSON.stringify(result.data.specialCardRules));
      if (result.data.settings) localStorage.setItem('gameShowSettings', JSON.stringify(result.data.settings));
      
      // Reload game data
      loadGameData();
      
      toast.success(`Edycja "${name}" wczytana pomyślnie!`);
      setLoadDialogOpen(false);
    } else {
      toast.error(`Nie znaleziono edycji "${name}"`);
    }
  };
  
  // Handle saving game
  const handleSaveGame = () => {
    saveGameData();
    toast.success('Stan gry zapisany lokalnie');
  };
  
  // Handle loading saved game
  const handleLoadGame = () => {
    loadGameData();
    toast.success('Stan gry wczytany z lokalnego zapisu');
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
          Zapisz lokalnie
        </button>
        
        <button
          onClick={handleLoadGame}
          className="flex items-center justify-center bg-black border border-neon-green text-white py-2 px-3 rounded hover:bg-neon-green/10"
        >
          <Download className="h-4 w-4 mr-2" />
          Wczytaj lokalnie
        </button>
        
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="flex items-center justify-center bg-black border border-neon-purple text-white py-2 px-3 rounded hover:bg-neon-purple/10"
            >
              <Database className="h-4 w-4 mr-2" />
              Zapisz edycję
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Zapisz edycję gry</DialogTitle>
              <DialogDescription>
                Podaj nazwę edycji, aby zapisać aktualny stan gry w bazie danych.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edition-name" className="text-right">
                  Nazwa
                </Label>
                <Input
                  id="edition-name"
                  value={editionName}
                  onChange={(e) => setEditionName(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Anuluj
              </Button>
              <Button onClick={handleSaveEdition}>Zapisz</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
          <DialogTrigger asChild>
            <button
              className="flex items-center justify-center bg-black border border-neon-yellow text-white py-2 px-3 rounded hover:bg-neon-yellow/10"
            >
              <Database className="h-4 w-4 mr-2" />
              Wczytaj edycję
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Wczytaj edycję gry</DialogTitle>
              <DialogDescription>
                Wybierz edycję, którą chcesz wczytać z bazy danych.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edition-select" className="text-right">
                  Edycja
                </Label>
                <div className="col-span-3">
                  <Input
                    id="edition-load-name"
                    value={editionName}
                    onChange={(e) => setEditionName(e.target.value)}
                    placeholder="Wpisz nazwę edycji"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setLoadDialogOpen(false)}>
                Anuluj
              </Button>
              <Button onClick={() => handleLoadEdition(editionName)}>Wczytaj</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <button
          onClick={handleExportGame}
          className="flex items-center justify-center bg-black border border-neon-yellow text-white py-2 px-3 rounded hover:bg-neon-yellow/10"
        >
          <Upload className="h-4 w-4 mr-2" />
          Eksportuj plik
        </button>
        
        <button
          onClick={handleImportGame}
          className="flex items-center justify-center bg-black border border-neon-purple text-white py-2 px-3 rounded hover:bg-neon-purple/10"
        >
          <Download className="h-4 w-4 mr-2" />
          Importuj plik
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
