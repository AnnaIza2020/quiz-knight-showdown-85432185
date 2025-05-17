
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import { 
  drawWheelSection, 
  getSelectedCategoryIndex, 
  getNeonColors 
} from '@/utils/wheelUtils';

interface FortuneWheelProps {
  categories?: string[];
  onCategorySelected?: (category: string) => void;
  disabled?: boolean;
  className?: string;
}

const FortuneWheel: React.FC<FortuneWheelProps> = ({
  categories = [],
  onCategorySelected = () => {},
  disabled = false,
  className = ''
}) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const { playSound, soundsEnabled } = useGameContext();
  const wheelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spinSoundTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Define default categories according to the production checklist
  const defaultCategories = [
    "Język polskiego internetu",
    "Polska scena Twitcha",
    "Zagadki",
    "Czy jesteś mądrzejszy od 8-klasisty",
    "Gry, które podbiły Polskę",
    "Technologie i internet w Polsce"
  ];
  
  // Use provided categories or default to required ones
  const wheelCategories = categories.length > 0 ? categories : defaultCategories;
  
  // Prepare the wheel when categories change
  useEffect(() => {
    if (wheelCategories.length > 0 && canvasRef.current) {
      drawWheel();
    }
  }, [wheelCategories]);
  
  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (spinSoundTimeoutRef.current) {
        clearTimeout(spinSoundTimeoutRef.current);
      }
    };
  }, []);
  
  // Draw the wheel on the canvas
  const drawWheel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) - 10;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw sections
    const numCategories = wheelCategories.length;
    const arc = (2 * Math.PI) / numCategories;
    const colors = getNeonColors();
    
    for (let i = 0; i < numCategories; i++) {
      const angle = i * arc;
      const endAngle = angle + arc;
      const color = colors[i % colors.length];
      
      drawWheelSection(
        ctx, 
        centerX, 
        centerY, 
        radius, 
        angle, 
        endAngle, 
        color,
        wheelCategories[i]
      );
    }
    
    // Draw center circle
    ctx.beginPath();
    ctx.arc(centerX, centerY, 20, 0, 2 * Math.PI);
    ctx.fillStyle = '#1A1F2C';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#FFFFFF';
    ctx.stroke();
  };
  
  // Spin the wheel with improved animation and error handling
  const handleSpin = () => {
    if (spinning || disabled) return;
    
    try {
      setSpinning(true);
      setSelectedCategory(null);
      
      // Play spin sound safely
      if (soundsEnabled) {
        try {
          playSound('wheel-spin');
          
          // Schedule tick sounds for spinning effect
          let tickCount = 0;
          const tickInterval = setInterval(() => {
            if (tickCount < 20) {
              try {
                playSound('wheel-tick', 0.2);
                tickCount++;
              } catch (e) {
                // Silent fail for tick sounds
                console.log('Failed to play tick sound:', e);
              }
            } else {
              clearInterval(tickInterval);
            }
          }, 200);
          
          spinSoundTimeoutRef.current = setTimeout(() => {
            clearInterval(tickInterval);
          }, 5000);
          
        } catch (err) {
          // Silently fail sound playback but don't interrupt the wheel
          console.warn('Error playing wheel sounds:', err);
        }
      }
      
      const minRotation = 2000; // Minimum rotation to ensure multiple spins
      const randomRotation = Math.floor(Math.random() * 1000) + minRotation;
      
      // Animate spinning with smooth transition
      setRotation(prev => prev + randomRotation);
      
      // Wait for animation to complete
      setTimeout(() => {
        try {
          const selectedIndex = getSelectedCategoryIndex(randomRotation + rotation, wheelCategories.length);
          const selected = wheelCategories[selectedIndex];
          setSelectedCategory(selected);
          
          // Try to play success sound, but don't break functionality if it fails
          try {
            if (soundsEnabled) playSound('success');
          } catch (err) {
            console.warn('Error playing success sound:', err);
          }
          
          // Notify selection
          toast.success(`Wybrano kategorię: ${selected}`);
          
          // Callback with selected category
          onCategorySelected(selected);
        } catch (err) {
          console.error("Error selecting category:", err);
          toast.error("Błąd podczas wybierania kategorii");
          
          // Try to play fail sound, but don't break functionality if it fails
          try {
            if (soundsEnabled) playSound('fail');
          } catch (err) {
            console.warn('Error playing fail sound:', err);
          }
        } finally {
          setSpinning(false);
        }
      }, 5000); // Match this with the CSS transition duration
    } catch (err) {
      console.error("Error spinning wheel:", err);
      setSpinning(false);
      toast.error("Błąd podczas obracania koła");
    }
  };
  
  return (
    <Card className={`w-full overflow-hidden ${className}`}>
      <CardHeader>
        <CardTitle className="text-center">Koło Fortuny</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-[300px] h-[300px] mb-6">
          {/* Canvas for wheel drawing */}
          <canvas 
            ref={canvasRef}
            width={300}
            height={300}
            className="absolute top-0 left-0 w-full h-full"
          />
          
          {/* Spinning Wheel */}
          <div 
            ref={wheelRef}
            className="absolute top-0 left-0 w-full h-full transition-transform duration-[5s] cubic-bezier(0.1, 0.7, 0.1, 1)"
            style={{ transform: `rotate(${rotation}deg)` }}
          />
          
          {/* Pointer */}
          <div className="absolute top-0 left-[calc(50%-12px)] w-0 h-0 border-l-[12px] border-r-[12px] border-b-[24px] border-l-transparent border-r-transparent border-b-red-500 z-10" />
        </div>
        
        {selectedCategory && (
          <div className="mb-4 p-2 bg-green-500/20 border border-green-500 rounded text-center">
            Wylosowano: <strong>{selectedCategory}</strong>
          </div>
        )}
        
        <Button
          onClick={handleSpin}
          disabled={spinning || disabled || wheelCategories.length === 0}
          className="px-8 py-2"
        >
          {spinning ? 'Kręcenie...' : 'Zakręć kołem'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default FortuneWheel;
