
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import Round1Questions from './questions/Round1Questions';
import Round2Questions from './questions/Round2Questions';
import Round3Questions from './questions/Round3Questions';
import { Download, Upload } from 'lucide-react';

const SettingsQuestions = () => {
  const [activeTab, setActiveTab] = useState('runda1');
  const { categories, saveGameData } = useGameContext();

  const handleExportQuestions = () => {
    try {
      // Przygotowanie pełnych danych do eksportu
      const exportData = {
        categories,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };

      // Konwersja na JSON i utworzenie URL do pobrania
      const dataStr = JSON.stringify(exportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      
      // Utworzenie linku do pobrania i symulacja kliknięcia
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `pytania_gameshow_${new Date().toLocaleDateString('pl-PL').replace(/\./g, '-')}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast.success('Pytania zostały wyeksportowane');
    } catch (error) {
      console.error('Błąd podczas eksportu pytań:', error);
      toast.error('Błąd podczas eksportu pytań');
    }
  };

  const handleImportQuestions = () => {
    // Utworzenie ukrytego input file i symulacja kliknięcia
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
          
          // Tu należałoby dodać walidację danych
          if (!importData.categories) {
            throw new Error('Nieprawidłowy format pliku');
          }
          
          // Tu można zaimplementować logikę importu
          toast.info('Funkcja importu jeszcze nie zaimplementowana');
          
        } catch (error) {
          console.error('Błąd podczas importu pytań:', error);
          toast.error('Nieprawidłowy format pliku');
        }
      };
      reader.readAsText(file);
    };
    
    fileInput.click();
  };
  
  return (
    <div className="bg-[#0c0e1a] rounded-lg p-6 shadow-lg border border-gray-800">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold mb-2 text-white">Zarządzanie Pytaniami</h2>
          <p className="text-white/60 text-sm">
            Tutaj możesz dodawać, edytować i zarządzać pytaniami dla wszystkich trzech rund teleturnieju.
          </p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
            onClick={handleExportQuestions}
          >
            <Download size={16} /> Eksportuj pytania
          </Button>
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white gap-2"
            onClick={handleImportQuestions}
          >
            <Upload size={16} /> Importuj pytania
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="bg-black/30 w-full border-b border-gray-800 mb-6">
          <TabsTrigger 
            value="runda1" 
            className="data-[state=active]:text-neon-pink data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-pink rounded-none py-3"
          >
            Runda 1: Wiedza z Internetu
          </TabsTrigger>
          <TabsTrigger 
            value="runda2" 
            className="data-[state=active]:text-neon-blue data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-blue rounded-none py-3"
          >
            Runda 2: 5 Sekund
          </TabsTrigger>
          <TabsTrigger 
            value="runda3" 
            className="data-[state=active]:text-neon-purple data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-neon-purple rounded-none py-3"
          >
            Runda 3: Koło Fortuny
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="runda1">
          <Round1Questions />
        </TabsContent>
        
        <TabsContent value="runda2">
          <Round2Questions />
        </TabsContent>
        
        <TabsContent value="runda3">
          <Round3Questions />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsQuestions;
