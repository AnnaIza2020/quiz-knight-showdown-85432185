
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings, Upload, Download } from 'lucide-react';

interface SettingsHeaderProps {
  onExportSettings?: () => void;
  onImportSettings?: (file: File) => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ 
  onExportSettings, 
  onImportSettings 
}) => {
  const handleImportClick = () => {
    if (!onImportSettings) return;
    
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file && onImportSettings) {
        onImportSettings(file);
      }
    };
    input.click();
  };
  
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center">
        <Link to="/">
          <Button variant="outline" size="icon" className="mr-4">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Powrót</span>
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Settings className="mr-2 h-6 w-6" /> Ustawienia Gry
          </h1>
          <p className="text-muted-foreground">
            Dostosuj parametry gry, pytania, graczy i inne ustawienia
          </p>
        </div>
      </div>
      
      <div className="flex gap-2">
        {onImportSettings && (
          <Button 
            variant="outline" 
            onClick={handleImportClick}
            className="flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            Importuj ustawienia
          </Button>
        )}
        
        {onExportSettings && (
          <Button 
            onClick={onExportSettings}
            className="flex items-center gap-2" 
          >
            <Download className="h-4 w-4" />
            Eksportuj ustawienia
          </Button>
        )}
      </div>
    </div>
  );
};

export default SettingsHeader;
