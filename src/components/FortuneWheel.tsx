
import React, { useState, useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";
import { useGameContext } from '@/context/GameContext';
import { motion } from 'framer-motion';

interface FortuneWheelProps {
  className?: string;
  onSelectCategory?: (categoryId: string, categoryName: string) => void;
  disabled?: boolean;
}

// Default Polish categories if none are provided
const DEFAULT_CATEGORIES = [
  { id: 'polski-internet', name: 'Język polskiego internetu' },
  { id: 'twitch', name: 'Polska scena Twitcha' },
  { id: 'zagadki', name: 'Zagadki' },
  { id: 'kalambury', name: 'Kalambury wizualne' },
  { id: 'gry', name: 'Gry, które podbiły Polskę' },
  { id: 'technologie', name: 'Technologie i internet w Polsce' },
];

const FortuneWheel: React.FC<FortuneWheelProps> = ({ 
  className, 
  onSelectCategory,
  disabled = false
}) => {
  const { categories, playSound } = useGameContext();
  const [rotation, setRotation] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);
  const spinHistory = useRef<string[]>([]);

  // Use provided categories or fallback to defaults, limiting to 6 categories for wheel
  const availableCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  const gameCategories = availableCategories.slice(0, 6);
  
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
    
    // Calculate spin to ensure fair distribution
    // We'll avoid landing on the same segment twice in a row if possible
    let spinCount = 3 + Math.random() * 2; // 3-5 full rotations
    let randomAngle = Math.random() * 360;
    
    // Determine which segment would be selected with this spin
    const segmentAngle = 360 / segments.length;
    const potentialSegmentIndex = Math.floor(randomAngle / segmentAngle);
    const potentialSegment = segments[potentialSegmentIndex % segments.length];
    
    // If we've already landed on this segment recently and there are alternatives,
    // adjust the angle to avoid it
    const recentSegments = spinHistory.current.slice(-2); // Last 2 spins
    if (recentSegments.includes(potentialSegment.id) && segments.length > 2) {
      // Shift by 1-2 segments to avoid repetition
      const offset = 1 + Math.floor(Math.random() * 2);
      randomAngle = ((potentialSegmentIndex + offset) % segments.length) * segmentAngle + (Math.random() * segmentAngle);
    }
    
    const finalRotation = rotation + (spinCount * 360) + randomAngle;
    setRotation(finalRotation);
    
    // Calculate which segment was selected
    setTimeout(() => {
      // Determine selected segment based on final angle
      const normalizedAngle = finalRotation % 360;
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
      const selected = segments[segmentIndex % segments.length];
      
      setSelectedSegment(selected.id);
      
      // Update spin history
      spinHistory.current = [...spinHistory.current, selected.id].slice(-5); // Keep last 5
      
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
      <motion.div 
        className="w-full h-full rounded-full overflow-hidden relative"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning ? 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none',
          boxShadow: '0 0 20px rgba(255, 255, 255, 0.3)'
        }}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.02 }}
      >
        {segments.map((segment, index) => {
          const angle = 360 / segments.length;
          const isSelected = segment.id === selectedSegment;
          
          return (
            <motion.div
              key={segment.id}
              className={cn(
                'absolute w-1/2 h-1/2 origin-bottom-right',
                isSelected && 'animate-pulse'
              )}
              initial={{ opacity: 0.7 }}
              animate={{ opacity: 1 }}
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
            </motion.div>
          );
        })}
      </motion.div>
      
      {/* Center button */}
      <motion.button
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
        whileHover={!isSpinning && !disabled ? { scale: 1.1, rotate: 5 } : {}}
        whileTap={!isSpinning && !disabled ? { scale: 0.95 } : {}}
      >
        {isSpinning ? 'KRĘCI...' : 'KRĘĆ'}
      </motion.button>
      
      {/* Pointer */}
      <motion.div 
        className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8"
        style={{
          clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          backgroundColor: '#ff0066'
        }}
        animate={isSpinning ? { 
          scale: [1, 1.2, 1],
          rotate: [0, 5, -5, 0]
        } : {}}
        transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
      />
      
      {/* Highlight ring when spinning */}
      {isSpinning && (
        <motion.div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{ 
            boxShadow: '0 0 25px rgba(255, 255, 255, 0.5)',
            border: '2px solid rgba(255, 255, 255, 0.3)',
          }}
          animate={{ 
            boxShadow: [
              '0 0 15px rgba(255, 255, 255, 0.3)',
              '0 0 25px rgba(255, 255, 255, 0.6)',
              '0 0 15px rgba(255, 255, 255, 0.3)'
            ]
          }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </div>
  );
};

export default FortuneWheel;
