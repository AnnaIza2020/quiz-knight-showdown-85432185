
import React, { useState, useEffect, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FortuneWheel from '@/components/FortuneWheel';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { RotateCcw, Check, XCircle } from 'lucide-react';
import { useWheelSync } from '@/hooks/useWheelSync';

interface WheelControlsProps {
  categories: string[];
  onCategorySelected?: (category: string) => void;
  className?: string;
}

const WheelControls: React.FC<WheelControlsProps> = memo(({
  categories = [],
  onCategorySelected,
  className = ''
}) => {
  const [lastSpinTime, setLastSpinTime] = useState<number>(0);
  const { playSound } = useGameContext();
  
  // Use the optimized wheel sync hook
  const { 
    isSpinning, 
    selectedCategory, 
    triggerSpin: startSpin, 
    resetWheel 
  } = useWheelSync({
    onCategorySelected: (category) => {
      if (onCategorySelected) {
        onCategorySelected(category);
      }
      playSound('success');
      toast.success(`Wybrano kategorię: ${category}`);
    },
    onSpinStart: () => {
      playSound('wheel-spin');
    }
  });

  // Anti-bounce for wheel spin (prevent accidental double clicks)
  const SPIN_COOLDOWN_MS = 3000;

  // Handler for manual spin trigger from host panel
  const handleSpin = useCallback(() => {
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
    
    setLastSpinTime(now);
    startSpin();
  }, [isSpinning, lastSpinTime, categories, startSpin]);

  // Mock onResult handler for FortuneWheel component
  const handleWheelResult = useCallback((category: string) => {
    if (onCategorySelected) {
      onCategorySelected(category);
    }
  }, [onCategorySelected]);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Koło Fortuny</span>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              onClick={resetWheel}
              variant="outline"
              disabled={isSpinning}
              className="flex items-center gap-1"
            >
              <RotateCcw className="h-4 w-4" />
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
          isSpinning={isSpinning}
          selectedCategory={selectedCategory}
          onResult={handleWheelResult}
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
});

WheelControls.displayName = 'WheelControls';

export default WheelControls;
