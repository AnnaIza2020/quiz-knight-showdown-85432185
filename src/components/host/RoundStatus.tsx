
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Player } from '@/types/interfaces';
import { GameRound } from '@/types/game-types';
import { RoundSettings } from '@/types/round-settings';
import { Users, Trophy, Heart, AlertTriangle } from 'lucide-react';

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
  const getRoundInfo = () => {
    switch (round) {
      case GameRound.SETUP:
        return {
          name: 'Przygotowanie',
          description: 'Konfiguracja gry i graczy',
          color: 'text-gray-400'
        };
      case GameRound.ROUND_ONE:
        return {
          name: 'Runda 1',
          description: 'Wiedza z Internetu',
          color: 'text-neon-blue'
        };
      case GameRound.ROUND_TWO:
        return {
          name: 'Runda 2',
          description: '5 Sekund',
          color: 'text-neon-green'
        };
      case GameRound.ROUND_THREE:
        return {
          name: 'Runda 3',
          description: 'Koło Fortuny',
          color: 'text-neon-purple'
        };
      case GameRound.FINISHED:
        return {
          name: 'Zakończona',
          description: 'Gra została ukończona',
          color: 'text-neon-pink'
        };
      default:
        return {
          name: 'Nieznana',
          description: '',
          color: 'text-gray-400'
        };
    }
  };

  const roundInfo = getRoundInfo();
  const totalPlayers = activePlayers.length + eliminatedPlayers.length;

  const getProgressInfo = () => {
    switch (round) {
      case GameRound.ROUND_ONE:
        const eliminatedCount = eliminatedPlayers.length;
        const targetEliminations = roundSettings.round1.eliminateCount;
        return {
          current: eliminatedCount,
          target: targetEliminations,
          label: 'Eliminacji do przejścia do R2',
          percentage: (eliminatedCount / targetEliminations) * 100
        };
      case GameRound.ROUND_TWO:
        const remainingInR2 = activePlayers.filter(p => p.lives > 0).length;
        return {
          current: totalPlayers - remainingInR2,
          target: totalPlayers - 3,
          label: 'Eliminacji do przejścia do R3',
          percentage: ((totalPlayers - remainingInR2) / (totalPlayers - 3)) * 100
        };
      case GameRound.ROUND_THREE:
        const remainingInR3 = activePlayers.filter(p => p.lives > 0).length;
        return {
          current: totalPlayers - remainingInR3,
          target: totalPlayers - 1,
          label: 'Eliminacji do zwycięstwa',
          percentage: ((totalPlayers - remainingInR3) / (totalPlayers - 1)) * 100
        };
      default:
        return null;
    }
  };

  const progressInfo = getProgressInfo();

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-neon-gold" />
          <span>Status Rundy</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Round Info */}
        <div className="text-center space-y-2">
          <h3 className={`text-2xl font-bold ${roundInfo.color}`}>
            {roundInfo.name}
          </h3>
          <p className="text-white/60 text-sm">
            {roundInfo.description}
          </p>
        </div>

        {/* Player Counts */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <Users className="w-5 h-5 text-neon-green mx-auto mb-1" />
            <p className="text-white font-semibold">{activePlayers.length}</p>
            <p className="text-white/60 text-xs">Aktywni</p>
          </div>
          
          <div className="bg-black/20 rounded-lg p-3 text-center">
            <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mb-1" />
            <p className="text-white font-semibold">{eliminatedPlayers.length}</p>
            <p className="text-white/60 text-xs">Wyeliminowani</p>
          </div>
        </div>

        {/* Progress to Next Round */}
        {progressInfo && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/60 text-sm">{progressInfo.label}</span>
              <span className="text-white text-sm">
                {progressInfo.current} / {progressInfo.target}
              </span>
            </div>
            <Progress 
              value={Math.min(progressInfo.percentage, 100)} 
              className="h-2"
            />
          </div>
        )}

        {/* Round-specific info */}
        {round === GameRound.ROUND_ONE && (
          <div className="bg-blue-500/10 rounded-lg p-3 border border-blue-500/20">
            <p className="text-blue-400 text-sm">
              <Heart className="w-4 h-4 inline mr-1" />
              Gracze tracą {roundSettings.round1.healthDeductionPercentage}% zdrowia za błędną odpowiedź
            </p>
          </div>
        )}

        {round === GameRound.ROUND_TWO && (
          <div className="bg-green-500/10 rounded-lg p-3 border border-green-500/20">
            <p className="text-green-400 text-sm">
              <Heart className="w-4 h-4 inline mr-1" />
              Gracze mają {roundSettings.round2.livesCount} życia, tracą 1 za błędną odpowiedź
            </p>
          </div>
        )}

        {round === GameRound.ROUND_THREE && (
          <div className="bg-purple-500/10 rounded-lg p-3 border border-purple-500/20">
            <p className="text-purple-400 text-sm">
              <Trophy className="w-4 h-4 inline mr-1" />
              Finałowa runda - ostatni gracz wygrywa!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoundStatus;
