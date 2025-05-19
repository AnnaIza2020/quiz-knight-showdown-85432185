
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GameRound, Player } from '@/types/game-types';
import { RoundSettings } from '@/hooks/useGameLogic';
import { Progress } from '@/components/ui/progress';

interface RoundStatusProps {
  round: GameRound;
  activePlayers: Player[];
  eliminatedPlayers: Player[];
  roundSettings: RoundSettings;
}

const RoundStatus: React.FC<RoundStatusProps> = ({
  round,
  activePlayers,
  eliminatedPlayers,
  roundSettings
}) => {
  // Get round name
  const getRoundName = () => {
    switch (round) {
      case GameRound.SETUP: return "Przygotowanie";
      case GameRound.ROUND_ONE: return "Runda 1: Eliminacje";
      case GameRound.ROUND_TWO: return "Runda 2: Szybkie odpowiedzi";
      case GameRound.ROUND_THREE: return "Runda 3: Koło Fortuny";
      case GameRound.FINISHED: return "Koniec gry";
      default: return "Nieznana runda";
    }
  };
  
  // Get round progress info
  const getRoundProgress = () => {
    if (round === GameRound.ROUND_ONE) {
      // Progress based on eliminated players (target: 5 eliminated)
      const eliminatedCount = eliminatedPlayers.length;
      const targetCount = 5;
      const progress = Math.min(100, (eliminatedCount / targetCount) * 100);
      
      return {
        progress,
        label: `${eliminatedCount}/${targetCount} graczy wyeliminowanych`,
        description: eliminatedCount >= targetCount 
          ? "Możesz przejść do Rundy 2" 
          : `Potrzeba jeszcze ${targetCount - eliminatedCount} eliminacji`
      };
    } 
    else if (round === GameRound.ROUND_TWO) {
      // Progress based on remaining players (target: 3 players)
      const remainingCount = activePlayers.length;
      const targetCount = 3;
      const progress = remainingCount <= targetCount 
        ? 100 
        : 100 - ((remainingCount - targetCount) / 3) * 100;
      
      return {
        progress,
        label: `${remainingCount} graczy pozostało`,
        description: remainingCount <= targetCount 
          ? "Możesz przejść do Rundy 3" 
          : `Potrzeba eliminacji ${remainingCount - targetCount} graczy`
      };
    }
    else if (round === GameRound.ROUND_THREE) {
      // Progress based on remaining players (target: 1 player)
      const remainingCount = activePlayers.length;
      const targetCount = 1;
      const progress = remainingCount <= targetCount 
        ? 100 
        : 100 - ((remainingCount - targetCount) / 2) * 100;
      
      return {
        progress,
        label: `${remainingCount} graczy pozostało`,
        description: remainingCount <= targetCount 
          ? "Mamy zwycięzcę!" 
          : `Czekamy na finalnego zwycięzcę`
      };
    }
    else {
      // Default for other rounds
      return {
        progress: 0,
        label: "Czekamy na start...",
        description: "Rozpocznij grę, aby śledzić postęp"
      };
    }
  };
  
  // Get round configuration
  const getRoundConfig = () => {
    if (round === GameRound.ROUND_ONE) {
      return [
        { label: "Punkty", value: `5-20 (wg. trudności)` },
        { label: "Kara za błąd", value: `-${roundSettings.lifePenalties.round1}% życia` },
        { label: "Czas", value: `${roundSettings.timerDurations.round1}s` },
        { label: "Lucky Loser", value: `Od ${roundSettings.luckyLoserThreshold} pkt` },
      ];
    }
    else if (round === GameRound.ROUND_TWO) {
      return [
        { label: "Punkty", value: `+${roundSettings.pointValues.round2} pkt` },
        { label: "Kara za błąd", value: `-1 życie` },
        { label: "Czas", value: `${roundSettings.timerDurations.round2}s` },
      ];
    }
    else if (round === GameRound.ROUND_THREE) {
      return [
        { label: "Punkty", value: `+${roundSettings.pointValues.round3} pkt` },
        { label: "Kara za błąd", value: `-1 życie` },
        { label: "Czas", value: `${roundSettings.timerDurations.round3}s` },
      ];
    }
    else {
      return [];
    }
  };
  
  const { progress, label, description } = getRoundProgress();
  const configItems = getRoundConfig();

  return (
    <Card className="bg-black/40 border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">{getRoundName()}</CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Progress bar */}
        {round !== GameRound.SETUP && round !== GameRound.FINISHED && (
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm">
              <span className="text-white">{label}</span>
              <span className="text-white/60">{Math.round(progress)}%</span>
            </div>
            <p className="text-sm text-white/70">{description}</p>
          </div>
        )}
        
        {/* Round configuration */}
        {configItems.length > 0 && (
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-3 p-3 rounded-lg bg-black/20">
            {configItems.map((item, i) => (
              <div key={i}>
                <p className="text-xs text-white/60">{item.label}</p>
                <p className="text-sm font-medium text-white">{item.value}</p>
              </div>
            ))}
          </div>
        )}
        
        {/* Player counts */}
        <div className="flex justify-between text-sm text-white p-3 rounded-lg bg-black/20">
          <div>
            <p className="text-xs text-white/60">Aktywni gracze</p>
            <p className="text-white font-semibold">{activePlayers.length}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Wyeliminowani</p>
            <p className="text-white font-semibold">{eliminatedPlayers.length}</p>
          </div>
          <div>
            <p className="text-xs text-white/60">Łącznie</p>
            <p className="text-white font-semibold">{activePlayers.length + eliminatedPlayers.length}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoundStatus;
