import React from 'react';
import { cn } from "@/lib/utils";
import { useGameContext } from '@/context/GameContext';

interface NeonLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NeonLogo: React.FC<NeonLogoProps> = ({
  size = 'md',
  className
}) => {
  const { gameLogo, primaryColor, secondaryColor } = useGameContext();
  
  // Determine size classes
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-3xl',
    lg: 'text-5xl'
  };
  
  // If logo URL is provided, render image
  if (gameLogo) {
    return (
      <div className={cn(
        'flex items-center justify-center',
        className
      )}>
        <img 
          src={gameLogo} 
          alt="Game Show Logo" 
          className={cn(
            'max-h-24',
            size === 'sm' ? 'max-h-12' : size === 'lg' ? 'max-h-32' : 'max-h-24'
          )} 
        />
      </div>
    );
  }
  
  // Otherwise render text-based logo
  return (
    <div className={cn(
      'flex flex-col items-center justify-center',
      className
    )}>
      <h1 
        className={cn(
          sizeClasses[size],
          'font-bold mb-1',
          'animate-pulse'
        )}
        style={{ 
          color: primaryColor,
          textShadow: `0 0 5px ${primaryColor}, 0 0 10px ${primaryColor}, 0 0 15px ${primaryColor}, 0 0 20px ${secondaryColor}`
        }}
      >
        DISCORD
      </h1>
      <h2 
        className={cn(
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-lg',
          'tracking-widest',
          'animate-pulse'
        )}
        style={{ 
          color: secondaryColor,
          textShadow: `0 0 5px ${secondaryColor}, 0 0 10px ${secondaryColor}` 
        }}
      >
        GAME SHOW
      </h2>
    </div>
  );
};

export default NeonLogo;
