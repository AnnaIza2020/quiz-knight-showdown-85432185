
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Category, GameRound } from '@/types/game-types';
import { useGameContext } from '@/context/GameContext';
import { Trash2 } from 'lucide-react';

const SettingsLayout: React.FC<{title: string, description: string, children: React.ReactNode}> = ({ title, description, children }) => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-muted-foreground">{description}</p>
    </div>
    {children}
  </div>
);

const SettingsWheelCategories: React.FC = () => {
  const { categories, setCategories } = useGameContext();
  const [newCategoryName, setNewCategoryName] = useState('');
  const [wheelCategories, setWheelCategories] = useState<Category[]>([]);

  useEffect(() => {
    // Filter categories for Round 3 (Wheel)
    const roundThreeCategories = categories.filter(cat => cat.round === GameRound.ROUND_THREE);
    setWheelCategories(roundThreeCategories);
  }, [categories]);

  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') return;
    
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name: newCategoryName,
      round: GameRound.ROUND_THREE,
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
    <SettingsLayout title="Kategorie Koła Fortuny" description="Zarządzaj kategoriami pytań dla rundy Koła Fortuny">
      <div className="space-y-4">
        {/* Add Category Form */}
        <div className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Nazwa nowej kategorii"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <Button onClick={handleAddCategory}>Dodaj kategorię</Button>
        </div>

        {/* Category List */}
        <ScrollArea className="h-[300px] w-full rounded-md border">
          <div className="p-4">
            {wheelCategories.length > 0 ? (
              <div className="grid gap-4">
                {wheelCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-3 rounded-md bg-black/20"
                  >
                    <Label>{category.name}</Label>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleRemoveCategory(category.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                Brak kategorii dla Koła Fortuny
              </div>
            )}
          </div>
        </ScrollArea>
      </div>
    </SettingsLayout>
  );
};

export default SettingsWheelCategories;
