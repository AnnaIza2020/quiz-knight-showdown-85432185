
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface EditionManagerProps {
  saveDialogOpen: boolean;
  setSaveDialogOpen: (open: boolean) => void;
  loadDialogOpen: boolean;
  setLoadDialogOpen: (open: boolean) => void;
  editionName: string;
  setEditionName: (name: string) => void;
  handleSaveEdition: () => void;
  handleLoadEdition: (name: string) => void;
  availableEditions: {name: string}[];
}

const EditionManager: React.FC<EditionManagerProps> = ({
  saveDialogOpen,
  setSaveDialogOpen,
  loadDialogOpen,
  setLoadDialogOpen,
  editionName,
  setEditionName,
  handleSaveEdition,
  handleLoadEdition,
  availableEditions,
}) => {
  return (
    <>
      {/* Save Dialog */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zapisz edycję gry</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Nazwa edycji"
              value={editionName}
              onChange={(e) => setEditionName(e.target.value)}
              className="mb-4"
            />
            <p className="text-sm text-gray-400">
              Zapisana edycja będzie zawierać wszystkich graczy, pytania, karty specjalne i ustawienia.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setSaveDialogOpen(false)} variant="outline">
              Anuluj
            </Button>
            <Button onClick={handleSaveEdition} className="bg-neon-green text-black">
              Zapisz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Load Dialog */}
      <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Wczytaj edycję gry</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {availableEditions.length > 0 ? (
              <Select onValueChange={handleLoadEdition}>
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz edycję do wczytania" />
                </SelectTrigger>
                <SelectContent>
                  {availableEditions.map((edition, i) => (
                    <SelectItem key={i} value={edition.name}>
                      {edition.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <p className="text-center text-gray-400">Brak zapisanych edycji</p>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setLoadDialogOpen(false)} variant="outline">
              Anuluj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EditionManager;
