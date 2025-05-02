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
  const { gameLogo } = useGameContext();
  
  // Determine size classes
  const sizeClasses = {
    sm: 'h-12',
    md: 'h-24',
    lg: 'h-32'
  };
  
  // If logo URL is provided in context, render that image
  if (gameLogo) {
    return (
      <div className={cn(
        'flex items-center justify-center',
        className
      )}>
        <img 
          src={gameLogo} 
          alt="Game Show Logo" 
          className={cn(sizeClasses[size])} 
        />
      </div>
    );
  }
  
  // Otherwise render the default logo
  return (
    <div className={cn(
      'flex items-center justify-center',
      className
    )}>
      <img 
        src="/lovable-uploads/5d43e62b-61b1-4821-beff-4abb5eb500f5.png"
        alt="Discord Game Show" 
        className={cn(sizeClasses[size])}
      />
    </div>
  );
};

export default NeonLogo;
