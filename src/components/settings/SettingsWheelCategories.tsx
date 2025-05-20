
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGameContext } from '@/context/GameContext';
import { Category, GameRound } from '@/types/game-types';
import { Plus, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';

const SettingsWheelCategories: React.FC = () => {
  const { categories, addCategory, removeCategory } = useGameContext();
  const [newCategory, setNewCategory] = useState<string>('');
  const [editing, setEditing] = useState(false);
  
  // Filter categories for Round 3
  const wheelCategories = categories.filter(c => {
    // Check if the category has a round property set to 3 (ROUND_THREE)
    if (typeof c.round === 'number') {
      return c.round === GameRound.ROUND_THREE;
    }
    // For backward compatibility, include categories without a round property
    return true;
  });
  
  // Add a new category for wheel
  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Nazwa kategorii nie może być pusta');
      return;
    }
    
    // Check if category already exists
    if (wheelCategories.some(c => c.name.toLowerCase() === newCategory.trim().toLowerCase())) {
      toast.error('Kategoria o tej nazwie już istnieje');
      return;
    }
    
    // Create new category object
    const newCategoryObj: Category = {
      id: crypto.randomUUID(),
      name: newCategory.trim(),
      round: GameRound.ROUND_THREE, // Set for Round 3 (wheel)
      questions: []
    };
    
    // Add to context
    addCategory(newCategoryObj);
    
    // Reset form
    setNewCategory('');
    
    // Show success message
    toast.success(`Dodano kategorię "${newCategory.trim()}" do koła fortuny`);
  };
  
  // Remove a category
  const handleRemoveCategory = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    
    // Check if there are questions in this category
    if (category.questions.length > 0) {
      toast.error(`Nie można usunąć kategorii "${category.name}" - zawiera pytania`);
      return;
    }
    
    // Remove category
    removeCategory(categoryId);
    
    // Show success message
    toast.success(`Usunięto kategorię "${category.name}"`);
  };
  
  return (
    <Card className="bg-black/40 border border-white/10">
      <CardHeader>
        <CardTitle>Kategorie Koła Fortuny (Runda 3)</CardTitle>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {/* Add new category */}
          <div className="flex space-x-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Nazwa nowej kategorii"
              className="bg-black/20"
            />
            <Button onClick={handleAddCategory} className="bg-neon-green hover:bg-neon-green/80 text-black">
              <Plus className="h-4 w-4 mr-1" />
              Dodaj
            </Button>
          </div>
          
          {/* Categories list */}
          {wheelCategories.length > 0 ? (
            <div>
              <Label className="mb-2 block">Istniejące kategorie:</Label>
              <div className="space-y-2">
                {wheelCategories.map((category) => (
                  <div 
                    key={category.id} 
                    className="flex items-center justify-between p-3 bg-black/30 border border-white/10 rounded-md"
                  >
                    <div>
                      {category.name}
                      <span className="text-sm text-white/50 ml-2">
                        ({category.questions.length} pytań)
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveCategory(category.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                      disabled={category.questions.length > 0}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-white/50">
              Brak kategorii. Dodaj kategorie, aby były dostępne w Kole Fortuny.
            </div>
          )}
          
          <div className="text-xs text-white/50">
            Uwaga: Kategorie z pytaniami nie mogą zostać usunięte. 
            Najpierw usuń lub przenieś wszystkie pytania z tej kategorii.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SettingsWheelCategories;
