
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { PlusCircle, Trash2, Save } from 'lucide-react';
import { toast } from 'sonner';
import { useGameContext } from '@/context/GameContext';

const SettingsWheelCategories = () => {
  const { categories, addCategory, removeCategory, saveCategories } = useGameContext();
  const [newCategory, setNewCategory] = useState<string>('');

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast.error('Nazwa kategorii nie może być pusta');
      return;
    }

    if (categories.find(c => c.name === newCategory.trim())) {
      toast.error('Kategoria o takiej nazwie już istnieje');
      return;
    }

    addCategory({
      id: crypto.randomUUID(),
      name: newCategory.trim(),
      round: 3, // Always round 3 for wheel categories
      created_at: new Date().toISOString()
    });
    
    setNewCategory('');
    toast.success(`Dodano kategorię: ${newCategory.trim()}`);
  };

  const handleRemoveCategory = (id: string, name: string) => {
    removeCategory(id);
    toast.info(`Usunięto kategorię: ${name}`);
  };

  const handleSaveCategories = () => {
    saveCategories();
    toast.success('Kategorie zostały zapisane');
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Kategorie dla Koła Fortuny</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <Input
            placeholder="Nowa kategoria..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
          />
          <Button onClick={handleAddCategory} size="sm">
            <PlusCircle className="h-4 w-4 mr-1" />
            Dodaj
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
          {categories.map((category) => (
            <div
              key={category.id}
              className="flex items-center justify-between bg-muted p-2 rounded"
            >
              <span className="truncate">{category.name}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveCategory(category.id, category.name)}
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </div>
          ))}
        </div>

        {categories.length > 0 && (
          <Button 
            onClick={handleSaveCategories} 
            className="mt-4"
            variant="outline"
          >
            <Save className="h-4 w-4 mr-1" />
            Zapisz zmiany
          </Button>
        )}

        {categories.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">
            Brak kategorii. Dodaj kategorię, aby używać koła fortuny.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SettingsWheelCategories;
