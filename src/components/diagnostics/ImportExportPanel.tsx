
import React, { useState, useRef } from 'react';
import { useGameContext } from '@/context/GameContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DownloadCloud, 
  UploadCloud, 
  Save, 
  Trash2, 
  RotateCcw, 
  Calendar 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { GameBackup } from '@/types/game-types';

const ImportExportPanel = () => {
  const { 
    createBackup, 
    restoreBackup, 
    getBackups, 
    deleteBackup,
    players,
    categories,
    specialCards 
  } = useGameContext();
  
  const [backupName, setBackupName] = useState('');
  const [backups, setBackups] = useState<GameBackup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<GameBackup | null>(null);
  const [showRestoreDialog, setShowRestoreDialog] = useState(false);
  const [restoreConfirmationText, setRestoreConfirmationText] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load backups
  const loadBackups = async () => {
    setIsLoading(true);
    try {
      const backupsResult = await getBackups();
      if (Array.isArray(backupsResult)) {
        setBackups(backupsResult);
      } else {
        toast.error('Failed to load backups');
      }
    } catch (error) {
      console.error('Error loading backups:', error);
      toast.error('Failed to load backups');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Create new backup
  const handleCreateBackup = async () => {
    if (!backupName.trim()) {
      toast.error('Please enter a backup name');
      return;
    }
    
    setIsLoading(true);
    try {
      const backup = await createBackup(backupName);
      toast.success('Backup created successfully');
      setBackupName('');
      loadBackups();
    } catch (error) {
      console.error('Error creating backup:', error);
      toast.error('Failed to create backup');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle restore backup
  const handleRestoreClick = (backup: GameBackup) => {
    setSelectedBackup(backup);
    setShowRestoreDialog(true);
  };
  
  const handleConfirmRestore = async () => {
    if (!selectedBackup) return;
    
    if (restoreConfirmationText !== 'CONFIRM') {
      toast.error('Please type CONFIRM to proceed');
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await restoreBackup(selectedBackup);
      if (success) {
        toast.success('Backup restored successfully');
        setShowRestoreDialog(false);
        setSelectedBackup(null);
        setRestoreConfirmationText('');
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
  
  // Handle delete backup
  const handleDeleteBackup = async (id: string) => {
    if (!confirm('Are you sure you want to delete this backup? This action cannot be undone.')) {
      return;
    }
    
    setIsLoading(true);
    try {
      const success = await deleteBackup(id);
      if (success) {
        toast.success('Backup deleted successfully');
        loadBackups();
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
  
  // Export functions
  const exportData = (data: any, filename: string) => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    link.click();
    
    URL.revokeObjectURL(url);
  };
  
  const exportPlayers = () => {
    const date = new Date().toISOString().split('T')[0];
    exportData(players, `players_export_${date}.json`);
    toast.success(`Exported ${players.length} players`);
  };
  
  const exportQuestions = () => {
    const questions = categories.flatMap(cat => cat.questions);
    const date = new Date().toISOString().split('T')[0];
    exportData(questions, `questions_export_${date}.json`);
    toast.success(`Exported ${questions.length} questions`);
  };
  
  const exportCards = () => {
    const date = new Date().toISOString().split('T')[0];
    exportData(specialCards, `cards_export_${date}.json`);
    toast.success(`Exported ${specialCards.length} cards`);
  };
  
  // Import functions
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleImportFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Here you would implement logic to determine what kind of data is imported
        // and how to integrate it into the game state
        
        toast.info('Data parsed successfully', {
          description: 'Import feature is under development.'
        });
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error parsing imported file:', error);
        toast.error('Failed to parse imported file');
      }
    };
    
    reader.onerror = () => {
      toast.error('Failed to read file');
    };
    
    reader.readAsText(file);
  };
  
  // Load backups when component mounts
  React.useEffect(() => {
    loadBackups();
  }, []);
  
  return (
    <div className="space-y-6">
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle>Backups</CardTitle>
          <CardDescription>
            Create, restore, or delete game backups
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex gap-2">
            <Input
              value={backupName}
              onChange={(e) => setBackupName(e.target.value)}
              placeholder="Backup name"
              className="bg-black/20 border-white/10"
            />
            <Button
              onClick={handleCreateBackup}
              disabled={isLoading || !backupName.trim()}
              className="whitespace-nowrap"
            >
              <Save className="h-4 w-4 mr-1" /> Create Backup
            </Button>
          </div>
          
          <div className="mb-2 text-sm text-white/60">
            {backups.length} backup(s) available
          </div>
          
          <div className="max-h-60 overflow-y-auto space-y-2">
            {backups.length === 0 ? (
              <div className="text-center p-4 text-white/40 bg-black/20 rounded-md">
                No backups available
              </div>
            ) : (
              backups.map((backup) => (
                <div 
                  key={backup.id} 
                  className="flex items-center justify-between p-2 bg-black/20 rounded-md"
                >
                  <div className="flex-grow">
                    <div className="font-medium">{backup.name}</div>
                    <div className="text-xs text-white/60 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {new Date(backup.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRestoreClick(backup)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-900/20"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteBackup(backup.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle>Export Data</CardTitle>
          <CardDescription>
            Export game data to JSON files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            <Button 
              variant="outline"
              onClick={exportPlayers}
              className="bg-blue-900/20 text-blue-400 border-blue-900/30"
            >
              <DownloadCloud className="h-4 w-4 mr-1" />
              Players ({players.length})
            </Button>
            
            <Button 
              variant="outline"
              onClick={exportQuestions}
              className="bg-green-900/20 text-green-400 border-green-900/30"
            >
              <DownloadCloud className="h-4 w-4 mr-1" />
              Questions ({categories.flatMap(c => c.questions).length})
            </Button>
            
            <Button 
              variant="outline"
              onClick={exportCards}
              className="bg-purple-900/20 text-purple-400 border-purple-900/30"
            >
              <DownloadCloud className="h-4 w-4 mr-1" />
              Cards ({specialCards.length})
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle>Import Data</CardTitle>
          <CardDescription>
            Import game data from JSON files
          </CardDescription>
        </CardHeader>
        <CardContent>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportFile}
            accept="application/json"
            className="hidden"
          />
          <Button 
            variant="outline"
            onClick={handleImportClick}
            className="w-full bg-amber-900/20 text-amber-400 border-amber-900/30"
          >
            <UploadCloud className="h-4 w-4 mr-1" />
            Import Data File
          </Button>
          <div className="text-xs text-white/40 mt-2">
            Supported formats: Players, Questions, Cards in JSON format
          </div>
        </CardContent>
      </Card>
      
      {/* Restore Confirmation Dialog */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent className="bg-black/90 border border-white/10">
          <DialogHeader>
            <DialogTitle>Restore Backup</DialogTitle>
            <DialogDescription>
              This will replace all current game data with the selected backup.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="font-medium">
              Restoring: {selectedBackup?.name}
              <div className="text-xs text-white/60">
                {selectedBackup && new Date(selectedBackup.timestamp).toLocaleString()}
              </div>
            </div>
            
            <div className="bg-red-900/20 p-3 rounded-md text-white">
              <div className="text-sm mb-2">Type <strong>CONFIRM</strong> to proceed:</div>
              <Input
                value={restoreConfirmationText}
                onChange={(e) => setRestoreConfirmationText(e.target.value)}
                className="bg-black/40 border-red-500/30"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRestoreDialog(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmRestore}
              disabled={restoreConfirmationText !== 'CONFIRM' || isLoading}
            >
              Restore Backup
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportExportPanel;
