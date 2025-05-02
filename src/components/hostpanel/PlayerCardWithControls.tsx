
import React, { useState } from 'react';
import { Player } from '@/types/game-types';
import { useGameContext } from '@/context/GameContext';
import { Plus, Minus, Award, Trash, Heart, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PlayerCardWithControlsProps {
  player: Player;
  isCompact?: boolean;
  showControls?: boolean;
}

const PlayerCardWithControls: React.FC<PlayerCardWithControlsProps> = ({ 
  player,
  isCompact = false,
  showControls = true
}) => {
  const { 
    activePlayerId, 
    setActivePlayer, 
    awardPoints, 
    deductHealth, 
    eliminatePlayer,
    round,
    deductLife,
    playSound
  } = useGameContext();
  
  const [showAnimation, setShowAnimation] = useState<string | null>(null);
  
  const isActive = activePlayerId === player.id;
  
  const handleActivate = () => {
    // Toggle active state
    setActivePlayer(isActive ? null : player.id);
    if (!isActive) {
      playSound('click');
    }
  };
  
  const handleAwardPoints = (e: React.MouseEvent) => {
    e.stopPropagation();
    awardPoints(player.id, 5); // Give 5 points by default with quick button
    playSound('success');
    
    // Show animation
    setShowAnimation('points');
    setTimeout(() => setShowAnimation(null), 1000);
  };
  
  const handleDeductHealth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (round === 'round_one') {
      deductHealth(player.id, 20);
      playSound('damage');
    } else {
      deductLife(player.id);
      playSound('damage');
    }
    
    // Show animation
    setShowAnimation('damage');
    setTimeout(() => setShowAnimation(null), 1000);
  };
  
  const handleEliminate = (e: React.MouseEvent) => {
    e.stopPropagation();
    eliminatePlayer(player.id);
    playSound('failure');
    
    // Show animation
    setShowAnimation('eliminate');
    setTimeout(() => setShowAnimation(null), 1000);
  };

  if (player.isEliminated) {
    return (
      <div className="h-36 relative rounded-lg border border-red-900/50 bg-black/40 flex flex-col overflow-hidden opacity-60">
        <div className="absolute inset-0 flex items-center justify-center text-red-500 font-bold text-lg">
          WYELIMINOWANY
        </div>
        <div className="p-2 mt-auto bg-black/60">
          <div className="text-white/40 font-bold truncate">{player.name}</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      onClick={handleActivate}
      className={`h-36 rounded-lg border overflow-hidden cursor-pointer transition-all ${
        isActive 
          ? 'border-neon-green shadow-[0_0_10px_rgba(74,222,128,0.5)]' 
          : 'border-white/10 hover:border-white/30'
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Player video */}
      <div className="relative h-[60%] bg-black">
        {player.cameraUrl ? (
          <iframe 
            src={player.cameraUrl}
            title={`Player ${player.name} camera`}
            className="w-full h-full"
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-black/20">
            <span className="text-white/50">Brak kamery</span>
          </div>
        )}
        
        {/* Player stats overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/70 p-1 flex justify-between items-center">
          <div className="flex gap-1">
            {/* Health or lives */}
            {round === 'round_one' ? (
              <div className="bg-neon-green/70 text-black text-xs font-bold px-1 rounded">
                {player.health}HP
              </div>
            ) : (
              <div className="flex">
                {Array.from({ length: player.lives }).map((_, i) => (
                  <Heart key={i} size={12} className="text-red-500 fill-red-500" />
                ))}
              </div>
            )}
          </div>
          
          {/* Points */}
          <div className="bg-yellow-500/70 text-black text-xs font-bold px-1 rounded">
            {player.points}p
          </div>
        </div>
        
        {/* Animations */}
        <AnimatePresence>
          {showAnimation && (
            <motion.div 
              className="absolute inset-0 flex items-center justify-center z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {showAnimation === 'points' && (
                <motion.div 
                  className="text-neon-green text-4xl font-bold"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  exit={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  +5
                </motion.div>
              )}
              
              {showAnimation === 'damage' && (
                <motion.div 
                  className="bg-neon-red/30 absolute inset-0"
                  animate={{ opacity: [0.8, 0.3, 0.8, 0] }}
                  transition={{ duration: 0.8 }}
                >
                  <motion.div 
                    className="text-neon-red text-4xl font-bold absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.2, opacity: 1 }}
                    exit={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    {round === 'round_one' ? '-20 HP' : '-1 ❤️'}
                  </motion.div>
                </motion.div>
              )}
              
              {showAnimation === 'eliminate' && (
                <motion.div 
                  className="bg-neon-red/50 absolute inset-0 flex items-center justify-center"
                  animate={{ opacity: [0.8, 0.3, 0.8, 0] }}
                  transition={{ duration: 0.8 }}
                >
                  <AlertOctagon size={48} className="text-neon-red" />
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Player info & controls */}
      <div className="h-[40%] bg-black/40 p-1 flex flex-col">
        <div className="font-bold text-white truncate">{player.name}</div>
        
        {showControls && (
          <div className="flex justify-between mt-auto">
            <motion.button 
              onClick={handleDeductHealth}
              className="p-1 bg-black/40 rounded hover:bg-red-900/40 text-red-400"
              title={round === 'round_one' ? "Odejmij HP" : "Odejmij życie"}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Minus size={16} />
            </motion.button>
            
            <motion.button
              onClick={handleAwardPoints}
              className="p-1 bg-black/40 rounded hover:bg-yellow-900/40 text-yellow-400"
              title="Dodaj punkty"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus size={16} />
            </motion.button>
            
            <motion.button
              onClick={handleEliminate}
              className="p-1 bg-black/40 rounded hover:bg-red-900/40 text-red-500"
              title="Wyeliminuj gracza"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Trash size={16} />
            </motion.button>
          </div>
        )}
      </div>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute inset-0 border-2 border-neon-green pointer-events-none" />
      )}
    </motion.div>
  );
};

export default PlayerCardWithControls;
