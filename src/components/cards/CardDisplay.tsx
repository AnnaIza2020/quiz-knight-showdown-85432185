
import React from 'react';
import { motion } from 'framer-motion';
import { SpecialCard } from '@/types/game-types';
import CardIcon from './CardIcon';

interface CardDisplayProps {
  card: SpecialCard;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
  showDescription?: boolean;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  onClick,
  active = false,
  disabled = false,
  showDescription = false,
  size = 'medium',
  className = '',
}) => {
  // Size maps
  const sizeClasses = {
    small: 'w-12 h-16',
    medium: 'w-20 h-28',
    large: 'w-32 h-44',
  };
  
  const iconSizes = {
    small: 16,
    medium: 24,
    large: 36,
  };
  
  const fontSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base',
  };

  // Generate glow effect based on card's animation style
  const getGlowEffect = () => {
    const baseGlow = 'animate-pulse shadow-lg';
    
    switch (card.animationStyle) {
      case 'neon-blue':
        return `${baseGlow} shadow-blue-500/50`;
      case 'neon-green':
        return `${baseGlow} shadow-green-500/50`;
      case 'neon-red':
        return `${baseGlow} shadow-red-500/50`;
      case 'neon-purple':
        return `${baseGlow} shadow-purple-500/50`;
      case 'rainbow':
        return 'animate-pulse shadow-lg shadow-[0_0_15px_rgba(255,0,0,0.5),0_0_30px_rgba(255,165,0,0.3),0_0_45px_rgba(255,255,0,0.2),0_0_60px_rgba(0,128,0,0.1)]';
      default:
        return `${baseGlow} shadow-white/30`;
    }
  };

  return (
    <motion.div
      className={`relative rounded-lg cursor-pointer ${sizeClasses[size]} ${className} 
                 ${active ? getGlowEffect() : 'shadow-md'} 
                 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 transition-transform'}`}
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={disabled ? undefined : onClick}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 rounded-lg border border-gray-600"></div>
      
      <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
        {/* Card Name */}
        <h3 className={`${fontSizes[size]} font-bold text-center text-white mb-1`}>
          {card.name}
        </h3>
        
        {/* Card Icon */}
        <div className="flex-grow flex items-center justify-center">
          <CardIcon 
            name={card.iconName || card.name} 
            className={`text-white ${active ? 'animate-pulse' : ''}`} 
            size={iconSizes[size]} 
          />
        </div>
        
        {/* Card Description (optional) */}
        {showDescription && (
          <p className={`${fontSizes.small} text-center text-gray-300 mt-1 line-clamp-2`}>
            {card.description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default CardDisplay;
