import React, { useState } from 'react';
import { GameRound, Player, Question } from '@/types/game-types';
import { RoundSettings } from '@/types/interfaces';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import { 
  Trophy, 
  Heart, 
  SkullIcon, 
  Timer, 
  Target,
  Users,
  Award,
  Minus,
  Plus,
  CheckCircle,
  XCircle,
  ArrowRight
} from 'lucide-react';

interface RoundControlPanelProps {
  round: GameRound;
  activePlayers: Player[];
  currentQuestion: Question | null;
  activePlayerId: string | null;
  timerRunning: boolean;
  timerSeconds: number;
  usedQuestionIds: string[];
  roundSettings: RoundSettings;
}

const RoundControlPanel: React.FC<RoundControlPanelProps> = ({
  round,
  activePlayers,
  currentQuestion,
  activePlayerId,
  timerRunning,
  timerSeconds,
  usedQuestionIds,
  roundSettings
}) => {
  const { 
    awardPoints, 
    deductHealth, 
    deductLife,
    updatePlayer,
    advanceToRoundTwo,
    advanceToRoundThree,
    finishGame,
    setPlayers,
    markQuestionAsUsed 
  } = useGameContext();
  
  const [customPoints, setCustomPoints] = useState<number>(0);
  const [customHealth, setCustomHealth] = useState<number>(0);
  
  // Get current round settings
  const getCurrentSettings = () => {
    switch (round) {
      case GameRound.ROUND_ONE:
        return {
          maxQuestions: roundSettings.round1.maxQuestions || 10,
          eliminateCount: roundSettings.round1.eliminateCount || 4,
          maxSpins: 0,
          pointsForCorrectAnswer: roundSettings.round1.pointsForCorrectAnswer || 10,
          healthDeductionPercentage: roundSettings.round1.healthDeductionPercentage || 20,
          luckyLoserEnabled: roundSettings.round1.luckyLoserEnabled || false
        };
      case GameRound.ROUND_TWO:
        return {
          maxQuestions: roundSettings.round2.maxQuestions || 8,
          eliminateCount: 0,
          maxSpins: 0,
          pointsForCorrectAnswer: roundSettings.round2.pointsForCorrectAnswer || 15
        };
      case GameRound.ROUND_THREE:
        return {
          maxQuestions: 0,
          eliminateCount: 0,
          maxSpins: roundSettings.round3.maxSpins || 3,
          pointsForCorrectAnswer: roundSettings.round3.pointsForCorrectAnswer || 20
        };
      default:
        return { maxQuestions: 0, eliminateCount: 0, maxSpins: 0, pointsForCorrectAnswer: 0 };
    }
  };

  const settings = getCurrentSettings();

  // Handle correct answer
  const handleCorrectAnswer = (playerId: string) => {
    if (!playerId) return;
    
    const points = settings.pointsForCorrectAnswer;
    awardPoints(playerId, points);
    
    if (currentQuestion) {
      markQuestionAsUsed(currentQuestion.id);
    }
    
    toast.success(`Gracz otrzymał ${points} punktów za poprawną odpowiedź!`);
  };

  // Handle incorrect answer
  const handleIncorrectAnswer = (playerId: string) => {
    if (!playerId) return;
    
    if (round === GameRound.ROUND_ONE) {
      const healthDeduction = settings.healthDeductionPercentage || 20;
      deductHealth(playerId, healthDeduction);
      toast.warning(`Gracz stracił ${healthDeduction}% zdrowia!`);
    } else {
      deductLife(playerId, 1);
      toast.warning('Gracz stracił życie!');
    }
    
    if (currentQuestion) {
      markQuestionAsUsed(currentQuestion.id);
    }
  };

  // Handle manual point adjustment
  const handleManualPoints = (playerId: string, points: number) => {
    awardPoints(playerId, points);
    toast.success(`Ręcznie dodano ${points} punktów!`);
  };

  // Handle manual health adjustment
  const handleManualHealth = (playerId: string, healthChange: number) => {
    const player = activePlayers.find(p => p.id === playerId);
    if (!player) return;
    
    const newHealth = Math.max(0, Math.min(100, player.health + healthChange));
    const updatedPlayer: Player = { 
      ...player, 
      health: newHealth,
      nickname: player.nickname || player.name // Ensure nickname is set
    };
    updatePlayer(updatedPlayer);
    toast.info(`Zdrowie gracza zmienione o ${healthChange}%`);
  };

  // Eliminate player manually
  const handleEliminatePlayer = (playerId: string) => {
    const player = activePlayers.find(p => p.id === playerId);
    if (player) {
      const eliminatedPlayer: Player = { 
        ...player, 
        isEliminated: true,
        health: 0,
        lives: 0,
        nickname: player.nickname || player.name // Ensure nickname is set
      };
      updatePlayer(eliminatedPlayer);
      toast.error('Gracz został wyeliminowany!');
    }
  };

  // Auto eliminate based on round 1 settings
  const handleAutoEliminate = () => {
    if (round !== GameRound.ROUND_ONE) return;
    
    const sortedPlayers = [...activePlayers].sort((a, b) => {
      // Sort by health first, then by points
      if (a.health !== b.health) return a.health - b.health;
      return a.points - b.points;
    });
    
    const toEliminate = sortedPlayers.slice(0, settings.eliminateCount);
    
    setPlayers(prev => prev.map(player => {
      if (toEliminate.find(p => p.id === player.id)) {
        return { 
          ...player, 
          isEliminated: true,
          nickname: player.nickname || player.name // Ensure nickname is set
        };
      }
      return player;
    }));
    
    toast.success(`Wyeliminowano ${toEliminate.length} graczy!`);
    
    // Check for lucky loser
    if (settings.luckyLoserEnabled && toEliminate.length > 0) {
      const luckyLoser = toEliminate[Math.floor(Math.random() * toEliminate.length)];
      const updatedLuckyLoser = { 
        ...luckyLoser, 
        isEliminated: false,
        nickname: luckyLoser.nickname || luckyLoser.name
      };
      updatePlayer(updatedLuckyLoser);
      toast.info(`Lucky Loser: ${luckyLoser.name} wraca do gry!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Round Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            {round === GameRound.ROUND_ONE && 'Runda 1 - Eliminacje'}
            {round === GameRound.ROUND_TWO && 'Runda 2 - Szybka Odpowiedź'}
            {round === GameRound.ROUND_THREE && 'Runda 3 - Koło Fortuny'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <Users className="h-6 w-6 mx-auto mb-2 text-blue-500" />
              <div className="text-2xl font-bold">{activePlayers.length}</div>
              <div className="text-sm text-gray-500">Aktywni gracze</div>
            </div>
            
            {settings.maxQuestions > 0 && (
              <div className="text-center">
                <Award className="h-6 w-6 mx-auto mb-2 text-green-500" />
                <div className="text-2xl font-bold">{usedQuestionIds.length}/{settings.maxQuestions}</div>
                <div className="text-sm text-gray-500">Użyte pytania</div>
              </div>
            )}
            
            <div className="text-center">
              <Trophy className="h-6 w-6 mx-auto mb-2 text-yellow-500" />
              <div className="text-2xl font-bold">{settings.pointsForCorrectAnswer}</div>
              <div className="text-sm text-gray-500">Punkty za odpowiedź</div>
            </div>
            
            <div className="text-center">
              <Timer className="h-6 w-6 mx-auto mb-2 text-red-500" />
              <div className="text-2xl font-bold">{timerSeconds}s</div>
              <div className="text-sm text-gray-500">Pozostały czas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions for Current Question */}
      {currentQuestion && activePlayerId && (
        <Card>
          <CardHeader>
            <CardTitle>Szybkie Akcje - Aktualne Pytanie</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button
                onClick={() => handleCorrectAnswer(activePlayerId)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Poprawna (+{settings.pointsForCorrectAnswer} pkt)
              </Button>
              
              <Button
                onClick={() => handleIncorrectAnswer(activePlayerId)}
                variant="destructive"
              >
                <XCircle className="h-4 w-4 mr-2" />
                Niepoprawna
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Ręczne Kontrole</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Punkty do dodania/odjęcia</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={customPoints}
                  onChange={(e) => setCustomPoints(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <Button
                  onClick={() => activePlayerId && handleManualPoints(activePlayerId, customPoints)}
                  disabled={!activePlayerId}
                  size="sm"
                >
                  Zastosuj
                </Button>
              </div>
            </div>
            
            <div>
              <Label>Zdrowie do dodania/odjęcia (%)</Label>
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={customHealth}
                  onChange={(e) => setCustomHealth(parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
                <Button
                  onClick={() => activePlayerId && handleManualHealth(activePlayerId, customHealth)}
                  disabled={!activePlayerId}
                  size="sm"
                >
                  Zastosuj
                </Button>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex gap-3">
            {activePlayerId && (
              <Button
                onClick={() => handleEliminatePlayer(activePlayerId)}
                variant="destructive"
                size="sm"
              >
                <SkullIcon className="h-4 w-4 mr-2" />
                Eliminuj gracza
              </Button>
            )}
            
            {round === GameRound.ROUND_ONE && (
              <Button
                onClick={handleAutoEliminate}
                variant="outline"
                size="sm"
              >
                <Users className="h-4 w-4 mr-2" />
                Auto eliminacja ({settings.eliminateCount})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Round Progression */}
      <Card>
        <CardHeader>
          <CardTitle>Przejście do następnej rundy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            {round === GameRound.ROUND_ONE && (
              <Button
                onClick={advanceToRoundTwo}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Przejdź do Rundy 2
              </Button>
            )}
            
            {round === GameRound.ROUND_TWO && (
              <Button
                onClick={advanceToRoundThree}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <ArrowRight className="h-4 w-4 mr-2" />
                Przejdź do Rundy 3
              </Button>
            )}
            
            {round === GameRound.ROUND_THREE && (
              <Button
                onClick={() => finishGame(activePlayers.slice(0, 3).map(p => p.id))}
                className="bg-yellow-600 hover:bg-yellow-700"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Zakończ Grę
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RoundControlPanel;
