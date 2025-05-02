
import React from 'react';
import { GameRound } from '@/types/game-types';
import { cn } from "@/lib/utils";

interface RoundIndicatorProps {
  round: GameRound;
  primaryColor: string;
  secondaryColor: string;
  className?: string;
}

const RoundIndicator: React.FC<RoundIndicatorProps> = ({
  round,
  primaryColor,
  secondaryColor,
  className
}) => {
  // Get round name and styling based on current round
  const getRoundInfo = () => {
    switch(round) {
      case GameRound.SETUP:
        return {
          name: 'Przygotowanie',
          color: 'white',
          bgColor: 'rgba(255, 255, 255, 0.1)'
        };
      case GameRound.ROUND_ONE:
        return {
          name: 'Runda 1: Zróżnicowana wiedza z Polskiego Internetu',
          color: primaryColor,
          bgColor: `${primaryColor}30` // 30 is alpha in hex (around 0.2 opacity)
        };
      case GameRound.ROUND_TWO:
        return {
          name: 'Runda 2: 5 Sekund',
          color: secondaryColor,
          bgColor: `${secondaryColor}30`
        };
      case GameRound.ROUND_THREE:
        return {
          name: 'Runda 3: Koło Chaosu',
          color: primaryColor,
          bgColor: `${primaryColor}30`
        };
      case GameRound.FINISHED:
        return {
          name: 'Koniec Gry',
          color: 'white',
          bgColor: 'rgba(255, 255, 255, 0.1)'
        };
      default:
        return {
          name: 'Nieznany etap',
          color: 'white',
          bgColor: 'rgba(255, 255, 255, 0.1)'
        };
    }
  };
  
  const roundInfo = getRoundInfo();
  
  // If in setup or finished, don't show indicator
  if (round === GameRound.SETUP) {
    return null;
  }
  
  return (
    <div 
      className={cn(
        'absolute top-4 left-1/2 transform -translate-x-1/2',
        'px-4 py-2 rounded-full',
        'text-center font-bold z-10',
        className
      )}
      style={{ 
        backgroundColor: roundInfo.bgColor,
        color: roundInfo.color,
        textShadow: `0 0 5px ${roundInfo.color}`
      }}
    >
      {roundInfo.name}
    </div>
  );
};

export default RoundIndicator;
