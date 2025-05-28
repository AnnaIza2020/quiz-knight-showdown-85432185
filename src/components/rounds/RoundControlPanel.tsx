
import React from 'react';
import { GameRound } from '@/types/game-types';
import { Player, Question, RoundSettings } from '@/types/interfaces';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';

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
    selectQuestion,
    setActivePlayer,
    categories,
    players,
    setPlayers
  } = useGameContext();

  const handleCorrectAnswer = () => {
    if (!activePlayerId) {
      toast.error('Nie wybrano aktywnego gracza');
      return;
    }

    const points = roundSettings.round1.pointsForCorrectAnswer;
    awardPoints(activePlayerId, points);
    toast.success(`Przyznano ${points} punktów!`);
  };

  const handleIncorrectAnswer = () => {
    if (!activePlayerId) {
      toast.error('Nie wybrano aktywnego gracza');
      return;
    }

    const healthLoss = roundSettings.round1.healthDeductionPercentage;
    deductHealth(activePlayerId, healthLoss);
    deductLife(activePlayerId, 1);
    toast.info(`Gracz stracił ${healthLoss}% życia`);
  };

  const handleEliminatePlayer = (playerId: string) => {
    const playerToUpdate = players.find(p => p.id === playerId);
    if (!playerToUpdate) return;

    const updatedPlayer: Player = {
      ...playerToUpdate,
      nickname: playerToUpdate.nickname || playerToUpdate.name,
      isEliminated: true,
      isActive: true
    };

    // Use functional update for setPlayers
    setPlayers((prev: Player[]) => 
      prev.map(player => 
        player.id === playerId ? updatedPlayer : player
      )
    );
    
    toast.info(`Gracz ${playerToUpdate.name} został wyeliminowany`);
  };

  const handleRevivePlayer = (playerId: string) => {
    const playerToUpdate = players.find(p => p.id === playerId);
    if (!playerToUpdate) return;

    const updatedPlayer: Player = {
      ...playerToUpdate,
      nickname: playerToUpdate.nickname || playerToUpdate.name,
      isEliminated: false,
      isActive: true,
      health: 100,
      lives: 3
    };

    setPlayers((prev: Player[]) => 
      prev.map(player => 
        player.id === playerId ? updatedPlayer : player
      )
    );
    
    toast.success(`Gracz ${playerToUpdate.name} został przywrócony`);
  };

  const getRandomQuestion = () => {
    const allQuestions = categories.flatMap(cat => cat.questions || []);
    const availableQuestions = allQuestions.filter(q => !usedQuestionIds.includes(q.id));
    
    if (availableQuestions.length === 0) {
      toast.error('Brak dostępnych pytań');
      return;
    }

    const randomQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    selectQuestion(randomQuestion);
    toast.success('Wylosowano nowe pytanie');
  };

  return (
    <div className="space-y-4">
      {/* Question Controls */}
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Kontrola pytań</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button
              onClick={getRandomQuestion}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Losuj pytanie
            </Button>
            <Button
              onClick={() => selectQuestion(null)}
              variant="outline"
              className="border-gray-600 text-white"
            >
              Ukryj pytanie
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Answer Controls */}
      {activePlayerId && (
        <Card className="bg-black/40 border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Kontrola odpowiedzi</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button
                onClick={handleCorrectAnswer}
                className="bg-green-600 hover:bg-green-700"
              >
                Poprawna odpowiedź
              </Button>
              <Button
                onClick={handleIncorrectAnswer}
                className="bg-red-600 hover:bg-red-700"
              >
                Błędna odpowiedź
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Player Management */}
      <Card className="bg-black/40 border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Zarządzanie graczami</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {players.map((player) => (
            <div key={player.id} className="flex items-center justify-between p-2 bg-black/20 rounded">
              <span className="text-white">{player.name}</span>
              <div className="flex gap-2">
                {player.isEliminated ? (
                  <Button
                    size="sm"
                    onClick={() => handleRevivePlayer(player.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Przywróć
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleEliminatePlayer(player.id)}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Eliminuj
                  </Button>
                )}
                <Button
                  size="sm"
                  onClick={() => setActivePlayer(player.id)}
                  variant={activePlayerId === player.id ? "default" : "outline"}
                  className={activePlayerId === player.id ? "bg-blue-600" : "border-gray-600 text-white"}
                >
                  {activePlayerId === player.id ? "Aktywny" : "Wybierz"}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default RoundControlPanel;
