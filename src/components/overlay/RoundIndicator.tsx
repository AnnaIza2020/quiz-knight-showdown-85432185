
import React from 'react';
import { GameRound } from '@/types/game-types';

interface RoundIndicatorProps {
  round: GameRound;
  primaryColor: string;
  secondaryColor: string;
}

const RoundIndicator = ({ round, primaryColor, secondaryColor }: RoundIndicatorProps) => {
  // Determine border color based on round
  const borderColor = 
    round === GameRound.ROUND_ONE ? primaryColor :
    round === GameRound.ROUND_TWO ? secondaryColor :
    round === GameRound.ROUND_THREE ? '#9b00ff' : 'white';
  
  return (
    <div 
      className="absolute top-0 left-1/2 transform -translate-x-1/2 px-6 py-2 rounded-b-lg"
      style={{
        backgroundColor: 'black',
        borderWidth: '0 2px 2px 2px',
        borderStyle: 'solid',
        borderColor,
        boxShadow: `0 0 10px ${borderColor}`
      }}
    >
      <div className="font-bold text-lg">
        {round === GameRound.SETUP && <span>Przygotowanie</span>}
        {round === GameRound.ROUND_ONE && <span className="text-neon-pink">Runda 1: Zróżnicowana wiedza z Internetu</span>}
        {round === GameRound.ROUND_TWO && <span className="text-neon-blue">Runda 2: 5 sekund</span>}
        {round === GameRound.ROUND_THREE && <span className="text-neon-purple">Runda 3: Koło Fortuny</span>}
        {round === GameRound.FINISHED && <span className="text-neon-yellow">Koniec gry!</span>}
      </div>
    </div>
  );
};

export default RoundIndicator;
