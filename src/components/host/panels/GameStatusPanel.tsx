
import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { GameRound } from '@/types/game-types';
import EventsBar from '@/components/hostpanel/EventsBar';
import GameActions from '@/components/hostpanel/GameActions';

interface GameStatusPanelProps {
  lastEvents: string[];
  startGame: () => void;
  startNewGame: () => void;
  handleSaveLocal: () => void;
  handleLoadLocal: () => void;
  soundMuted: boolean;
  toggleSound: () => void;
}

const GameStatusPanel: React.FC<GameStatusPanelProps> = ({
  lastEvents,
  startGame,
  startNewGame,
  handleSaveLocal,
  handleLoadLocal,
  soundMuted,
  toggleSound
}) => {
  const { round, players } = useGameContext();
  
  return (
    <>
      <div className="mb-4">
        <EventsBar lastEvents={lastEvents} className="mb-4" />
      </div>
      
      <GameActions
        round={round}
        startGame={startGame}
        startNewGame={startNewGame}
        handleSaveLocal={handleSaveLocal}
        handleLoadLocal={handleLoadLocal}
        soundMuted={soundMuted}
        toggleSound={toggleSound}
      />
    </>
  );
};

export default GameStatusPanel;
