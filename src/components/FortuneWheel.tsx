
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';

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
  const { playSound } = useGameContext();
  const wheelRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
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
    
    for (let i = 0; i < numCategories; i++) {
      const angle = i * arc;
      const endAngle = angle + arc;
      
      // Set colors alternating - using more neon colors
      const colors = ['#9b87f5', '#7E69AB', '#FF3E9D', '#00E0FF', '#00FFA3', '#FFA500'];
      ctx.fillStyle = colors[i % colors.length] || '#9b87f5';
      
      // Draw section
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, angle, endAngle);
      ctx.lineTo(centerX, centerY);
      ctx.fill();
      
      // Add text
      ctx.save();
      ctx.translate(centerX, centerY);
      const textAngle = angle + arc / 2;
      ctx.rotate(textAngle);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '14px sans-serif';
      
      // Wrap text if too long
      const maxWidth = radius - 30;
      const text = wheelCategories[i];
      if (ctx.measureText(text).width > maxWidth) {
        const words = text.split(' ');
        let line = '';
        let y = 0;
        
        for (const word of words) {
          const testLine = line + word + ' ';
          const metrics = ctx.measureText(testLine);
          
          if (metrics.width > maxWidth && line !== '') {
            ctx.fillText(line, radius - 20, y);
            line = word + ' ';
            y += 15;
          } else {
            line = testLine;
          }
        }
        
        ctx.fillText(line, radius - 20, y);
      } else {
        ctx.fillText(text, radius - 20, 5);
      }
      
      ctx.restore();
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
      
      // Play spin sound
      playSound('wheel-spin');
      
      const minRotation = 2000; // Minimum rotation to ensure multiple spins
      const randomRotation = Math.floor(Math.random() * 1000) + minRotation;
      
      // Animate spinning with smooth transition
      setRotation(prev => prev + randomRotation);
      
      // Wait for animation to complete
      setTimeout(() => {
        try {
          const selectedIndex = getSelectedCategory(randomRotation);
          const selected = wheelCategories[selectedIndex];
          setSelectedCategory(selected);
          
          // Play success sound
          playSound('success');
          
          // Notify selection
          toast.success(`Wybrano kategorię: ${selected}`);
          
          // Callback with selected category
          onCategorySelected(selected);
        } catch (err) {
          console.error("Error selecting category:", err);
          toast.error("Błąd podczas wybierania kategorii");
          playSound('fail');
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
  
  // Calculate which category is selected based on final rotation
  const getSelectedCategory = (addedRotation: number) => {
    const totalRotation = rotation + addedRotation;
    const numCategories = wheelCategories.length;
    const degreesPerCategory = 360 / numCategories;
    
    // Calculate how many degrees past 0 the wheel landed on
    const normalizedRotation = totalRotation % 360;
    
    // Convert to index (reverse because wheel spins clockwise)
    const index = Math.floor((360 - normalizedRotation) / degreesPerCategory) % numCategories;
    
    return index;
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
