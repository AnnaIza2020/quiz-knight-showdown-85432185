
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Settings, 
  Home, 
  Volume2, 
  VolumeX, 
  Save, 
  PlayCircle, 
  RefreshCw, 
  Maximize, 
  Minimize, 
  Upload, 
  Download,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface TopBarControlsProps {
  soundMuted: boolean;
  toggleSound: () => void;
  isFullscreen: boolean;
  toggleFullscreen: () => void;
  setSaveDialogOpen: (open: boolean) => void;
  saveDialogOpen: boolean;
  setLoadDialogOpen: (open: boolean) => void;
  loadDialogOpen: boolean;
  editionName: string;
  setEditionName: (name: string) => void;
  handleSaveEdition: () => void;
  handleLoadEdition: (name: string) => void;
  availableEditions: {name: string}[];
}

const TopBarControls: React.FC<TopBarControlsProps> = ({
  soundMuted,
  toggleSound,
  isFullscreen,
  toggleFullscreen,
  setSaveDialogOpen,
  saveDialogOpen,
  setLoadDialogOpen,
  loadDialogOpen,
  editionName,
  setEditionName,
  handleSaveEdition,
  handleLoadEdition,
  availableEditions,
}) => {
  const navigate = useNavigate();
  
  return (
    <div className="mb-4 flex justify-between items-center">
      <h1 className="text-3xl font-bold text-white">Panel Prowadzącego</h1>
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleSound}
          className="border-white/20 text-white hover:bg-white/10"
        >
          {soundMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={toggleFullscreen}
          className="border-white/20 text-white hover:bg-white/10"
          title={isFullscreen ? "Wyjdź z trybu pełnoekranowego" : "Tryb pełnoekranowy"}
        >
          {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
        </Button>
        
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="border-white/20 text-white hover:bg-white/10"
              title="Zapisz edycję"
            >
              <Save size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Zapisz edycję gry</DialogTitle>
              <DialogDescription>
                Podaj nazwę edycji, aby zapisać aktualny stan gry, w tym pytania, graczy i ustawienia.
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
            <Button 
              variant="outline" 
              size="icon"
              className="border-white/20 text-white hover:bg-white/10"
              title="Wczytaj edycję"
            >
              <Upload size={20} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Wczytaj edycję gry</DialogTitle>
              <DialogDescription>
                Wybierz edycję do wczytania z zapisanych w bazie danych.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4 max-h-80 overflow-auto">
              {availableEditions.length > 0 ? (
                <div className="grid gap-2">
                  {availableEditions.map((edition) => (
                    <Button
                      key={edition.name}
                      variant="outline"
                      className="justify-start"
                      onClick={() => handleLoadEdition(edition.name)}
                    >
                      {edition.name}
                    </Button>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground">Brak dostępnych edycji</p>
              )}
            </div>
            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setLoadDialogOpen(false)}>
                Anuluj
              </Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/')}
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Home size={20} />
        </Button>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={() => navigate('/settings')}
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Settings size={20} />
        </Button>
      </div>
    </div>
  );
};

export default TopBarControls;
