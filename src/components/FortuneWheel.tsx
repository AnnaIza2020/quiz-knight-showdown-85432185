
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { useGameContext } from '@/context/GameContext';

interface FortuneWheelProps {
  className?: string;
  onSelectCategory?: (categoryId: string) => void;
}

const FortuneWheel: React.FC<FortuneWheelProps> = ({ className, onSelectCategory }) => {
  const { categories } = useGameContext();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  const segments = categories.map(category => ({
    id: category.id,
    name: category.name,
    color: getRandomNeonColor(),
  }));

  function getRandomNeonColor() {
    const neonColors = [
      '#ff00ff', // pink
      '#00ffff', // cyan
      '#ff00cc', // magenta
      '#33ff00', // lime
      '#ff3300', // orange
      '#ff0066', // rose
      '#9900ff', // purple
      '#ffff00', // yellow
    ];
    return neonColors[Math.floor(Math.random() * neonColors.length)];
  }

  const spinWheel = () => {
    if (isSpinning || segments.length === 0) return;
    
    // Play spin sound
    const spinSound = new Audio('/sounds/spin.mp3');
    spinSound.volume = 0.5;
    spinSound.play().catch(e => console.log('Error playing sound:', e));
    
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
      const successSound = new Audio('/sounds/success.mp3');
      successSound.volume = 0.5;
      successSound.play().catch(e => console.log('Error playing sound:', e));
      
      if (onSelectCategory) {
        onSelectCategory(selected.id);
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
                className="absolute text-black font-bold text-xs"
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
        disabled={isSpinning}
        className={cn(
          'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
          'w-16 h-16 rounded-full bg-black border-4',
          'flex items-center justify-center font-bold text-sm',
          'transition-all',
          isSpinning ? 'border-red-500 text-red-500' : 'border-white text-white hover:border-neon-yellow hover:text-neon-yellow'
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
