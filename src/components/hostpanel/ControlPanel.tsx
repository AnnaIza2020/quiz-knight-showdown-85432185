
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { RotateCcw, Play, Pause, SkipForward, X } from 'lucide-react';

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
  const navigate = useNavigate();

  return (
    <div className="hidden lg:block w-64 space-y-4">
      <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-white/10">
        <h3 className="text-xl font-bold mb-4 text-white">Akcje</h3>
        
        <div className="space-y-3">
          <button 
            className="w-full py-3 px-4 bg-black border border-neon-purple text-neon-purple rounded-md hover:bg-neon-purple/20 flex items-center justify-center"
            onClick={resetGame}
          >
            <RotateCcw size={18} className="mr-2" /> Reset Rundy
          </button>
          
          <button 
            className="w-full py-3 px-4 bg-black border border-neon-yellow text-neon-yellow rounded-md hover:bg-neon-yellow/20 flex items-center justify-center"
            onClick={handleTogglePause}
          >
            {isPaused ? (
              <><Play size={18} className="mr-2" /> Wznów Grę</>
            ) : (
              <><Pause size={18} className="mr-2" /> Przerwa</>
            )}
          </button>
          
          <button 
            className="w-full py-3 px-4 bg-black border border-neon-blue text-neon-blue rounded-md hover:bg-neon-blue/20 flex items-center justify-center"
            onClick={handleSkipQuestion}
          >
            <SkipForward size={18} className="mr-2" /> Pomiń Pytanie
          </button>
          
          <button 
            className="w-full py-4 px-4 bg-black border-2 border-neon-red text-neon-red rounded-md hover:bg-neon-red/20 flex items-center justify-center font-bold mt-6"
            onClick={handleFinishGame}
          >
            <X size={18} className="mr-2" /> Zakończ Grę
          </button>
        </div>
      </div>
      
      <div className="bg-black/70 backdrop-blur-md p-4 rounded-lg border border-white/10">
        <h3 className="text-xl font-bold mb-2 text-white">Nawigacja</h3>
        <div className="space-y-2">
          <button 
            className="w-full p-2 bg-black/50 text-white rounded hover:bg-white/10 text-left"
            onClick={() => navigate('/')}
          >
            Strona Główna
          </button>
          <button 
            className="w-full p-2 bg-black/50 text-white rounded hover:bg-white/10 text-left"
            onClick={() => navigate('/overlay')}
          >
            Przejdź do Overlay
          </button>
          <button 
            className="w-full p-2 bg-black/50 text-white rounded hover:bg-white/10 text-left"
            onClick={() => navigate('/settings')}
          >
            Ustawienia
          </button>
        </div>
      </div>
    </div>
  );
};

export default ControlPanel;
