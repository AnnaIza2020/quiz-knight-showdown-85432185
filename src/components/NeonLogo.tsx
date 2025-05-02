
import React from 'react';
import { cn } from "@/lib/utils";
import { useGameContext } from '@/context/GameContext';

interface NeonLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const NeonLogo: React.FC<NeonLogoProps> = ({ className, size = 'md' }) => {
  const { gameLogo, primaryColor, secondaryColor } = useGameContext();

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-20',
  };

  // If custom logo is provided, use that
  if (gameLogo) {
    return (
      <img 
        src={gameLogo} 
        alt="Game Logo" 
        className={cn(sizeClasses[size], 'object-contain', className)} 
      />
    );
  }

  // Default logo
  return (
    <div className={cn('font-bold flex items-center', className)}>
      <span 
        style={{ textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}` }}
        className={cn(
          'text-transparent bg-clip-text bg-gradient-to-r',
          sizeClasses[size],
          size === 'sm' ? 'text-xl' : size === 'md' ? 'text-3xl' : 'text-5xl'
        )}
        style={{ 
          backgroundImage: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})`,
          textShadow: `0 0 10px ${primaryColor}, 0 0 20px ${primaryColor}`
        }}
      >
        DISCORD
      </span>
      <span 
        className={cn(
          'text-transparent bg-clip-text bg-gradient-to-r ml-2',
          sizeClasses[size],
          size === 'sm' ? 'text-xl' : size === 'md' ? 'text-3xl' : 'text-5xl'
        )}
        style={{ 
          backgroundImage: `linear-gradient(to right, ${secondaryColor}, ${primaryColor})`,
          textShadow: `0 0 10px ${secondaryColor}, 0 0 20px ${secondaryColor}`
        }}
      >
        GAME SHOW
      </span>
    </div>
  );
};

export default NeonLogo;
