
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Category, GameRound } from '@/types/game-types';
import { useGameContext } from '@/context/GameContext';
import { Trash2 } from 'lucide-react';

const CategoryManager: React.FC = () => {
  const { categories, setCategories } = useGameContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  
  const handleAddCategory = (round: GameRound) => {
    if (newCategoryName.trim() === '') return;
    
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryName,
      round: round,
      questions: [],
      description: ''
    };
    
    setCategories(prevCategories => [...prevCategories, newCategory]);
    setNewCategoryName('');
    toast.success(`Dodano kategorię "${newCategoryName}"`);
  };

  const handleRemoveCategory = (categoryId: string) => {
    setCategories(prevCategories =>
      prevCategories.filter(category => category.id !== categoryId)
    );
    toast.success('Kategoria została usunięta');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Zarządzanie kategoriami</h3>
      
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Nazwa nowej kategorii"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          className="bg-black/40 border-gray-700 text-white"
        />
        <Button onClick={() => handleAddCategory(GameRound.ROUND_ONE)}>
          Dodaj do R1
        </Button>
        <Button onClick={() => handleAddCategory(GameRound.ROUND_TWO)}>
          Dodaj do R2
        </Button>
        <Button onClick={() => handleAddCategory(GameRound.ROUND_THREE)}>
          Dodaj do R3
        </Button>
      </div>
      
      <div className="grid grid-cols-3 gap-4">
        {[GameRound.ROUND_ONE, GameRound.ROUND_TWO, GameRound.ROUND_THREE].map(round => (
          <div key={round} className="space-y-2">
            <h4 className="font-medium text-white">
              {round === GameRound.ROUND_ONE ? 'Runda 1' : 
               round === GameRound.ROUND_TWO ? 'Runda 2' : 'Runda 3'}
            </h4>
            {categories
              .filter(cat => cat.round === round)
              .map(category => (
                <div
                  key={category.id}
                  className="p-2 rounded bg-black/20 border border-gray-700 text-white flex justify-between items-center"
                >
                  <span className="text-sm">{category.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:bg-red-500/10"
                    onClick={() => handleRemoveCategory(category.id)}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryManager;
