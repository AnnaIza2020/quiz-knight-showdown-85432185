
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Player, Question } from '@/types/interfaces';
import { GameRound } from '@/types/game-types';
import { RoundSettings } from '@/types/round-settings';
import { CheckCircle, XCircle, Plus, Minus, UserX, RotateCcw, Heart, Trophy } from 'lucide-react';

interface PlayerActionsProps {
  activePlayerId: string | null;
  activePlayer: Player | null;
  currentQuestion: Question | null;
  round: GameRound;
  roundSettings: RoundSettings;
  hasUndoHistory: boolean;
  handleAwardPoints: () => void;
  handleDeductHealth: () => void;
  handleBonusPoints: () => void;
  handleEliminatePlayer: () => void;
  handleUndoLastAction: () => void;
  handleManualPoints: (points: number) => void;
  handleManualHealth: (health: number) => void;
}

const PlayerActions: React.FC<PlayerActionsProps> = ({
  activePlayerId,
  activePlayer,
  currentQuestion,
  round,
  roundSettings,
  hasUndoHistory,
  handleAwardPoints,
  handleDeductHealth,
  handleBonusPoints,
  handleEliminatePlayer,
  handleUndoLastAction,
  handleManualPoints,
  handleManualHealth
}) => {
  if (!activePlayerId || !activePlayer) {
    return (
      <Card className="bg-black/40 backdrop-blur-md border-white/20">
        <CardContent className="py-8">
          <p className="text-white/60 text-center">
            Wybierz gracza, aby wyświetlić akcje
          </p>
        </CardContent>
      </Card>
    );
  }

  const getPointsForCorrectAnswer = () => {
    if (currentQuestion) {
      return currentQuestion.points || currentQuestion.difficulty || 10;
    }
    
    switch (round) {
      case GameRound.ROUND_ONE:
        return roundSettings.round1.pointsForCorrectAnswer;
      case GameRound.ROUND_TWO:
        return roundSettings.round2.pointsForCorrectAnswer;
      case GameRound.ROUND_THREE:
        return roundSettings.round3.pointsForCorrectAnswer;
      default:
        return 10;
    }
  };

  return (
    <Card className="bg-black/40 backdrop-blur-md border-white/20">
      <CardHeader>
        <CardTitle className="text-lg text-white flex items-center justify-between">
          <span>Akcje dla gracza</span>
          <Badge variant="outline" className="text-neon-blue border-neon-blue">
            {activePlayer.name}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Player Stats */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-black/20 rounded-lg">
          <div className="text-center">
            <Trophy className="w-5 h-5 text-neon-green mx-auto mb-1" />
            <p className="text-white text-sm">{activePlayer.points}</p>
            <p className="text-white/60 text-xs">Punkty</p>
          </div>
          
          {round === GameRound.ROUND_ONE && (
            <div className="text-center">
              <div className="w-5 h-5 bg-neon-blue rounded mx-auto mb-1" />
              <p className="text-white text-sm">{activePlayer.health}%</p>
              <p className="text-white/60 text-xs">Zdrowie</p>
            </div>
          )}
          
          {(round === GameRound.ROUND_TWO || round === GameRound.ROUND_THREE) && (
            <div className="text-center">
              <Heart className="w-5 h-5 text-red-500 mx-auto mb-1" />
              <p className="text-white text-sm">{activePlayer.lives}</p>
              <p className="text-white/60 text-xs">Życia</p>
            </div>
          )}
          
          <div className="text-center">
            <div className={`w-3 h-3 rounded-full mx-auto mb-1 ${
              activePlayer.isEliminated ? 'bg-red-500' : 'bg-green-500'
            }`} />
            <p className="text-white text-xs">
              {activePlayer.isEliminated ? 'Wyeliminowany' : 'Aktywny'}
            </p>
          </div>
        </div>

        {/* Main Actions */}
        {!activePlayer.isEliminated && (
          <div className="grid grid-cols-2 gap-3">
            <Button
              onClick={handleAwardPoints}
              className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>+{getPointsForCorrectAnswer()}</span>
            </Button>
            
            <Button
              onClick={handleDeductHealth}
              className="bg-red-600 hover:bg-red-700 text-white flex items-center space-x-2"
            >
              <XCircle className="w-4 h-4" />
              <span>Błędna</span>
            </Button>
          </div>
        )}

        {/* Additional Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button
            onClick={handleBonusPoints}
            variant="outline"
            className="border-neon-green text-neon-green hover:bg-neon-green hover:text-black flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Bonus +5</span>
          </Button>
          
          {!activePlayer.isEliminated && (
            <Button
              onClick={handleEliminatePlayer}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white flex items-center space-x-2"
            >
              <UserX className="w-4 h-4" />
              <span>Eliminuj</span>
            </Button>
          )}
        </div>

        {/* Manual Adjustments */}
        <div className="space-y-2">
          <p className="text-white/60 text-sm">Ręczne korekty:</p>
          <div className="grid grid-cols-4 gap-2">
            <Button
              size="sm"
              onClick={() => handleManualPoints(-5)}
              className="bg-red-600/20 hover:bg-red-600/40 text-red-400"
            >
              -5
            </Button>
            <Button
              size="sm"
              onClick={() => handleManualPoints(5)}
              className="bg-green-600/20 hover:bg-green-600/40 text-green-400"
            >
              +5
            </Button>
            <Button
              size="sm"
              onClick={() => handleManualPoints(-10)}
              className="bg-red-600/20 hover:bg-red-600/40 text-red-400"
            >
              -10
            </Button>
            <Button
              size="sm"
              onClick={() => handleManualPoints(10)}
              className="bg-green-600/20 hover:bg-green-600/40 text-green-400"
            >
              +10
            </Button>
          </div>
        </div>

        {/* Undo Action */}
        {hasUndoHistory && (
          <Button
            onClick={handleUndoLastAction}
            variant="outline"
            className="w-full border-neon-purple text-neon-purple hover:bg-neon-purple hover:text-black flex items-center justify-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Cofnij ostatnią akcję</span>
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default PlayerActions;
