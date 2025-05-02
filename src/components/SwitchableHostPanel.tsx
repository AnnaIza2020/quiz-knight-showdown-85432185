
import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import Host from '@/pages/Host';
import HostPanel from '@/pages/HostPanel';
import { Button } from '@/components/ui/button';
import { Maximize2, Minimize2, ExternalLink, Bell } from 'lucide-react';
import EventsBar from '@/components/hostpanel/EventsBar';

interface SwitchableHostPanelProps {
  view: 'classic' | 'modern';
}

const SwitchableHostPanel: React.FC<SwitchableHostPanelProps> = ({ view }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const { round, playSound } = useGameContext();
  
  // Generate friendly name for the current round
  const getRoundName = () => {
    switch (round) {
      case GameRound.SETUP:
        return "Przygotowanie do gry";
      case GameRound.ROUND_ONE:
        return "Runda 1: Zróżnicowana Wiedza z Polskiego Internetu";
      case GameRound.ROUND_TWO:
        return "Runda 2: 5 Sekund";
      case GameRound.ROUND_THREE:
        return "Runda 3: Koło Fortuny";
      case GameRound.FINISHED:
        return "Gra zakończona";
      default:
        return "Przygotowanie do gry";
    }
  };
  
  // Add initial events - reduced to a single welcome message
  useEffect(() => {
    if (events.length === 0) {
      setEvents([
        "Witaj w panelu prowadzącego Quiz Knight Showdown!"
      ]);
    }
  }, [events.length]);
  
  // Function to add new events
  const addEvent = (event: string) => {
    setEvents(prev => [event, ...prev]);
    
    // Limit stored events to prevent memory issues
    if (events.length > 50) {
      setEvents(prev => prev.slice(0, 50));
    }
  };
  
  const toggleFullscreen = () => {
    const element = document.documentElement;
    
    if (!document.fullscreenElement) {
      element.requestFullscreen().then(() => {
        setIsFullscreen(true);
        addEvent("Włączono tryb pełnoekranowy");
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
        addEvent(`Błąd włączania trybu pełnoekranowego: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullscreen(false);
          addEvent("Wyłączono tryb pełnoekranowy");
        }).catch(err => {
          console.error(`Error attempting to exit fullscreen: ${err.message}`);
          addEvent(`Błąd wyłączania trybu pełnoekranowego: ${err.message}`);
        });
      }
    }
  }
  
  const openOverlay = () => {
    window.open('/overlay', '_blank', 'noopener,noreferrer');
    addEvent("Otwarto nakładkę OBS w nowym oknie");
  }
  
  const testSound = (sound: string) => {
    playSound(sound as any);
    addEvent(`Odtworzono dźwięk testowy: ${sound}`);
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
            {getRoundName()}
          </span>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => testSound('success')}
            className="border-neon-green text-neon-green hover:bg-neon-green/10 flex items-center"
          >
            <Bell size={16} className="mr-1" />
            Test dźwięku
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={openOverlay}
            className="border-white/20 text-white hover:bg-white/10 flex items-center"
          >
            <ExternalLink size={16} className="mr-1" />
            Nakładka OBS
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
      
      <EventsBar lastEvents={events} className="mb-4" />
      
      <div className="flex-grow overflow-auto">
        {view === 'modern' ? <HostPanel /> : <Host />}
      </div>
    </div>
  );
};

export default SwitchableHostPanel;
