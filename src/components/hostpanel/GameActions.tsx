
import React, { useState } from 'react';
import { GameRound } from '@/types/game-types';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { PlayCircle, RefreshCw, Download, Upload, Volume2, VolumeX, SkipForward } from 'lucide-react';
import { motion } from 'framer-motion';
import { useGameContext } from '@/context/GameContext';
import { useSubscription } from '@/hooks/useSubscription';

interface GameActionsProps {
  round: GameRound;
  startGame: () => void;
  startNewGame: () => void;
  handleSaveLocal: () => void;
  handleLoadLocal: () => void;
  soundMuted: boolean;
  toggleSound: () => void;
}

const GameActions: React.FC<GameActionsProps> = ({
  round,
  startGame,
  startNewGame,
  handleSaveLocal,
  handleLoadLocal,
  soundMuted,
  toggleSound
}) => {
  const [isSkipping, setIsSkipping] = useState(false);
  const { playSound } = useGameContext();
  const { broadcast } = useSubscription('game_events', 'new_event', () => {}, { immediate: false });
  
  const handleStartGame = () => {
    toast.success('Rozpoczynamy grę!');
    playSound('success');
    startGame();
  };

  const handleSkipQuestion = () => {
    setIsSkipping(true);
    
    // Play skip sound
    playSound('wheel-tick');
    
    // Show toast
    toast.info('Pytanie pominięte!', {
      description: 'Przechodzę do następnego pytania'
    });
    
    // Broadcast event to overlay
    broadcast({
      type: 'game_event',
      event: 'question_skipped'
    });
    
    // Visual animation effect for skipping
    setTimeout(() => {
      setIsSkipping(false);
    }, 1000);
  };

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {round === GameRound.SETUP && (
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button
            variant="default"
            className="bg-neon-green text-black hover:bg-neon-green/80"
            onClick={handleStartGame}
          >
            <PlayCircle size={18} className="mr-2" />
            Start gry
          </Button>
        </motion.div>
      )}
      
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          variant="outline"
          className="border-neon-blue text-neon-blue hover:bg-neon-blue/20"
          onClick={startNewGame}
        >
          <RefreshCw size={18} className="mr-2" />
          Nowa gra
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          variant="outline"
          className="border-neon-yellow text-neon-yellow hover:bg-neon-yellow/20"
          onClick={handleSaveLocal}
        >
          <Download size={18} className="mr-2" />
          Zapisz lokalnie
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          variant="outline"
          className="border-neon-purple text-neon-purple hover:bg-neon-purple/20"
          onClick={handleLoadLocal}
        >
          <Upload size={18} className="mr-2" />
          Wczytaj lokalnie
        </Button>
      </motion.div>
      
      <motion.div
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        <Button
          variant="outline"
          className="border-neon-pink text-neon-pink hover:bg-neon-pink/20"
          onClick={toggleSound}
        >
          {soundMuted ? <VolumeX size={18} className="mr-2" /> : <Volume2 size={18} className="mr-2" />}
          {soundMuted ? "Włącz dźwięk" : "Wycisz dźwięk"}
        </Button>
      </motion.div>
      
      {round !== GameRound.SETUP && (
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          animate={isSkipping ? { 
            rotate: [0, 5, -5, 0],
            scale: [1, 1.05, 0.95, 1]
          } : {}}
          transition={{ duration: 0.5 }}
        >
          <Button
            variant="outline"
            className={`border-orange-400 text-orange-400 hover:bg-orange-400/20 ${isSkipping ? 'animate-pulse' : ''}`}
            onClick={handleSkipQuestion}
            disabled={isSkipping}
          >
            <SkipForward size={18} className={`mr-2 ${isSkipping ? 'animate-spin' : ''}`} />
            {isSkipping ? "Pomijam..." : "Pomiń pytanie"}
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default GameActions;
