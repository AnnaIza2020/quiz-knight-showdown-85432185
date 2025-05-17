
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FortuneWheel from '@/components/FortuneWheel';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { ArrowClockwise, Check, XCircle } from 'lucide-react';

interface WheelControlsProps {
  categories: string[];
  onCategorySelected?: (category: string) => void;
  className?: string;
}

const WheelControls: React.FC<WheelControlsProps> = ({
  categories = [],
  onCategorySelected,
  className = ''
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [lastSpinTime, setLastSpinTime] = useState<number>(0);
  const { playSound } = useGameContext();
  const { broadcast, subscribe } = useSubscription('wheel_events', 'category_selected', 
    (payload) => {
      if (payload.category) {
        handleCategorySelected(payload.category);
      }
    }, 
    { immediate: false }
  );

  // Anti-bounce for wheel spin (prevent accidental double clicks)
  const SPIN_COOLDOWN_MS = 3000;

  useEffect(() => {
    // Subscribe to wheel events from other components
    return () => {
      // Cleanup subscription when component unmounts
      subscribe(false);
    };
  }, [subscribe]);

  // Handler for manual spin trigger from host panel
  const handleSpin = () => {
    if (isSpinning) return;
    
    // Check spin cooldown
    const now = Date.now();
    if (now - lastSpinTime < SPIN_COOLDOWN_MS) {
      toast.info('Odczekaj chwilę przed ponownym losowaniem');
      return;
    }
    
    if (categories.length === 0) {
      toast.error('Brak dostępnych kategorii do losowania!', {
        description: 'Dodaj kategorie w ustawieniach zanim użyjesz koła fortuny.'
      });
      return;
    }
    
    setIsSpinning(true);
    setLastSpinTime(now);
    playSound('wheel-spin');
    
    // Broadcast the spin event to all listeners
    broadcast({
      type: 'wheel_spin',
      timestamp: now
    });
    
    // After a timeout, simulate the wheel stopping
    const spinDuration = 3000 + Math.random() * 1000; // 3-4 seconds
    setTimeout(() => {
      setIsSpinning(false);
      
      // Pick a random category
      const randomIndex = Math.floor(Math.random() * categories.length);
      const category = categories[randomIndex];
      
      handleCategorySelected(category);
    }, spinDuration);
  };

  // Handler for category selection (whether from wheel component or manual selection)
  const handleCategorySelected = (category: string) => {
    setSelectedCategory(category);
    
    if (onCategorySelected) {
      onCategorySelected(category);
    }
    
    // Broadcast the category selection to all listeners
    broadcast({
      type: 'category_selected',
      category,
      timestamp: Date.now()
    });
    
    playSound('success');
    toast.success(`Wybrano kategorię: ${category}`);
  };

  const handleResetWheel = () => {
    setSelectedCategory(null);
    
    // Broadcast the reset event to all listeners
    broadcast({
      type: 'wheel_reset',
      timestamp: Date.now()
    });
    
    toast.info('Koło fortuny zresetowane');
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Koło Fortuny</span>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={handleResetWheel}
              variant="outline"
              disabled={isSpinning}
              className="flex items-center gap-1"
            >
              <ArrowClockwise className="h-4 w-4" />
              Reset
            </Button>
            <Button 
              size="sm" 
              onClick={handleSpin}
              disabled={isSpinning || categories.length === 0}
              className="flex items-center gap-1"
            >
              {isSpinning ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-1" />
                  Losowanie...
                </>
              ) : (
                <>
                  <svg 
                    className="h-4 w-4 mr-1" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path 
                      d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                    />
                    <path 
                      d="M12 8V16" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                    />
                    <path 
                      d="M15 12L9 12" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                    />
                  </svg>
                  Losuj kategorię
                </>
              )}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <FortuneWheel 
          categories={categories}
          onCategorySelected={handleCategorySelected}
          disabled={isSpinning}
          triggerSpin={isSpinning}
        />
        
        {selectedCategory && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded text-center w-full">
            <div className="flex items-center justify-center gap-2">
              <Check className="text-green-500 h-5 w-5" />
              <span>Wybrana kategoria: <strong>{selectedCategory}</strong></span>
            </div>
          </div>
        )}
        
        {categories.length === 0 && (
          <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500 rounded text-center w-full">
            <div className="flex items-center justify-center gap-2">
              <XCircle className="text-yellow-500 h-5 w-5" />
              <span>Dodaj kategorie w ustawieniach, aby używać koła fortuny</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WheelControls;
