
import React from 'react';
import { motion } from 'framer-motion';

interface PlayerStatsProps {
  player: {
    nickname: string;
    points: number;
    life_percent: number;
    color?: string;
  };
}

const PlayerStats: React.FC<PlayerStatsProps> = ({ player }) => {
  return (
    <header 
      className="mb-6 p-4 rounded-lg border" 
      style={{ 
        borderColor: player.color || '#ff00ff',
        boxShadow: `0 0 10px ${player.color || '#ff00ff'}` 
      }}
    >
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: player.color || '#ff00ff' }}>
          {player.nickname}
        </h1>
        <div className="text-white font-bold">
          {player.points} punktów
        </div>
      </div>
      
      {/* Health bar */}
      <div className="mt-2">
        <div className="flex justify-between text-xs text-white/70 mb-1">
          <span>Zdrowie</span>
          <span>{player.life_percent}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
          <motion.div 
            className="h-full"
            style={{ 
              backgroundColor: player.color || '#ff00ff',
              width: `${player.life_percent}%` 
            }}
            initial={{ width: 0 }}
            animate={{ width: `${player.life_percent}%` }}
            transition={{ duration: 1 }}
          />
        </div>
      </div>
    </header>
  );
};

export default PlayerStats;
