
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { QuestionImportExport } from '@/types/questions-types';
import { DownloadCloud, UploadCloud } from 'lucide-react';

interface ImportExportButtonsProps {
  onImport: (data: any) => boolean;
  onExport: (exportFiltered: boolean) => QuestionImportExport | null;
  filteredCount: number;
  totalCount: number;
}

const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({
  onImport,
  onExport,
  filteredCount,
  totalCount
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const data = JSON.parse(result);
        const success = onImport(data);
        
        if (success && fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Error parsing file:', error);
        toast.error('Nieprawidłowy format pliku');
      }
    };

    reader.onerror = () => {
      toast.error('Błąd podczas odczytu pliku');
    };

    reader.readAsText(file);
  };

  const handleExport = (exportFiltered: boolean = false) => {
    try {
      const exportData = onExport(exportFiltered);
      
      if (!exportData) {
        toast.error('Nie można wyeksportować danych');
        return;
      }

      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename with current date
      const date = new Date().toISOString().split('T')[0];
      const count = exportFiltered ? filteredCount : totalCount;
      link.download = `questions_export_${date}_${count}_items.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success(`Wyeksportowano ${count} pytań do pliku JSON`);
    } catch (error) {
      console.error('Error exporting questions:', error);
      toast.error('Błąd podczas eksportu pytań');
    }
  };

  return (
    <div className="flex gap-2">
      {/* Hidden file input for import */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="application/json"
        className="hidden"
      />
      
      {/* Import button */}
      <Button 
        variant="outline" 
        className="flex items-center gap-2 bg-green-900/20 text-green-400 hover:text-green-300 border-green-800/50"
        onClick={handleImportClick}
      >
        <UploadCloud size={16} /> Importuj pytania
      </Button>
      
      {/* Export filtered button */}
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-blue-900/20 text-blue-400 hover:text-blue-300 border-blue-800/50"
        onClick={() => handleExport(true)}
        disabled={filteredCount === 0}
      >
        <DownloadCloud size={16} /> Eksportuj filtrowane ({filteredCount})
      </Button>
      
      {/* Export all button */}
      <Button
        variant="outline"
        className="flex items-center gap-2 bg-purple-900/20 text-purple-400 hover:text-purple-300 border-purple-800/50"
        onClick={() => handleExport(false)}
        disabled={totalCount === 0}
      >
        <DownloadCloud size={16} /> Eksportuj wszystkie ({totalCount})
      </Button>
    </div>
  );
};

export default ImportExportButtons;
