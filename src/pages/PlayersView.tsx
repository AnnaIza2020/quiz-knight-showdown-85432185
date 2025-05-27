
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameState } from '@/context/GameStateContext';
import { ArrowLeft, User, Heart, Trophy } from 'lucide-react';

const PlayersView: React.FC = () => {
  const navigate = useNavigate();
  const { players, gameState } = useGameState();

  const getStatusColor = (player: any) => {
    if (player.isEliminated) return 'text-red-500';
    if (player.status === 'online') return 'text-green-500';
    return 'text-gray-500';
  };

  const getStatusText = (player: any) => {
    if (player.isEliminated) return 'Wyeliminowany';
    if (player.status === 'online') return 'Online';
    return 'Offline';
  };

  return (
    <div className="min-h-screen bg-[#0C0C13] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-[#00FFA3] hover:text-[#00FFA3]/80 transition-colors mr-4"
            >
              <ArrowLeft className="w-6 h-6 mr-2" />
              Powrót
            </button>
            <h1 className="text-4xl font-bold text-[#00FFA3]">Gracze</h1>
          </div>
          <div className="text-right">
            <p className="text-gray-300">Runda: <span className="text-[#00E0FF] font-bold">{gameState.currentRound}</span></p>
            <p className="text-gray-300">Aktywnych graczy: <span className="text-[#FF3E9D] font-bold">{players.filter(p => !p.isEliminated).length}</span></p>
          </div>
        </div>

        {/* Players grid */}
        {players.length === 0 ? (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-500 text-xl">Brak graczy w grze</p>
            <p className="text-gray-400 mt-2">Gracze pojawią się tutaj po dołączeniu do gry</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {players.map((player) => (
              <div
                key={player.id}
                className={`bg-white/5 border rounded-lg p-6 transition-all duration-300 ${
                  player.isEliminated 
                    ? 'border-red-500/30 opacity-60' 
                    : 'border-white/10 hover:border-[#00FFA3]/50'
                }`}
              >
                {/* Player avatar and name */}
                <div className="text-center mb-4">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-white/20">
                    {player.avatar ? (
                      <img 
                        src={player.avatar} 
                        alt={player.nickname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div 
                        className="w-full h-full flex items-center justify-center text-white font-bold text-xl"
                        style={{ backgroundColor: player.color || '#666' }}
                      >
                        {player.nickname?.charAt(0)?.toUpperCase() || 'G'}
                      </div>
                    )}
                  </div>
                  <h3 className="font-bold text-lg" style={{ color: player.color || '#white' }}>
                    {player.nickname}
                  </h3>
                  <p className={`text-sm ${getStatusColor(player)}`}>
                    {getStatusText(player)}
                  </p>
                </div>

                {/* Player stats */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Trophy className="w-4 h-4 text-[#FFD700] mr-2" />
                      <span className="text-sm">Punkty</span>
                    </div>
                    <span className="font-bold text-[#00FFA3]">{player.points}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Heart className="w-4 h-4 text-red-500 mr-2" />
                      <span className="text-sm">Życie</span>
                    </div>
                    <span className="font-bold text-white">{player.health}%</span>
                  </div>

                  {/* Health bar */}
                  <div className="w-full h-2 bg-black/40 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        player.health > 70 ? 'bg-green-500' :
                        player.health > 40 ? 'bg-yellow-500' : 
                        'bg-red-500'
                      }`}
                      style={{ width: `${Math.max(0, player.health)}%` }}
                    />
                  </div>

                  {/* Special cards */}
                  {player.specialCards && player.specialCards.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-400 mb-1">Karty: {player.specialCards.length}</p>
                      <div className="flex space-x-1">
                        {player.specialCards.slice(0, 3).map((card, index) => (
                          <div
                            key={index}
                            className="w-6 h-6 bg-[#FF3E9D]/20 border border-[#FF3E9D]/50 rounded text-xs flex items-center justify-center"
                          >
                            ✦
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayersView;
