import React from 'react';
import { useGameContext } from '@/context/GameContext';
import { cn } from "@/lib/utils";

interface NeonLogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const NeonLogo: React.FC<NeonLogoProps> = ({ size = 'md', className }) => {
  const { gameLogo, primaryColor, secondaryColor } = useGameContext();

  // Size variations
  const sizes = {
    sm: 'h-10',
    md: 'h-16',
    lg: 'h-24',
  };
  
  // Colors with fallback
  const primaryColorHex = primaryColor || '#ff00ff'; // Neon pink fallback
  const secondaryColorHex = secondaryColor || '#00ffff'; // Neon cyan fallback
  
  // If there's a custom logo, display it
  if (gameLogo) {
    return (
      <img 
        src={gameLogo} 
        alt="Game Logo" 
        className={cn(sizes[size], 'object-contain', className)} 
      />
    );
  }
  
  // Otherwise show the default neon logo
  return (
    <div 
      className={cn(
        'flex flex-col items-center justify-center font-bold',
        sizes[size],
        className
      )}
    >
      <div 
        className="text-3xl sm:text-4xl md:text-5xl tracking-wider"
        style={{
          color: primaryColorHex,
          textShadow: `0 0 5px ${primaryColorHex}, 0 0 20px ${primaryColorHex}`
        }}
      >
        QUIZ KNIGHT
      </div>
      <div 
        className="text-xl sm:text-2xl md:text-3xl tracking-wide"
        style={{
          color: secondaryColorHex,
          textShadow: `0 0 5px ${secondaryColorHex}, 0 0 15px ${secondaryColorHex}`
        }}
      >
        SHOWDOWN
      </div>
    </div>
  );
};

export default NeonLogo;
