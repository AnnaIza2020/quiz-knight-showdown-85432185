import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Save, Download, Upload, Trash } from 'lucide-react';
import { toast } from 'sonner';
import { useGameContext } from '@/context/GameContext';
import { GameBackup } from '@/types/game-types';

const GameSaveManager: React.FC = () => {
  const { createBackup, restoreBackup, getBackups, deleteBackup } = useGameContext();
  const [open, setOpen] = useState(false);
  const [backupName, setBackupName] = useState('');
  const [backups, setBackups] = useState<GameBackup[]>([]);
  const [selectedBackup, setSelectedBackup] = useState<GameBackup | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load backups on component mount
  React.useEffect(() => {
    loadBackups();
  }, []);

  const loadBackups = async () => {
    setIsLoading(true);
    try {
      const loadedBackups = await getBackups();
      setBackups(loadedBackups);
    } catch (error) {
      console.error('Error loading backups:', error);
      toast.error('Failed to load backups');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBackup = async () => {
    setIsLoading(true);
    try {
      await createBackup(backupName);
      toast.success('Backup created successfully');
      setOpen(false);
      setBackupName('');
      await loadBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestoreBackup = async () => {
    if (!selectedBackup) {
      toast.error('No backup selected');
      return;
    }

    setIsLoading(true);
    try {
      const success = await restoreBackup(selectedBackup);
      if (success) {
        toast.success('Backup restored successfully');
      } else {
        toast.error('Failed to restore backup');
      }
    } catch (error) {
      console.error('Error restoring backup:', error);
      toast.error('Failed to restore backup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteBackup = async (backupId: string) => {
    setIsLoading(true);
    try {
      const success = await deleteBackup(backupId);
      if (success) {
        toast.success('Backup deleted successfully');
        await loadBackups();
      } else {
        toast.error('Failed to delete backup');
      }
    } catch (error) {
      console.error('Error deleting backup:', error);
      toast.error('Failed to delete backup');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-black/40 border border-white/10">
      <CardHeader>
        <CardTitle>Zarządzanie Zapisami Gry</CardTitle>
        <CardDescription>
          Twórz i przywracaj kopie zapasowe stanu gry
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Button onClick={() => setOpen(true)} className="w-full">
          <Save className="mr-2 h-4 w-4" />
          Utwórz Nowy Zapis
        </Button>
        
        {/* List of Backups */}
        <div>
          <h3 className="text-sm font-bold mb-2 text-white/80">Dostępne Zapisy</h3>
          
          {isLoading ? (
            <p>Ładowanie zapisów...</p>
          ) : backups.length === 0 ? (
            <p>Brak dostępnych zapisów.</p>
          ) : (
            <div className="space-y-2">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className={`p-3 rounded-md border ${selectedBackup?.id === backup.id ? 'border-neon-blue bg-black/50' : 'border-white/20 hover:bg-black/30'} cursor-pointer`}
                  onClick={() => setSelectedBackup(backup)}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{backup.name}</p>
                      <p className="text-xs text-white/50">
                        {new Date(backup.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <Button 
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteBackup(backup.id);
                      }}
                    >
                      <Trash className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Restore Selected Backup */}
        {selectedBackup && (
          <Button 
            onClick={handleRestoreBackup}
            disabled={isLoading}
            className="w-full bg-neon-green hover:bg-neon-green/80"
          >
            <Download className="mr-2 h-4 w-4" />
            Przywróć Wybrany Zapis
          </Button>
        )}
      </CardContent>
      
      {/* Create Backup Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Utwórz Nowy Zapis</DialogTitle>
            <DialogDescription>
              Nazwij swój zapis, aby łatwo go później odnaleźć.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nazwa
              </Label>
              <Input 
                id="name" 
                value={backupName}
                onChange={(e) => setBackupName(e.target.value)}
                className="col-span-3" 
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="submit" onClick={handleCreateBackup} disabled={isLoading}>
              Utwórz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default GameSaveManager;
