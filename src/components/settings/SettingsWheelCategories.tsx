import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useGameContext } from '@/context/GameContext';
import { Category, GameRound } from '@/types/game-types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

const SettingsWheelCategories = () => {
  const gameContext = useGameContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    if (gameContext) {
      setCategories(gameContext.categories.filter(cat => cat.round === GameRound.ROUND_THREE));
    }
  }, [gameContext, gameContext?.categories]);

  const addCategory = () => {
    if (newCategoryName.trim() === '') {
      toast.error('Podaj nazwę kategorii');
      return;
    }
    
    const newCategory: Category = {
      id: uuidv4(),
      name: newCategoryName,
      description: '', // Add the required description field
      round: GameRound.ROUND_THREE,
      questions: []
    };
    
    gameContext.addCategory(newCategory);
    setNewCategoryName('');
  };

  const removeCategory = (categoryId: string) => {
    gameContext.removeCategory(categoryId);
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4 text-white">Kategorie Rundy 3</h3>
      
      <div className="mb-4">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Nazwa nowej kategorii"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            className="bg-black/40 border-gray-700 text-white"
          />
          <Button onClick={addCategory}>Dodaj</Button>
        </div>
      </div>
      
      <div className="space-y-2">
        {categories.map(category => (
          <div
            key={category.id}
            className="p-3 rounded-md bg-black/30 border border-gray-700 text-white"
          >
            <div className="flex justify-between items-center">
              {category.name}
              <Button 
                variant="ghost"
                size="sm"
                className="text-red-500 hover:bg-red-500/10"
                onClick={() => removeCategory(category.id)}
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SettingsWheelCategories;
