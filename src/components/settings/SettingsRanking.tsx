
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trophy, Download, RotateCcw, Eye, Trash } from 'lucide-react';
import SettingsLayout from '@/components/SettingsLayout';
import { toast } from 'sonner';

interface GameHistory {
  id: string;
  name: string;
  date: string;
  winner: string;
  players: string[];
  duration: string;
  rounds: number;
}

interface RankingEntry {
  position: number;
  nickname: string;
  avatar: string;
  points: number;
  gamesPlayed: number;
  winRate: number;
}

const SettingsRanking: React.FC = () => {
  const [gameHistory, setGameHistory] = useState<GameHistory[]>([
    {
      id: '1',
      name: 'Sesja #001',
      date: '2024-01-15',
      winner: 'Player1',
      players: ['Player1', 'Player2', 'Player3', 'Player4'],
      duration: '45 min',
      rounds: 3
    },
    {
      id: '2',
      name: 'Sesja #002',
      date: '2024-01-14',
      winner: 'Player2',
      players: ['Player1', 'Player2', 'Player3'],
      duration: '38 min',
      rounds: 3
    }
  ]);

  const [globalRanking, setGlobalRanking] = useState<RankingEntry[]>([
    {
      position: 1,
      nickname: 'Player1',
      avatar: '🎮',
      points: 850,
      gamesPlayed: 12,
      winRate: 75
    },
    {
      position: 2,
      nickname: 'Player2',
      avatar: '🎯',
      points: 720,
      gamesPlayed: 10,
      winRate: 60
    },
    {
      position: 3,
      nickname: 'Player3',
      avatar: '🎪',
      points: 650,
      gamesPlayed: 8,
      winRate: 50
    }
  ]);

  const [rankingMode, setRankingMode] = useState<'points' | 'winRate' | 'gamesPlayed'>('points');

  const removeGameHistory = (gameId: string) => {
    setGameHistory(prev => prev.filter(game => game.id !== gameId));
    toast.success('Historia gry została usunięta');
  };

  const resetGlobalRanking = () => {
    setGlobalRanking([]);
    toast.success('Globalny ranking został zresetowany');
  };

  const exportRankingData = () => {
    const data = {
      gameHistory,
      globalRanking,
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.download = `ranking_${new Date().toLocaleDateString('pl-PL')}.json`;
    downloadLink.click();
    
    toast.success('Dane rankingowe zostały wyeksportowane');
  };

  const sortedRanking = [...globalRanking].sort((a, b) => {
    switch (rankingMode) {
      case 'winRate':
        return b.winRate - a.winRate;
      case 'gamesPlayed':
        return b.gamesPlayed - a.gamesPlayed;
      default:
        return b.points - a.points;
    }
  });

  return (
    <div className="space-y-6">
      <SettingsLayout 
        title="Historia Gier" 
        description="Przegląd zakończonych sesji i ich wyników"
        actions={
          <Button onClick={exportRankingData} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Eksportuj Dane
          </Button>
        }
      >
        <div className="space-y-4">
          {gameHistory.length > 0 ? (
            <div className="space-y-3">
              {gameHistory.map((game) => (
                <div key={game.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Trophy className="w-5 h-5 text-[#FFD700]" />
                      <div>
                        <h3 className="font-semibold">{game.name}</h3>
                        <p className="text-sm text-gray-400">
                          {game.date} • {game.duration} • {game.rounds} rundy
                        </p>
                      </div>
                      <Badge variant="secondary">
                        Zwycięzca: {game.winner}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => removeGameHistory(game.id)}
                      >
                        <Trash className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-300">
                      Gracze: {game.players.join(', ')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Brak historii gier</p>
            </div>
          )}
        </div>
      </SettingsLayout>

      <SettingsLayout 
        title="Globalny Ranking" 
        description="Ranking wszystkich graczy na podstawie wybranych kryteriów"
        actions={
          <Button onClick={resetGlobalRanking} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetuj Ranking
          </Button>
        }
      >
        <div className="space-y-4">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={rankingMode === 'points' ? 'default' : 'outline'}
              onClick={() => setRankingMode('points')}
            >
              Punkty
            </Button>
            <Button
              size="sm"
              variant={rankingMode === 'winRate' ? 'default' : 'outline'}
              onClick={() => setRankingMode('winRate')}
            >
              % Wygranych
            </Button>
            <Button
              size="sm"
              variant={rankingMode === 'gamesPlayed' ? 'default' : 'outline'}
              onClick={() => setRankingMode('gamesPlayed')}
            >
              Ilość Gier
            </Button>
          </div>

          {sortedRanking.length > 0 ? (
            <div className="space-y-2">
              {sortedRanking.map((entry, index) => (
                <div key={entry.nickname} className="bg-white/5 border border-white/10 rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#00FFA3] flex items-center justify-center text-black font-bold">
                        {index + 1}
                      </div>
                      <span className="text-2xl">{entry.avatar}</span>
                      <div>
                        <h4 className="font-semibold">{entry.nickname}</h4>
                        <p className="text-sm text-gray-400">
                          {entry.gamesPlayed} gier • {entry.winRate}% wygranych
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-[#00FFA3]">
                        {rankingMode === 'points' && `${entry.points} pkt`}
                        {rankingMode === 'winRate' && `${entry.winRate}%`}
                        {rankingMode === 'gamesPlayed' && `${entry.gamesPlayed} gier`}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              <Trophy className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Brak danych rankingowych</p>
            </div>
          )}
        </div>
      </SettingsLayout>
    </div>
  );
};

export default SettingsRanking;
