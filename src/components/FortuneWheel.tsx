
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useGameContext } from '@/context/GameContext';

interface FortuneWheelProps {
  className?: string;
  onSelectCategory?: (categoryId: string, categoryName: string) => void;
  disabled?: boolean;
}

const FortuneWheel: React.FC<FortuneWheelProps> = ({ 
  className, 
  onSelectCategory,
  disabled = false
}) => {
  const { categories, playSound } = useGameContext();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const gameCategories = categories.slice(0, 6); // Limit to 6 categories for wheel
  
  // Create segments for wheel with random colors
  const segments = gameCategories.map(category => ({
    id: category.id,
    name: category.name,
    color: getRandomNeonColor(),
  }));

  // Fill with dummy segments if less than 6
  while (segments.length < 6) {
    segments.push({
      id: `dummy-${segments.length}`,
      name: `Kategoria ${segments.length + 1}`,
      color: getRandomNeonColor(),
    });
  }

  function getRandomNeonColor() {
    const neonColors = [
      '#ff00ff', // neon pink
      '#00ffff', // neon cyan
      '#ff00cc', // neon magenta
      '#33ff00', // neon lime
      '#ff3300', // neon orange
      '#ff0066', // neon rose
      '#9900ff', // neon purple
      '#ffff00', // neon yellow
    ];
    return neonColors[Math.floor(Math.random() * neonColors.length)];
  }

  const spinWheel = () => {
    if (isSpinning || segments.length === 0 || disabled) return;
    
    // Play spin sound
    playSound('wheel-spin', 0.5);
    
    setIsSpinning(true);
    
    // Random number of rotations (3-5 full spins) + random segment
    const spinCount = 3 + Math.random() * 2;
    const randomAngle = Math.random() * 360;
    const finalRotation = rotation + (spinCount * 360) + randomAngle;
    
    setRotation(finalRotation);
    
    // Calculate which segment was selected
    setTimeout(() => {
      // Determine selected segment based on final angle
      const normalizedAngle = finalRotation % 360;
      const segmentAngle = 360 / segments.length;
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
      const selected = segments[segmentIndex % segments.length];
      
      setSelectedSegment(selected.id);
      
      // Play success sound
      playSound('success', 0.5);
      
      if (onSelectCategory && !selected.id.startsWith('dummy-')) {
        onSelectCategory(selected.id, selected.name);
      }
      
      setTimeout(() => {
        setIsSpinning(false);
        setSelectedSegment(null);
      }, 3000);
    }, 3000);
  };

  return (
    <div className={cn('relative w-full aspect-square', className)}>
      {/* Wheel */}
      <div 
        className="w-full h-full rounded-full overflow-hidden relative"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
        }}
      >
        {segments.map((segment, index) => {
          const angle = 360 / segments.length;
          const isSelected = segment.id === selectedSegment;
          
          return (
            <div
              key={segment.id}
              className={cn(
                'absolute w-1/2 h-1/2 origin-bottom-right',
                isSelected && 'animate-pulse'
              )}
              style={{
                transform: `rotate(${angle * index}deg)`,
                transformOrigin: 'bottom right',
                backgroundColor: segment.color,
                borderLeftWidth: '1px',
                borderTopWidth: '1px',
                borderColor: 'rgba(0,0,0,0.2)',
                clipPath: 'polygon(0 0, 100% 0, 100% 100%)'
              }}
            >
              <div 
                className="absolute text-black font-bold text-xs md:text-sm"
                style={{
                  transform: `rotate(${angle/2}deg) translateY(-80%) translateX(20%)`,
                  maxWidth: '60%',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}
              >
                {segment.name}
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Center button */}
      <button
        onClick={spinWheel}
        disabled={isSpinning || disabled}
        className={cn(
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          'w-16 h-16 rounded-full bg-black border-4',
          'flex items-center justify-center font-bold text-sm',
          'transition-all',
          isSpinning ? 'border-red-500 text-red-500' : 'border-white text-white hover:border-neon-yellow hover:text-neon-yellow',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isSpinning ? 'KRĘCI...' : 'KRĘĆ'}
      </button>
      
      {/* Pointer */}
      <div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8"
        style={{
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          backgroundColor: '#ff0066'
        }}
      ></div>
    </div>
  );
};

export default FortuneWheel;
