
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Disc } from 'lucide-react';

interface FortuneWheelProps {
  categories: string[];
  onResult: (category: string) => void;
  isSpinning: boolean;
  selectedCategory?: string;
}

const FortuneWheel: React.FC<FortuneWheelProps> = ({
  categories,
  onResult,
  isSpinning,
  selectedCategory
}) => {
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);

  const spinWheel = useCallback(() => {
    if (spinning || categories.length === 0) return;

    setSpinning(true);
    
    // Calculate random rotation (multiple full rotations + random angle)
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalAngle = Math.random() * 360;
    const totalRotation = rotation + (spins * 360) + finalAngle;
    
    setRotation(totalRotation);

    // Calculate which category was selected
    const normalizedAngle = (360 - (finalAngle % 360)) % 360;
    const sectionAngle = 360 / categories.length;
    const selectedIndex = Math.floor(normalizedAngle / sectionAngle);
    const selectedCategory = categories[selectedIndex] || categories[0];

    // Stop spinning after animation
    setTimeout(() => {
      setSpinning(false);
      onResult(selectedCategory);
    }, 3000);
  }, [spinning, categories, rotation, onResult]);

  const sectionAngle = 360 / categories.length;

  return (
    <div className="flex flex-col items-center space-y-6">
      <div className="relative">
        {/* Wheel */}
        <motion.div
          className="relative w-80 h-80 rounded-full border-4 border-neon-gold shadow-2xl"
          style={{
            background: `conic-gradient(${categories.map((_, index) => {
              const hue = (index * 360) / categories.length;
              return `hsl(${hue}, 70%, 50%) ${index * sectionAngle}deg ${(index + 1) * sectionAngle}deg`;
            }).join(', ')})`
          }}
          animate={{ rotate: rotation }}
          transition={{ duration: 3, ease: "easeOut" }}
        >
          {/* Categories */}
          {categories.map((category, index) => {
            const angle = (index * sectionAngle) + (sectionAngle / 2);
            const radian = (angle * Math.PI) / 180;
            const x = Math.cos(radian) * 120;
            const y = Math.sin(radian) * 120;
            
            return (
              <div
                key={index}
                className="absolute text-white font-bold text-sm text-center"
                style={{
                  left: `calc(50% + ${x}px - 40px)`,
                  top: `calc(50% + ${y}px - 10px)`,
                  width: '80px',
                  transform: `rotate(${angle}deg)`,
                  transformOrigin: 'center'
                }}
              >
                {category}
              </div>
            );
          })}
          
          {/* Center circle */}
          <div className="absolute inset-1/2 w-16 h-16 -ml-8 -mt-8 bg-black rounded-full border-4 border-neon-gold flex items-center justify-center">
            <Disc className="w-6 h-6 text-neon-gold" />
          </div>
        </motion.div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 -ml-3 -mt-4 w-6 h-8 bg-neon-gold clip-triangle" />
      </div>

      {/* Selected Category Display */}
      {selectedCategory && (
        <div className="bg-neon-gold text-black px-6 py-2 rounded-lg font-bold text-lg">
          Wybrana kategoria: {selectedCategory}
        </div>
      )}

      {/* Spin Button */}
      <Button
        onClick={spinWheel}
        disabled={spinning || isSpinning}
        className="bg-neon-gold hover:bg-neon-gold/80 text-black font-bold px-8 py-3 text-lg"
      >
        {spinning ? 'Kręcenie...' : 'ZAKRĘĆ KOŁEM!'}
      </Button>
    </div>
  );
};

export default FortuneWheel;
