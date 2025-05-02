
import React from 'react';
import { cn } from "@/lib/utils";
import { Player } from '@/context/GameContext';

interface PlayerCardProps {
  player: Player;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showDetails?: boolean;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  size = 'md', 
  className,
  showDetails = true 
}) => {
  const { id, name, cameraUrl, points, health, lives, isActive, isEliminated } = player;

  let cardStatus = 'player-card-inactive';
  if (isEliminated) {
    cardStatus = 'player-card-eliminated';
  } else if (isActive) {
    cardStatus = 'player-card-active';
  }

  const sizeClasses = {
    sm: 'h-24',
    md: 'h-36',
    lg: 'h-48'
  };

  return (
    <div className={cn(
      'player-card', 
      cardStatus,
      sizeClasses[size],
      className
    )}>
      {/* Video container */}
      <div className="relative h-full w-full bg-black">
        {cameraUrl ? (
          <iframe 
            src={cameraUrl}
            title={`Player ${name}`}
            className="w-full h-full"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neon-background">
            <span className="text-lg font-bold text-gray-400">No Camera</span>
          </div>
        )}
      </div>

      {/* Player info overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-sm p-1">
        <div className="flex justify-between items-center">
          <div className="font-bold text-white truncate">{name}</div>
          
          {showDetails && (
            <div className="flex gap-1 text-xs">
              {/* Show points */}
              <div className="bg-neon-yellow/80 text-black font-bold px-1 rounded">
                {points}p
              </div>
              
              {/* Show health or lives depending on the game phase */}
              {health > 0 ? (
                <div className="bg-neon-green/80 text-black font-bold px-1 rounded">
                  {health}HP
                </div>
              ) : (
                <div className="flex">
                  {Array(lives).fill(0).map((_, i) => (
                    <div key={i} className="text-neon-red">♥</div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Eliminated overlay */}
      {isEliminated && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/70">
          <span className="text-neon-red font-bold text-2xl animate-pulse">OUT</span>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
