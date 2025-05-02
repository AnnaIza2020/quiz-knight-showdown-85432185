
import React from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, RefreshCw, Download, Upload, Volume2, VolumeX } from 'lucide-react';
import { GameRound } from '@/types/game-types';
import { useSubscription } from '@/hooks/useSubscription';

interface GameActionButtonsProps {
  round: GameRound;
  isIntroPlaying: boolean;
  startGameWithIntro: () => void;
  startNewGame: () => void;
  handleSaveLocal: () => void;
  handleLoadLocal: () => void;
  isMuted?: boolean;
  toggleMute?: () => void;
  showIntroOnLoad?: boolean;
  toggleShowIntroOnLoad?: () => void;
  toggleIntro?: () => void;
}

const GameActionButtons: React.FC<GameActionButtonsProps> = ({
  round,
  isIntroPlaying,
  startGameWithIntro,
  startNewGame,
  handleSaveLocal,
  handleLoadLocal,
  isMuted = false,
  toggleMute,
  showIntroOnLoad = true,
  toggleShowIntroOnLoad,
  toggleIntro
}) => {
  const { broadcast } = useSubscription('game_events', 'new_event', () => {}, { immediate: false });

  // Start with game show style intro with narrator
  const startGameWithShowIntro = () => {
    // First trigger the narrator intro on the overlay
    broadcast({
      type: 'intro_control',
      action: 'start',
      event: 'Rozpoczynamy show z narratorem!'
    });
    
    // Then start the game after a delay
    setTimeout(() => {
      startGameWithIntro();
    }, 15000); // Allow time for the narrator to complete
  };
  
  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {round === GameRound.SETUP && (
        <>
          <Button
            variant="default"
            className="bg-neon-green text-black hover:bg-neon-green/80"
            onClick={startGameWithIntro}
            disabled={isIntroPlaying}
          >
            <PlayCircle size={18} className="mr-2" />
            Start gry
          </Button>
          
          <Button
            variant="default"
            className="bg-neon-purple text-black hover:bg-neon-purple/80"
            onClick={startGameWithShowIntro}
            disabled={isIntroPlaying}
          >
            <PlayCircle size={18} className="mr-2" />
            Start z czołówką
          </Button>
        </>
      )}
      
      <Button
        variant="outline"
        className="border-neon-blue text-neon-blue hover:bg-neon-blue/20"
        onClick={startNewGame}
      >
        <RefreshCw size={18} className="mr-2" />
        Nowa gra
      </Button>
      
      {toggleIntro && (
        <Button
          variant="outline"
          className="border-neon-purple text-neon-purple hover:bg-neon-purple/20"
          onClick={toggleIntro}
        >
          <PlayCircle size={18} className="mr-2" />
          {isIntroPlaying ? "Ukryj intro" : "Pokaż intro"}
        </Button>
      )}
      
      <Button
        variant="outline"
        className="border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20"
        onClick={handleSaveLocal}
      >
        <Download size={18} className="mr-2" />
        Zapisz lokalnie
      </Button>
      
      <Button
        variant="outline"
        className="border-neon-purple text-neon-purple hover:bg-neon-purple/20"
        onClick={handleLoadLocal}
      >
        <Upload size={18} className="mr-2" />
        Wczytaj lokalnie
      </Button>
      
      {toggleMute && (
        <Button
          variant="outline"
          className="border-neon-pink text-neon-pink hover:bg-neon-pink/20"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX size={18} className="mr-2" /> : <Volume2 size={18} className="mr-2" />}
          {isMuted ? "Włącz dźwięk" : "Wycisz dźwięk"}
        </Button>
      )}
      
      {toggleShowIntroOnLoad && (
        <Button
          variant="outline"
          className={showIntroOnLoad ? "border-neon-green text-neon-green hover:bg-neon-green/20" : "border-white/40 text-white/40 hover:bg-white/10"}
          onClick={toggleShowIntroOnLoad}
        >
          <PlayCircle size={18} className="mr-2" />
          {showIntroOnLoad ? "Intro włączone" : "Intro wyłączone"}
        </Button>
      )}
    </div>
  );
};

export default GameActionButtons;
