
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download, Upload, HelpCircle } from 'lucide-react';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from 'sonner';
import { usePlayerConnection } from '@/hooks/usePlayerConnection';

interface SettingsHeaderProps {
  onExportSettings: () => void;
}

const SettingsHeader: React.FC<SettingsHeaderProps> = ({ onExportSettings }) => {
  const { status: connectionStatus } = usePlayerConnection();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-2">
        <Link 
          to="/" 
          className="text-neon-green hover:text-neon-green/80 flex items-center gap-1 text-sm"
        >
          <ArrowLeft size={16} />
          <span>Powrót do strony głównej</span>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Panel Ustawień</h1>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <HelpCircle size={16} className="text-white/60" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p className="max-w-xs">
                W panelu ustawień możesz skonfigurować wszystkie aspekty gry.
                Zmiany są zapisywane automatycznie.
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        {connectionStatus === 'connected' && (
          <div className="flex items-center gap-1 ml-3 bg-green-500/20 text-green-500 px-2 py-0.5 rounded-full text-xs">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            Połączono z bazą danych
          </div>
        )}
        
        {connectionStatus === 'error' && (
          <div className="flex items-center gap-1 ml-3 bg-red-500/20 text-red-500 px-2 py-0.5 rounded-full text-xs">
            <span className="w-2 h-2 bg-red-500 rounded-full"></span>
            Problem z połączeniem
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs"
          onClick={onExportSettings}
        >
          <Download size={14} className="mr-1" /> Eksportuj ustawienia
        </Button>
        <Button variant="outline" size="sm" className="text-xs" onClick={() => toast.info('Wylogowywanie nie jest jeszcze zaimplementowane')}>
          <Upload size={14} className="mr-1" /> Wyloguj
        </Button>
      </div>
    </div>
  );
};

export default SettingsHeader;
