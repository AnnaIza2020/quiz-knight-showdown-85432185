
import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface StatusPanelProps {
  player: {
    status?: string;
    id: string;
  };
}

const StatusPanel: React.FC<StatusPanelProps> = ({ player }) => {
  return (
    <div className="p-4 bg-black/50 border border-white/20 rounded-lg">
      <h2 className="text-white text-xl mb-4">Status gry</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="text-sm text-white/70">Status</div>
          <div className="text-white flex items-center">
            {player.status === 'active' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                Aktywny
              </>
            ) : player.status === 'eliminated' ? (
              <>
                <AlertCircle className="w-4 h-4 text-red-500 mr-2" />
                Wyeliminowany
              </>
            ) : (
              'Oczekiwanie'
            )}
          </div>
        </div>
        
        <div>
          <div className="text-sm text-white/70">ID gracza</div>
          <div className="text-white/50 text-sm">{player.id.substring(0, 8)}...</div>
        </div>
      </div>
      
      <div className="mt-4 text-center text-sm text-white/50">
        Nie zamykaj tego okna! Host gry widzi Twoją kamerę.
      </div>
    </div>
  );
};

export default StatusPanel;
