
import React from 'react';
import { ArrowLeft, Download, Upload, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import NeonButton from '@/components/common/NeonButton';

interface SettingsHeaderProps {
  onExportSettings: () => void;
  onImportSettings: (file: File) => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({
  onExportSettings,
  onImportSettings
}) => {
  const navigate = useNavigate();

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        onImportSettings(file);
      }
    };
    input.click();
  };

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-[#00FFA3] hover:text-[#00FFA3]/80 transition-colors mr-4"
        >
          <ArrowLeft className="w-6 h-6 mr-2" />
          Powrót do menu
        </button>
        <h1 className="text-4xl font-bold text-[#00FFA3]">Ustawienia</h1>
      </div>
      
      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={handleImportClick}
          className="border-gray-500 text-gray-300 hover:bg-gray-700"
        >
          <Upload className="w-4 h-4 mr-2" />
          Importuj
        </Button>
        <Button
          variant="outline"
          onClick={onExportSettings}
          className="border-gray-500 text-gray-300 hover:bg-gray-700"
        >
          <Download className="w-4 h-4 mr-2" />
          Eksportuj
        </Button>
        <NeonButton>
          <Save className="w-4 h-4 mr-2" />
          Zapisz Wszystko
        </NeonButton>
      </div>
    </div>
  );
};

export default SettingsHeader;
