import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Save, Database } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useGameContext } from '@/context/GameContext';

const GameSaveManager: React.FC = () => {
  const { createBackup, restoreBackup, getBackups, deleteBackup } = useGameContext();
  const [backupName, setBackupName] = useState('');
  const [open, setOpen] = useState(false);
  const [backups, setBackups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load backups on component mount
  React.useEffect(() => {
    loadBackups();
  }, []);
  
  // Load backups from the database
  const loadBackups = async () => {
    setIsLoading(true);
    const result = await getBackups();
    if (result.success) {
      setBackups(result.data);
    } else {
      console.error('Failed to load backups:', result.error);
    }
    setIsLoading(false);
  };
  
  // Handle creating a new backup
  const handleCreateBackup = async () => {
    setIsLoading(true);
    const result = await createBackup(backupName);
    if (result) {
      setOpen(false);
      setBackupName('');
      await loadBackups();
    }
    setIsLoading(false);
  };
  
  // Handle restoring a backup
  const handleRestoreBackup = async (backupId: string) => {
    setIsLoading(true);
    const backupToRestore = backups.find(backup => backup.id === backupId);
    if (backupToRestore) {
      const result = await restoreBackup(backupToRestore);
      if (result) {
        console.log('Backup restored successfully');
      } else {
        console.error('Failed to restore backup');
      }
    }
    setIsLoading(false);
  };
  
  // Handle deleting a backup
  const handleDeleteBackup = async (backupId: string) => {
    setIsLoading(true);
    const result = await deleteBackup(backupId);
    if (result.success) {
      await loadBackups();
    } else {
      console.error('Failed to delete backup:', result.error);
    }
    setIsLoading(false);
  };
  
  return (
    <Card className="bg-black/40 border border-white/10">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-neon-blue" />
          <span>Zarządzanie Zapisami Gry</span>
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Create Backup Section */}
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-neon-green/10 hover:bg-neon-green/20">
                  <Save className="h-4 w-4 mr-2" />
                  Utwórz Nowy Zapis
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Utwórz Nowy Zapis</DialogTitle>
                  <DialogDescription>
                    Nazwij swój zapis gry, aby łatwo go później odnaleźć.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right">
                      Nazwa
                    </label>
                    <Input
                      id="name"
                      value={backupName}
                      onChange={(e) => setBackupName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                    Anuluj
                  </Button>
                  <Button type="submit" onClick={handleCreateBackup} disabled={isLoading}>
                    Utwórz
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* List Backups Section */}
          <div>
            <h3 className="text-lg font-semibold mb-2 text-white">Dostępne Zapisy</h3>
            {isLoading ? (
              <div className="text-center text-gray-500">Ładowanie zapisów...</div>
            ) : backups.length === 0 ? (
              <div className="text-center text-gray-500">Brak dostępnych zapisów.</div>
            ) : (
              <div className="space-y-2">
                {backups.map((backup) => (
                  <div key={backup.id} className="flex items-center justify-between p-2 bg-black/30 rounded-md border border-white/10">
                    <div>
                      <h4 className="font-medium text-white">{backup.name}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(backup.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreBackup(backup.id)}
                        disabled={isLoading}
                        className="text-xs border-neon-green text-neon-green hover:bg-neon-green/20"
                      >
                        Przywróć
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteBackup(backup.id)}
                        disabled={isLoading}
                      >
                        Usuń
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GameSaveManager;
