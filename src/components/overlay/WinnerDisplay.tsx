
import React from 'react';
import { Player } from '@/types/game-types';
import { Crown } from 'lucide-react';
import { cn } from "@/lib/utils";

interface WinnerDisplayProps {
  show: boolean;
  winners: (Player | undefined)[];
  className?: string;
}

const WinnerDisplay: React.FC<WinnerDisplayProps> = ({
  show,
  winners,
  className
}) => {
  if (!show || winners.length === 0) return null;
  
  // Filter out undefined winners
  const validWinners = winners.filter(Boolean) as Player[];
  
  return (
    <div 
      className={cn(
        'fixed inset-0 z-50 bg-black/70 backdrop-blur-md',
        'flex flex-col items-center justify-center',
        'animate-fade-in',
        className
      )}
    >
      <div className="text-neon-yellow text-6xl font-bold mb-8 animate-pulse flex items-center">
        <Crown size={64} className="mr-4 text-neon-yellow" />
        ZWYCIĘZCA
        <Crown size={64} className="ml-4 text-neon-yellow" />
      </div>
      
      <div className="flex gap-6">
        {validWinners.map((winner) => (
          <div 
            key={winner.id} 
            className="flex flex-col items-center bg-black/50 rounded-lg p-6 border-2 border-neon-yellow"
          >
            {winner.cameraUrl ? (
              <div className="w-64 h-48 mb-4 overflow-hidden rounded-lg">
                <iframe 
                  src={winner.cameraUrl} 
                  title={winner.name}
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            ) : winner.avatar ? (
              <img 
                src={winner.avatar} 
                alt={winner.name}
                className="w-64 h-48 object-cover mb-4 rounded-lg"
              />
            ) : (
              <div className="w-64 h-48 mb-4 bg-gray-800 rounded-lg flex items-center justify-center">
                <span className="text-white/50">No Camera</span>
              </div>
            )}
            
            <h2 className="text-4xl font-bold text-white mb-2">{winner.name}</h2>
            <div className="text-2xl text-neon-yellow font-bold flex items-center">
              {winner.points} punktów
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WinnerDisplay;
