
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Pause, Play, FastForward, SkipForward, 
  Repeat, RefreshCw, FileWarning 
} from 'lucide-react';
import PreviewMode from '@/components/host/PreviewMode';
import WinnerHistory from '@/components/host/WinnerHistory';
import DebugPanel from '@/components/host/DebugPanel';

interface ControlPanelProps {
  isPaused: boolean;
  handleTogglePause: () => void;
  handleSkipQuestion: () => void;
  handleFinishGame: () => void;
  resetGame: () => void;
}

const ControlPanel = ({
  isPaused,
  handleTogglePause,
  handleSkipQuestion,
  handleFinishGame,
  resetGame
}: ControlPanelProps) => {
  // Preview mode state
  const [previewMode, setPreviewMode] = React.useState(false);

  return (
    <div className="w-96 space-y-4">
      {/* Preview Mode Panel */}
      <PreviewMode 
        onToggle={setPreviewMode}
        isActive={previewMode}
      />

      {/* Main Control Panel */}
      <div className="bg-black/50 backdrop-blur-md p-4 rounded-lg border border-white/10">
        <h2 className="text-2xl font-bold mb-4 text-white">Kontrola Gry</h2>
        
        {/* Play/Pause Button */}
        <Button
          className={`w-full mb-3 h-14 text-lg font-bold ${
            isPaused 
              ? 'bg-neon-green text-black hover:bg-neon-green/90' 
              : 'bg-red-600 hover:bg-red-700'
          }`}
          onClick={handleTogglePause}
        >
          {isPaused ? (
            <>
              <Play className="mr-2 h-6 w-6" />
              Wznów Grę
            </>
          ) : (
            <>
              <Pause className="mr-2 h-6 w-6" />
              Pauzuj Grę
            </>
          )}
        </Button>
        
        {/* Game Control Buttons */}
        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            className="border-orange-400 text-orange-400 hover:bg-orange-400/20"
            onClick={handleSkipQuestion}
          >
            <SkipForward className="mr-2 h-5 w-5" />
            Pomiń Pytanie
          </Button>
          
          <Button
            variant="outline"
            className="border-neon-yellow text-neon-yellow hover:bg-yellow-600/10"
            onClick={handleFinishGame}
          >
            <FastForward className="mr-2 h-5 w-5" />
            Zakończ Grę
          </Button>
          
          <Button
            variant="destructive"
            onClick={resetGame}
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Resetuj Grę
          </Button>
        </div>
        
        {/* Warning for preview mode */}
        {previewMode && (
          <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-600 rounded text-sm">
            <div className="flex">
              <FileWarning className="mr-2 text-yellow-500" size={18} />
              <div>
                <h4 className="text-yellow-500 font-medium">Tryb Podglądu Aktywny</h4>
                <p className="text-white/70 text-xs">
                  Niektóre funkcje mogą być ograniczone. Wyłącz tryb podglądu, aby korzystać ze wszystkich funkcji.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Winners History */}
      <WinnerHistory />
      
      {/* Debug Panel */}
      <DebugPanel />
    </div>
  );
};

export default ControlPanel;
