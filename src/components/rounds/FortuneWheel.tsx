
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WheelSegment {
  id: string;
  label: string;
  color: string;
  angle: number;
}

interface FortuneWheelProps {
  segments: WheelSegment[];
  onSpinComplete?: (selectedSegment: WheelSegment) => void;
  isSpinning?: boolean;
  selectedSegment?: WheelSegment | null;
}

const FortuneWheel: React.FC<FortuneWheelProps> = ({
  segments,
  onSpinComplete,
  isSpinning = false,
  selectedSegment = null
}) => {
  const [currentRotation, setCurrentRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);

  // Calculate segment angles
  const segmentAngle = 360 / segments.length;
  
  const processedSegments = segments.map((segment, index) => ({
    ...segment,
    angle: index * segmentAngle,
    startAngle: index * segmentAngle,
    endAngle: (index + 1) * segmentAngle
  }));

  const handleSpin = useCallback(() => {
    if (spinning || isSpinning) return;

    setSpinning(true);
    
    // Random number of full rotations (3-8) plus random position
    const minRotations = 3;
    const maxRotations = 8;
    const rotations = minRotations + Math.random() * (maxRotations - minRotations);
    const finalAngle = Math.random() * 360;
    const totalRotation = currentRotation + (rotations * 360) + finalAngle;
    
    setCurrentRotation(totalRotation);

    // Determine which segment was selected
    setTimeout(() => {
      const normalizedAngle = (360 - (totalRotation % 360)) % 360;
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle);
      const selectedSeg = processedSegments[segmentIndex];
      
      setSpinning(false);
      
      if (onSpinComplete && selectedSeg) {
        onSpinComplete(selectedSeg);
      }
    }, 3000); // 3 second spin duration
    
  }, [spinning, isSpinning, currentRotation, segmentAngle, processedSegments, onSpinComplete]);

  const resetWheel = () => {
    if (spinning || isSpinning) return;
    setCurrentRotation(0);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Wheel Container */}
      <div className="relative">
        {/* Wheel */}
        <motion.div
          className="relative w-96 h-96 rounded-full border-4 border-white/20 shadow-2xl"
          style={{
            background: `conic-gradient(${processedSegments.map((segment, index) => 
              `${segment.color} ${segment.startAngle}deg ${segment.endAngle}deg`
            ).join(', ')})`
          }}
          animate={{ 
            rotate: currentRotation 
          }}
          transition={{ 
            duration: spinning ? 3 : 0.5,
            ease: spinning ? "easeOut" : "easeInOut"
          }}
        >
          {/* Segment Labels */}
          {processedSegments.map((segment, index) => {
            const labelAngle = segment.startAngle + segmentAngle / 2;
            const labelRadius = 120; // Distance from center
            
            return (
              <div
                key={segment.id}
                className="absolute text-white font-bold text-sm text-center pointer-events-none"
                style={{
                  transform: `rotate(${labelAngle}deg) translateY(-${labelRadius}px) rotate(-${labelAngle}deg)`,
                  transformOrigin: '50% 50%',
                  left: '50%',
                  top: '50%',
                  width: '100px',
                  marginLeft: '-50px',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.8)'
                }}
              >
                {segment.label}
              </div>
            );
          })}

          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gray-800 rounded-full border-4 border-white/50 flex items-center justify-center">
            <div className="w-6 h-6 bg-white rounded-full"></div>
          </div>
        </motion.div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2">
          <div className="w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-white drop-shadow-lg"></div>
        </div>

        {/* Spinning indicator */}
        {(spinning || isSpinning) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-black/70 text-white px-4 py-2 rounded-lg font-bold">
              Kręcę...
            </div>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-4">
        <Button
          onClick={handleSpin}
          disabled={spinning || isSpinning}
          className="bg-[#00FFA3] hover:bg-[#00FFA3]/80 text-black font-bold px-8 py-3"
        >
          <Play className="w-5 h-5 mr-2" />
          {spinning || isSpinning ? 'Kręcę...' : 'Kręć Kołem'}
        </Button>
        
        <Button
          onClick={resetWheel}
          disabled={spinning || isSpinning}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <RotateCcw className="w-5 h-5 mr-2" />
          Reset
        </Button>
      </div>

      {/* Selected Result */}
      {selectedSegment && !spinning && !isSpinning && (
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white/10 border border-white/20 rounded-lg p-4 text-center"
        >
          <h3 className="text-xl font-bold text-[#00FFA3] mb-2">Wylosowana Kategoria:</h3>
          <p className="text-2xl font-bold" style={{ color: selectedSegment.color }}>
            {selectedSegment.label}
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default FortuneWheel;
