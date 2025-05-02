
import React, { useState } from 'react';
import { useGameContext, GameRound } from '@/context/GameContext';
import Host from '@/pages/Host';
import HostPanel from '@/pages/HostPanel';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, ExternalLink } from 'lucide-react';

interface SwitchableHostPanelProps {
  view: 'classic' | 'modern';
}

const SwitchableHostPanel: React.FC<SwitchableHostPanelProps> = ({ view }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { round } = useGameContext();
  const navigate = useNavigate();
  
  const toggleFullscreen = () => {
    const element = document.documentElement;
    
    if (!document.fullscreenElement) {
      element.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
        }).catch(err => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
        });
      }
    }
  }
  
  const openOverlay = () => {
    window.open('/overlay', '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <span className={`text-lg font-semibold ${
            round === GameRound.SETUP ? 'text-white' :
            round === GameRound.ROUND_ONE ? 'text-neon-pink' :
            round === GameRound.ROUND_TWO ? 'text-neon-blue' :
            round === GameRound.ROUND_THREE ? 'text-neon-purple' : 'text-neon-yellow'
          }`}>
            {round === GameRound.SETUP && 'Przygotowanie do gry'}
            {round === GameRound.ROUND_ONE && 'Runda 1: Wiedza z Internetu'}
            {round === GameRound.ROUND_TWO && 'Runda 2: 5 Sekund'}
            {round === GameRound.ROUND_THREE && 'Runda 3: Koło Fortuny'}
            {round === GameRound.FINISHED && 'Gra zakończona'}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={openOverlay}
            className="border-white/20 text-white hover:bg-white/10 flex items-center"
          >
            <ExternalLink size={16} className="mr-1" />
            Otwórz nakładkę OBS
          </Button>
          <Button 
            variant="outline" 
            size="icon"
            onClick={toggleFullscreen}
            className="border-white/20 text-white hover:bg-white/10"
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </Button>
        </div>
      </div>
      
      <div className="flex-grow overflow-auto">
        {view === 'modern' ? <HostPanel /> : <Host />}
      </div>
    </div>
  );
};

export default SwitchableHostPanel;
