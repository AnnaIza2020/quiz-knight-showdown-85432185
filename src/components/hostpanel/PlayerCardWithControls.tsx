import React from 'react';
import { Button } from "@/components/ui/button";
import { useGameContext } from '@/context/GameContext';
import { Card } from '@/components/ui/card';
import { Player, GameRound } from '@/types/game-types';
import { Trophy, X, Heart, CircleMinus, CirclePlus } from 'lucide-react';
import { toast } from 'sonner';

interface PlayerCardWithControlsProps {
  player: Player;
  round: GameRound;
  onAssignPoints: (playerId: string, points: number) => void;
  onRemoveLife: (playerId: string) => void;
  onEliminate: (playerId: string) => void;
}

const PlayerCardWithControls: React.FC<PlayerCardWithControlsProps> = ({
  player,
  round,
  onAssignPoints,
  onRemoveLife,
  onEliminate
}) => {
  const { awardPoints, playSound } = useGameContext();

  const getHealthColor = () => {
    if (player.health > 70) return 'bg-green-500';
    if (player.health > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getLivesDisplay = () => {
    return Array(player.lives)
      .fill(0)
      .map((_, index) => (
        <Heart key={index} className="h-4 w-4 fill-red-500 text-white" />
      ));
  };

  // Quick points buttons based on round
  const renderPointsButtons = () => {
    // Tutaj zmieniamy porównania, aby były bezpieczne typowo
    if (round === GameRound.ROUND_ONE) {
      return (
        <div className="flex flex-wrap gap-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-green-500 text-green-500 hover:bg-green-500/10"
            onClick={() => handleAwardPoints(1)}
          >
            +1
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-green-500 text-green-500 hover:bg-green-500/10"
            onClick={() => handleAwardPoints(2)}
          >
            +2
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-green-500 text-green-500 hover:bg-green-500/10"
            onClick={() => handleAwardPoints(3)}
          >
            +3
          </Button>
        </div>
      );
    }

    // Zmieniamy porównanie, aby było bezpieczne typowo
    if (round === GameRound.ROUND_TWO || round === GameRound.ROUND_THREE) {
      return (
        <div className="flex flex-wrap gap-1">
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-green-500 text-green-500 hover:bg-green-500/10"
            onClick={() => handleAwardPoints(5)}
          >
            +5
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-green-500 text-green-500 hover:bg-green-500/10"
            onClick={() => handleAwardPoints(10)}
          >
            +10
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 border-green-500 text-green-500 hover:bg-green-500/10"
            onClick={() => handleAwardPoints(15)}
          >
            +15
          </Button>
        </div>
      );
    }

    return (
      <Button
        size="sm"
        variant="outline"
        className="border-green-500 text-green-500 hover:bg-green-500/10"
        onClick={() => handleAwardPoints(1)}
      >
        +1 Punkt
      </Button>
    );
  };

  const handleAwardPoints = (points: number) => {
    onAssignPoints(player.id, points);
    toast.success(`Przyznano ${points} punktów dla ${player.name}`);
    playSound('success');
  };

  const handleRemoveLife = () => {
    onRemoveLife(player.id);
    toast.warning(`Usunięto życie dla ${player.name}`);
    playSound('fail');
  };

  const handleEliminate = () => {
    onEliminate(player.id);
    toast.error(`Gracz ${player.name} został wyeliminowany`);
    playSound('eliminate');
  };

  return (
    <Card className="bg-black/50 backdrop-blur-md p-4 rounded-lg border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <h3 className="text-xl font-semibold text-white">{player.name}</h3>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Trophy className="h-4 w-4" />
            <span>{player.points} pkt</span>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center justify-end gap-1">
            {getLivesDisplay()}
          </div>
          <div className={`w-20 h-2 rounded-full mt-1 ${getHealthColor()}`} />
        </div>
      </div>

      <div className="space-y-2">
        {renderPointsButtons()}

        <div className="flex gap-2">
          <Button
            variant="destructive"
            size="sm"
            className="flex-1"
            onClick={handleRemoveLife}
          >
            <CircleMinus className="mr-2 h-4 w-4" />
            Odejmij życie
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            onClick={handleEliminate}
            disabled={player.isEliminated}
          >
            <X className="mr-2 h-4 w-4" />
            Eliminuj
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PlayerCardWithControls;
