
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import FortuneWheel from '@/components/FortuneWheel';
import { useGameContext } from '@/context/GameContext';
import { toast } from 'sonner';

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
  const { playSound } = useGameContext();

  // Handler for manual spin trigger from host panel
  const handleSpin = () => {
    if (isSpinning) return;
    
    if (categories.length === 0) {
      toast.error('Brak dostępnych kategorii do losowania!', {
        description: 'Dodaj kategorie w ustawieniach zanim użyjesz koła fortuny.'
      });
      return;
    }
    
    setIsSpinning(true);
    playSound('wheel-spin');
    
    // After a timeout, simulate the wheel stopping
    setTimeout(() => {
      setIsSpinning(false);
      
      // Pick a random category
      const randomIndex = Math.floor(Math.random() * categories.length);
      const category = categories[randomIndex];
      
      setSelectedCategory(category);
      if (onCategorySelected) {
        onCategorySelected(category);
      }
      
      playSound('success');
      toast.success(`Wybrano kategorię: ${category}`);
    }, 3000);
  };

  // Handler for when FortuneWheel component selects a category
  const handleWheelCategorySelected = (category: string) => {
    setSelectedCategory(category);
    
    if (onCategorySelected) {
      onCategorySelected(category);
    }
  };

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Koło Fortuny</span>
          <Button 
            size="sm" 
            onClick={handleSpin}
            disabled={isSpinning || categories.length === 0}
          >
            {isSpinning ? 'Losowanie...' : 'Losuj kategorię'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <FortuneWheel 
          categories={categories}
          onCategorySelected={handleWheelCategorySelected}
          disabled={isSpinning}
        />
        
        {selectedCategory && (
          <div className="mt-4 p-3 bg-green-500/20 border border-green-500 rounded text-center">
            Aktualna kategoria: <strong>{selectedCategory}</strong>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WheelControls;
