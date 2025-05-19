
import React from 'react';
import { Button } from '@/components/ui/button';
import { GameRound, Question, Player } from '@/types/game-types';
import { RoundSettings } from '@/hooks/useGameLogic';
import { CheckCircle, XCircle, Undo2, Plus, Minus, Shield, AlertOctagon } from 'lucide-react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';

interface PlayerActionsProps {
  activePlayerId: string | null;
  currentQuestion: Question | null;
  round: GameRound;
  activePlayer: Player | null;
  roundSettings: RoundSettings;
  hasUndoHistory: boolean;
  handleAwardPoints: () => void;
  handleDeductHealth: () => void;
  handleBonusPoints: () => void;
  handleEliminatePlayer: () => void;
  handleUndoLastAction: () => void;
  handleManualPoints: (amount: number) => void;
  handleManualHealth: (amount: number) => void;
}

const PlayerActions: React.FC<PlayerActionsProps> = ({
  activePlayerId,
  currentQuestion,
  round,
  activePlayer,
  roundSettings,
  hasUndoHistory,
  handleAwardPoints,
  handleDeductHealth,
  handleBonusPoints,
  handleEliminatePlayer,
  handleUndoLastAction,
  handleManualPoints,
  handleManualHealth,
}) => {
  // Get point values for the current round
  const getPointValue = () => {
    if (!currentQuestion) return 0;
    
    if (round === GameRound.ROUND_ONE) {
      // Based on difficulty level
      const difficultyMap: Record<string, keyof typeof roundSettings.pointValues.round1> = {
        '5': 'easy',
        '10': 'medium',
        '15': 'hard',
        '20': 'expert',
      };
      
      const difficultyKey = difficultyMap[currentQuestion.difficulty.toString()] || 'medium';
      return roundSettings.pointValues.round1[difficultyKey];
    } else if (round === GameRound.ROUND_TWO) {
      return roundSettings.pointValues.round2;
    } else {
      return roundSettings.pointValues.round3;
    }
  };

  // Get penalty for current round
  const getPenaltyValue = () => {
    if (round === GameRound.ROUND_ONE) {
      return roundSettings.lifePenalties.round1;
    } else if (round === GameRound.ROUND_TWO) {
      return roundSettings.lifePenalties.round2;
    } else {
      return roundSettings.lifePenalties.round3;
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white flex justify-between items-center">
            <span>Akcje dla gracza</span>
            {hasUndoHistory && (
              <Button 
                variant="outline" 
                size="sm"
                className="border-amber-400 text-amber-400 hover:bg-amber-400/20"
                onClick={handleUndoLastAction}
              >
                <Undo2 className="h-4 w-4 mr-1" />
                Cofnij akcję
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {activePlayerId && activePlayer ? (
            <div className="space-y-4">
              {/* Player status information */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-lg bg-black/30 mb-4">
                <div>
                  <p className="text-xs text-white/60">Gracz</p>
                  <p className="font-bold text-white">{activePlayer.name}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60">Punkty</p>
                  <p className="font-bold text-neon-green">{activePlayer.points}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60">Życie</p>
                  <p className="font-bold text-neon-red">{activePlayer.health}% / {activePlayer.lives} ❤️</p>
                </div>
              </div>
            
              {/* Primary game actions */}
              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="py-3 px-4 bg-black border-2 border-neon-green text-neon-green rounded-md font-bold
                           hover:bg-neon-green/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handleAwardPoints}
                  disabled={!currentQuestion}
                >
                  <CheckCircle className="h-5 w-5 mr-2" />
                  {currentQuestion ? (
                    <>Poprawna (+{getPointValue()} pkt)</>
                  ) : (
                    <>Wybierz pytanie</>
                  )}
                </Button>
                
                <Button
                  className="py-3 px-4 bg-black border-2 border-neon-red text-neon-red rounded-md font-bold
                           hover:bg-neon-red/20"
                  onClick={handleDeductHealth}
                >
                  <XCircle className="h-5 w-5 mr-2" />
                  {round === GameRound.ROUND_ONE ? (
                    <>Błędna (-{getPenaltyValue()}% HP)</>
                  ) : (
                    <>Błędna (-1 życie)</>
                  )}
                </Button>
              </div>
              
              {/* Additional game actions */}
              <div className="grid grid-cols-2 gap-4">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="py-3 px-4 bg-black border-2 border-neon-yellow text-neon-yellow rounded-md font-bold
                              hover:bg-neon-yellow/20"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Zarządzaj punktami
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-black/80 border border-neon-yellow/50 text-white">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-neon-yellow">Ręczne dodawanie punktów</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 5, 10, 15].map((points) => (
                          <Button 
                            key={`add-${points}`}
                            variant="outline" 
                            className="border-neon-green text-neon-green hover:bg-neon-green/20"
                            onClick={() => handleManualPoints(points)}
                          >
                            +{points}
                          </Button>
                        ))}
                      </div>
                      <h3 className="font-semibold text-neon-yellow">Ręczne odejmowanie punktów</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {[1, 5, 10, 15].map((points) => (
                          <Button 
                            key={`sub-${points}`}
                            variant="outline" 
                            className="border-neon-red text-neon-red hover:bg-neon-red/20"
                            onClick={() => handleManualPoints(-points)}
                          >
                            -{points}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      className="py-3 px-4 bg-black border-2 border-neon-purple text-neon-purple rounded-md font-bold
                              hover:bg-neon-purple/20"
                    >
                      <Shield className="h-5 w-5 mr-2" />
                      Zarządzaj życiem
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 bg-black/80 border border-neon-purple/50 text-white">
                    <div className="space-y-4">
                      <h3 className="font-semibold text-neon-purple">Ręczne zarządzanie zdrowiem</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {[10, 20, 50, 100].map((health) => (
                          <Button 
                            key={`heal-${health}`}
                            variant="outline" 
                            className="border-neon-green text-neon-green hover:bg-neon-green/20"
                            onClick={() => handleManualHealth(health)}
                          >
                            +{health}%
                          </Button>
                        ))}
                      </div>
                      <h3 className="font-semibold text-neon-purple">Ręczne odejmowanie zdrowia</h3>
                      <div className="grid grid-cols-4 gap-2">
                        {[10, 20, 50, 100].map((health) => (
                          <Button 
                            key={`damage-${health}`}
                            variant="outline" 
                            className="border-neon-red text-neon-red hover:bg-neon-red/20"
                            onClick={() => handleManualHealth(-health)}
                          >
                            -{health}%
                          </Button>
                        ))}
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="py-3 px-4 bg-black border-2 border-neon-blue text-neon-blue rounded-md font-bold
                           hover:bg-neon-blue/20"
                  onClick={handleBonusPoints}
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Bonus +5 punktów
                </Button>
                
                <Button
                  className="py-3 px-4 bg-black border-2 border-red-800 text-red-500 rounded-md font-bold
                           hover:bg-red-900/30"
                  onClick={handleEliminatePlayer}
                >
                  <AlertOctagon className="h-5 w-5 mr-2" />
                  Wyeliminuj gracza
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center text-white/60 py-8">
              Wybierz gracza, aby wykonać akcje
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerActions;
